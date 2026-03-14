from typing import Dict, List, Optional


class ATSScorer:
    WEIGHTS = {"skills": 40, "roles": 20, "experience": 20, "structure": 10, "companies": 10}

    # (min_total_months, score)
    EXP_BUCKETS = [(0,0),(6,5),(12,10),(24,15),(36,17),(60,20)]

    def score(self, resume: Dict, jd: Optional[Dict] = None) -> Dict:
        e = resume.get("entities", {}) or {}
        s = resume.get("sections", {}) or {}
        breakdown = {
            "skills":     self._skills(e, jd),
            "roles":      self._roles(e, jd),
            "experience": self._experience(e),
            "structure":  self._structure(s),
            "companies":  self._companies(e),
        }
        return {
            "total_score": min(100, sum(breakdown.values())),
            "breakdown":   breakdown,
            "flags":       self._flags(e, s),
            "meta":        {"scorer": "ats_v2", "jd_used": bool(jd)},
        }

    def _skills(self, e, jd):
        skills = set(e.get("skills", []))
        if not skills:
            return 0
        w = self.WEIGHTS["skills"]
        if jd and jd.get("skills"):
            ratio = len(skills & set(jd["skills"])) / max(len(jd["skills"]), 1)
            return int(w * min(ratio, 1.0))
        return min(w, int(len(skills) * 2.5))

    def _roles(self, e, jd):
        roles = set(e.get("normalized_roles", []))
        if not roles:
            return 0
        score = self.WEIGHTS["roles"]
        if jd and jd.get("roles") and not (roles & set(jd["roles"])):
            score = int(score * 0.4)
        if e.get("seniority") == ["intern"]:
            score = int(score * 0.4)
        return score

    def _experience(self, e):
        total = e.get("total_months") or e.get("experience_years", 0) * 12 + e.get("experience_months", 0)
        for min_m, score in reversed(self.EXP_BUCKETS):
            if total >= min_m:
                return score
        return 0

    def _structure(self, s):
        present = sum(bool(s.get(k, "").strip()) for k in ["experience", "skills", "projects"])
        w = self.WEIGHTS["structure"]
        if present == 3: return w
        if present == 2: return int(w * 0.7)
        if s.get("projects", "").strip(): return int(w * 0.4)
        return int(w * 0.2) if present else 0

    def _companies(self, e):
        c = e.get("companies", [])
        if not c: return 0
        return self.WEIGHTS["companies"] if len(c) >= 2 else int(self.WEIGHTS["companies"] * 0.6)

    def _flags(self, e, s) -> List[str]:
        flags = []
        total = e.get("total_months") or e.get("experience_years", 0) * 12 + e.get("experience_months", 0)
        if not e.get("skills"):              flags.append("missing_skills")
        if not s.get("experience","").strip(): flags.append("missing_experience_section")
        if total < 6:                         flags.append("low_experience")
        if e.get("seniority") == ["intern"]:  flags.append("intern_only_profile")
        if not e.get("companies"):            flags.append("no_company_signal")
        return flags
