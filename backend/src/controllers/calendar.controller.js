import { googleCalendarService } from '../services/googleCalendar.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import {User} from '../models/user.model.js';

/**
 * Get Google Calendar authorization URL
 * GET /api/calendar/auth-url
 */
export const getCalendarAuthUrl = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const authUrl = googleCalendarService.getAuthUrl(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, { authUrl }, 'Authorization URL generated'));
});

/**
 * Handle OAuth callback and save tokens
 * GET /api/calendar/oauth-callback
 */
export const handleCalendarOAuthCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    throw new ApiError(400, 'Missing authorization code or state');
  }

  const userId = state;

  // Exchange code for tokens
  const tokens = await googleCalendarService.getTokensFromCode(code);

  // Save tokens to user
  await User.findByIdAndUpdate(userId, {
    googleCalendarTokens: tokens,
  });

  // Redirect to frontend with success
  return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?calendar_connected=true`);
});

/**
 * Get calendar events
 * GET /api/calendar/events?start=ISO_DATE&end=ISO_DATE
 */
export const getCalendarEvents = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { start, end } = req.query;

  if (!start || !end) {
    throw new ApiError(400, 'Start and end dates are required');
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new ApiError(400, 'Invalid date format');
  }

  const events = await googleCalendarService.getEvents(userId, startDate, endDate);

  return res
    .status(200)
    .json(new ApiResponse(200, { events }, 'Calendar events fetched successfully'));
});

/**
 * Check if calendar is connected
 * GET /api/calendar/status
 */
export const getCalendarConnectionStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const user = await User.findById(userId).select('googleCalendarTokens');
  const isConnected = !!user?.googleCalendarTokens?.access_token;

  return res
    .status(200)
    .json(new ApiResponse(200, { isConnected }, 'Calendar connection status'));
});

/**
 * Disconnect calendar
 * DELETE /api/calendar/disconnect
 */
export const disconnectCalendar = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await User.findByIdAndUpdate(userId, {
    $unset: { googleCalendarTokens: "" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Calendar disconnected successfully'));
});

// Keep your existing createCalendarEvent function
export const createCalendarEvent = asyncHandler(async (req, res) => {
  // Your existing implementation
  // ...
});