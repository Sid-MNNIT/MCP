from client.mcp.client import get_mcp_client
from client.wrappers.gmail_wrapper import clean_email_body
from client.orchestrator.context_builder import build_email_prompt
from client.orchestrator.fake_llm import generate_fake_email_reply
# from client.llm.claude import generate_text

import asyncio
import json


async def run_email_reply_flow(message_id: str, tone: str = "professional"):

    # 1️⃣ Connect to MCP
    mcp_client = get_mcp_client()
    tools = await mcp_client.get_tools()

    # 2️⃣ Get draft_reply tool
    draft_tool = next(
        t for t in tools if t.name == "draft_reply"
    )
    send_tool=next(t for t in tools if t.name=="send_email")


    draft_result = await draft_tool.ainvoke({
        "message_id": message_id,
        "tone": tone
    })

    # 4️ MCP OUTPUT PARSING (CRITICAL FIX)
    # draft_result -> List[{type, text, id}]
    tool_output = draft_result[0]

    if tool_output["type"] != "text":
        raise RuntimeError("Unexpected MCP tool output type")

    parsed = json.loads(tool_output["text"])
    reply_context = parsed["reply_context"]

    # CLEAN EMAIL BODY (WRAPPER)
    raw_body = reply_context["originalEmail"]["body"]
    clean_body = clean_email_body(raw_body)
    reply_context["originalEmail"]["body"] = clean_body

    # 6️⃣ BUILD PROMPT
    prompt = build_email_prompt(reply_context)

    # 7️⃣ LLM CALL (disabled for now)
    # llm_response = await generate_text(prompt)
    # email_body = llm_response.strip()

    # TEMP: show cleaned body
    # email_body = reply_context["originalEmail"]["body"]

    email_body=generate_fake_email_reply(prompt)

    send_result = await send_tool.ainvoke({
        "to": reply_context["to"],
        "subject": reply_context["subject"],
        "body": email_body,
        "threadId": reply_context.get("threadId")
    })




    return {
        "preview": {
            "to": reply_context["to"],
            "subject": reply_context["subject"],
            "body": email_body
        },
        "send_result": send_result
    }



# ---- Manual test runner ----
if __name__ == "__main__":
    async def test():
        result = await run_email_reply_flow(
            message_id="19b5e0fed9c5c1a1",
            tone="professional"
        )

        print("TO:", result["preview"]["to"])
        print("SUBJECT:", result["preview"]["subject"])
        print("\nBODY:\n", result["preview"]["body"])


    asyncio.run(test())
