import { useState, useEffect } from "react";
import { format, parseISO, isAfter, startOfDay, addDays } from "date-fns";
import { calendarService } from "../../services/calendar.service";

function getCompanyInitial(summary) {
  if (!summary) return "?";
  return summary.charAt(0).toUpperCase();
}

function getEventType(summary = "") {
  const s = summary.toLowerCase();
  if (s.includes("oa") || s.includes("assessment") || s.includes("test")) return "OA Test";
  if (s.includes("interview")) return "Interview";
  if (s.includes("offer")) return "Offer";
  return "Event";
}

function getLogoColor(str = "") {
  const colors = ["#6366f1", "#0ea5e9", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getIconType(summary = "") {
  const s = summary.toLowerCase();
  if (s.includes("interview")) return "user";
  return "doc";
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const connected = await calendarService.getConnectionStatus();
      setIsConnected(connected);

      if (!connected) {
        setLoading(false);
        return;
      }

      // Fetch events from today → next 30 days
      const start = startOfDay(new Date());
      const end = addDays(start, 30);
      const fetched = await calendarService.getEvents(start, end);

      // Filter to only future events, sort ascending, take next 5
      const upcoming = fetched
        .filter((ev) => {
          const dt = ev.start.dateTime || ev.start.date;
          return isAfter(parseISO(dt), new Date());
        })
        .sort((a, b) => {
          const dtA = a.start.dateTime || a.start.date;
          const dtB = b.start.dateTime || b.start.date;
          return new Date(dtA) - new Date(dtB);
        })
        .slice(0, 5)
        .map((ev) => {
          const dt = ev.start.dateTime || ev.start.date;
          const parsed = parseISO(dt);
          return {
            id: ev.id,
            summary: ev.summary || "Untitled Event",
            type: getEventType(ev.summary),
            date: ev.start.dateTime
              ? format(parsed, "MMM d, h:mm aa")
              : format(parsed, "MMM d"),
            logoColor: getLogoColor(ev.summary),
            logoLetter: getCompanyInitial(ev.summary),
            iconType: getIconType(ev.summary),
            htmlLink: ev.htmlLink,
          };
        });

      setEvents(upcoming);
    } catch (err) {
      console.error("UpcomingEvents fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Not connected state
  if (!loading && !isConnected) {
    return (
      <div className="card event-card">
        <h3>Upcoming Events</h3>
        <div style={{ padding: "1.5rem 0", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
          Connect Google Calendar to see upcoming events
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="card event-card">
        <h3>Upcoming Events</h3>
        <div style={{ padding: "1.5rem 0", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
          Loading events...
        </div>
      </div>
    );
  }

  // Empty state
  if (events.length === 0) {
    return (
      <div className="card event-card">
        <h3>Upcoming Events</h3>
        <div style={{ padding: "1.5rem 0", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
          No upcoming events in the next 30 days 🎉
        </div>
      </div>
    );
  }

  return (
    <div className="card event-card">
      <h3>Upcoming Events</h3>
      <div className="event-list">
        {events.map((event) => (
          <div
            key={event.id}
            className="event-row"
            style={{ cursor: event.htmlLink ? "pointer" : "default" }}
            onClick={() => event.htmlLink && window.open(event.htmlLink, "_blank")}
          >
            {/* Left: Logo + Name */}
            <div className="event-left">
              <div className="event-logo" style={{ color: event.logoColor }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="event-company" title={event.summary}>
                {event.summary.length > 18 ? event.summary.slice(0, 18) + "…" : event.summary}
              </span>
            </div>

            {/* Middle: Type */}
            <div className="event-type">
              {event.iconType === "user" ? <UserIcon /> : <DocIcon />}
              <span>{event.type}</span>
            </div>

            {/* Right: Date */}
            <div className="event-date">{event.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
