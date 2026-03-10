import React from "react";
import { UserRound, ScrollText, CalendarClock } from "lucide-react";

const EVENTS = [
  { id: 1, company: "TechCorp",   initial: "T", color: "#6366f1", type: "Interview", date: "Dec 5",  time: "10:00 AM", iconType: "user" },
  { id: 2, company: "InnovateX",  initial: "I", color: "#0ea5e9", type: "OA Test",   date: "Dec 12", time: "2:00 PM",  iconType: "doc"  },
  { id: 3, company: "FutureFlow", initial: "F", color: "#3b82f6", type: "Interview", date: "Dec 23", time: "11:30 AM", iconType: "user" },
];

export default function UpcomingEvents() {
  return (
    <div className="card event-card">
      {/* Header */}
      <div className="event-card__header">
        <div className="event-card__icon">
          <CalendarClock size={16} strokeWidth={2} />
        </div>
        <h3>Upcoming Events</h3>
      </div>

      <div className="event-list">
        {EVENTS.map((ev) => (
          <div key={ev.id} className="event-row">

            {/* Avatar */}
            <div
              className="event-avatar"
              style={{
                background: ev.color + "18",
                border: `1.5px solid ${ev.color}33`,
                color: ev.color,
              }}
            >
              {ev.initial}
            </div>

            {/* Company + type */}
            <div className="event-info">
              <span className="event-company">{ev.company}</span>
              <span className="event-type-badge">
                {ev.iconType === "user"
                  ? <UserRound size={11} strokeWidth={2.5} />
                  : <ScrollText size={11} strokeWidth={2.5} />
                }
                {ev.type}
              </span>
            </div>

            {/* Date + time */}
            <div className="event-when">
              <span className="event-date">{ev.date}</span>
              <span className="event-time">{ev.time}</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
