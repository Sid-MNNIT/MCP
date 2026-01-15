import json

from client.llm.groq_client import get_groq_client


MODEL_ID = "llama-3.1-8b-instant"


def generate_email_reply(prompt: str) -> str:
    """
    Generates a polite, professional email reply.
    Returns ONLY the email body.
    """

    client = get_groq_client()

    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a professional assistant that writes concise, "
                    "polite, business-appropriate email replies."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.4,
        max_tokens=300,
    )

    return response.choices[0].message.content.strip()


def classify_email_semantic(subject: str, body: str) -> dict:
    """
    Determines whether an email is job-related and classifies it.
    Includes DEBUG logs.
    """

    prompt = f"""
You classify emails related to job applications.

Decide:
1. Is this a REAL job-related email?
2. If yes, classify into ONE category:
   OFFER, INTERVIEW, REJECTION, JOB, OTHER

Return STRICT JSON only (no markdown, no explanation):
{{
  "is_relevant": true | false,
  "type": "OFFER | INTERVIEW | REJECTION | JOB | OTHER"
}}

Subject:
{subject}

Body:
{body}
""".strip()

    client = get_groq_client()

    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=120,
    )

    raw_text = response.choices[0].message.content.strip()

    # 🔍 DEBUG LOG
    print("\n[LLM RAW RESPONSE]")
    print(raw_text)

    # 🔧 Strip markdown if present
    cleaned = raw_text
    if raw_text.startswith("```"):
        cleaned = raw_text.strip("`").replace("json", "").strip()

    try:
        result = json.loads(cleaned)
    except Exception as e:
        print("[LLM PARSE ERROR]", e)
        return {"is_relevant": False, "type": "OTHER"}

    # 🔍 DEBUG LOG
    print("[LLM PARSED RESULT]", result)

    return {
        "is_relevant": bool(result.get("is_relevant", False)),
        "type": result.get("type", "OTHER").upper(),
    }
