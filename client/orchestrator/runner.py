# client/orchestrator/runner.py

from client.orchestrator.email_agent import (
    prepare_email_reply_preview,
    send_email_with_approval,
    ingest_and_store_emails
)


async def run_workflow(workflow: str, payload: dict):

    if workflow == "prepare_email_reply_preview":
        if "message_id" not in payload:
            raise ValueError("message_id required for draft workflow")

        return await prepare_email_reply_preview(
            message_id=payload["message_id"],
            tone=payload.get("tone", "professional")
        )

    if workflow == "send_email_with_approval":
        if "draft" not in payload:
            raise ValueError("draft required to send email")

        return await send_email_with_approval(payload["draft"])

    if workflow == "ingest_and_store_emails":
        return await ingest_and_store_emails()

    raise ValueError(f"Unknown workflow: {workflow}")
