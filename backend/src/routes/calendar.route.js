import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createCalendarEvent } from "../controllers/calendar.controller.js";

const router = Router();

/* --------------- PROTECTED -------------- */
router.post("/events", verifyJWT, createCalendarEvent);

export default router;