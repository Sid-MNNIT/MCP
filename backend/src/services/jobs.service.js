/**
 * Jobs Service
 * ------------
 * Handles job search, job recommendations, matching,
 * and saved jobs logic for Career Copilot.
 *
 * Architecture:
 * Node Backend → Python Orchestrator Pipelines → MCP Servers
 */

import { callMCP } from "./mcp.service.js";
import { User } from "../models/user.model.js";

class JobsService {
  /* ===================================================== */
  /* Job Search Pipeline                                   */
  /* ===================================================== */

  async searchJobs(
    keywords,
    country = "in",
    where = "",
    maxResults = 10,
    page = 1,
    userId = null,
    jwt=null
  ) {
    try {
      console.log(`🔍 Searching jobs: keywords="${keywords}", location="${where}"`);
      
      return await callMCP({
        endpoint: "/pipelines/job-search",  // ← Using pipeline
        args: {
          keywords,
          location: where,  // ← Changed from 'where' to 'location'
          country,
          maxResults,
          page,
          useResumeMatching: false,  // Phase 2: Can be made dynamic
        },
        userId,
        jwt
      });
    } catch (error) {
      console.error("❌ Job search error:", error);
      throw new Error("Failed to search jobs");
    }
  }

  /* ===================================================== */
  /* Job Relevance Ranking Pipeline                         */
  /* ===================================================== */

    async rankJobsByRelevance(jobs, userId, jwt) {
      try {
        console.log(`🔍 Ranking jobs: ${jobs.length} jobs for user: ${userId}`);
        const result = await callMCP({
          endpoint: "/pipelines/rank-jobs",
          args: { jobs },
          userId,
          jwt
        });
  
        if (result.success && result.jobs) {
          return result.jobs;
        }
  
        // Fallback: return original jobs if ranking fails
        console.warn("⚠️ Ranking failed, returning unranked jobs");
        return jobs;
      } catch (error) {
        console.error("⚠️ Ranking error:", error);
        return jobs; // Fail gracefully
      }
    }


  async getJobCategories(country = "in", userId = null) {
    try {
      // Note: This is a GET endpoint, but we're calling via POST
      // You might want to adjust this based on your needs
      return await callMCP({
        endpoint: "/pipelines/job-categories",
        args: { country },
        userId,
      });
    } catch (error) {
      console.error("❌ Get categories error:", error);
      throw new Error("Failed to fetch job categories");
    }
  }

  /* ===================================================== */
  /* Job Recommendations Pipeline                          */
  /* ===================================================== */

    async getRecommendedJobs(userId, jwt) {
    try {
      console.log(`✨ Getting recommendations for user: ${userId}`);
      
      // Pipeline handles everything:
      // - Fetching user profile
      // - Extracting skills
      // - Searching jobs
      // - Matching and ranking
      return await callMCP({
        endpoint: "/pipelines/job-recommendations",  // ← Using pipeline
        args: {
          maxResults: 20,
        },
        userId,
        jwt,
      });
    } catch (error) {
      console.error("❌ Recommendation error:", error);
      throw new Error("Failed to get job recommendations");
    }
  }

  /* ===================================================== */
  /* Job Matching (Legacy - kept for backward compat)     */
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

      // Note: This still uses legacy /agent/execute
      // Can be moved to pipeline in Phase 2
      return await callMCP({
        tool: "filter_jobs_by_skills",  // Legacy tool
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

      console.log(`💾 Job saved: ${job.id} for user ${userId}`);

      return { success: true, message: "Job saved successfully" };
    } catch (error) {
      console.error("❌ Save job error:", error);
      throw new Error("Failed to save job");
    }
  }

  async getSavedJobs(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    console.log(`📋 Fetching saved jobs for user: ${userId}`);

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

    console.log(`🗑️ Job unsaved: ${jobId} for user ${userId}`);

    return {
      success: true,
      message: "Job removed from saved list",
    };
  }
}

export const jobsService = new JobsService();