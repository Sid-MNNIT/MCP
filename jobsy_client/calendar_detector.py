import re
from datetime import datetime
from dateutil import parser


DATE_PATTERNS = [
    r"\b\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b",
    r"\b\d{1,2}/\d{1,2}/\d{4}\b",
    r"\b\d{4}-\d{2}-\d{2}\b"
]


KEYWORDS = [
    "interview",
    "deadline",
    "last date",
    "event",
    "hiring drive",
    "apply by",
    "scheduled"
]


def extract_event_date(text: str):
    """
    Tries to find a date inside email text.
    Returns ISO datetime string or None.
    """
    for pattern in DATE_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                dt = parser.parse(match.group())
                return dt.isoformat()
            except Exception:
                pass
    return None


def is_calendar_worthy(email_doc: dict):
    """
    Decide whether this email should become a calendar event.
    """
    content = f"{email_doc.get('email_subject', '')} {email_doc.get('snippet', '')}".lower()

    if not any(k in content for k in KEYWORDS):
        return None

    event_date = extract_event_date(content)
    if not event_date:
        return None

    return {
        "event_date": event_date,
        "event_type": "job_event"
    }
