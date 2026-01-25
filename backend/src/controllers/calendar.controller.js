/**
 * Calendar Controller
 * ------------------
 * Handles calendar-related HTTP requests
 */

import { calendarService } from "../services/calendar.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * Create a calendar event from an email
 * POST /api/calendar/events
 * Body: { emailId: "mongo_email_id" }
 */
export const createCalendarEvent = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const { emailId } = req.body;

  // Validation
  if (!emailId) {
    throw new ApiError(400, "emailId is required");
  }

  // Extract JWT from request
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Authentication token required");
  }

  // Create calendar event from email (service will fetch and parse email)
  const result = await calendarService.createCalendarEventFromEmail(
    userId,
    emailId,
    token
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Calendar event created successfully"));
});
