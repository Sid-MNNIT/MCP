from client.backend_client.agent_api import execute_tool
from client.wrappers.gmail_wrapper import clean_email_body
from client.orchestrator.email_prompt_builder import build_email_prompt
from client.orchestrator.email_mapper import map_to_backend
from client.backend_client.email_api import save_email
from client.llm.llm_service import generate_email_reply

import json
import asyncio

# ============================================================
# Draft email preview (READ-ONLY PIPELINE)
# ============================================================
async def prepare_email_reply_preview(
    message_id: str,
    tone: str,
    jwt: str
):
    result = await execute_tool(
        tool="draft_reply",
        args={
            "message_id": message_id,
            "tone": tone
        },
        jwt=jwt
    )

    # 🔓 MCP response unwrapping
    if "reply_context" in result:
        reply_context = result["reply_context"]
    elif result.get("type") == "text":
        payload = json.loads(result["text"])
        reply_context = payload["reply_context"]
    else:
        raise ValueError(f"Unexpected MCP response: {result}")

    for key in ("to", "subject", "threadId", "messageId", "originalEmail"):
        if key not in reply_context:
            raise ValueError(f"Missing {key} in reply_context")

    reply_context["originalEmail"]["body"] = clean_email_body(
        reply_context["originalEmail"].get("body", "")
    )

    prompt = build_email_prompt(reply_context)
    email_body = await asyncio.to_thread(
    generate_email_reply,
    prompt
    )  


    return {
        "draft": {
            "to": reply_context["to"],
            "subject": reply_context["subject"],
            "body": email_body,
            "threadId": reply_context["threadId"],
            "in_reply_to": reply_context["messageId"]
        }
    }


# ============================================================
# Send email with approval (WRITE PIPELINE)
# ============================================================
async def send_email_with_approval(draft: dict, jwt: str):
    for field in ("to", "subject", "body", "threadId", "in_reply_to"):
        if field not in draft:
            raise ValueError(f"Missing required draft field: {field}")

    result = await execute_tool(
        tool="send_email",
        args={
            "to": draft["to"],
            "subject": draft["subject"],
            "body": draft["body"],
            "threadId": draft["threadId"],
            "in_reply_to": draft["in_reply_to"]
        },
        jwt=jwt
    )

    if isinstance(result, dict):
        return result
    elif result.get("type") == "text":
        return json.loads(result["text"])
    else:
        raise ValueError(f"Unexpected MCP response: {result}")


# ============================================================
# Ingest and store emails (BACKGROUND PIPELINE)
# ============================================================
async def ingest_and_store_emails(jwt: str):
    if not jwt:
        raise RuntimeError("JWT is required for ingest_and_store_emails")

    result = await execute_tool(
        tool="get_recent_job_emails",
        args={},
        jwt=jwt
    )

    # 🔓 MCP response unwrapping
    if "emails" in result:
        emails = result["emails"]
    elif result.get("type") == "text":
        payload = json.loads(result["text"])
        emails = payload.get("emails", [])
    else:
        raise ValueError(f"Unexpected MCP response: {result}")

    stored = []

    for email in emails:
        email["body"] = clean_email_body(email.get("body", ""))

        payload = map_to_backend(email)

        if payload is None:
            continue
         


        # Normalize date
        if hasattr(payload.get("date"), "isoformat"):
            payload["date"] = payload["date"].isoformat()

        # 🔑 PASS JWT EXPLICITLY
        stored_email = save_email(payload, jwt)
        stored.append(stored_email)

    return stored




async def run_ingest_pipeline():
    """
    Manually runs Gmail ingest pipeline.
    Fill JWT manually before running.
    """

    JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTY4YWIyZDM2NWI3NDFjMGVhNzBiMjEiLCJlbWFpbCI6Im1haGVzaEBleGFtcGxlLmNvbSIsImZ1bGxuYW1lIjoiTWFoZXNoIiwiaWF0IjoxNzY4NDY3Mjk3LCJleHAiOjE3Njg1NTM2OTd9.CTXHBAMPAlTP-P7lwPH9SHxuiL7xFHur6-0dVIh4O_c"
    if not JWT or JWT == "PASTE_YOUR_JWT_HERE":
        raise RuntimeError("❌ Please set JWT before running ingest pipeline")

    print("🚀 Starting Gmail ingest pipeline...")
    stored_emails = await ingest_and_store_emails(jwt=JWT)

    print(f"✅ Ingest complete. Stored {len(stored_emails)} emails.")
    return stored_emails


# ============================================================
# Entry point
# ============================================================
if __name__ == "__main__":
    asyncio.run(run_ingest_pipeline())
    
