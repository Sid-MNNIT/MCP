import { google } from 'googleapis';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';

class GoogleCalendarService {
  constructor() {
    this.oauth2Client = null;
    this.initialized = false;
  }

  /**
   * Initialize the OAuth client (lazy initialization)
   */
  initialize() {
    if (this.initialized) return;

    console.log('🔧 Initializing Google Calendar Service...');
    console.log('📌 GOOGLE_CALENDAR_CLIENT_ID:', process.env.GOOGLE_CALENDAR_CLIENT_ID ? '✅ Set' : '❌ Missing');
    console.log('📌 GOOGLE_CALENDAR_CLIENT_SECRET:', process.env.GOOGLE_CALENDAR_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
    console.log('📌 GOOGLE_CALENDAR_REDIRECT_URI:', process.env.GOOGLE_CALENDAR_REDIRECT_URI || '❌ Missing');

    if (!process.env.GOOGLE_CALENDAR_CLIENT_ID || !process.env.GOOGLE_CALENDAR_CLIENT_SECRET || !process.env.GOOGLE_CALENDAR_REDIRECT_URI) {
      console.error('❌ ERROR: Google Calendar credentials not configured in .env');
      throw new ApiError(500, 'Google Calendar API credentials are not configured. Please check your .env file.');
    }

    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CALENDAR_CLIENT_ID,
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
      process.env.GOOGLE_CALENDAR_REDIRECT_URI
    );

    this.initialized = true;
    console.log('✅ Google Calendar Service initialized successfully');
  }

  /**
   * Ensure the service is initialized before use
   */
  ensureInitialized() {
    if (!this.initialized) {
      this.initialize();
    }
  }

  /**
   * Get authorization URL for user to grant calendar access
   */
  getAuthUrl(userId) {
    this.ensureInitialized();

    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly',
    ];

    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: userId, // Pass userId to retrieve after callback
      prompt: 'consent', // Force consent screen to get refresh token
    });

    console.log('🔗 Generated Calendar Auth URL (first 100 chars):', authUrl.substring(0, 100) + '...');
    return authUrl;
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokensFromCode(code) {
    this.ensureInitialized();

    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw new ApiError(500, 'Failed to get calendar access tokens');
    }
  }

  /**
   * Set credentials for authenticated requests
   */
  setCredentials(tokens) {
    this.ensureInitialized();
    this.oauth2Client.setCredentials(tokens);
  }

  /**
   * Refresh access token if expired
   */
  async refreshAccessToken(refreshToken) {
    this.ensureInitialized();

    try {
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });
      
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      return credentials;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new ApiError(500, 'Failed to refresh calendar access token');
    }
  }

  /**
   * Get calendar events for a date range
   */
  async getEvents(userId, startDate, endDate) {
    this.ensureInitialized();

    try {
      // Get user's calendar tokens
      const user = await User.findById(userId).select('googleCalendarTokens');
      
      if (!user?.googleCalendarTokens?.access_token) {
        throw new ApiError(401, 'Calendar not connected. Please authorize access.');
      }

      // Check if token needs refresh
      let tokens = user.googleCalendarTokens;
      if (this.isTokenExpired(tokens)) {
        tokens = await this.refreshAccessToken(tokens.refresh_token);
        
        // Update user's tokens
        user.googleCalendarTokens = tokens;
        await user.save();
      }

      this.setCredentials(tokens);

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      
      // If unauthorized, clear tokens
      if (error.code === 401 || error.message?.includes('invalid_grant')) {
        await User.findByIdAndUpdate(userId, {
          $unset: { googleCalendarTokens: "" }
        });
        throw new ApiError(401, 'Calendar authorization expired. Please reconnect.');
      }
      
      throw new ApiError(500, 'Failed to fetch calendar events');
    }
  }

  /**
   * Create a calendar event
   */
  async createEvent(userId, eventData) {
    this.ensureInitialized();

    try {
      const user = await User.findById(userId).select('googleCalendarTokens');
      
      if (!user?.googleCalendarTokens?.access_token) {
        throw new ApiError(401, 'Calendar not connected. Please authorize access.');
      }

      let tokens = user.googleCalendarTokens;
      if (this.isTokenExpired(tokens)) {
        tokens = await this.refreshAccessToken(tokens.refresh_token);
        user.googleCalendarTokens = tokens;
        await user.save();
      }

      this.setCredentials(tokens);

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const event = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: eventData.timeZone || 'UTC',
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: eventData.timeZone || 'UTC',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new ApiError(500, 'Failed to create calendar event');
    }
  }

  /**
   * Update an existing calendar event
   */
  async updateEvent(userId, eventId, eventData) {
    this.ensureInitialized();

    try {
      const user = await User.findById(userId).select('googleCalendarTokens');
      
      if (!user?.googleCalendarTokens?.access_token) {
        throw new ApiError(401, 'Calendar not connected. Please authorize access.');
      }

      let tokens = user.googleCalendarTokens;
      if (this.isTokenExpired(tokens)) {
        tokens = await this.refreshAccessToken(tokens.refresh_token);
        user.googleCalendarTokens = tokens;
        await user.save();
      }

      this.setCredentials(tokens);

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const event = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: eventData.timeZone || 'UTC',
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: eventData.timeZone || 'UTC',
        },
      };

      const response = await calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
      });

      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new ApiError(500, 'Failed to update calendar event');
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(userId, eventId) {
    this.ensureInitialized();

    try {
      const user = await User.findById(userId).select('googleCalendarTokens');
      
      if (!user?.googleCalendarTokens?.access_token) {
        throw new ApiError(401, 'Calendar not connected. Please authorize access.');
      }

      let tokens = user.googleCalendarTokens;
      if (this.isTokenExpired(tokens)) {
        tokens = await this.refreshAccessToken(tokens.refresh_token);
        user.googleCalendarTokens = tokens;
        await user.save();
      }

      this.setCredentials(tokens);

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw new ApiError(500, 'Failed to delete calendar event');
    }
  }

  /**
   * Check if access token is expired
   */
  isTokenExpired(tokens) {
    if (!tokens.expiry_date) return false;
    // Add 5 minute buffer
    return Date.now() >= (tokens.expiry_date - 5 * 60 * 1000);
  }
}

export const googleCalendarService = new GoogleCalendarService();
