from fastapi import FastAPI, Request, HTTPException
import os

from client.mcp.client import get_mcp_client
from client.orchestrator.email_agent import prepare_email_reply_preview, send_email_with_approval

from client.orchestrator.job_agent import (
    search_jobs_pipeline,
    get_personalized_recommendations,
    fetch_job_categories,
)

# ✅ NEW: import resume pipeline
from client.orchestrator.resume_agent import parse_resume_pipeline

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

    print(jwt, "APP>POST/PIPELINE")

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


# ============================================================
# JOB PIPELINES
# ============================================================

@app.post("/pipelines/job-search")
async def job_search_pipeline_endpoint(request: Request):
    if request.headers.get("X-Service-Key") != SERVICE_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized service")

    body = await request.json()
    jwt = request.state.jwt

    if not jwt:
        raise HTTPException(status_code=401, detail="JWT missing")

    user_id = body.get("userId")
    if not user_id:
        raise HTTPException(status_code=400, detail="userId required")

    keywords = body.get("keywords", "")
    if not keywords:
        raise HTTPException(status_code=400, detail="keywords required")

    print(f"📥 Job search request: keywords='{keywords}', user={user_id}")

    result = await search_jobs_pipeline(
        keywords=keywords,
        location=body.get("location", ""),
        country=body.get("country", "in"),
        user_id=user_id,
        jwt=jwt,
        use_resume_matching=body.get("useResumeMatching", False),
        max_results=body.get("maxResults", 20),
        page=body.get("page", 1),
    )

    print(f"📤 Job search response: success={result.get('success')}, count={result.get('count', 0)}")

    return result


@app.post("/pipelines/job-recommendations")
async def job_recommendations_pipeline_endpoint(request: Request):
    if request.headers.get("X-Service-Key") != SERVICE_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    body = await request.json()
    jwt = request.state.jwt

    if not jwt:
        raise HTTPException(status_code=401, detail="JWT missing")

    user_id = body.get("userId")
    if not user_id:
        raise HTTPException(status_code=400, detail="userId required")

    print(f"📥 Recommendations request: user={user_id}")

    result = await get_personalized_recommendations(
        user_id=user_id,
        jwt=jwt,
        max_results=body.get("maxResults", 20),
    )

    print(f"📤 Recommendations response: success={result.get('success')}, count={result.get('count', 0)}")

    return result


@app.get("/pipelines/job-categories")
async def job_categories_pipeline_endpoint(request: Request):
    if request.headers.get("X-Service-Key") != SERVICE_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    country = request.query_params.get("country", "in")

    print(f"📥 Categories request: country={country}")

    result = await fetch_job_categories(country=country)

    return result

# RESUME PIPELINE

@app.post("/pipelines/resume-parse")
async def resume_parse_pipeline_endpoint(request: Request):
    """
    Resume parsing pipeline endpoint.

    Input JSON:
      {
        "userId": "...",
        "file_b64": "...",
        "filename": "resume.pdf" (optional),
        "mimetype": "application/pdf" (optional)
      }
    """
    if request.headers.get("X-Service-Key") != SERVICE_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized service")

    body = await request.json()
    jwt = request.state.jwt

    if not jwt:
        raise HTTPException(status_code=401, detail="JWT missing")

    user_id = body.get("userId")
    if not user_id:
        raise HTTPException(status_code=400, detail="userId required")

    file_b64 = body.get("file_b64")
    if not file_b64:
        raise HTTPException(status_code=400, detail="file_b64 required")

    print(f"📥 Resume parse request: user={user_id}")

    result = await parse_resume_pipeline(
        user_id=user_id,
        jwt=jwt,
        file_b64=file_b64,
        filename=body.get("filename", "resume.pdf"),
        mimetype=body.get("mimetype", "application/pdf"),
    )

    print(f"📤 Resume parse response: success={result.get('success')}")

    return result