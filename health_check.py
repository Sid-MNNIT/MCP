"""
Complete Service Health Check Script
Run this to verify all services are working
"""
import asyncio
import requests
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

def check_backend():
    """Check if Node.js backend is running"""
    print("\n1️⃣ Checking Backend (Node.js on port 5000)...")
    try:
        response = requests.get("http://localhost:5000/api", timeout=5)
        print(f"   ✅ Backend is running - Status: {response.status_code}")
        return True
    except requests.exceptions.ConnectionError:
        print("   ❌ Backend is NOT running")
        print("   💡 Start it with: cd backend && npm start")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def check_orchestrator():
    """Check if Python orchestrator is running"""
    print("\n2️⃣ Checking Orchestrator (Python on port 9000)...")
    try:
        response = requests.get("http://localhost:9000/docs", timeout=5)
        print(f"   ✅ Orchestrator is running - Status: {response.status_code}")
        return True
    except requests.exceptions.ConnectionError:
        print("   ❌ Orchestrator is NOT running")
        print("   💡 Start it with: python -m uvicorn client.orchestrator.client:app --port 9000")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def check_adzuna_api():
    """Check if Adzuna API is accessible"""
    print("\n3️⃣ Checking Adzuna API...")
    try:
        url = "https://api.adzuna.com/v1/api/jobs/in/search/1"
        params = {
            "app_id": "59bea90b",
            "app_key": "898dc0c54605588ab5b0b32b847f5c2a",
            "what": "test",
            "results_per_page": 1
        }
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Adzuna API is working - Found {data.get('count', 0)} jobs")
            return True
        else:
            print(f"   ❌ Adzuna API error - Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_backend_to_orchestrator():
    """Test if backend can reach orchestrator"""
    print("\n4️⃣ Testing Backend → Orchestrator Connection...")
    try:
        url = "http://localhost:9000/pipelines/job-search"
        headers = {
            "X-Service-Key": "abcd12345",
            "Content-Type": "application/json"
        }
        data = {
            "userId": "test-user",
            "keywords": "python",
            "location": "",
            "country": "in",
            "maxResults": 2,
            "page": 1,
            "useResumeMatching": False
        }
        response = requests.post(url, json=data, headers=headers, timeout=15)
        
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                print(f"   ✅ Pipeline working - Found {result.get('count', 0)} jobs")
                return True
            else:
                print(f"   ⚠️ Pipeline returned success=false")
                print(f"   Error: {result.get('error', 'Unknown')}")
                return False
        else:
            print(f"   ❌ HTTP {response.status_code}")
            print(f"   Response: {response.text[:500]}")
            return False
    except requests.exceptions.Timeout:
        print("   ❌ Request timed out (>15s)")
        print("   💡 MCP server might be hanging - check if it's started properly")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

async def test_mcp_direct():
    """Test MCP wrapper directly"""
    print("\n5️⃣ Testing MCP Wrapper Directly...")
    try:
        from client.wrappers.job_wrapper import search_jobs
        
        result = await search_jobs(
            keywords="python",
            country="in",
            where="",
            max_results=2,
            page=1
        )
        
        if result.success:
            print(f"   ✅ MCP working - Found {result.count} jobs")
            if result.jobs:
                print(f"   Sample job: {result.jobs[0].title}")
            return True
        else:
            print(f"   ❌ MCP returned success=false")
            print(f"   Error: {result.error}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("=" * 60)
    print("🔍 COMPLETE SERVICE HEALTH CHECK")
    print("=" * 60)
    
    results = {
        "backend": check_backend(),
        "orchestrator": check_orchestrator(),
        "adzuna": check_adzuna_api(),
    }
    
    if results["orchestrator"]:
        results["pipeline"] = test_backend_to_orchestrator()
    else:
        results["pipeline"] = False
        print("\n4️⃣ Skipping pipeline test (orchestrator not running)")
    
    if results["orchestrator"]:
        print("\n5️⃣ Testing MCP Wrapper Directly...")
        results["mcp"] = asyncio.run(test_mcp_direct())
    else:
        results["mcp"] = False
        print("\n5️⃣ Skipping MCP test (orchestrator not running)")
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    
    all_passed = all(results.values())
    
    for service, status in results.items():
        icon = "✅" if status else "❌"
        print(f"{icon} {service.capitalize()}: {'PASS' if status else 'FAIL'}")
    
    print("\n" + "=" * 60)
    
    if all_passed:
        print("🎉 All services are working correctly!")
        print("\nIf frontend still has issues, check browser console (F12)")
    else:
        print("⚠️ Some services are not working. See failures above.")
        print("\n💡 RECOMMENDED ACTIONS:")
        
        if not results["backend"]:
            print("   • Start backend: cd backend && npm start")
        
        if not results["orchestrator"]:
            print("   • Start orchestrator: python -m uvicorn client.orchestrator.client:app --port 9000")
        
        if not results["adzuna"]:
            print("   • Check Adzuna API credentials in .env file")
        
        if results["orchestrator"] and not results["pipeline"]:
            print("   • Check SERVICE_KEY in both backend and client .env files")
        
        if results["orchestrator"] and not results["mcp"]:
            print("   • MCP server might not be starting correctly")
            print("   • Check mcp_servers/job_search_mcp/main.py")

if __name__ == "__main__":
    main()
