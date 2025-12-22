from datetime import datetime,timedelta
from utils.email_utils import extract_body,extract_headers

def fetch_recent_messages(service,lookback_days=7, max_results=50):
   

    after_date = (datetime.utcnow() - timedelta(days=lookback_days)).strftime("%Y/%m/%d")

    query = f"after:{after_date}"
    # google quert requires in this form

    response = service.users().messages().list(
        userId="me",
        q=query,
        maxResults=max_results
    ).execute()

    '''

    {
  "messages": [
    {"id": "18c8a...", "threadId": "18c8a..."},
    {"id": "18c8b...", "threadId": "18c8b..."}
  ]
}

    '''

    return response.get("messages", [])


def get_full_message(service, message_id):
    return service.users().messages().get(
        userId="me",
        id=message_id,
        format="full"
    ).execute()


def parse_email(message):
    payload = message.get("payload", {})
    headers = extract_headers(payload.get("headers", []))
    body = extract_body(payload)

    return {
        
        "id": message.get("id"),
        "from": headers.get("from"),
        "subject": headers.get("subject"),
        "date": headers.get("date"),
        "body": body.strip()
    }
