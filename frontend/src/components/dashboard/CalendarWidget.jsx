import { useState } from "react";
import {
  addMonths,
  subMonths,
  addYears,
  subYears,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";

export default function CalendarWidget() {
  const [view, setView] = useState("day"); // day | month | year
  const [activeDate, setActiveDate] = useState(new Date(2025, 11, 1)); // Default to Dec 2025 for demo
  const [selectedDate, setSelectedDate] = useState(null);

  // ✅ UPDATED: Events matching your "Upcoming Events" list
  // mapped to December 2025 so they appear in your current view
  const events = {
    "2025-12-05": [{ company: "TechCorp", type: "Interview", time: "10:00 AM", color: "#6366f1" }],
    "2025-12-12": [{ company: "InnovateX", type: "OA Test", time: "2:00 PM", color: "#0ea5e9" }],
    "2025-12-23": [{ company: "FutureFlow", type: "Interview", time: "11:30 AM", color: "#3b82f6" }],
  };

  /* ---------------- Header controls ---------------- */

  const handlePrev = () => {
    if (view === "day") setActiveDate(subMonths(activeDate, 1));
    if (view === "month") setActiveDate(subYears(activeDate, 1));
    if (view === "year") setActiveDate(subYears(activeDate, 12));
  };

  const handleNext = () => {
    if (view === "day") setActiveDate(addMonths(activeDate, 1));
    if (view === "month") setActiveDate(addYears(activeDate, 1));
    if (view === "year") setActiveDate(addYears(activeDate, 12));
  };

  const handleTitleClick = () => {
    if (view === "day") setView("month");
    else if (view === "month") setView("year");
  };

  const goToToday = () => {
    setActiveDate(new Date());
    setView("day");
  };

  const getEventsForDate = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return events[dateKey] || [];
  };

  /* ---------------- Day grid ---------------- */

  const renderDays = () => {
    const monthStart = startOfMonth(activeDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const rows = [];
    let day = startDate;

    // Weekday headers
    rows.push(
      <div className="calendar-weekdays" key="weekdays">
        {weekdays.map((weekday) => (
          <div key={weekday} className="calendar-weekday">
            {weekday}
          </div>
        ))}
      </div>
    );

    // Day cells
    while (day <= endDate) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dayEvents = getEventsForDate(currentDay);
        const hasEvents = dayEvents.length > 0;
        
        days.push(
          <div
            key={currentDay.toString()}
            className={`calendar-cell ${
              !isSameMonth(currentDay, monthStart) ? "muted" : ""
            } ${isSameDay(currentDay, new Date()) ? "today" : ""} ${
              selectedDate && isSameDay(currentDay, selectedDate) ? "selected" : ""
            } ${hasEvents ? "has-event" : ""}`}
            onClick={() => setSelectedDate(currentDay)}
          >
            {format(currentDay, "d")}

            {/* ✅ TOOLTIP LOGIC: Only renders if there is an event */}
            {hasEvents && (
              <div className="event-tooltip">
                {dayEvents.map((ev, idx) => (
                  <div key={idx} className="tooltip-content">
                    <div className="tooltip-header">
                      <span className="tooltip-dot" style={{background: ev.color}}></span>
                      <span className="tooltip-company">{ev.company}</span>
                    </div>
                    <div className="tooltip-details">
                      {ev.type} • {ev.time}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="calendar-row" key={day.toString()}>
          {days}
        </div>
      );
    }

    return <div className="calendar-grid">{rows}</div>;
  };

  /* ---------------- Month/Year Renderers ---------------- */
  // (Using the logic we fixed in the previous step)
  const renderMonths = () => {
    const months = Array.from({ length: 12 }, (_, i) => format(new Date(2020, i, 1), "MMM"));
    return (
      <div className="calendar-month-grid">
        {months.map((m, i) => (
          <button key={m} className={`calendar-month ${i === activeDate.getMonth() ? "active" : ""}`} onClick={() => { setActiveDate(new Date(activeDate.getFullYear(), i, 1)); setView("day"); }}>{m}</button>
        ))}
      </div>
    );
  };

  const renderYears = () => {
    const startYear = Math.floor(activeDate.getFullYear() / 12) * 12;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);
    return (
      <div className="calendar-year-grid">
        {years.map((y) => (
          <button key={y} className={`calendar-year ${y === activeDate.getFullYear() ? "active" : ""}`} onClick={() => { setActiveDate(new Date(y, activeDate.getMonth(), 1)); setView("month"); }}>{y}</button>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <button onClick={handlePrev} className="calendar-nav-btn">‹</button>
        <div className="calendar-nav">
          <div className="calendar-month-year" onClick={handleTitleClick}>
            {view === "day" && format(activeDate, "MMMM yyyy")}
            {view === "month" && format(activeDate, "yyyy")}
            {view === "year" && `${Math.floor(activeDate.getFullYear() / 12) * 12} – ${Math.floor(activeDate.getFullYear() / 12) * 12 + 11}`}
          </div>
          <button onClick={goToToday} className="calendar-today-btn">Today</button>
        </div>
        <button onClick={handleNext} className="calendar-nav-btn">›</button>
      </div>
      {view === "day" && renderDays()}
      {view === "month" && renderMonths()}
      {view === "year" && renderYears()}
    </div>
  );
}