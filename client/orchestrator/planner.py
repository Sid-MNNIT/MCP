def decide_workflow(user_message: dict) -> str:
    text = user_message.get("text", "").lower()

    if "schedule" in text or "calendar" in text or "interview" in text:
        return "calendar_create_event"                    # ← move to TOP

    if "draft" in text or "reply" in text:
        return "prepare_email_reply_preview"

    if "send" in text:
        return "send_email_with_approval"

    if "sync" in text or "fetch" in text:
        return "ingest_and_store_emails"

    raise ValueError("Unable to decide workflow from user message")