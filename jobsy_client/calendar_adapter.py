from datetime import datetime, timedelta

def gmail_context_to_calendar_input(ctx):
    event_dt = datetime.fromisoformat(ctx["event_hint"]["event_date"])

    start_time = event_dt.strftime("%H:%M")
    end_time = (event_dt + timedelta(hours=1)).strftime("%H:%M")

    return {
        "company": ctx["email_from"],
        "event_type": "Interview",
        "role": ctx.get("role", "Unknown Role"),
        "date": event_dt.strftime("%Y-%m-%d"),
        "start_time": start_time,
        "end_time": end_time,
        "timezone": "Asia/Kolkata",
        "description": ctx["snippet"],
        "meet_link": None
    }
