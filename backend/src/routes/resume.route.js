/**
 * Client → Route → verifyJWT → multer (PDF upload) → Controller → Service → Orchestrator
 */

import { Router } from "express";
import multer from "multer";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { parseResumePdf } from "../controllers/resume.controller.js";

const router = Router();

/**
 * Multer Configuration
 * --------------------
 * Using memoryStorage so the PDF stays in req.file.buffer.
 * We forward this buffer to orchestrator (no disk storage in phase 1).
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit (adjust later if needed)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

/**
 * POST /resume/parse
 * ------------------
 * - Protected route (verifyJWT)
 * - Expects form-data file field: "resume"
 */
router.post(
    "/", 
    verifyJWT, 
    upload.single("resume"), 
    parseResumePdf
);

export default router;
