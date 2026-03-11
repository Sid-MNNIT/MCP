from langchain_mcp_adapters.client import MultiServerMCPClient
from client.mcp.server import SERVERS


async def get_mcp_client() -> MultiServerMCPClient:
    """
    Always return a fresh MCP client.
    
    We intentionally do NOT cache/reuse the client because
    stdio transport spawns a subprocess per session — after the
    first session() context exits the pipe closes and the process
    dies. Reusing the same client then throws McpError: Connection closed.
    
    Creating a fresh MultiServerMCPClient per call is cheap and safe.
    """
    return MultiServerMCPClient(SERVERS)
