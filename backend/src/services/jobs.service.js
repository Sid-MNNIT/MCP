/**
 * Jobs Service
 * ------------
 * Handles job search, job recommendations, matching,
 * and saved jobs logic for Career Copilot.
 *
 * Architecture:
 * Node Backend → Python Orchestrator → MCP Servers
 */

import { callMCP } from "./mcp.service.js";
import { User } from "../models/user.model.js";

class JobsService {
  /* ===================================================== */
  /* Job Search                                            */
  /* ===================================================== */

  async searchJobs(
    keywords,
    country = "in",
    where = "",
    maxResults = 10,
    page = 1,
    userId = null
  ) {
    try {
      return await callMCP({
        tool: "search_jobs",
        args: {
          keywords,
          country,
          where,
          max_results: maxResults,
          page,
        },
        userId,
      });
    } catch (error) {
      console.error("❌ Job search error:", error);
      throw new Error("Failed to search jobs");
    }
  }

  async getJobCategories(country = "in", userId = null) {
    try {
      return await callMCP({
        tool: "get_job_categories",
        args: { country },
        userId,
      });
    } catch (error) {
      console.error("❌ Get categories error:", error);
      throw new Error("Failed to fetch job categories");
    }
  }

  /* ===================================================== */
  /* Job Matching                                          */
  /* ===================================================== */

  async matchJobsToResume(userId, jobs) {
    try {
      const user = await User.findById(userId);

      if (!user?.resume?.skills?.length) {
        throw new Error("Resume skills not found");
      }

      // Split skills: strict + flexible
      const requiredSkills = user.resume.skills.slice(0, 3);
      const preferredSkills = user.resume.skills.slice(3, 8);

      return await callMCP({
        tool: "filter_jobs_by_skills",
        args: {
          jobs,
          required_skills: requiredSkills,
          preferred_skills: preferredSkills,
        },
        userId,
      });
    } catch (error) {
      console.error("❌ Job matching error:", error);
      throw new Error("Failed to match jobs");
    }
  }

  /* ===================================================== */
  /* Job Recommendations                                   */
  /* ===================================================== */

  async getRecommendedJobs(userId) {
    try {
      const user = await User.findById(userId);

      if (!user?.resume?.skills?.length) {
        throw new Error("Resume not found");
      }

      const keywords = user.resume.skills.slice(0, 3).join(" ");
      const country = user.preferences?.country || "in";
      const where = user.preferences?.city || "";

      const searchResult = await this.searchJobs(
        keywords,
        country,
        where,
        20,
        1,
        userId
      );

      if (!searchResult?.success || !searchResult.jobs?.length) {
        return { success: true, jobs: [], total: 0 };
      }

      const matchResult = await this.matchJobsToResume(
        userId,
        searchResult.jobs
      );

      return {
        success: true,
        jobs: matchResult.matched_jobs || [],
        total: matchResult.total_matches || 0,
      };
    } catch (error) {
      console.error("❌ Recommendation error:", error);
      throw new Error("Failed to get job recommendations");
    }
  }

  /* ===================================================== */
  /* Saved Jobs                                            */
  /* ===================================================== */

  async saveJob(userId, job) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      user.savedJobs ??= [];

      const alreadySaved = user.savedJobs.some(
        (saved) => saved.id === job.id
      );

      if (alreadySaved) {
        return { success: false, message: "Job already saved" };
      }

      user.savedJobs.push({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.apply_url || job.url,
        matchScore: job.match_score,
        savedAt: new Date(),
      });

      await user.save();

      return { success: true, message: "Job saved successfully" };
    } catch (error) {
      console.error("❌ Save job error:", error);
      throw new Error("Failed to save job");
    }
  }

  async getSavedJobs(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    return {
      success: true,
      jobs: user.savedJobs || [],
    };
  }

  async unsaveJob(userId, jobId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.savedJobs = (user.savedJobs || []).filter(
      (job) => job.id !== jobId
    );

    await user.save();

    return {
      success: true,
      message: "Job removed from saved list",
    };
  }
}

export const jobsService = new JobsService();
