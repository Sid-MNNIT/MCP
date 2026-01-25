import React from "react";

const JobDetails = ({ job, isVisible, onClose, isSaved, onSaveJob, onUnsaveJob }) => {
  if (!job) {
    return (
      <div className={`job-details-panel ${isVisible ? "visible" : ""}`}>
        <div className="job-details-empty">
          <p>Select a job to view details</p>
        </div>
      </div>
    );
  }

  // Format salary
  const formatSalary = (amount) => {
    if (!amount) return null;
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const salaryRange =
    job.salary_min || job.salary_max
      ? `${formatSalary(job.salary_min) || "Not disclosed"} - ${formatSalary(job.salary_max) || "Not disclosed"}`
      : "Not disclosed";

  // Clean and format description
  const cleanDescription = (html) => {
    if (!html) return "No description available";
    
    // Remove HTML tags
    const text = html.replace(/<[^>]*>/g, " ");
    
    // Decode HTML entities
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    const decoded = textarea.value;
    
    // Clean up whitespace
    return decoded.replace(/\s+/g, " ").trim();
  };

  const description = cleanDescription(job.description);

  return (
    <div className={`job-details-panel ${isVisible ? "visible" : ""}`}>
      {/* Mobile Close Button */}
      <button className="btn-close-details" onClick={onClose}>
        ✕
      </button>

      {/* Header */}
      <div className="job-details-header">
        <div className="job-details-company">
          <div className="company-logo-large">
            {job.company?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <h2 className="job-details-title">{job.title}</h2>
            <p className="job-details-company-name">{job.company}</p>
            <p className="job-details-location">📍 {job.location}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="job-details-actions">
          <button
            className={`btn-save-large ${isSaved ? "btn-save-active" : ""}`}
            onClick={() => {
              if (isSaved) {
                onUnsaveJob(job.id);
              } else {
                onSaveJob(job);
              }
            }}
          >
            {isSaved ? "❤️ Saved" : "♡ Save Job"}
          </button>

          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-apply"
          >
            Apply Now →
          </a>
        </div>
      </div>

      {/* Job Info Grid */}
      <div className="job-info-grid">
        <div className="job-info-item">
          <span className="job-info-label">Salary Range</span>
          <span className="job-info-value">{salaryRange}</span>
        </div>

        {job.contract_type && (
          <div className="job-info-item">
            <span className="job-info-label">Employment Type</span>
            <span className="job-info-value">{job.contract_type}</span>
          </div>
        )}

        {job.contract_time && (
          <div className="job-info-item">
            <span className="job-info-label">Work Schedule</span>
            <span className="job-info-value">{job.contract_time}</span>
          </div>
        )}

        {job.category && (
          <div className="job-info-item">
            <span className="job-info-label">Category</span>
            <span className="job-info-value">{job.category}</span>
          </div>
        )}

        {job.match_score && (
          <div className="job-info-item">
            <span className="job-info-label">Match Score</span>
            <span className="job-info-value">
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "6px",
                  background: job.match_score >= 70 ? "#dcfce7" : "#fef3c7",
                  color: job.match_score >= 70 ? "#166534" : "#92400e",
                  fontWeight: "600",
                }}
              >
                {job.match_score}%
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="job-description-section">
        <h3 className="section-title">Job Description</h3>
        <div className="job-description-content">
          {description.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Source */}
      <div className="job-source">
        <small>Source: {job.source || "Adzuna"}</small>
      </div>
    </div>
  );
};

export default JobDetails;