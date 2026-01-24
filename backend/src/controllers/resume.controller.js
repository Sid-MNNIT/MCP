/**
 * Resume Controller
 * -----------------
 * Endpoint:
 * POST /resume
 *
 * Receives PDF via multer (memoryStorage), converts to base64,
 * sends to orchestrator via resumeService.
 */

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { resumeService } from "../services/resume.service.js";

export const parseResumePdf = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: user not found");
  }

  const file = req.file;
  if (!file) {
    throw new ApiError(400, "Resume PDF file is required");
  }

  if (file.mimetype !== "application/pdf") {
    throw new ApiError(400, "Invalid file type. Only PDF is allowed.");
  }

  // Extract JWT (same pattern as jobs.controller.js)
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.cookies?.accessToken ||
    null;

  // ✅ CONSISTENT KEY: file_b64
  const file_b64 = file.buffer.toString("base64");

  const result = await resumeService.parseResumePdf({
    userId,
    jwt: token,
    filename: file.originalname,
    mimetype: file.mimetype,
    file_b64,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Resume parsed successfully"));
});
