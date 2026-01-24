"""
ATS Scorer (Deterministic, Stable)

Design goals:
- Reproducible scores (no randomness)
- Explainable breakdown
- Safe with partial / noisy resumes
- Future-ready for JD alignment & LLM augmentation
"""

from typing import Dict, List


class ATSScorer:
    WEIGHTS = {
        "skills": 40,
        "roles": 20,
        "experience": 20,
        "structure": 10,
        "companies": 10,
    }
    EXPERIENCE_BUCKETS = [
        (0, 0),
        (1, 5),
        (2, 10),
        (3, 15),
        (5, 20),
    ]
    def score(self, resume: Dict, jd: Dict | None = None) -> Dict:
        """
        Compute ATS score.

        Inputs:
            resume: output of extract_pipeline
            jd (optional): parsed job description

        Output:
            {
              total_score,
              breakdown,
              flags,
              meta
            }
        """

        entities = resume.get("entities", {}) or {}
        sections = resume.get("sections", {}) or {}

        breakdown = {
            "skills": self._score_skills(entities, jd),
            "roles": self._score_roles(entities, jd),
            "experience": self._score_experience(entities),
            "structure": self._score_structure(sections),
            "companies": self._score_companies(entities),
        }

        total = min(100, sum(breakdown.values()))

        return {
            "total_score": total,
            "breakdown": breakdown,
            "flags": self._generate_flags(entities, sections),
            "meta": {
                "scorer": "deterministic_ats_v1",
                "jd_used": bool(jd),
            },
        }

    # SCORING COMPONENTS
    def _score_skills(self, entities: Dict, jd: Dict | None) -> int:
        skills = set(entities.get("skills", []))
        if not skills:
            return 0

        weight = self.WEIGHTS["skills"]

        if jd and jd.get("skills"):
            jd_skills = set(jd["skills"])
            matched = skills & jd_skills
            ratio = len(matched) / max(len(jd_skills), 1)
            return int(weight * min(ratio, 1.0))

        return min(weight, int(len(skills) * 2.5))

    def _score_roles(self, entities: Dict, jd: Dict | None) -> int:
        roles = set(entities.get("normalized_roles", []))
        seniority = set(entities.get("seniority", []))

        if not roles:
            return 0
        score = self.WEIGHTS["roles"]

        if jd and jd.get("roles"):
            if not roles & set(jd["roles"]):
                score *= 0.4

        if seniority == {"intern"}:
            score *= 0.4

        return int(score)

    def _score_experience(self, entities: Dict) -> int:
        years = entities.get("experience_years", 0)

        for min_years, score in reversed(self.EXPERIENCE_BUCKETS):
            if years >= min_years:
                return score

        return 0

    def _score_structure(self, sections: Dict) -> int:
        required = ["experience", "skills", "projects"]
        present = sum(bool(sections.get(s)) for s in required)

        weight = self.WEIGHTS["structure"]

        if present == 3:
            return weight
        if present == 2:
            return int(weight * 0.6)
        if present == 1:
            return int(weight * 0.3)
        return 0

    def _score_companies(self, entities: Dict) -> int:
        companies = entities.get("companies", [])
        weight = self.WEIGHTS["companies"]

        if not companies:
            return 0
        if len(companies) >= 2:
            return weight
        return int(weight * 0.6)
    
    # FLAGS (non-scoring signals)
    def _generate_flags(self, entities: Dict, sections: Dict) -> List[str]:
        flags = []

        if not entities.get("skills"):
            flags.append("missing_skills")

        if not sections.get("experience"):
            flags.append("missing_experience_section")

        if entities.get("experience_years", 0) < 1:
            flags.append("low_experience")

        if entities.get("seniority") == ["intern"]:
            flags.append("intern_only_profile")

        if not entities.get("companies"):
            flags.append("no_company_signal")

        return flags
