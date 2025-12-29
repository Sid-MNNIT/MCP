import json
from client.mcp.client import get_mcp_client

async def fetch_job_emails():
    mcp = get_mcp_client()
    tools = await mcp.get_tools()

    tool = next(t for t in tools if t.name == "get_recent_job_emails")

    result = await tool.ainvoke({
        "lookback_days": 7,
        "max_results": 20
    })

    payload = json.loads(result[0]["text"])
    return payload["emails"]
