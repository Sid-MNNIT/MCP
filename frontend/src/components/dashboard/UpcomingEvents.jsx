import React from "react";

export default function UpcomingEvents() {
  const events = [
    {
      id: 1,
      company: "TechCorp",
      logoColor: "#6366f1", // Purple/Blue
      logoLetter: "T",
      type: "Interview",
      date: "Nov 15, 10:00 AM",
      iconType: "user",
    },
    {
      id: 2,
      company: "InnovateX",
      logoColor: "#0ea5e9", // Cyan
      logoLetter: "X",
      type: "OA Test",
      date: "Nov 20, 2:00 PM",
      iconType: "doc",
    },
    {
      id: 3,
      company: "FutureFlow",
      logoColor: "#3b82f6", // Blue
      logoLetter: "F",
      type: "Interview",
      date: "Nov 25, 11:30 AM",
      iconType: "doc",
    },
  ];

  return (
    <div className="card event-card">
      <h3>Upcoming Events</h3>
      <div className="event-list">
        {events.map((event) => (
          <div key={event.id} className="event-row">
            {/* Left: Company Logo & Name */}
            <div className="event-left">
              <div
                className="event-logo"
                style={{ color: event.logoColor }}
              >
                {/* Simple SVG Logo Placeholder */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span className="event-company">{event.company}</span>
            </div>

            {/* Middle: Type */}
            <div className="event-type">
              {event.iconType === "user" ? (
                <svg className="event-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              ) : (
                <svg className="event-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              )}
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