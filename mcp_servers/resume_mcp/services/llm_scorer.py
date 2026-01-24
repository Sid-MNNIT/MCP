"""
LLM Scorer (Hugging Face backed)
"""

class LLMScorer:
    def __init__(self, client):
        self.client = client

    def evaluate(self, resume, ats_result, job_description=None):
        try:
            prompt = self._build_prompt(resume, ats_result, job_description)
            result = self.client.complete(prompt)
        except Exception as e:
            return {
                "feedback": ["LLM unavailable, ATS score used as-is"],
                "score_adjustment": 0,
            }

        adjustment = int(result.get("score_adjustment", 0))
        adjustment = max(-10, min(10, adjustment))

        return {
            "feedback": result.get("feedback", []),
            "score_adjustment": adjustment,
        }


    def _build_prompt(self, resume, ats_result, jd):
        return f"""
You are an ATS resume reviewer.

Rules:
- Do NOT extract skills
- Do NOT recalculate experience
- Do NOT override ATS score

ATS score: {ats_result["total_score"]}
ATS breakdown: {ats_result["breakdown"]}

Experience years: {resume["entities"].get("experience_years")}
Roles: {resume["entities"].get("normalized_roles")}
Skills: {resume["entities"].get("skills")}

Experience section:
{resume["sections"].get("experience")}

Projects section:
{resume["sections"].get("projects")}

Job description:
{jd if jd else "Not provided"}

Return JSON only:
{{
  "feedback": ["short actionable suggestion"],
  "score_adjustment": integer between -10 and +10
}}
"""
