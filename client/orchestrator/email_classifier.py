def classify_email(subject: str, body: str) -> str:
    text = f"{subject} {body}".lower()

    if "interview" in text:
        return "INTERVIEW"
    if "offer" in text:
        return "OFFER"
    if "regret" in text or "unfortunately" in text:
        return "REJECTION"
    if "job" in text or "position" in text:
        return "JOB"

    return "OTHER"



