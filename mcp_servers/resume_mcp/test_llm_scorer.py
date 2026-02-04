from services.ats_scorer import ATSScorer
from services.llm_scorer import LLMScorer
from services.groq_client import GroqClient
from pipelines.extract_pipeline import extract_resume

def test_llm():
    with open("services/sample_output.txt", encoding="utf-8") as f:
        raw_text = f.read()
    resume = extract_resume(raw_text)

    ats = ATSScorer()
    ats_result = ats.score(resume)

    print("\n===== ATS SCORE RESULT =====\n")
    print("Total Score:", ats_result["total_score"])
    print("Breakdown:", ats_result["breakdown"])
    print("Flags:", ats_result["flags"])
    print("\n===== LLM SCORER (GROQ) =====\n")
    client = GroqClient()
    llm = LLMScorer(client)
    llm_result = llm.evaluate(
        resume=resume,
        ats_result=ats_result,
        job_description=None
    )
    print("Score Adjustment:", llm_result["score_adjustment"])
    print("Feedback:")
    for item in llm_result["feedback"]:
        print("-", item)


if __name__ == "__main__":
    test_llm()
