import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import {
  addMonths, subMonths, addYears, subYears,
  format, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, addDays,
  isSameMonth, isSameDay,
} from "date-fns";

const EVENTS = {
  "2025-12-05": [{ company: "TechCorp",   type: "Interview", time: "10:00 AM", color: "#6366f1" }],
  "2025-12-12": [{ company: "InnovateX",  type: "OA Test",   time: "2:00 PM",  color: "#0ea5e9" }],
  "2025-12-23": [{ company: "FutureFlow", type: "Interview", time: "11:30 AM", color: "#3b82f6" }],
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarWidget() {
  const [view, setView]         = useState("day");
  const [activeDate, setActive] = useState(new Date(2025, 11, 1));
  const [selected, setSelected] = useState(null);

  const prev = () => {
    if (view === "day")   setActive(subMonths(activeDate, 1));
    if (view === "month") setActive(subYears(activeDate, 1));
    if (view === "year")  setActive(subYears(activeDate, 12));
  };
  const next = () => {
    if (view === "day")   setActive(addMonths(activeDate, 1));
    if (view === "month") setActive(addYears(activeDate, 1));
    if (view === "year")  setActive(addYears(activeDate, 12));
  };
  const titleClick = () => {
    if (view === "day") setView("month");
    else if (view === "month") setView("year");
  };
  const goToday = () => { setActive(new Date()); setView("day"); };

  const eventsFor = (d) => EVENTS[format(d, "yyyy-MM-dd")] || [];

  /* ── Day grid ── */
  const renderDays = () => {
    const monthStart = startOfMonth(activeDate);
    const monthEnd   = endOfMonth(monthStart);
    const start      = startOfWeek(monthStart);
    const end        = endOfWeek(monthEnd);
    const rows       = [];
    let day          = start;

    while (day <= end) {
      const cells = [];
      for (let i = 0; i < 7; i++) {
        const d    = day;
        const evs  = eventsFor(d);
        const inMonth   = isSameMonth(d, monthStart);
        const isToday   = isSameDay(d, new Date());
        const isSel     = selected && isSameDay(d, selected);
        const hasEvent  = evs.length > 0;

        cells.push(
          <div
            key={d.toString()}
            className={[
              "cal-cell",
              !inMonth   && "cal-cell--muted",
              isToday    && "cal-cell--today",
              isSel      && "cal-cell--selected",
              hasEvent   && "cal-cell--event",
            ].filter(Boolean).join(" ")}
            onClick={() => setSelected(d)}
          >
            <span className="cal-cell__num">{format(d, "d")}</span>
            {hasEvent && <span className="cal-cell__dot" style={{ background: evs[0].color }} />}

            {hasEvent && (
              <div className="cal-tooltip">
                {evs.map((ev, i) => (
                  <div key={i} className="cal-tooltip__row">
                    <span className="cal-tooltip__dot" style={{ background: ev.color }} />
                    <div>
                      <div className="cal-tooltip__company">{ev.company}</div>
                      <div className="cal-tooltip__meta">{ev.type} · {ev.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="cal-row" key={day.toString()}>{cells}</div>);
    }

    return (
      <div className="cal-grid-wrapper">
        <div className="cal-weekdays">
          {WEEKDAYS.map(w => <span key={w} className="cal-weekday">{w}</span>)}
        </div>
        <div className="cal-grid">{rows}</div>
      </div>
    );
  };

  /* ── Month / Year grids ── */
  const renderMonths = () => {
    const months = Array.from({ length: 12 }, (_, i) => format(new Date(2020, i, 1), "MMM"));
    return (
      <div className="cal-picker-grid">
        {months.map((m, i) => (
          <button key={m}
            className={`cal-picker-cell ${i === activeDate.getMonth() ? "active" : ""}`}
            onClick={() => { setActive(new Date(activeDate.getFullYear(), i, 1)); setView("day"); }}
          >{m}</button>
        ))}
      </div>
    );
  };

  const renderYears = () => {
    const base  = Math.floor(activeDate.getFullYear() / 12) * 12;
    const years = Array.from({ length: 12 }, (_, i) => base + i);
    return (
      <div className="cal-picker-grid">
        {years.map(y => (
          <button key={y}
            className={`cal-picker-cell ${y === activeDate.getFullYear() ? "active" : ""}`}
            onClick={() => { setActive(new Date(y, activeDate.getMonth(), 1)); setView("month"); }}
          >{y}</button>
        ))}
      </div>
    );
  };

  const titleLabel = () => {
    if (view === "day")   return format(activeDate, "MMMM yyyy");
    if (view === "month") return format(activeDate, "yyyy");
    const base = Math.floor(activeDate.getFullYear() / 12) * 12;
    return `${base} – ${base + 11}`;
  };

  return (
    <div className="cal-card">
      {/* ── Header ── */}
      <div className="cal-header">
        <div className="cal-header__left">
          <div className="cal-header__icon">
            <CalendarDays size={16} strokeWidth={2} />
          </div>
          <button className="cal-title" onClick={titleClick}>{titleLabel()}</button>
          <button className="cal-today-btn" onClick={goToday}>Today</button>
        </div>
        <div className="cal-header__nav">
          <button className="cal-nav-btn" onClick={prev}>
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <button className="cal-nav-btn" onClick={next}>
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {view === "day"   && renderDays()}
      {view === "month" && renderMonths()}
      {view === "year"  && renderYears()}
    </div>
  );
}
