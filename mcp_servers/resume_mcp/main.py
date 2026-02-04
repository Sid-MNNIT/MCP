from mcp.server.fastmcp import FastMCP
import base64
import json
import re

from services.pdf_loader import extract_text_from_pdf
from pipelines.extract_pipeline import extract_resume
from pipelines.score_pipeline import ScorePipeline

mcp = FastMCP("resume-mcp")


# ==================================================
# TOOL 1: Parse Resume (NO scoring, NO LLM)
# ==================================================
@mcp.tool()
def parse_resume(file_b64: str):
    """
    MCP Tool: Parse a resume PDF into structured data.

    Input:
      - file_b64: base64-encoded PDF

    Output:
      {
        "status": "ok",
        "result": {
          "sections": {...},
          "entities": {...}
        }
      }
    """

    # -----------------------------
    # Validate input
    # -----------------------------
    if not file_b64 or not isinstance(file_b64, str):
        return {
            "status": "error",
            "error": "INVALID_INPUT",
            "message": "file_b64 must be a base64 string",
        }

    # -----------------------------
    # Normalize base64 input
    # -----------------------------
    try:
        raw = file_b64.strip()

        # Case 1: some clients paste JSON inside the field by mistake:
        #   {"file_b64":"...."}
        # We support that too to prevent integration pain.
        if raw.startswith("{") and raw.endswith("}"):
            try:
                obj = json.loads(raw)
                if isinstance(obj, dict) and "file_b64" in obj:
                    raw = str(obj["file_b64"]).strip()
            except Exception:
                # if JSON parsing fails, ignore and continue
                pass

        # Case 2: data URL prefix:
        # data:application/pdf;base64,JVBERi0x...
        if raw.lower().startswith("data:"):
            # split at first comma
            parts = raw.split(",", 1)
            raw = parts[1].strip() if len(parts) == 2 else raw

        # Case 3: remove ALL whitespace/newlines/tabs
        # base64 is allowed to have whitespace in many encoders.
        raw = re.sub(r"\s+", "", raw)

        file_b64_clean = raw

    except Exception as e:
        return {
            "status": "error",
            "error": "NORMALIZATION_FAILED",
            "message": str(e),
        }

    # -----------------------------
    # Decode base64 → pdf bytes
    # -----------------------------
    try:
        pdf_bytes = base64.b64decode(file_b64_clean, validate=True)
    except Exception:
        return {
            "status": "error",
            "error": "INVALID_BASE64",
            "message": "Failed to decode base64",
        }

    # -----------------------------
    # Quick PDF signature validation
    # -----------------------------
    if not pdf_bytes.startswith(b"%PDF"):
        return {
            "status": "error",
            "error": "NOT_A_PDF",
            "message": "Input is not a valid PDF",
        }

    # -----------------------------
    # Extract raw text from PDF
    # -----------------------------
    try:
        raw_text = extract_text_from_pdf(pdf_bytes)
    except Exception as e:
        return {
            "status": "error",
            "error": "PDF_TEXT_EXTRACTION_FAILED",
            "message": str(e),
        }

    # -----------------------------
    # Parse resume (text → sections/entities)
    # -----------------------------
    try:
        parsed_resume = extract_resume(raw_text)
    except Exception as e:
        return {
            "status": "error",
            "error": "PARSE_FAILED",
            "message": str(e),
        }

    return {
        "status": "ok",
        "result": parsed_resume,
    }


# ==================================================
# TOOL 2: ATS Score (+ optional Hugging Face LLM)
# ==================================================
@mcp.tool()
def ats_score(parsed_resume: dict, use_llm: bool = False):
    if not isinstance(parsed_resume, dict):
        return {
            "status": "error",
            "error": "INVALID_INPUT",
            "message": "parsed_resume must be a dict",
        }

    try:
        pipeline = ScorePipeline(use_llm=use_llm)
        score_result = pipeline.run(parsed_resume)
    except Exception as e:
        return {
            "status": "error",
            "error": "SCORING_FAILED",
            "message": str(e),
        }

    return {
        "status": "ok",
        "result": score_result,
    }


@mcp.tool()
def ping():
    return "pong"


if __name__ == "__main__":
    mcp.run(transport="stdio")
