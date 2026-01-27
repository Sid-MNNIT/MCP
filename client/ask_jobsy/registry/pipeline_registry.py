"""
Pipeline Registry
=================

Authoritative list of all user-facing pipelines that the planner
is allowed to select and the executor is allowed to execute.

Rules:
- Planner MAY read this
- Executor MUST validate against this
- Pipelines MUST match real FastAPI endpoints
- NO MCP tools here
"""

from typing import Dict, Any

PIPELINE_REGISTRY: Dict[str, Dict[str, Any]] = {

    # =========================================================
    # JOB PIPELINES
    # =========================================================

    "job_search": {
        "endpoint": "/pipelines/job-search",
        "type": "ACTION",
        "risk": "LOW",
        "description": "Search for jobs using keywords, location, and filters",
        "required_args": ["keywords"],
        "optional_args": [
            "location",
            "country",
            "maxResults",
            "page",
            "useResumeMatching",
        ],
        "requires_confirmation": False,
    },

    "job_recommendations": {
        "endpoint": "/pipelines/job-recommendations",
        "type": "ACTION",
        "risk": "LOW",
        "description": "Get personalized job recommendations for the user",
        "required_args": [],
        "optional_args": ["maxResults"],
        "requires_confirmation": False,
    },

    "job_categories": {
        "endpoint": "/pipelines/job-categories",
        "type": "ACTION",
        "risk": "LOW",
        "description": "Fetch available job categories",
        "required_args": [],
        "optional_args": ["country"],
        "requires_confirmation": False,
    },

    # =========================================================
    # EMAIL PIPELINES
    # =========================================================

    "email_reply_preview": {
        "endpoint": "/pipelines/email-reply-preview",
        "type": "ACTION",
        "risk": "LOW",
        "description": "Generate a draft reply for an email (preview only)",
        "required_args": ["messageId"],
        "optional_args": ["tone"],
        "requires_confirmation": False,
    },

    "email_reply_send": {
        "endpoint": "/pipelines/email-reply-send",
        "type": "ACTION",
        "risk": "HIGH",
        "description": "Send an email reply after explicit user approval",
        "required_args": ["draft"],
        "optional_args": [],
        "requires_confirmation": True,
    },

    "email_sync": {
        "endpoint": "/pipelines/email-sync",
        "type": "BACKGROUND",
        "risk": "LOW",
        "description": "Sync and store recent job-related emails",
        "required_args": [],
        "optional_args": [],
        "requires_confirmation": False,
    },

    # =========================================================
    # CALENDAR PIPELINES
    # =========================================================

    "calendar_create_event": {
        "endpoint": "/pipelines/calendar-create-event",
        "type": "ACTION",
        "risk": "HIGH",
        "description": "Create a calendar event (interview, assessment, etc.)",
        "required_args": [
            "eventType",
            "company",
            "date",
            "startTime",
            "endTime",
        ],
        "optional_args": [
            "role",
            "timezone",
            "meetLink",
            "description",
        ],
        "requires_confirmation": True,
    },

    "extract_calendar_from_email": {
        "endpoint": "/pipelines/extract-calendar-from-email",
        "type": "ACTION",
        "risk": "LOW",
        "description": "Extract calendar event details from email content",
        "required_args": ["subject", "text"],
        "optional_args": [],
        "requires_confirmation": False,
    },
}
