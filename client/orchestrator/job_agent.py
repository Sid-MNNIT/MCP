from typing import List, Optional, Dict, Any

from client.wrappers.job_wrapper import (
    search_jobs,
    filter_jobs_by_skills,
    get_job_categories,
)
from client.schemas.job import JobSearchResponse, Job


# ============================================================
# Pipeline 1: Complete Job Search with Optional Matching
# ============================================================

async def search_jobs_pipeline(
    keywords: str,
    location: str,
    country: str,
    user_id: str,
    jwt: str,
    use_resume_matching: bool = False,
    max_results: int = 20,
    page: int = 1,
) -> Dict[str, Any]:
    """
    Full job search pipeline with optional skill matching.
    
    Steps:
    1. Search jobs via MCP
    2. If use_resume_matching, fetch user skills and filter
    3. Return formatted results
    """
    
    try:
        # Step 1: Search jobs via MCP
        print(f"🔍 Searching jobs: keywords='{keywords}', location='{location}', country='{country}'")
        
        search_result = await search_jobs(
            keywords=keywords,
            country=country,
            where=location,
            max_results=max_results,
            page=page,
        )
        
        if not search_result.success:
            return {
                "success": False,
                "error": search_result.error or "Job search failed",
                "jobs": [],
            }
        
        jobs = search_result.jobs
        print(f"✅ Found {len(jobs)} jobs")
        
        # Step 2: Resume matching (placeholder for now)
        if use_resume_matching:
            print("⚠️ Resume matching requested but not yet implemented (Phase 2)")
            # Will implement in Phase 2:
            # - Fetch user profile from MongoDB
            # - Extract skills from resume
            # - Filter jobs using filter_jobs_by_skills
            # - Add match scores
        
        # Step 3: Format response
        return {
            "success": True,
            "jobs": [job.dict() for job in jobs],
            "count": len(jobs),
            "total_results": search_result.total_results,
            "page": search_result.page,
            "country": search_result.country,
            "matched_to_resume": use_resume_matching,
        }
        
    except Exception as e:
        print(f"❌ Job search pipeline error: {e}")
        return {
            "success": False,
            "error": str(e),
            "jobs": [],
        }


# ============================================================
# Pipeline 2: Personalized Recommendations
# ============================================================

async def get_personalized_recommendations(
    user_id: str,
    jwt: str,
    max_results: int = 20,
) -> Dict[str, Any]:
    """
    Get personalized job recommendations based on user profile.
    
    Phase 1: Basic implementation (generic search)
    Phase 2: Will add:
    - Fetch user profile from MongoDB
    - Extract skills and preferences
    - Build personalized query
    - Match and rank by relevance
    """
    
    try:
        print(f"🔍 Getting recommendations for user: {user_id}")
        
        # Phase 1: Generic search as placeholder
        # Phase 2: Will fetch user profile and build personalized query
        result = await search_jobs_pipeline(
            keywords="software engineer",
            location="",
            country="in",
            user_id=user_id,
            jwt=jwt,
            use_resume_matching=False,  # Phase 2: Set to True
            max_results=max_results,
        )
        
        return result
        
    except Exception as e:
        print(f"❌ Recommendations pipeline error: {e}")
        return {
            "success": False,
            "error": str(e),
            "jobs": [],
        }


# ============================================================
# Helper: Get Job Categories
# ============================================================

async def fetch_job_categories(country: str = "in") -> Dict[str, Any]:
    """
    Fetch job categories from job_search_mcp.
    """
    try:
        print(f"📋 Fetching job categories for country: {country}")
        return await get_job_categories(country=country)
    except Exception as e:
        print(f"❌ Categories fetch error: {e}")
        return {
            "success": False,
            "error": str(e),
            "categories": [],
        }


# ============================================================
# Legacy Functions (Keep for backward compatibility)
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
    DEPRECATED: Use search_jobs_pipeline instead.
    Kept for backward compatibility.
    """
    
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

    filter_result = await filter_jobs_by_skills(
        jobs=search_response.jobs,
        required_skills=required_skills or [],
        preferred_skills=preferred_skills or [],
    )

    return {
        "success": filter_result.success,
        "jobs": filter_result.matched_jobs,
        "total_matches": filter_result.total_matches,
        "filtered": True,
    }


async def get_recommended_jobs_for_user(user_id: str) -> Dict[str, Any]:
    """
    DEPRECATED: Use get_personalized_recommendations instead.
    """
    return await search_and_filter_jobs(
        keywords="software engineer",
        country="in",
        where="bangalore",
        max_results=10,
    )