class LLMScorer:
    def __init__(self, client):
        self.client = client

    def evaluate(self, resume: dict, ats_result: dict, job_description=None) -> dict:
        try:
            result = self.client.complete(self._prompt(resume, ats_result, job_description))
        except Exception:
            return {"feedback": ["LLM unavailable, ATS score used as-is"], "score_adjustment": 0}
        return {
            "feedback":         result.get("feedback", []),
            "score_adjustment": max(-10, min(10, int(result.get("score_adjustment", 0) or 0))),
        }

    def _prompt(self, resume, ats, jd):
        e = resume.get("entities", {}) or {}
        s = resume.get("sections", {}) or {}
        years  = e.get("experience_years", 0)
        months = e.get("experience_months", 0)
        total  = e.get("total_months", years * 12 + months)
        return f"""ATS resume review.

ATS score: {ats.get("total_score", 0)}
Breakdown: {ats.get("breakdown", {})}
Experience: {years}y {months}m ({total} months total)
Roles: {e.get("normalized_roles", [])}
Skills: {e.get("skills", [])}

Experience section:
{(s.get("experience", "") or "(not provided)")[:800]}

Projects section:
{(s.get("projects", "") or "(not provided)")[:800]}

Job description: {jd or "Not provided"}

Return JSON only:
{{"feedback": ["short actionable suggestion"], "score_adjustment": integer -10 to +10}}"""