# api/agent.py

from fastapi import FastAPI, Request, HTTPException
import os

from client.mcp.client import get_mcp_client

app = FastAPI()

SERVICE_KEY = os.getenv("SERVICE_KEY")
if not SERVICE_KEY:
    raise RuntimeError("SERVICE_KEY not set")


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


    args["userId"] = user_id

    mcp = await get_mcp_client()
    tools = await mcp.get_tools()

    tool = next((t for t in tools if t.name == tool_name), None)

    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")

    result = await tool.ainvoke(args)
    return result[0]
