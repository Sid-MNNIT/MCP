from mcp.server.fastmcp import FastMCP

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
def ping():
    return "pong"

if __name__ == "__main__":
    mcp.run(transport="stdio")
