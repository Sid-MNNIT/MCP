from services.ats_scorer import ATSScorer
from services.llm_scorer import LLMScorer
from services.groq_client import GroqClient



class ScorePipeline:
    def __init__(self, use_llm=False):
        self.ats_scorer = ATSScorer()
        self.llm_scorer = None

        if use_llm:
            self.llm_scorer = LLMScorer(GroqClient())

    def run(self, parsed_resume, job_description=None):
        ats_result = self.ats_scorer.score(parsed_resume)

        final_score = ats_result["total_score"]
        llm_feedback = []

        if self.llm_scorer:
            llm_result = self.llm_scorer.evaluate(
                parsed_resume, ats_result, job_description
            )
            final_score = max(
                0, min(100, final_score + llm_result["score_adjustment"])
            )
            llm_feedback = llm_result["feedback"]

        return {
            "final_score": final_score,
            "ats": ats_result,
            "llm_feedback": llm_feedback,
        }
