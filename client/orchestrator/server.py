from fastapi import FastAPI, Request, HTTPException
from langchain_mcp_adapters.client import MultiServerMCPClient
import os
from pathlib import Path

app = FastAPI()

SERVICE_KEY = os.getenv("SERVICE_KEY")
if not SERVICE_KEY:
    raise RuntimeError("SERVICE_KEY not set")

PROJECT_ROOT = Path(__file__).resolve().parents[2]

PYTHON = PROJECT_ROOT / "jobsy" / "Scripts" / "python.exe"

SERVERS = {
    "gmail": {
        "command": str(PYTHON),
        "args": ["main.py"],
        "cwd": str(PROJECT_ROOT / "mcp_servers" / "gmail_mcp"),
        "transport": "stdio",
    }
}

_mcp_client: MultiServerMCPClient | None = None


async def get_mcp():
    global _mcp_client
    if _mcp_client is None:
        _mcp_client = MultiServerMCPClient(SERVERS)
    return _mcp_client


@app.post("/agent/execute")
async def execute_agent(request: Request):
    if request.headers.get("X-Service-Key") != SERVICE_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized service")

    body = await request.json()
    tool_name = body.get("tool")
    args = body.get("args", {})
    user_id = body.get("userId")

    if not tool_name or not user_id:
        raise HTTPException(
            status_code=400,
            detail="tool and userId required"
        )

    # inject userId
    args["userId"] = user_id

    mcp = await get_mcp()
    tools = await mcp.get_tools()

    tool = next((t for t in tools if t.name == tool_name), None)

    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")

    result = await tool.ainvoke(args)
    return result[0]
