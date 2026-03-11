import cron from "node-cron";
import fetch from "node-fetch";
import { User } from "../models/user.model.js";
import { Email } from "../models/email.model.js";
import { calendarService } from "../services/calendar.service.js";
import jwt from "jsonwebtoken";

const ORCHESTRATOR_URL = "http://localhost:9000";

// Generate a short-lived JWT for the user so orchestrator accepts the request
function generateServiceJWT(user) {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
}

// Call orchestrator to ingest emails for a user
async function ingestEmailsForUser(user, userJwt) {
  try {
    const res = await fetch(`${ORCHESTRATOR_URL}/pipelines/ingest-emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Key": process.env.SERVICE_KEY,
        "Authorization": `Bearer ${userJwt}`,
      },
      body: JSON.stringify({ userId: user._id }),
    });
    if (!res.ok) {
      console.error(`❌ [CronJob] Ingest failed for ${user._id}: ${await res.text()}`);
      return false;
    }
    console.log(`📥 [CronJob] Emails ingested for user ${user._id}`);
    return true;
  } catch (err) {
    console.error(`❌ [CronJob] Ingest error:`, err.message);
    return false;
  }
}

// Find unscheduled INTERVIEW emails and create calendar events
async function autoScheduleInterviews(user, userJwt) {
  const interviewEmails = await Email.find({
    userId: user._id,
    type: "INTERVIEW",
    calendarEventCreated: { $ne: true },
  });

  if (interviewEmails.length === 0) return;

  console.log(`📅 [CronJob] ${interviewEmails.length} unscheduled interview(s) for user ${user._id}`);

  for (const email of interviewEmails) {
    try {
      const result = await calendarService.createCalendarEventFromEmail(user._id, email._id, userJwt);
      // Only mark done if the Google Calendar event was actually created
      await Email.findByIdAndUpdate(email._id, { calendarEventCreated: true });
      console.log(`✅ [CronJob] Scheduled: "${email.subject}" → ${result?.event_link || result?.data?.event_link || 'no link'}`);
    } catch (err) {
      // 422/400 = LLM couldn't find date/time or invalid email — no point retrying
      if (err.statusCode === 422 || err.statusCode === 400) {
        console.warn(`⚠️ [CronJob] Skipping "${email.subject}" — no schedule info or invalid email`);
        await Email.findByIdAndUpdate(email._id, { calendarEventCreated: true });
      } else {
        // 500 = MCP/Google API failed — DON'T mark as done, retry next cron tick
        console.error(`❌ [CronJob] Failed to schedule "${email.subject}" (will retry):`, err.message);
      }
    }
  }
}

// Main job
async function runEmailSyncJob() {
  console.log("🔄 [CronJob] Running email sync...");
  try {
    const users = await User.find({ isGmailConnected: true });
    for (const user of users) {
      const userJwt = generateServiceJWT(user);
      await ingestEmailsForUser(user, userJwt);
      await autoScheduleInterviews(user, userJwt);
    }
    console.log("✅ [CronJob] Done.");
  } catch (err) {
    console.error("❌ [CronJob] Error:", err.message);
  }
}

// Export — call this once at server start
// "*/5 * * * *" = every 5 mins | "*/1 * * * *" = every 1 min (for testing)
export function startEmailSyncJob() {
  console.log("⏰ [CronJob] Email sync registered — every 5 minutes");
  cron.schedule("*/1 * * * *", runEmailSyncJob);
}