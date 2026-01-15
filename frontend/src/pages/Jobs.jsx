import React, { useState, useEffect } from "react";
import "../styles/jobs.css";

import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";
import JobFilters from "../components/jobs/JobFilters";
import JobFeed from "../components/jobs/JobFeed";
import JobDetails from "../components/jobs/JobDetails";

import { searchJobs, getRecommendedJobs, saveJob, unsaveJob, getSavedJobs } from "../utils/api";

const Jobs = () => {
  /* ============================= */
  /* Filters (BACKEND CONTRACT)    */
  /* ============================= */
  const [filters, setFilters] = useState({
    keywords: "",
    location: "",
    category: "",
    jobType: "full_time",
    minSalary: "",
    maxSalary: "",
    sortBy: "relevance",
  });

  /* ============================= */
  /* Jobs State                    */
  /* ============================= */
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  /* ============================= */
  /* Mobile/Desktop Toggle         */
  /* ============================= */
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);

  /* ============================= */
  /* Load Saved Jobs on Mount      */
  /* ============================= */
  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      const response = await getSavedJobs();
      if (response.success && response.data?.jobs) {
        const ids = new Set(response.data.jobs.map(job => job.id));
        setSavedJobIds(ids);
      }
    } catch (err) {
      console.error("Failed to load saved jobs:", err);
    }
  };

  /* ============================= */
  /* Handlers                      */
  /* ============================= */

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchJobs = async () => {
    if (!filters.keywords.trim()) {
      setError("Please enter keywords to search");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await searchJobs({
        keywords: filters.keywords,
        location: filters.location,
        country: "in",
        maxResults: 20,
        page: 1,
      });

      console.log("Search response:", response);

      // Handle the response structure from backend
      if (response.success === false) {
        throw new Error(response.message || "Failed to search jobs");
      }

      // The backend returns: { statusCode, data: { success, jobs, count, ... }, message }
      const jobList = response.data?.jobs || [];

      setJobs(jobList);
      setSelectedJob(jobList[0] || null);
      setShowJobDetails(jobList.length > 0);
    } catch (error) {
      console.error("❌ Failed to fetch jobs:", error);
      setError(error.message || "Failed to search jobs. Please try again.");
      setJobs([]);
      setSelectedJob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadRecommended = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getRecommendedJobs();

      if (response.success === false) {
        throw new Error(response.message || "Failed to get recommendations");
      }

      const jobList = response.data?.jobs || [];

      setJobs(jobList);
      setSelectedJob(jobList[0] || null);
      setShowJobDetails(jobList.length > 0);
    } catch (error) {
      console.error("❌ Failed to fetch recommended jobs:", error);
      setError(error.message || "Failed to load recommendations. Please ensure you're logged in.");
      setJobs([]);
      setSelectedJob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (job) => {
    try {
      const response = await saveJob({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.apply_url,
        match_score: job.match_score,
      });

      if (response.success !== false) {
        setSavedJobIds(prev => new Set([...prev, job.id]));
      } else {
        console.error("Failed to save job:", response.message);
      }
    } catch (error) {
      console.error("❌ Failed to save job:", error);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      const response = await unsaveJob(jobId);

      if (response.success !== false) {
        setSavedJobIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      }
    } catch (error) {
      console.error("❌ Failed to unsave job:", error);
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  /* ============================= */
  /* Render                        */
  /* ============================= */

  return (
    <div className="jobs-container">
      {/* Sidebar */}
      <div className="jobs-sidebar">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="jobs-main-area">
        {/* Header */}
        <div className="jobs-page-header">
          <TopHeader title="Find your next role" hideGreeting />
        </div>

        {/* Recommended Jobs Button */}
        <div style={{ padding: "0 24px", marginBottom: "16px" }}>
          <button
            onClick={handleLoadRecommended}
            className="btn-recommended"
            style={{
              padding: "8px 16px",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            ✨ Get Recommended Jobs
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            margin: "0 24px 16px",
            padding: "12px 16px",
            background: "#fee2e2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            color: "#991b1b",
            fontSize: "14px",
          }}>
            {error}
          </div>
        )}

        <div className="jobs-content-grid">
          {/* Mobile overlay */}
          {showMobileFilters && (
            <div
              className="mobile-filter-overlay"
              onClick={() => setShowMobileFilters(false)}
            />
          )}

          {/* Filters (LEFT PANEL) */}
          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearchJobs}
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
          />

          {/* Job Feed (MIDDLE PANEL) */}
          <JobFeed
            jobs={jobs}
            loading={loading}
            selectedJob={selectedJob}
            onSelectJob={handleSelectJob}
            onToggleFilters={() => setShowMobileFilters(true)}
            savedJobIds={savedJobIds}
            onSaveJob={handleSaveJob}
            onUnsaveJob={handleUnsaveJob}
          />

          {/* Job Details (RIGHT PANEL) */}
          <JobDetails
            job={selectedJob}
            isVisible={showJobDetails}
            onClose={() => setShowJobDetails(false)}
            isSaved={selectedJob ? savedJobIds.has(selectedJob.id) : false}
            onSaveJob={handleSaveJob}
            onUnsaveJob={handleUnsaveJob}
          />
        </div>
      </div>
    </div>
  );
};

export default Jobs;