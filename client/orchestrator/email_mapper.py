from client.orchestrator.email_classifier import classify_email
from datetime import datetime

def map_to_backend(email):
    """
    Maps parsed Gmail email → backend Email model
    """

    # Prefer Gmail internal timestamp (milliseconds)
    timestamp = email.get("timestamp")

    if timestamp:
        date = datetime.utcfromtimestamp(timestamp / 1000)
    else:
        # fallback to header date (best effort)
        date = email.get("date")

    return {
        

        # Gmail identifiers
        "emailId": email["id"],              # required
        "provider": "gmail",

        # Classification
        "type": classify_email(
            email.get("subject", ""),
            email.get("body", "")
        ),

        # Core fields
        "from": email.get("from", ""),
        "subject": email.get("subject", ""),
        "text": email.get("body", ""),
        "date": date.isoformat() if date else None,

        # Flags
        "isEmbedded": False
    }
