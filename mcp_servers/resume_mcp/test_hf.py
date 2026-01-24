from services.hf_client import HuggingFaceClient

client = HuggingFaceClient()

prompt = """
Return JSON only.
{
  "feedback": ["This is a test message"],
  "score_adjustment": 3
}
"""

print("Calling Hugging Face...")
result = client.complete(prompt)
print("HF RESULT:", result)
