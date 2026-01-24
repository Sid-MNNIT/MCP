from typing import Dict, Any

from client.wrappers.resume_wrapper import (
    parse_resume_pdf,
    score_resume_ats,
)

async def parse_resume_pipeline(
    user_id: str,
    jwt: str,
    file_b64: str,
    filename: str = "resume.pdf",
    mimetype: str = "application/pdf",
) -> Dict[str, Any]:
    try:
        print(f"📄 Starting resume pipeline for user: {user_id}, file={filename}")

        # Step 1: Parse resume
        parsed = await parse_resume_pdf(file_b64=file_b64)

        if not parsed.get("success"):
            return parsed

        parsed_resume = parsed.get("parsed_resume")
        if not parsed_resume:
            return {
                "success": False,
                "error": "Resume parsing failed: no parsed_resume returned",
            }

        # Step 2: ATS scoring (LLM disabled)
        scored = await score_resume_ats(parsed_resume=parsed_resume, use_llm=False)

        if not scored.get("success"):
            return scored

        score_result = scored.get("score_result")

        return {
            "success": True,
            "userId": user_id,
            "filename": filename,
            "mimetype": mimetype,
            "parsed_resume": parsed_resume,
            "score": score_result,
        }

    except Exception as e:
        print(f"❌ Resume pipeline error: {e}")
        return {
            "success": False,
            "error": str(e),
        }
