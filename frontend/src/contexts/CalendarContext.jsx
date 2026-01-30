import { createContext, useContext, useState, useEffect } from 'react';
import { calendarService } from '../services/calendar.service';

const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check connection status on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const connected = await calendarService.getConnectionStatus();
      setIsConnected(connected);
    } catch (err) {
      console.error('Failed to check calendar connection:', err);
      setIsConnected(false);
    }
  };

  const connectCalendar = async () => {
    try {
      const authUrl = await calendarService.getAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to connect calendar');
      console.error(err);
    }
  };

  const disconnectCalendar = async () => {
    try {
      await calendarService.disconnectCalendar();
      setIsConnected(false);
      setEvents([]);
    } catch (err) {
      setError('Failed to disconnect calendar');
      console.error(err);
    }
  };

  const fetchEvents = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedEvents = await calendarService.getEvents(startDate, endDate);
      setEvents(fetchedEvents);
      return fetchedEvents;
    } catch (err) {
      setError(err.message);
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        isConnected,
        events,
        loading,
        error,
        connectCalendar,
        disconnectCalendar,
        fetchEvents,
        checkConnectionStatus,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};