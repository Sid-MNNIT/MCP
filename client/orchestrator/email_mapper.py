from client.orchestrator.email_classifier import classify_email
from datetime import datetime

ALLOWED_TYPES = {
    "JOB", "INTERVIEW", "OFFER", "REJECTION", "OTHER"
}

def map_to_backend(email):
    """
    Maps parsed Gmail email → backend Email model
    """

    # -----------------------------
    # Date handling (REQUIRED)
    # -----------------------------
    timestamp = email.get("timestamp")

    if timestamp:
        date = datetime.utcfromtimestamp(timestamp / 1000)
    else:
        date = email.get("date")

    if not date:
        # 🔥 HARD FAIL (better than silent corruption)
        raise ValueError(f"Missing date for email {email.get('id')}")

    # -----------------------------
    # Classification (SAFE)
    # -----------------------------
    raw_type = classify_email(
        email.get("subject", ""),
        email.get("body", "")
    )

    email_type = raw_type.upper() if raw_type else "OTHER"
    if email_type not in ALLOWED_TYPES:
        email_type = "OTHER"

    # -----------------------------
    # Final payload
    # -----------------------------
    return {
        "emailId": email["id"],

        "type": email_type,

        "from": email.get("from", ""),
        "subject": email.get("subject", ""),
        "text": email.get("body", ""),
        "date": date.isoformat(),

        "isEmbedded": False
    }
