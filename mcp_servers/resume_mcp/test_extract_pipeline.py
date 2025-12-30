from pipelines.extract_pipeline import extract_resume

def test_pipeline():
    with open("services/sample_output.txt", encoding="utf-8") as f:
        raw_text = f.read()

    result = extract_resume(raw_text)

    print("\n===== FINAL PIPELINE OUTPUT =====\n")
    print(result)

if __name__ == "__main__":
    test_pipeline()
