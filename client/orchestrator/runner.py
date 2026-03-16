# client/orchestrator/runner.py
from client.orchestrator.calendar_agent import create_calendar_event_pipeline
from client.orchestrator.calendar_email_extractor import extract_calendar_from_email_pipeline

# in run_workflow():


from client.orchestrator.email_agent import (
    prepare_email_reply_preview,
    send_email_with_approval,
    ingest_and_store_emails
)


async def run_workflow(workflow: str, payload: dict):

    if workflow == "calendar_create_event":
        return await create_calendar_event_pipeline(
            event_type=payload["event_type"],
            company=payload["company"],
            date=payload["date"],
            start_time=payload["start_time"],
            end_time=payload["end_time"],
            user_id=str(payload["userId"]),
            role=payload.get("role"),
            timezone=payload.get("timezone", "Asia/Kolkata"),
            meet_link=payload.get("meet_link"),
            description=payload.get("description"),
        )

    if workflow == "extract_calendar_from_email":
        return await extract_calendar_from_email_pipeline(
            subject=payload["subject"],
            text=payload["text"]
        )

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