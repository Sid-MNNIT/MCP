# jobsy_client/context_wrapper.py

from datetime import datetime


def extract_company(email_from: str) -> str:
    """
    Very naive extraction for now.
    Later we will improve this.
    """
    if "<" in email_from:
        email_from = email_from.split("<")[0]

    return email_from.strip()


def classify_type(labels: list[str]) -> str:
    if "interview" in labels:
        return "interview"
    if "jobs" in labels:
        return "job"
    return "general"


def gmail_to_storable_context(gmail_email: dict) -> dict:
    """
    Convert Gmail MCP output → MongoDB-ready context
    """

    return {
        "source": "gmail",
        "type": classify_type(gmail_email.get("labels", [])),

        # Gmail references
        "email_id": gmail_email.get("id"),
        "email_from": gmail_email.get("from"),
        "email_subject": gmail_email.get("subject"),
        "email_date": gmail_email.get("date"),
        "snippet": gmail_email.get("snippet"),

        # Extracted / inferred
        "company": extract_company(gmail_email.get("from", "")),
        "event_hint": "Interview" if "interview" in gmail_email.get("labels", []) else None,

        # System fields
        "processed": False,
        "created_at": datetime.utcnow().isoformat()
    }
