from client.mcp.client import get_mcp_client
from client.wrappers.gmail_wrapper import clean_email_body
from client.orchestrator.context_builder import build_email_prompt
from client.orchestrator.fake_llm import generate_fake_email_reply
from client.orchestrator.email_mapper import map_to_backend
from client.backend_client.email_api import save_emails
from client.orchestrator.email_ingest import fetch_job_emails
# from client.llm.claude import generate_text

import asyncio
import json


async def prepare_email_reply_preview(message_id: str, tone: str = "professional"):

    mcp_client = get_mcp_client()
    tools = await mcp_client.get_tools()

    draft_tool = next(t for t in tools if t.name == "draft_reply")

    draft_result = await draft_tool.ainvoke({
        "message_id": message_id,
        "tone": tone
    })

    tool_output = draft_result[0]
    parsed = json.loads(tool_output["text"])
    reply_context = parsed["reply_context"]

    # Clean original email
    reply_context["originalEmail"]["body"] = clean_email_body(
        reply_context["originalEmail"]["body"]
    )

    # Build prompt
    prompt = build_email_prompt(reply_context)

    # Generate draft
    email_body = generate_fake_email_reply(prompt)

    return {
        "draft": {
            "to": reply_context["to"],
            "subject": reply_context["subject"],
            "body": email_body,
            "threadId": reply_context.get("threadId")
        }
    }


async def send_email_with_approval(draft: dict):

    mcp_client = get_mcp_client()
    tools = await mcp_client.get_tools()

    send_tool = next(t for t in tools if t.name == "send_email")

    return await send_tool.ainvoke({
        "to": draft["to"],
        "subject": draft["subject"],
        "body": draft["body"],
        "threadId": draft.get("threadId")
    })




async def ingest_and_store_emails():
    emails = await fetch_job_emails()
    stored = []

    for email in emails:
        email["body"] = clean_email_body(email.get("body", ""))
        payload = map_to_backend(email)

        if hasattr(payload["date"], "isoformat"):
            payload["date"] = payload["date"].isoformat()

        result = save_emails(payload)
        stored.append(result)

    return stored



# ---- Manual test runner ----
if __name__ == "__main__":

    async def test():
        results = await prepare_email_reply_preview("19b685ca698fd8cd")
        print("\n---EMAIL PREVIEW __\n")
        print(results["draft"]["body"])

        user_input=input("\n Send your reply (yes/no) \n")
        if user_input.lower() =="yes":
            sent=await send_email_with_approval(results["draft"])
            print("EMAIL SENT \n",sent)

        else:
            print("email not sent")


      

    asyncio.run(test())

