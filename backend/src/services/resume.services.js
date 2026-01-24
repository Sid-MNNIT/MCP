/**
 * Resume Service
 * --------------
 * Node Backend → Orchestrator Pipelines → resume_mcp
 */

import { callMCP } from "./mcp.service.js";

class ResumeService {
  async parseResumePdf({ userId, jwt, file_b64, filename, mimetype }) {
    try {
      console.log(`📄 Parsing resume PDF for user: ${userId}`);

      if (!file_b64) {
        throw new Error("file_b64 is required");
      }

      // ✅ Pipeline mode (team-lead style)
      return await callMCP({
        endpoint: "/pipelines/resume-parse",
        args: {
          file_b64,
          filename: filename || "resume.pdf",
          mimetype: mimetype || "application/pdf",
        },
        userId,
        jwt,
      });
    } catch (error) {
      console.error("❌ Resume parse error:", error);
      throw new Error("Failed to parse resume");
    }
  }
}

export const resumeService = new ResumeService();
