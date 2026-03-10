import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/jobs.css";

import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";
import JobFilters from "../components/jobs/JobFilters";
import JobFeed from "../components/jobs/JobFeed";
import JobDetails from "../components/jobs/JobDetails";

import { searchJobs, getRecommendedJobs, saveJob, unsaveJob, getSavedJobs } from "../utils/api";
import { useCurrentUser } from "../hooks/useCurrentUser";

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  /* ============================= */
  /* Filters (BACKEND CONTRACT)    */
  /* ============================= */
  const [filters, setFilters] = useState({
    keywords: searchParams.get("keywords") || "",
    location: searchParams.get("location") || "",
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
  const fullName = useCurrentUser();

  /* ============================= */
  /* Load Saved Jobs on Mount      */
  /* ============================= */
  useEffect(() => {
    loadSavedJobs();
    
    // If there are search params on mount, auto-search
    if (searchParams.get("keywords")) {
      handleSearchJobs();
    }
  }, []);

  /* ============================= */
  /* Keyboard Shortcuts            */
  /* ============================= */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC to close job details
      if (e.key === "Escape" && showJobDetails) {
        setShowJobDetails(false);
      }
      
      // Arrow keys to navigate jobs
      if (selectedJob && jobs.length > 0) {
        const currentIndex = jobs.findIndex(job => job.id === selectedJob.id);
        
        if (e.key === "ArrowDown" && currentIndex < jobs.length - 1) {
          e.preventDefault();
          handleSelectJob(jobs[currentIndex + 1]);
        }
        
        if (e.key === "ArrowUp" && currentIndex > 0) {
          e.preventDefault();
          handleSelectJob(jobs[currentIndex - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedJob, jobs, showJobDetails]);

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

      // Update URL with search params
      setSearchParams({
        keywords: filters.keywords,
        ...(filters.location && { location: filters.location }),
      });

      const response = await searchJobs({
        keywords: filters.keywords,
        location: filters.location,
        country: "in",
        maxResults: 20,
        page: 1,
      });

      console.log("Search response:", response);

      if (response.success === false) {
        throw new Error(response.message || "Failed to search jobs");
      }

      const jobList = response.data?.jobs || [];

      setJobs(jobList);
      if (jobList.length > 0) {
        setSelectedJob(jobList[0]);
        setShowJobDetails(true);
      } else {
        setSelectedJob(null);
        setShowJobDetails(false);
      }
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
      if (jobList.length > 0) {
        setSelectedJob(jobList[0]);
        setShowJobDetails(true);
      } else {
        setSelectedJob(null);
        setShowJobDetails(false);
      }
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
        
        // Show success feedback (optional)
        console.log("✅ Job saved successfully");
      } else {
        console.error("Failed to save job:", response.message);
      }
    } catch (error) {
      console.error("❌ Failed to save job:", error);
      setError("Failed to save job. Please try again.");
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
        
        console.log("✅ Job unsaved successfully");
      }
    } catch (error) {
      console.error("❌ Failed to unsave job:", error);
      setError("Failed to unsave job. Please try again.");
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
    
    // Optional: Update URL with job ID for sharing
    // setSearchParams({ ...Object.fromEntries(searchParams), jobId: job.id });
  };

  const handleCloseDetails = () => {
    setShowJobDetails(false);
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
          <TopHeader title="Find your next role" hideGreeting fullName={fullName} />
        </div>

        {/* Recommended Jobs Button */}
        <div style={{ padding: "0 24px", marginBottom: "20px" }}>
          <button
            onClick={handleLoadRecommended}
            className="btn-recommended"
          >
            ✨ Get Recommended Jobs
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            margin: "0 24px 20px",
            padding: "14px 18px",
            background: "#fee2e2",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            color: "#991b1b",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <span>⚠️</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: "#991b1b",
                cursor: "pointer",
                fontSize: "18px",
                padding: "0 4px",
              }}
            >
              ✕
            </button>
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
            onClose={handleCloseDetails}
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
