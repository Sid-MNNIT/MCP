from googleapiclient.discovery import build
from tools.gmail_auth import authenticate
from email.utils import parsedate_to_datetime

# ------------------------------------
# Fetch message IDs using a search query
# ------------------------------------
def fetch_messages(query="job OR interview OR recruiter", max_results=10):
    creds = authenticate()
    service = build("gmail", "v1", credentials=creds)

    response = service.users().messages().list(
        userId="me",
        q=query,
        maxResults=max_results
    ).execute()

    return response.get("messages", [])


# ------------------------------------
# Fetch full metadata for a message
# ------------------------------------
def get_message_details(message_id):
    creds = authenticate()
    service = build("gmail", "v1", credentials=creds)

    msg = service.users().messages().get(
        userId="me",
        id=message_id,
        format="metadata",
        metadataHeaders=["From", "Subject", "Date"]
    ).execute()

    headers = {
        h["name"]: h["value"]
        for h in msg["payload"]["headers"]
    }

    date_iso = None
    if "Date" in headers:
        try:
            date_iso = parsedate_to_datetime(
                headers["Date"]
            ).isoformat()
        except Exception:
            date_iso = headers["Date"]

    return {
        "id": msg["id"],
        "from": headers.get("From", ""),
        "subject": headers.get("Subject", ""),
        "date": date_iso,
        "snippet": msg.get("snippet", ""),
        "labels": msg.get("labelIds", []),
        "attachments": has_attachments(msg)
    }


# ------------------------------------
# Detect attachments
# ------------------------------------
def has_attachments(msg):
    payload = msg.get("payload", {})
    parts = payload.get("parts", [])

    for part in parts:
        if part.get("filename"):
            return True
    return False


# ------------------------------------
# Normalize into MCP emailSummary schema
# ------------------------------------
def build_email_summary(msg):
    return {
        "source": "gmail",
        "id": msg["id"],
        "from": msg["from"],
        "subject": msg["subject"],
        "date": msg["date"],
        "snippet": msg["snippet"],
        "labels": normalize_labels(msg),
        "attachments": msg["attachments"]
    }


def normalize_labels(msg):
    labels = msg.get("labels", [])
    subject = msg.get("subject", "").lower()

    out = []

    if any(x in subject for x in ["interview", "schedule", "meeting"]):
        out.append("interview")

    if any(x in subject for x in ["job", "role", "position", "career", "hiring"]):
        out.append("jobs")

    if "IMPORTANT" in labels:
        out.append("important")

    if not out:
        out.append("general")

    return out
