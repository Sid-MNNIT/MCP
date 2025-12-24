from langchain_mcp_adapters.client import MultiServerMCPClient
from client.mcp.servers import create_mcp_client

_mcp_client = None

def get_mcp_client() -> MultiServerMCPClient:
    global _mcp_client
    if _mcp_client is None:
        _mcp_client = create_mcp_client()
    return _mcp_client
