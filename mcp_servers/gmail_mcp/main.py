from mcp.server.fastmcp import FastMCP
import base64
from email.message import EmailMessage
from state.gmail_state import get_cached_gmail_service
from services.gmail_service import (
    fetch_recent_messages,
    get_full_message,
    parse_email
)
from services.job_email_filter import is_job_related

mcp = FastMCP("gmail-mcp")

@mcp.tool()
def get_recent_job_emails(lookback_days: int = 7, max_results: int = 10):
    service = get_cached_gmail_service()

    messages = fetch_recent_messages(
        service,
        lookback_days=lookback_days,
        max_results=max_results
    )

    emails = []
    for msg in messages:
        full_msg = get_full_message(service, msg["id"])
        parsed = parse_email(full_msg)

        if is_job_related(parsed):
            emails.append(parsed)

    return {"emails": emails}


@mcp.tool()
def get_email_by_id(message_id: str):
    service = get_cached_gmail_service()

    message = service.users().messages().get(
            userId="me",
            id=message_id,
            format="full"
        ).execute()
    
    parsed=parse_email(message)

    return{"email":parsed}


@mcp.tool()
def draft_reply(message_id: str, tone: str = "professional"):
    service = get_cached_gmail_service()   # ✅ FIXED

    message = service.users().messages().get(
        userId="me",
        id=message_id,
        format="full"
    ).execute()

    parsed = parse_email(message)

    return {
        "reply_context": {
            "to": parsed["from"],
            "subject": f"Re: {parsed['subject']}",
            "threadId": parsed.get("threadId"),
            "originalEmail": {
                "from": parsed["from"],
                "subject": parsed["subject"],
                "date": parsed["date"],     # ensure parse_email provides this
                "body": parsed["body"]      # ensure parse_email provides this
            },
            "guidelines": {
                "tone": tone,
                "length": "short",
                "style": "clear and polite"
            }
        }
    }

@mcp.tool()
def send_email(
    to: str,
    subject: str,
    body: str,
    threadId: str | None = None
):
    """
    Send an email via Gmail.
    REAL ACTION — uses gmail.modify scope.
    """

    service = get_cached_gmail_service()

    msg = EmailMessage()
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)

    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()

    payload = {"raw": raw}
    if threadId:
        payload["threadId"] = threadId

    sent = service.users().messages().send(
        userId="me",
        body=payload
    ).execute()

    return {
        "status": "sent",
        "messageId": sent["id"],
        "threadId": sent.get("threadId")
    }


    





@mcp.tool()
def ping():
    return "pong"

if __name__ == "__main__":
    mcp.run(transport="stdio")
