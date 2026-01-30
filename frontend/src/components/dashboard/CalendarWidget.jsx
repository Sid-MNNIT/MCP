import { useState, useEffect } from "react";
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
  parseISO,
} from "date-fns";
import { calendarService } from "../../services/calendar.service";

export default function CalendarWidget() {
  const [view, setView] = useState("day");
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(false);

  // Check if calendar is connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Fetch events when month changes
  useEffect(() => {
    if (isConnected && view === "day") {
      fetchEventsForMonth();
    }
  }, [activeDate, isConnected, view]);

  // Check for OAuth callback success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('calendar_connected') === 'true') {
      setIsConnected(true);
      setError(null);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (params.get('calendar_error') === 'true') {
      setError('Failed to connect calendar. Please try again.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await calendarService.getConnectionStatus();
      setIsConnected(connected);
    } catch (err) {
      console.error('Failed to check connection:', err);
      setIsConnected(false);
    }
  };

  const fetchEventsForMonth = async () => {
    setLoading(true);
    setError(null);
    try {
      const monthStart = startOfMonth(activeDate);
      const monthEnd = endOfMonth(activeDate);
      
      // Extend range to cover the visible calendar grid
      const calendarStart = startOfWeek(monthStart);
      const calendarEnd = endOfWeek(monthEnd);
      
      const fetchedEvents = await calendarService.getEvents(calendarStart, calendarEnd);
      
      // Convert events to date-keyed object
      const eventsByDate = {};
      fetchedEvents.forEach(event => {
        const start = event.start.dateTime || event.start.date;
        const dateKey = format(parseISO(start), "yyyy-MM-dd");
        
        if (!eventsByDate[dateKey]) {
          eventsByDate[dateKey] = [];
        }
        
        eventsByDate[dateKey].push({
          id: event.id,
          summary: event.summary,
          description: event.description,
          time: event.start.dateTime 
            ? format(parseISO(event.start.dateTime), "h:mm a") 
            : "All day",
          color: event.colorId ? getEventColor(event.colorId) : "#6366f1",
          htmlLink: event.htmlLink,
        });
      });
      
      setEvents(eventsByDate);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError(err.message);
      
      // If auth error, disconnect calendar
      if (err.message.includes('authorization') || err.message.includes('reconnect')) {
        setIsConnected(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConnectCalendar = async () => {
    setConnecting(true);
    setError(null);
    try {
      console.log('🔵 Getting calendar auth URL...');
      const authUrl = await calendarService.getCalendarAuthUrl();
      console.log('🔵 Redirecting to:', authUrl);
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (err) {
      console.error('🔴 Failed to connect calendar:', err);
      setError('Failed to connect calendar. ' + err.message);
      setConnecting(false);
    }
  };

  const handleDisconnectCalendar = async () => {
    if (!confirm('Are you sure you want to disconnect your Google Calendar?')) {
      return;
    }

    try {
      await calendarService.disconnectCalendar();
      setIsConnected(false);
      setEvents({});
      setError(null);
    } catch (err) {
      console.error('Failed to disconnect calendar:', err);
      setError('Failed to disconnect calendar. Please try again.');
    }
  };

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

  const getEventColor = (colorId) => {
    const colors = {
      '1': '#a4bdfc', '2': '#7ae7bf', '3': '#dbadff', '4': '#ff887c',
      '5': '#fbd75b', '6': '#ffb878', '7': '#46d6db', '8': '#e1e1e1',
      '9': '#5484ed', '10': '#51b749', '11': '#dc2127'
    };
    return colors[colorId] || '#6366f1';
  };

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

            {hasEvents && (
              <div className="event-tooltip">
                {dayEvents.map((ev, idx) => (
                  <div key={idx} className="tooltip-content">
                    <div className="tooltip-header">
                      <span className="tooltip-dot" style={{background: ev.color}}></span>
                      <span className="tooltip-company">{ev.summary}</span>
                    </div>
                    <div className="tooltip-details">
                      {ev.time}
                    </div>
                    {ev.description && (
                      <div className="tooltip-description" title={ev.description}>
                        {ev.description}
                      </div>
                    )}
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

  const renderMonths = () => {
    const months = Array.from({ length: 12 }, (_, i) => format(new Date(2020, i, 1), "MMM"));
    return (
      <div className="calendar-month-grid">
        {months.map((m, i) => (
          <button 
            key={m} 
            className={`calendar-month ${i === activeDate.getMonth() ? "active" : ""}`} 
            onClick={() => { 
              setActiveDate(new Date(activeDate.getFullYear(), i, 1)); 
              setView("day"); 
            }}
          >
            {m}
          </button>
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
          <button 
            key={y} 
            className={`calendar-year ${y === activeDate.getFullYear() ? "active" : ""}`} 
            onClick={() => { 
              setActiveDate(new Date(y, activeDate.getMonth(), 1)); 
              setView("month"); 
            }}
          >
            {y}
          </button>
        ))}
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="calendar-card">
        <div className="calendar-connect-prompt">
          <div className="calendar-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#6366f1" strokeWidth="2"/>
              <path d="M3 10H21" stroke="#6366f1" strokeWidth="2"/>
              <path d="M8 2V6" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 2V6" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Connect Google Calendar</h3>
          <p>Sync your Google Calendar to see and manage your events</p>
          {error && <div className="calendar-error-inline">{error}</div>}
          <button 
            onClick={handleConnectCalendar} 
            className="calendar-connect-btn"
            disabled={connecting}
          >
            {connecting ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
                </svg>
                Connect with Google
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <button onClick={handlePrev} className="calendar-nav-btn" disabled={loading}>‹</button>
        <div className="calendar-nav">
          <div className="calendar-month-year" onClick={handleTitleClick}>
            {view === "day" && format(activeDate, "MMMM yyyy")}
            {view === "month" && format(activeDate, "yyyy")}
            {view === "year" && `${Math.floor(activeDate.getFullYear() / 12) * 12} – ${Math.floor(activeDate.getFullYear() / 12) * 12 + 11}`}
          </div>
          <div className="calendar-actions">
            <button onClick={goToToday} className="calendar-today-btn">Today</button>
            <button 
              onClick={handleDisconnectCalendar} 
              className="calendar-disconnect-btn"
              title="Disconnect calendar"
            >
              ⚙️
            </button>
          </div>
        </div>
        <button onClick={handleNext} className="calendar-nav-btn" disabled={loading}>›</button>
      </div>
      
      {loading && <div className="calendar-loading">Loading events...</div>}
      {error && <div className="calendar-error">{error}</div>}
      
      {view === "day" && renderDays()}
      {view === "month" && renderMonths()}
      {view === "year" && renderYears()}
      
      {isConnected && !loading && (
        <div className="calendar-footer">
          <span className="calendar-status">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="6" fill="#10b981"/>
            </svg>
            Synced with Google Calendar
          </span>
        </div>
      )}
    </div>
  );
}
