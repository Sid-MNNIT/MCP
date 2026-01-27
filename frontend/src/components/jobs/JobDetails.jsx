import React from "react";

const JobDetails = ({
  job,
  isVisible,
  onClose,
  isSaved,
  onSaveJob,
  onUnsaveJob,
}) => {
  if (!job) {
    return (
      <div className={`job-details-panel ${isVisible ? "visible" : ""}`}>
        <div className="job-details-empty">
          <p>Select a job to view details</p>
        </div>
      </div>
    );
  }

  // =========================
  // Salary Formatting
  // =========================
  const formatSalary = (amount) => {
    if (!amount) return null;
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const salaryRange =
    job.salary_min || job.salary_max
      ? `${formatSalary(job.salary_min) || "Not disclosed"} - ${
          formatSalary(job.salary_max) || "Not disclosed"
        }`
      : "Not disclosed";

  // =========================
  // Description Cleaning
  // =========================
  const cleanDescription = (html) => {
    if (!html) return "No description available";

    const text = html.replace(/<[^>]*>/g, " ");
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;

    return textarea.value.replace(/\s+/g, " ").trim();
  };

  const description = cleanDescription(job.description);

  // =========================
  // Match / Recommendation
  // =========================
  const matchScore = job.match_score || job.matchScore;
  const matchReason = job.match_reason || job.matchReason;
  const matchedSkills = job.matched_skills || job.matchedSkills || [];

  const getMatchQuality = (score) => {
    if (!score) return null;
    if (score >= 80) return { label: "Excellent Match", color: "#10b981" };
    if (score >= 60) return { label: "Good Match", color: "#f59e0b" };
    return { label: "Potential Match", color: "#6b7280" };
  };

  const matchQuality = getMatchQuality(matchScore);

  return (
    <div className={`job-details-panel ${isVisible ? "visible" : ""}`}>
      {/* Close Button (Mobile) */}
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

        {/* Actions */}
        <div className="job-details-actions">
          <button
            className={`btn-save-large ${
              isSaved ? "btn-save-active" : ""
            }`}
            onClick={() =>
              isSaved ? onUnsaveJob(job.id) : onSaveJob(job)
            }
          >
            {isSaved ? "❤️ Saved" : "♡ Save Job"}
          </button>

          {job.apply_url && (
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-apply"
            >
              Apply Now →
            </a>
          )}
        </div>
      </div>

      {/* ========================= */}
      {/* Match Score Card */}
      {/* ========================= */}
      {(matchScore || matchReason || matchedSkills.length > 0) && (
        <div
          className="match-score-card"
          style={{ borderColor: matchQuality?.color || "#e5e7eb" }}
        >
          {matchScore && matchQuality && (
            <div className="match-score-display">
              <div
                className="match-score-large"
                style={{ color: matchQuality.color }}
              >
                {matchScore}%
              </div>
              <div
                className="match-quality-label"
                style={{ color: matchQuality.color }}
              >
                {matchQuality.label}
              </div>
            </div>
          )}

          {matchReason && (
            <div className="match-explanation">
              <div className="explanation-icon">✨</div>
              <div>
                <strong>Why this matches:</strong>
                <p>{matchReason}</p>
              </div>
            </div>
          )}

          {matchedSkills.length > 0 && (
            <div className="matched-skills-section">
              <strong>Your matching skills:</strong>
              <div className="skill-tags-large">
                {matchedSkills.map((skill, idx) => (
                  <span key={idx} className="skill-tag-large">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Job Info */}
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
      </div>

      {/* Description */}
      <div className="job-description-section">
        <h3 className="section-title">Job Description</h3>
        <div className="job-description-content">
          {description.split("\n\n").map((paragraph, index) => (
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