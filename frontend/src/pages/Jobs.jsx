import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/jobs.css";

import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";
import JobFilters from "../components/jobs/JobFilters";
import JobFeed from "../components/jobs/JobFeed";
import JobDetails from "../components/jobs/JobDetails";

import { searchJobs, getRecommendedJobs, saveJob, unsaveJob, getSavedJobs } from "../utils/api";

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keywords: searchParams.get("keywords") || "",
    location: searchParams.get("location") || "",
    category: "",
    jobType: "full_time",
    minSalary: "",
    maxSalary: "",
    sortBy: "relevance",
  });

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);

  // Sorting Logic
  const getSortedJobs = () => {
    if (!jobs) return [];
    return [...jobs].sort((a, b) => {
      if (filters.sortBy === 'salary') {
        const salA = a.salary_max || 0;
        const salB = b.salary_max || 0;
        if (salA === 0 && salB > 0) return 1;
        if (salB === 0 && salA > 0) return -1;
        return salB - salA;
      }
      if (filters.sortBy === 'date') {
        return new Date(b.created || 0) - new Date(a.created || 0);
      }
      return 0;
    });
  };

  const sortedJobs = getSortedJobs();

  useEffect(() => {
    loadSavedJobs();
    if (searchParams.get("keywords")) {
      handleSearchJobs();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showJobDetails) {
        handleCloseDetails();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showJobDetails]);

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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchJobs = async () => {
    if (!filters.keywords.trim()) {
      setError("Please enter keywords to search");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setShowJobDetails(false);
      setSelectedJob(null);

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

      if (response.success === false) throw new Error(response.message);
      setJobs(response.data?.jobs || []);
    } catch (error) {
      setError(error.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadRecommended = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowJobDetails(false);
      setSelectedJob(null);

      const response = await getRecommendedJobs();
      if (response.success === false) throw new Error(response.message);
      setJobs(response.data?.jobs || []);
    } catch (error) {
      setError("Failed to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (job) => {
    const response = await saveJob({
        id: job.id, title: job.title, company: job.company, 
        location: job.location, url: job.apply_url, match_score: job.match_score 
    });
    if (response.success !== false) setSavedJobIds(prev => new Set([...prev, job.id]));
  };

  const handleUnsaveJob = async (jobId) => {
    const response = await unsaveJob(jobId);
    if (response.success !== false) {
      setSavedJobIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleCloseDetails = () => {
    setShowJobDetails(false);
    setTimeout(() => setSelectedJob(null), 300);
  };

  return (
    <div className="jobs-container">
      <div className="jobs-sidebar">
        <Sidebar />
      </div>

      <div className="jobs-main-area">
        <div className="jobs-page-header">
          <TopHeader title="Find your next role" hideGreeting />
        </div>

        <div style={{ padding: "0 24px", marginBottom: "20px" }}>
          <button onClick={handleLoadRecommended} className="btn-recommended">
            ✨ Get Recommended Jobs
          </button>
        </div>

        {error && (
          <div style={{ margin: "0 24px 20px", padding: "14px", background: "#fee2e2", color: "#991b1b", borderRadius: "12px" }}>
            {error} <button onClick={() => setError(null)} style={{ float: 'right', background:'none', border:'none' }}>✕</button>
          </div>
        )}

        <div className={`jobs-content-grid ${showJobDetails ? 'details-open' : ''}`}>
          
          {/* Mobile Filter Backdrop */}
          {showMobileFilters && (
            <div className="mobile-filter-overlay" onClick={() => setShowMobileFilters(false)} />
          )}

          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearchJobs}
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
          />

          <JobFeed
            jobs={sortedJobs}
            loading={loading}
            selectedJob={selectedJob}
            onSelectJob={handleSelectJob}
            onToggleFilters={() => setShowMobileFilters(true)}
            savedJobIds={savedJobIds}
            onSaveJob={handleSaveJob}
            onUnsaveJob={handleUnsaveJob}
            sortBy={filters.sortBy}
            onSortChange={(val) => handleFilterChange("sortBy", val)}
          />

          {/* FIX: DETAILS OVERLAY BACKDROP */}
          {/* Only rendered when details are open. CSS handles display logic (none on desktop, block on tablet) */}
          {showJobDetails && (
            <div className="details-overlay-backdrop" onClick={handleCloseDetails}></div>
          )}

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