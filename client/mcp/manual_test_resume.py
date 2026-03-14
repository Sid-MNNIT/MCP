"""
Manual test for the resume MCP pipeline.
Run from the project root:
    python -m client.mcp.manual_test_resume path/to/resume.pdf
"""
import asyncio
import base64
import sys
import json
from client.mcp.client import get_mcp_client, close_mcp_client


async def main():
    pdf_path = sys.argv[1] if len(sys.argv) > 1 else "sample_resume.pdf"

    print("🔌 Connecting MCP client...")
    mcp = await get_mcp_client()

    print("📡 Discovering tools...")
    tools = {t.name: t for t in await mcp.get_tools()}
    print(f"✅ Tools found: {list(tools.keys())}\n")

    # ── parse_resume ──────────────────────────────────────────
    print(f"📄 Loading PDF: {pdf_path}")
    with open(pdf_path, "rb") as f:
        pdf_b64 = base64.b64encode(f.read()).decode()

    if "parse_resume" not in tools:
        print("❌ parse_resume tool not found — is resume_mcp enabled in server.py?")
        return

    print("📤 Calling parse_resume...")
    raw = await tools["parse_resume"].ainvoke({"file_b64": pdf_b64})
    result = json.loads(raw[0]["text"]) if isinstance(raw, list) else raw
    print("📥 parse_resume response:")
    print(json.dumps(result, indent=2))

    if result.get("status") != "ok":
        print("❌ Parsing failed — stopping.")
        return

    parsed_resume = result["result"]

    # ── ats_score ─────────────────────────────────────────────
    print("\n📊 Calling ats_score...")
    raw = await tools["ats_score"].ainvoke({
        "parsed_resume": json.dumps(parsed_resume),
        "use_llm": False,
    })
    score = json.loads(raw[0]["text"]) if isinstance(raw, list) else raw
    print("📥 ats_score response:")
    print(json.dumps(score, indent=2))

    await close_mcp_client()
    print("\n✅ Done.")


if __name__ == "__main__":
    asyncio.run(main())
