from tools.gmail import (
    fetch_messages,
    get_message_details,
    build_email_summary
)

if __name__ == "__main__":
    messages = fetch_messages(max_results=5)

    for m in messages:
        details = get_message_details(m["id"])
        summary = build_email_summary(details)
        print(summary)
