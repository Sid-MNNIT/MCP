import React, { useMemo } from "react";
import JobCard from "./JobCard";

const JobFeed = ({
  jobs = [],
  loading,
  selectedJob,
  onSelectJob,
  onToggleFilters,
  savedJobIds,
  onSaveJob,
  onUnsaveJob,
}) => {
  // ============================================
  // NEW: Check if jobs have match scores
  // ============================================
  const hasMatchScores = useMemo(() => {
    return jobs.some(job => job.match_score || job.matchScore);
  }, [jobs]);

  // ============================================
  // NEW: Sort jobs by match score if available
  // ============================================
  const sortedJobs = useMemo(() => {
    if (hasMatchScores) {
      return [...jobs].sort((a, b) => {
        const scoreA = a.match_score || a.matchScore || 0;
        const scoreB = b.match_score || b.matchScore || 0;
        return scoreB - scoreA;
      });
    }
    return jobs;
  }, [jobs, hasMatchScores]);

  return (
    <div className="jobs-feed-col">
      {/* Header */}
      <div className="jobs-feed-header">
        <div className="feed-title-wrapper">
          <div className="feed-count">
            {loading ? (
              "Searching jobs..."
            ) : (
              <>
                Showing <span>{jobs.length}</span> job{jobs.length !== 1 ? 's' : ''}
                {/* NEW: Show recommendation indicator */}
                {hasMatchScores && (
                  <span className="recommendation-indicator">🎯 Personalized</span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="feed-actions">
          {/* Mobile Filter Trigger */}
          <button
            className="btn-filter-trigger"
            onClick={onToggleFilters}
            title="Open Filters"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="20"
              height="20"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Job List */}
      <div className="jobs-scroll-area">
        {loading ? (
          <div className="jobs-empty-state">
            <div className="spinner"></div>
            <h3>Loading jobs...</h3>
            <p>Please wait while we search for the best opportunities</p>
          </div>
        ) : sortedJobs.length > 0 ? (
          sortedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={selectedJob?.id === job.id}
              isSaved={savedJobIds?.has(job.id)}
              onClick={() => onSelectJob(job)}
              onSave={() => onSaveJob(job)}
              onUnsave={() => onUnsaveJob(job.id)}
            />
          ))
        ) : (
          <div className="jobs-empty-state">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="64"
              height="64"
              style={{ marginBottom: "16px", opacity: 0.5 }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h3>No jobs found</h3>
            <p>Try adjusting your filters or search with different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobFeed;