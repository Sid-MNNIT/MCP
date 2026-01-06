from client.backend_client.agent_api import execute_tool
from client.wrappers.gmail_wrapper import clean_email_body
from client.orchestrator.context_builder import build_email_prompt
from client.orchestrator.fake_llm import generate_fake_email_reply
from client.orchestrator.email_mapper import map_to_backend
from client.backend_client.email_api import save_email

import asyncio
import json

# ============================================================
# Draft email preview (READ-ONLY PIPELINE)
# ============================================================
async def prepare_email_reply_preview(
    message_id: str,
    tone: str = "professional"
):
    result = await execute_tool(
        tool="draft_reply",
        args={
            "message_id": message_id,
            "tone": tone
        }
    )

    # 🔓 MCP response unwrapping (INLINE)
    if "reply_context" in result:
        reply_context = result["reply_context"]
    elif result.get("type") == "text":
        payload = json.loads(result["text"])
        reply_context = payload["reply_context"]
    else:
        raise ValueError(f"Unexpected MCP response: {result}")

    # Defensive validation
    for key in ("to", "subject", "threadId", "messageId", "originalEmail"):
        if key not in reply_context:
            raise ValueError(f"Missing {key} in reply_context")

    # Clean email body
    reply_context["originalEmail"]["body"] = clean_email_body(
        reply_context["originalEmail"].get("body", "")
    )

    # Build LLM prompt
    prompt = build_email_prompt(reply_context)

    # Generate draft reply
    email_body = generate_fake_email_reply(prompt)

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
async def send_email_with_approval(draft: dict):

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
        }
    )

    # 🔓 MCP response unwrapping (INLINE)
    if isinstance(result, dict):
        return result
    elif result.get("type") == "text":
        return json.loads(result["text"])
    else:
        raise ValueError(f"Unexpected MCP response: {result}")


# ============================================================
# Ingest and store emails (BACKGROUND PIPELINE)
# ============================================================
async def ingest_and_store_emails():

    result = await execute_tool(
        tool="get_recent_job_emails",
        args={}
    )

    # 🔓 MCP response unwrapping (INLINE)
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

        if hasattr(payload.get("date"), "isoformat"):
            payload["date"] = payload["date"].isoformat()

        stored.append( save_email(payload))  

    return stored


# ============================================================
# Manual pipeline test
# ============================================================
if __name__ == "__main__":

    async def manual_test():
        from client.backend_client.auth import set_current_jwt

 

        set_current_jwt(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTUwMzU3OWIyNGJmOGQ0ZTU3YzNiMjgiLCJlbWFpbCI6InJpdGlrQGV4YW1wbGUuY29tIiwiZnVsbG5hbWUiOiJSaXR2aWsgUmFpIiwiaWF0IjoxNzY3NzI4NjM5LCJleHAiOjE3Njc4MTUwMzl9.aLM37P1i5G0m_sx-YUqxHhrpQA6L_mR1_ZAZXFsiZDQ"
        )
        result = await ingest_and_store_emails()
          

        
        
        print(result)



    asyncio.run(manual_test())
