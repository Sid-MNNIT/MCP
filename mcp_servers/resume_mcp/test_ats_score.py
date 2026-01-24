from pipelines.extract_pipeline import extract_resume
from services.ats_scorer import ATSScorer


def test_ats():
    with open("services/sample_output.txt", encoding="utf-8") as f:
        raw_text = f.read()

    resume = extract_resume(raw_text)

    scorer = ATSScorer()
    ats_result = scorer.score(resume)

    print("\n===== ATS SCORE RESULT =====\n")
    print("Total Score:", ats_result["total_score"])
    print("\nBreakdown:")
    for k, v in ats_result["breakdown"].items():
        print(f"  {k}: {v}")

    print("\nFlags:", ats_result["flags"])
    print("\nMeta:", ats_result["meta"])

if __name__ == "__main__":
    test_ats()
