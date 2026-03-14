from typing import Dict, List, Optional


# ---------------------------------------------------------------------------
# Profile detection constants
# ---------------------------------------------------------------------------
# A resume is treated as a STUDENT profile when:
#   - total work experience < 12 months  AND
#   - has an education section            AND
#   - has a projects section  (their primary signal)
#
# EARLY_CAREER: has some experience (internship / <24 months) but no degree
#   signal or clearly junior.
#
# PROFESSIONAL: everything else (>= 24 months experience).
# ---------------------------------------------------------------------------

PROFILE_STUDENT      = "student"
PROFILE_EARLY_CAREER = "early_career"
PROFILE_PROFESSIONAL = "professional"


class ATSScorer:
    # -----------------------------------------------------------------------
    # Weights per profile type
    # Keys must stay identical to ATSBreakdown schema:
    #   skills | roles | experience | structure | companies
    # -----------------------------------------------------------------------
    WEIGHTS = {
        PROFILE_STUDENT: {
            # Skills still matter most — fair for everyone
            "skills":     35,
            # Having ANY role title (intern / trainee counts fully)
            "roles":      10,
            # Experience expected to be low → low weight, generous buckets
            "experience": 10,
            # Structure: education + projects replace experience section
            "structure":  25,
            # Companies: even 1 internship = full marks
            "companies":  20,
        },
        PROFILE_EARLY_CAREER: {
            "skills":     38,
            "roles":      15,
            "experience": 15,
            "structure":  17,
            "companies":  15,
        },
        PROFILE_PROFESSIONAL: {
            # Original weights — unchanged for experienced candidates
            "skills":     40,
            "roles":      20,
            "experience": 20,
            "structure":  10,
            "companies":  10,
        },
    }

    # Experience buckets per profile: (min_total_months, score)
    # Student: 0 months → 6 pts baseline so they're not immediately penalised
    # Early career: gentler ramp
    # Professional: original strict buckets
    EXP_BUCKETS = {
        PROFILE_STUDENT: [
            (0, 6), (3, 7), (6, 8), (12, 9), (18, 10),
        ],
        PROFILE_EARLY_CAREER: [
            (0, 3), (6, 7), (12, 11), (18, 13), (24, 15),
        ],
        PROFILE_PROFESSIONAL: [
            (0, 0), (6, 5), (12, 10), (24, 15), (36, 17), (60, 20),
        ],
    }

    # -----------------------------------------------------------------------
    # Public API — identical signature, identical return shape
    # -----------------------------------------------------------------------
    def score(self, resume: Dict, jd: Optional[Dict] = None) -> Dict:
        e = resume.get("entities", {}) or {}
        s = resume.get("sections", {}) or {}

        profile = self._detect_profile(e, s)
        w       = self.WEIGHTS[profile]

        breakdown = {
            "skills":     self._skills(e, jd, w),
            "roles":      self._roles(e, jd, w, profile),
            "experience": self._experience(e, profile, w),
            "structure":  self._structure(s, profile, w),
            "companies":  self._companies(e, w, profile),
        }
        return {
            "total_score": min(100, sum(breakdown.values())),
            "breakdown":   breakdown,
            "flags":       self._flags(e, s, profile),
            "meta": {
                "scorer":   "ats_v3",
                "profile":  profile,
                "jd_used":  bool(jd),
            },
        }

    # -----------------------------------------------------------------------
    # Profile detection
    # -----------------------------------------------------------------------
    def _detect_profile(self, e: Dict, s: Dict) -> str:
        total_months  = self._total_months(e)
        has_education = bool(s.get("education", "").strip())
        has_projects  = bool(s.get("projects",  "").strip())
        seniority     = e.get("seniority", [])

        # Student: very low experience + education present + projects as primary
        if total_months < 12 and has_education and has_projects:
            return PROFILE_STUDENT

        # Student without explicit education section but pure intern/trainee
        if total_months < 6 and ("intern" in seniority or "trainee" in seniority):
            return PROFILE_STUDENT

        # Early career: some experience but not yet professional level
        if total_months < 24:
            return PROFILE_EARLY_CAREER

        return PROFILE_PROFESSIONAL

    # -----------------------------------------------------------------------
    # Scoring helpers
    # -----------------------------------------------------------------------
    def _total_months(self, e: Dict) -> int:
        return (
            e.get("total_months")
            or e.get("experience_years", 0) * 12 + e.get("experience_months", 0)
        )

    def _skills(self, e: Dict, jd: Optional[Dict], w: Dict) -> int:
        skills = set(e.get("skills", []))
        if not skills:
            return 0
        max_w = w["skills"]
        if jd and jd.get("skills"):
            ratio = len(skills & set(jd["skills"])) / max(len(jd["skills"]), 1)
            return int(max_w * min(ratio, 1.0))
        # 16+ skills = full marks for any profile
        return min(max_w, int(len(skills) * (max_w / 16)))

    def _roles(self, e: Dict, jd: Optional[Dict], w: Dict, profile: str) -> int:
        roles = set(e.get("normalized_roles", []))
        if not roles:
            return 0

        max_w    = w["roles"]
        seniority = e.get("seniority", [])

        # JD mismatch penalty — same for all profiles
        if jd and jd.get("roles") and not (roles & set(jd["roles"])):
            max_w = int(max_w * 0.5)

        # Intern/trainee seniority:
        #   Student  → no penalty (expected)
        #   Early    → mild penalty (0.8)
        #   Pro      → steeper (0.5) — an intern title on a senior resume is a red flag
        if "intern" in seniority or "trainee" in seniority:
            if profile == PROFILE_EARLY_CAREER:
                max_w = int(max_w * 0.8)
            elif profile == PROFILE_PROFESSIONAL:
                max_w = int(max_w * 0.5)
            # PROFILE_STUDENT: no penalty at all

        return max_w

    def _experience(self, e: Dict, profile: str, w: Dict) -> int:
        total   = self._total_months(e)
        buckets = self.EXP_BUCKETS[profile]
        max_w   = w["experience"]
        for min_m, frac_score in reversed(buckets):
            if total >= min_m:
                # frac_score is already an absolute value relative to the
                # old weight=20 scale — rescale to current profile weight
                return min(max_w, frac_score)
        return 0

    def _structure(self, s: Dict, profile: str, w: Dict) -> int:
        """
        Professional: reward experience + skills + projects (original)
        Student/Early: reward education + skills + projects
          - education section present  → extra credit
          - achievements/certifications → bonus
        """
        max_w = w["structure"]

        if profile == PROFILE_PROFESSIONAL:
            present = sum(
                bool(s.get(k, "").strip())
                for k in ["experience", "skills", "projects"]
            )
            if present == 3: return max_w
            if present == 2: return int(max_w * 0.7)
            if s.get("projects", "").strip(): return int(max_w * 0.4)
            return int(max_w * 0.2) if present else 0

        # Student / Early career scoring
        score = 0
        # Core sections — each worth a portion
        section_weights = {
            "skills":          0.30,
            "projects":        0.30,
            "education":       0.25,
            "experience":      0.10,   # nice-to-have for students
            "achievements":    0.05,   # hackathons, awards, scholarships
        }
        for section, weight in section_weights.items():
            if s.get(section, "").strip():
                score += max_w * weight

        # Bonus: certifications or volunteer show initiative
        bonus_sections = ["certifications", "volunteer"]
        if any(s.get(sec, "").strip() for sec in bonus_sections):
            score = min(max_w, score + max_w * 0.05)

        return int(score)

    def _companies(self, e: Dict, w: Dict, profile: str) -> int:
        companies = e.get("companies", [])
        seniority = e.get("seniority", [])
        max_w     = w["companies"]

        if not companies:
            return 0

        if profile == PROFILE_STUDENT:
            # Any company (even 1 internship) = full marks for students
            return max_w

        if profile == PROFILE_EARLY_CAREER:
            # 1 company = 70%, 2+ = full
            return max_w if len(companies) >= 2 else int(max_w * 0.7)

        # Professional: original logic
        return max_w if len(companies) >= 2 else int(max_w * 0.6)

    # -----------------------------------------------------------------------
    # Flags — profile-aware, no false alarms for students
    # -----------------------------------------------------------------------
    def _flags(self, e: Dict, s: Dict, profile: str) -> List[str]:
        flags   = []
        total   = self._total_months(e)
        has_exp = bool(s.get("experience", "").strip())
        has_proj = bool(s.get("projects",  "").strip())

        # Skills missing — relevant for ALL profiles
        if not e.get("skills"):
            flags.append("missing_skills")

        if profile == PROFILE_STUDENT:
            # Students are not expected to have an experience section
            # Only flag if they have NEITHER experience NOR projects
            if not has_exp and not has_proj:
                flags.append("missing_experience_and_projects")
            if not s.get("education", "").strip():
                flags.append("missing_education_section")
            # No company flag only if they have zero internships AND no projects
            if not e.get("companies") and not has_proj:
                flags.append("no_experience_signal")

        elif profile == PROFILE_EARLY_CAREER:
            if not has_exp and not has_proj:
                flags.append("missing_experience_and_projects")
            if total < 6:
                flags.append("low_experience")
            if not e.get("companies"):
                flags.append("no_company_signal")

        else:  # PROFESSIONAL
            if not has_exp:
                flags.append("missing_experience_section")
            if total < 6:
                flags.append("low_experience")
            if "intern" in e.get("seniority", []):
                flags.append("intern_only_profile")
            if not e.get("companies"):
                flags.append("no_company_signal")

        return flags
