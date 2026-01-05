def decide_workflow(user_message: dict) -> str:
    """
    LLM decides WHICH workflow to run.
    Replace with real LLM later.
    """

    text = user_message["text"].lower()

    if "draft" in text or "reply" in text:
        return "prepare_email_reply_preview"

    if "send" in text:
        return "send_email_with_approval"

    if "sync" in text or "fetch" in text:
        return "ingest_and_store_emails"

    return "unknown"
