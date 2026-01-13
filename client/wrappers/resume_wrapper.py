from typing import Dict, Any

# Helpers
def _safe_list(value):
    if isinstance(value, list):
        return value
    return []


def _safe_str(value):
    if isinstance(value, str):
        return value.strip()
    return ""


def _safe_int(value, default=0):
    try:
        return int(value)
    except Exception:
        return default

# Main wrapper
def normalize_resume_mcp_response(mcp_response: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize output from resume MCP.

    Expected MCP response:
    {
      "status": "ok",
      "result": {
        "sections": {...},
        "entities": {...}
      }
    }
    """

    if not mcp_response or mcp_response.get("status") != "ok":
        return {
            "status": "error",
            "error": mcp_response.get("error", "UNKNOWN_ERROR"),
            "message": mcp_response.get("message", "Resume parsing failed"),
        }

    result = mcp_response.get("result", {})

    sections = result.get("sections", {})
    entities = result.get("entities", {})

    normalized = {
        "sections": {
            "experience": _safe_str(sections.get("experience")),
            "projects": _safe_str(sections.get("projects")),
            "skills": _safe_str(sections.get("skills")),
            "education": _safe_str(sections.get("education")),
            "certifications": _safe_str(sections.get("certifications")),
            "achievements": _safe_str(sections.get("achievements")),
            "other": _safe_str(sections.get("other")),
        },
        "entities": {
            "roles": _safe_list(entities.get("roles")),
            "normalized_roles": _safe_list(entities.get("normalized_roles")),
            "seniority": _safe_list(entities.get("seniority")),
            "skills": _safe_list(entities.get("skills")),
            "companies": _safe_list(entities.get("companies")),
            "dates": _safe_list(entities.get("dates")),
            "experience_years": _safe_int(entities.get("experience_years")),
        }
    }

    return {
        "status": "ok",
        "resume": normalized
    }
