from fastapi import FastAPI, Request, HTTPException
import os

from client.mcp.client import get_mcp_client
from client.orchestrator.email_agent import prepare_email_reply_preview,send_email_with_approval,ingest_and_store_emails

app = FastAPI()

SERVICE_KEY = os.getenv("SERVICE_KEY")
if not SERVICE_KEY:
    raise RuntimeError("SERVICE_KEY not set")


# ---------------------------
# JWT middleware (SAFE)
# ---------------------------
@app.middleware("http")
async def jwt_context_middleware(request: Request, call_next):
    auth = request.headers.get("authorization")
    request.state.jwt = None

    if auth and auth.startswith("Bearer "):
        request.state.jwt = auth[7:].strip()

    response = await call_next(request)
    return response


# ---------------------------
# MCP executor
# ---------------------------
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


# ---------------------------
# Email reply preview pipeline
# ---------------------------
@app.post("/pipelines/email-reply-preview")
async def email_reply_preview(request: Request):
    if request.headers.get("X-Service-Key") != SERVICE_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized service")

    body = await request.json()

    message_id = body.get("messageId")
    tone = body.get("tone", "professional")
    user_id = body.get("userId")
    jwt = request.state.jwt
    if not jwt:
        raise HTTPException(status_code=401, detail="JWT missing")

    print(jwt,"APP>POST/PIPELINE")

    if not message_id or not user_id:
        raise HTTPException(
            status_code=400,
            detail="messageId and userId required"
        )

    if not jwt:
        raise HTTPException(status_code=401, detail="JWT missing")

    result = await prepare_email_reply_preview(
        message_id=message_id,
        tone=tone,
        jwt=jwt
    )

    return result


@app.post("/pipelines/email-reply-send")
async def email_reply_send(request: Request):
    if request.headers.get("X-Service-Key") != SERVICE_KEY:
        raise HTTPException(status_code=401)

    body = await request.json()
    draft = body.get("draft")
    jwt = request.state.jwt

    if not jwt or not draft:
        raise HTTPException(status_code=400)

    result = await send_email_with_approval(draft, jwt)
    return result


@app.post("/pipelines/email-sync")
async def email_sync(request: Request):
    if request.headers.get("X-Service-Key") != SERVICE_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized service")

    jwt = request.state.jwt
    if not jwt:
        raise HTTPException(status_code=401, detail="JWT missing")

    print(jwt, "APP>POST/PIPELINE EMAIL SYNC")

    result = await ingest_and_store_emails(jwt)

    return {
        "status": "ok",
        "synced": len(result)
    }