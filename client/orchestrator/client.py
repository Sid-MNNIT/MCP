from fastapi import FastAPI, Request, HTTPException
import os
from pathlib import Path
import sys
from client.mcp.client import get_mcp_client

# Import job wrapper
from client.wrappers.job_wrapper import (
    search_jobs,
    filter_jobs_by_skills,
    get_job_categories,
    ping_job_service
)
from client.schemas.job import Job

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

    if not tool_name:
        raise HTTPException(
            status_code=400,
            detail="tool required"
        )

    # Route job-related tools to wrapper functions
    if tool_name == "search_jobs":
        result = await search_jobs(
            keywords=args.get("keywords"),
            country=args.get("country", "in"),
            where=args.get("where", ""),
            max_results=args.get("max_results", 10),
            page=args.get("page", 1)
        )
        return result.dict()
    
    elif tool_name == "filter_jobs_by_skills":
        # Convert job dicts to Job objects
        jobs = [Job(**job) for job in args.get("jobs", [])]
        result = await filter_jobs_by_skills(
            jobs=jobs,
            required_skills=args.get("required_skills", []),
            preferred_skills=args.get("preferred_skills", [])
        )
        return result.dict()
    
    elif tool_name == "get_job_categories":
        result = await get_job_categories(
            country=args.get("country", "in")
        )
        return result
    
    elif tool_name == "ping_job_service":
        result = await ping_job_service()
        return result
    
    # Fallback to direct MCP tool invocation for other tools (gmail, resume, etc.)
    else:
        mcp = await get_mcp_client()
        tools = await mcp.get_tools()
        
        tool = next((t for t in tools if t.name == tool_name), None)
        
        if not tool:
            raise HTTPException(status_code=404, detail=f"Tool '{tool_name}' not found")
        
        if user_id:
            args["userId"] = user_id
        
        result = await tool.ainvoke(args)
        return result[0]