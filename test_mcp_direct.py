"""
Test MCP Server Directly
Run this to see if the job_search MCP server is working
"""
import asyncio
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

from client.wrappers.job_wrapper import search_jobs

async def test_search():
    print("🔍 Testing job search MCP...")
    try:
        result = await search_jobs(
            keywords="software engineer",
            country="in",
            where="bangalore",
            max_results=5,
            page=1
        )
        print("✅ Success!")
        print(f"Found {result.count} jobs")
        print(f"First job: {result.jobs[0].title if result.jobs else 'None'}")
        return result
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    asyncio.run(test_search())
