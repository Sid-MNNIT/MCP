from pathlib import Path

from pipelines.extract_pipeline import extract_resume
from services.ats_scorer import ATSScorer
from services.llm_scorer import LLMScorer
from services.hf_client import HuggingFaceClient
from dotenv import load_dotenv
load_dotenv()


def test_llm():
    # Load resume text
    base_dir = Path(__file__).resolve().parents[1]
    with open("services/sample_output.txt", encoding="utf-8") as f:
        raw_text = f.read()

    resume = extract_resume(raw_text)

    # Run ATS first (deterministic)
    ats = ATSScorer()
    ats_result = ats.score(resume)

    # Run LLM
    client = HuggingFaceClient()
    llm = LLMScorer(client)

    llm_result = llm.evaluate(
        resume=resume,
        ats_result=ats_result,
        job_description=None
    )

    print("\n===== LLM RESULT =====\n")
    print("Feedback:")
    for f in llm_result["feedback"]:
        print("-", f)

    print("\nScore Adjustment:", llm_result["score_adjustment"])


if __name__ == "__main__":
    test_llm()
