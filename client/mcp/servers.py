from pathlib import Path
from langchain_mcp_adapters.client import MultiServerMCPClient

PROJECT_ROOT = Path(__file__).resolve().parents[2]

PYTHON = PROJECT_ROOT / "env" / "Scripts" / "python.exe"

SERVERS = {
    "gmail": {
        "command": str(PYTHON),
        "args": ["main.py"],
        "cwd": str(PROJECT_ROOT / "mcp_servers" / "gmail_mcp"),
        "transport": "stdio",
    }
}


def create_mcp_client():
    return MultiServerMCPClient(SERVERS)
