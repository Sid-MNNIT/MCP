from client.orchestrator.agent import (
    prepare_email_reply_preview,
    send_email_with_approval,
    ingest_and_store_emails
)

async def run_workflow(workflow: str, payload: dict):
    if workflow == "prepare_email_reply_preview":
        return await prepare_email_reply_preview(
            message_id=payload["message_id"],
            tone=payload.get("tone", "professional")
        )

    if workflow == "send_email_with_approval":
        return await send_email_with_approval(payload["draft"])

    if workflow == "ingest_and_store_emails":
        return await ingest_and_store_emails()

    raise ValueError(f"Unknown workflow: {workflow}")
