import React from "react";

const JobCard = ({ job, isSelected, isSaved, onClick, onSave, onUnsave }) => {
  // Company initial for logo
  const companyInitial = job.company?.charAt(0)?.toUpperCase() || "?";

  // Format salary
  const formatSalary = (amount) => {
    if (!amount) return null;
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const salaryText =
    job.salary_min || job.salary_max
      ? `${formatSalary(job.salary_min) || "?"} - ${formatSalary(job.salary_max) || "?"}`
      : "Salary not disclosed";

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return "Recently";
    }
  };

  const postedText = formatDate(job.created);

  // Match score badge
  const showMatchScore = job.match_score && job.match_score > 0;

  return (
    <div
      className={`job-card ${isSelected ? "job-card-selected" : ""}`}
      onClick={onClick}
    >
      {/* Company Logo */}
      <div className="company-logo">{companyInitial}</div>

      {/* Job Info */}
      <div className="job-details">
        <div className="job-role">{job.title}</div>

        <div className="job-company-loc">
          {job.company}
          <span className="dot-sep">•</span>
          {job.location}
        </div>

        <div className="job-badges">
          <span className="badge badge-salary">{salaryText}</span>

          {job.contract_type && (
            <span className="badge badge-type">
              {job.contract_type.replace("_", " ")}
            </span>
          )}

          {job.contract_time && (
            <span className="badge badge-time">
              {job.contract_time}
            </span>
          )}

          {showMatchScore && (
            <span
              className="badge badge-match"
              style={{
                background: job.match_score >= 7 ? "#dcfce7" : "#fef3c7",
                color: job.match_score >= 7 ? "#166534" : "#92400e",
              }}
            >
              {job.match_score}% Match
            </span>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="job-card-meta">
        {/* Save/Unsave Button */}
        <button
          className={`btn-save ${isSaved ? "btn-save-active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (isSaved) {
              onUnsave();
            } else {
              onSave();
            }
          }}
          title={isSaved ? "Unsave job" : "Save job"}
        >
          {isSaved ? "❤️" : "♡"}
        </button>

        <span className="posted-time">{postedText}</span>
      </div>
    </div>
  );
};

export default JobCard;