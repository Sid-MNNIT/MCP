import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient

SERVERS = {
    "calendar": {
        "transport": "stdio",
        "command": "python",
        "args": ["-m", "calendar_mcp.main"]
    }
}


async def main():
    client = MultiServerMCPClient(SERVERS)
    tools = await client.get_tools()

    named_tools = {tool.name: tool for tool in tools}

    print("Available tools:", named_tools.keys())

    event = {
        "company": "Demo Company",
        "event_type": "Interview",
        "role": "Software Engineer",
        "date": "2026-01-05",
        "start_time": "10:00",
        "end_time": "11:00",
        "timezone": "Asia/Kolkata",
        "description": "Test interview created from MCP",
        "meet_link": "https://meet.google.com/demo-link"
    }

    result = await named_tools["schedule_event"].ainvoke({
        "event": event
    })

    print("📅 Calendar result:", result)

if __name__ == "__main__":
    asyncio.run(main())
