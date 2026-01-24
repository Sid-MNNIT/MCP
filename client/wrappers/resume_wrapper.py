import json
from typing import Dict, Any

from client.mcp.client import get_mcp_client


# -----------------------------------------
# Internal helper
# -----------------------------------------
def _unwrap(result):
    """
    Unwrap MCP tool response.

    MCP sometimes returns:
    - dict directly
    - list of items where one has {type:"text", text:"{...json...}"}
    """
    if isinstance(result, dict):
        return result

    if isinstance(result, list):
        for item in result:
            if isinstance(item, dict) and item.get("type") == "text":
                return json.loads(item["text"])
        return result[0] if result else {}

    raise ValueError(f"Unexpected MCP response: {result}")


# -----------------------------------------
# Resume parsing
# -----------------------------------------
async def parse_resume_pdf(file_b64: str) -> Dict[str, Any]:
    """
    Calls resume_mcp tool: parse_resume
    """
    mcp = await get_mcp_client()
    tools = await mcp.get_tools()

    tool = next((t for t in tools if t.name == "parse_resume"), None)
    if not tool:
        raise ValueError("parse_resume tool not found")

    result = await tool.ainvoke({
        "file_b64": file_b64
    })

    data = _unwrap(result)

    if data.get("status") != "ok":
        return {
            "success": False,
            "error": data.get("message") or "parse_resume failed",
            "raw": data,
        }

    return {
        "success": True,
        "parsed_resume": data.get("result", {}),
    }


# -----------------------------------------
# ATS scoring
# -----------------------------------------
async def score_resume_ats(parsed_resume: dict, use_llm: bool = False) -> Dict[str, Any]:
    """
    Calls resume_mcp tool: ats_score
    """
    mcp = await get_mcp_client()
    tools = await mcp.get_tools()

    tool = next((t for t in tools if t.name == "ats_score"), None)
    if not tool:
        raise ValueError("ats_score tool not found")

    result = await tool.ainvoke({
        "parsed_resume": parsed_resume,
        "use_llm": use_llm,
    })

    data = _unwrap(result)

    if data.get("status") != "ok":
        return {
            "success": False,
            "error": data.get("message") or "ats_score failed",
            "raw": data,
        }

    return {
        "success": True,
        "score_result": data.get("result", {}),
    }
