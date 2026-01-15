from typing import List, Optional, Dict, Any

from client.wrappers.job_wrapper import (
    search_jobs,
    filter_jobs_by_skills,
    get_job_categories,
)
from client.schemas.job import JobSearchResponse


# ============================================================
# Job Search Orchestration(pipeline)
# ============================================================

async def search_and_filter_jobs(
    keywords: str,
    country: str = "in",
    where: str = "",
    required_skills: Optional[List[str]] = None,
    preferred_skills: Optional[List[str]] = None,
    max_results: int = 20,
    page: int = 1,
) -> Dict[str, Any]:
    """
    Search jobs via MCP and optionally filter/rank them using skills.

    This function:
    1. Searches jobs using job_search_mcp
    2. Optionally filters & ranks jobs based on skills
    3. Returns a frontend-ready payload
    """

    # ----------------------------
    # Step 1: Search jobs
    # ----------------------------
    search_response: JobSearchResponse = await search_jobs(
        keywords=keywords,
        country=country,
        where=where,
        max_results=max_results,
        page=page,
    )

    if not search_response.success:
        return {
            "success": False,
            "error": "Job search failed",
            "jobs": [],
        }

    # ----------------------------
    # Step 2: Decide if filtering is needed
    # ----------------------------
    if not required_skills and not preferred_skills:
        return {
            "success": True,
            "jobs": [job.dict() for job in search_response.jobs],
            "count": search_response.count,
            "total_results": search_response.total_results,
            "page": search_response.page,
            "country": search_response.country,
            "filtered": False,
        }

    # ----------------------------
    # Step 3: Filter & rank jobs
    # ----------------------------
    filter_result = await filter_jobs_by_skills(
        jobs=[job.dict() for job in search_response.jobs],
        required_skills=required_skills or [],
        preferred_skills=preferred_skills or [],
    )

    return {
        "success": filter_result.get("success", False),
        "jobs": filter_result.get("matched_jobs", []),
        "total_matches": filter_result.get("total_matches", 0),
        "filtered": True,
    }


# ============================================================
# Recommendations (Future-ready)
# ============================================================

async def get_recommended_jobs_for_user(user_id: str) -> Dict[str, Any]:
    """
    Return recommended jobs for a user.

    NOTE:
    - Resume extraction
    - Preference lookup
    - RAG ranking
    will be added later.
    """

    # Placeholder logic (safe + deterministic)
    return await search_and_filter_jobs(
        keywords="software engineer",
        country="in",
        where="bangalore",
        max_results=10,
    )


# ============================================================
# Categories Helper
# ============================================================

async def fetch_job_categories(country: str = "in") -> Dict[str, Any]:
    """
    Fetch job categories from job_search_mcp.
    """
    return await get_job_categories(country=country)
