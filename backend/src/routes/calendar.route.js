import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createCalendarEvent,
  getCalendarAuthUrl,
  handleCalendarOAuthCallback,
  getCalendarEvents,
  getCalendarConnectionStatus,
  disconnectCalendar,
} from "../controllers/calendar.controller.js";

const router = Router();

/* --------------- PUBLIC (for OAuth callback) -------------- */
router.get("/oauth-callback", handleCalendarOAuthCallback);

/* --------------- PROTECTED -------------- */
router.use(verifyJWT); // Apply to all routes below

router.get("/auth-url", getCalendarAuthUrl);
router.get("/status", getCalendarConnectionStatus);
router.get("/events", getCalendarEvents);
router.delete("/disconnect", disconnectCalendar);
router.post("/events", createCalendarEvent); // Your existing route

export default router;