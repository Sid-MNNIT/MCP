import json
from typing import List, Dict

from client.mcp.client import get_mcp_client
from client.schemas.job import (
    Job,
    JobSearchResponse,
    JobFilterResponse,
)

# -----------------------------------------
# Internal helper
# -----------------------------------------

def _unwrap(result):
    """Unwrap MCP tool response"""
    if isinstance(result, dict):
        return result

    if isinstance(result, list):
        for item in result:
            if isinstance(item, dict) and item.get("type") == "text":
                return json.loads(item["text"])
        # If it's a list but no text type found, return first item
        return result[0] if result else {}

    raise ValueError(f"Unexpected MCP response: {result}")

# -----------------------------------------
# Job search
# -----------------------------------------

async def search_jobs(
    keywords: str,
    country: str = "in",
    where: str = "",
    max_results: int = 10,
    page: int = 1,
) -> JobSearchResponse:

    mcp = await get_mcp_client()  # ← Fixed: Added await
    tools = await mcp.get_tools()
    
    # Find the search_jobs tool
    tool = next((t for t in tools if t.name == "search_jobs"), None)
    if not tool:
        raise ValueError("search_jobs tool not found")
    
    result = await tool.ainvoke({
        "keywords": keywords,
        "country": country,
        "where": where,
        "max_results": max_results,
        "page": page,
    })

    return JobSearchResponse(**_unwrap(result))

# -----------------------------------------
# Filtering
# -----------------------------------------

async def filter_jobs_by_skills(
    jobs: List[Job],
    required_skills: List[str],
    preferred_skills: List[str],
) -> JobFilterResponse:

    mcp = await get_mcp_client()  # ← Fixed: Added await
    tools = await mcp.get_tools()
    
    # Find the filter tool
    tool = next((t for t in tools if t.name == "filter_jobs_by_skills"), None)
    if not tool:
        raise ValueError("filter_jobs_by_skills tool not found")
    
    result = await tool.ainvoke({
        "jobs": [job.dict() if hasattr(job, 'dict') else job for job in jobs],
        "required_skills": required_skills,
        "preferred_skills": preferred_skills,
    })

    return JobFilterResponse(**_unwrap(result))

# -----------------------------------------
# Categories
# -----------------------------------------

async def get_job_categories(country: str = "in") -> Dict:
    mcp = await get_mcp_client()  # ← Fixed: Added await
    tools = await mcp.get_tools()
    
    # Find the categories tool
    tool = next((t for t in tools if t.name == "get_job_categories"), None)
    if not tool:
        raise ValueError("get_job_categories tool not found")
    
    result = await tool.ainvoke({"country": country})
    return _unwrap(result)

# -----------------------------------------
# Health
# -----------------------------------------

async def ping_job_service() -> Dict:
    mcp = await get_mcp_client()  # ← Fixed: Added await
    tools = await mcp.get_tools()
    
    # Find the ping tool
    tool = next((t for t in tools if t.name == "ping"), None)
    if not tool:
        raise ValueError("ping tool not found")
    
    result = await tool.ainvoke({})
    return _unwrap(result)