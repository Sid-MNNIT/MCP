from mcp.server.fastmcp import FastMCP
import base64

from pipelines.extract_pipeline import extract_resume

mcp = FastMCP("resume-mcp")


@mcp.tool()
def parse_resume(file_b64: str):
    """
    MCP Tool: Parse a resume PDF.

    Input:
      - file_b64: base64-encoded PDF bytes

    Output:
      {
        "status": "ok",
        "result": {
          "sections": {...},
          "entities": {...}
        }
      }
    """

    # ---------- Input validation ----------
    if not file_b64 or not isinstance(file_b64, str):
        return {
            "status": "error",
            "error": "INVALID_INPUT",
            "message": "file_b64 must be a base64-encoded string"
        }

    try:
        pdf_bytes = base64.b64decode(file_b64, validate=True)
    except Exception:
        return {
            "status": "error",
            "error": "INVALID_BASE64",
            "message": "Failed to decode base64 input"
        }

    if not pdf_bytes.startswith(b"%PDF"):
        return {
            "status": "error",
            "error": "NOT_A_PDF",
            "message": "Input does not appear to be a PDF file"
        }

    # ---------- Core pipeline ----------
    try:
        result = extract_resume(pdf_bytes)
    except Exception as e:
        return {
            "status": "error",
            "error": "PIPELINE_FAILED",
            "message": str(e)
        }

    return {
        "status": "ok",
        "result": result
    }

@mcp.tool()
def ping():
    return "pong"


if __name__ == "__main__":
    # STDIO transport only — same as gmail_mcp
    mcp.run(transport="stdio")
