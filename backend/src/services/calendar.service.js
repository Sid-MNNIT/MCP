/**
 * Calendar Service
 * ---------------
 * Handles calendar event creation through MCP orchestrator
 */

import { callMCP } from "./mcp.service.js";
import { Email } from "../models/email.model.js";
import { ApiError } from "../utils/apiError.js";

class CalendarService {
  /**
   * Create a calendar event from an email
   * Fetches email from DB, extracts details, and creates calendar event
   */
  async createCalendarEventFromEmail(userId, emailId, jwt) {
    try {
      console.log(`📅 Creating calendar event from email: ${emailId} for user: ${userId}`);
      
      // 1. Fetch the email from database
      const email = await Email.findOne({ _id: emailId, userId });
      
      if (!email) {
        throw new ApiError(404, "Email not found");
      }

      // 2. Validate email type (should be INTERVIEW)
      if (email.type !== "INTERVIEW") {
        throw new ApiError(400, `Cannot create calendar event from email type: ${email.type}. Only INTERVIEW emails are supported.`);
      }

      // 3. Extract calendar details from email using MCP parser
      const extractedDetails = await this.extractCalendarDetailsFromEmail(
        userId,
        email.subject,
        email.text,
        jwt
      );

      // 4. Create calendar event with extracted details
      return await callMCP({
        endpoint: "/pipelines/calendar-create-event",
        args: {
          eventType: extractedDetails.eventType || "INTERVIEW",
          company: extractedDetails.company,
          role: extractedDetails.role,
          date: extractedDetails.date,
          startTime: extractedDetails.startTime,
          endTime: extractedDetails.endTime,
          timezone: extractedDetails.timezone || "Asia/Kolkata",
          meetLink: extractedDetails.meetLink,
          description: extractedDetails.description || email.subject,
        },
        userId,
        jwt,
      });
    } catch (error) {
      console.error("❌ Calendar event creation error:", error);
      throw error;
    }
  }

  /**
   * Extract calendar event details from email subject and text
   * Uses MCP to parse email content and extract structured data
   */
  async extractCalendarDetailsFromEmail(userId, subject, text, jwt) {
    try {
      console.log(`🔍 Extracting calendar details from email`);
      
      // Call MCP to parse email and extract calendar details
      const result = await callMCP({
        endpoint: "/pipelines/extract-calendar-from-email",
        args: {
          subject,
          text,
        },
        userId,
        jwt,
      });

      return result;
    } catch (error) {
      console.error("❌ Email parsing error:", error);
      throw new ApiError(500, "Failed to extract calendar details from email");
    }
  }

  /**
   * Original method - Create calendar event directly with provided data
   * (Keeping for backward compatibility if needed)
   */
  async createCalendarEvent(userId, eventData, jwt) {
    try {
      console.log(`📅 Creating calendar event for user: ${userId}`);
      
      return await callMCP({
        endpoint: "/pipelines/calendar-create-event",
        args: {
          eventType: eventData.eventType,
          company: eventData.company,
          role: eventData.role,
          date: eventData.date,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          timezone: eventData.timezone || "Asia/Kolkata",
          meetLink: eventData.meetLink,
          description: eventData.description,
        },
        userId,
        jwt,
      });
    } catch (error) {
      console.error("❌ Calendar event creation error:", error);
      throw new Error("Failed to create calendar event");
    }
  }
}

export const calendarService = new CalendarService();
