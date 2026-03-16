from pathlib import Path
import sys



PROJECT_ROOT = Path(__file__).resolve().parents[2]

PYTHON = sys.executable

SERVERS = {
    "gmail": {
        "command": str(PYTHON),
        "args": ["main.py"],
        "cwd": str(PROJECT_ROOT / "mcp_servers" / "gmail_mcp"),
        "transport": "stdio",
    },
    # "resume": {
    #     "command": str(PYTHON),
    #     "args": ["main.py"],
    #     "cwd": str(PROJECT_ROOT / "mcp_servers" / "resume_mcp"),
    #       "transport": "stdio",
    # },
     "job_search": {
        "command": str(PYTHON),
        "args": ["main.py"],
        "cwd": str(PROJECT_ROOT / "mcp_servers" / "job_search_mcp"),
        "transport": "stdio",
    },
     "calendar": {
    "command": str(PYTHON),
    "args": ["main.py"],
    "cwd": str(PROJECT_ROOT / "mcp_servers" / "calendar_mcp"),
    "transport": "stdio",
}
}