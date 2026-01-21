import asyncio
import json
from context_wrapper import gmail_to_storable_context
from mongo_store import save_context
from calendar_adapter import gmail_context_to_calendar_input

from calendar_detector import is_calendar_worthy

from langchain_mcp_adapters.client import MultiServerMCPClient



SERVERS = {
    "gmail": {
        "transport": "stdio",
        "command": "python",
        "args": ["gmail_mcp/main.py"]
    },
    "calendar": {
        "transport": "stdio",
        "command": r"calendar_mcp\venv\Scripts\python.exe",
        "args": ["calendar_mcp/main.py"]
    }

}



async def main():
    client = MultiServerMCPClient(SERVERS)

    tools = await client.get_tools()
    named_tools = {tool.name: tool for tool in tools}

    print("\n🌱 Gmail MCP exposed tools:\n")
    for tool in tools:
        print(f"- {tool.name}")
        print(f"  {tool.description}\n")

    print("\n📨 Fetching job emails...\n")

    result = await named_tools["fetch_job_emails"].ainvoke({
        "limit": 5
    })

    print("📦 Wrapped & storable contexts:\n")

    

    for item in result:
        raw_email = json.loads(item["text"])

        wrapped = gmail_to_storable_context(raw_email)

        inserted_id = save_context(wrapped)

        print("Stored in MongoDB with ID:", inserted_id)

        # 🌿 Calendar bridge
        event_hint = is_calendar_worthy(wrapped)

        if event_hint:
            wrapped["event_hint"] = event_hint

            calendar_input = gmail_context_to_calendar_input(wrapped)

            result = await named_tools["schedule_event"].ainvoke({
                "event": calendar_input
            })

            print("📅 Calendar event created:", result)

        print("-" * 60)




if __name__ == "__main__":
    asyncio.run(main())
