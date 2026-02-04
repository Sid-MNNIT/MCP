import fs from "fs";
import path from "path";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import { Resume } from "../models/resume.model.js";
import { resumeService } from "../services/resume.services.js";
import { savePdfToDisk } from "../utils/fileStorage.js";

/**
 * POST /api/resume
 * Upload resume PDF → store → parse → save results
 */
export const uploadAndParseResume = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized: user not found");

  const file = req.file;
  if (!file) throw new ApiError(400, "Resume PDF file is required");

  if (file.mimetype !== "application/pdf") {
    throw new ApiError(400, "Invalid file type. Only PDF allowed.");
  }

  // Extract JWT (same pattern as your other controllers)
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.cookies?.accessToken ||
    null;

  // 1) Store the PDF on disk
  const storagePath = savePdfToDisk({
    userId,
    buffer: file.buffer,
    filename: file.originalname
  });

  // 2) Convert to base64 for orchestrator pipeline
  const file_b64 = file.buffer.toString("base64");

  // 3) Call orchestrator → MCP parse+score pipeline
  const pipelineResult = await resumeService.parseResumePdf({
    userId,
    jwt: token,
    filename: file.originalname,
    mimetype: file.mimetype,
    file_b64
  });

  // pipelineResult is your orchestrator JSON
  const parsed_resume = pipelineResult?.parsed_resume || {};
  const score = pipelineResult?.score || {};

  // 4) Save Resume document in MongoDB (upsert)
  const resumeDoc = await Resume.findOneAndUpdate(
    { userId },
    {
      userId,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      storagePath,
      uploadedAt: new Date(),
      parsed_resume,
      score
    },
    { upsert: true, new: true }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        resume: {
          id: resumeDoc._id,
          filename: resumeDoc.filename,
          mimetype: resumeDoc.mimetype,
          size: resumeDoc.size,
          uploadedAt: resumeDoc.uploadedAt,
        },
        parsed_resume,
        score,
        openUrl: `/api/resume/file`
      },
      "Resume uploaded and parsed successfully"
    )
  );
});


/**
 * GET /api/resume
 * Fetch user's resume metadata + parsed result + score
 */
export const getMyResume = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const resumeDoc = await Resume.findOne({ userId });

  if (!resumeDoc) {
    return res.status(200).json(
      new ApiResponse(
        200,
        { hasResume: false },
        "No resume found"
      )
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        hasResume: true,
        resume: {
          id: resumeDoc._id,
          filename: resumeDoc.filename,
          mimetype: resumeDoc.mimetype,
          size: resumeDoc.size,
          uploadedAt: resumeDoc.uploadedAt
        },
        parsed_resume: resumeDoc.parsed_resume || {},
        score: resumeDoc.score || {},
        openUrl: `/api/resume/file`
      },
      "Resume fetched successfully"
    )
  );
});


/**
 * GET /api/resume/file
 * Streams the stored resume PDF for the logged-in user
 */
export const streamMyResumeFile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const resumeDoc = await Resume.findOne({ userId });
  if (!resumeDoc) throw new ApiError(404, "Resume not found");

  const filePath = resumeDoc.storagePath;

  if (!filePath || !fs.existsSync(filePath)) {
    throw new ApiError(404, "Resume file missing on server");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${resumeDoc.filename || "resume.pdf"}"`
  );

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});
