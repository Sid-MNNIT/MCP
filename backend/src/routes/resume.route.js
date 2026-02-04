import { Router } from "express";
import multer from "multer";

import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  uploadAndParseResume,
  getMyResume,
  streamMyResumeFile
} from "../controllers/resume.controller.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

// POST upload + parse
router.post("/", verifyJWT, upload.single("resume"), uploadAndParseResume);

// GET metadata + parsed + score
router.get("/", verifyJWT, getMyResume);

// GET pdf file
router.get("/file", verifyJWT, streamMyResumeFile);

export default router;
