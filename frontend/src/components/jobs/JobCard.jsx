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

  // ============================================
  // HYBRID RECOMMENDATION FEATURES
  // ============================================

  // Match score - support both snake_case and camelCase
  const matchScore = job.match_score || job.matchScore;
  const matchReason = job.match_reason || job.matchReason;
  const matchedSkills = job.matched_skills || job.matchedSkills || [];
  
  const showMatchScore = matchScore && matchScore > 0;

  // Get match quality badge style based on score
  const getMatchBadgeStyle = (score) => {
    if (score >= 80) {
      return {
        background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
        color: "#166534",
        border: "1px solid #86efac",
        boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)"
      };
    }
    if (score >= 60) {
      return {
        background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        color: "#92400e",
        border: "1px solid #fcd34d",
        boxShadow: "0 2px 8px rgba(245, 158, 11, 0.2)"
      };
    }
    return {
      background: "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
      color: "#374151",
      border: "1px solid #9ca3af",
      boxShadow: "0 2px 8px rgba(107, 114, 128, 0.2)"
    };
  };

  return (
    <div
      className={`job-card ${isSelected ? "job-card-selected" : ""}`}
      onClick={onClick}
    >
      {/* Match Score Badge - Top Right Corner */}
      {showMatchScore && (
        <div 
          className="match-score-badge" 
          style={getMatchBadgeStyle(matchScore)}
        >
          <div className="match-percentage">{matchScore}%</div>
          <div className="match-label">Match</div>
        </div>
      )}

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

        {/* Match Reason - AI Generated Explanation */}
        {matchReason && (
          <div className="match-reason">
            <span className="match-icon">✨</span>
            <span className="match-text">{matchReason}</span>
          </div>
        )}

        {/* Matched Skills Tags */}
        {matchedSkills.length > 0 && (
          <div className="matched-skills">
            {matchedSkills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="skill-tag">
                {skill}
              </span>
            ))}
            {matchedSkills.length > 3 && (
              <span className="skill-tag skill-tag-more">
                +{matchedSkills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Job Metadata Badges */}
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
        </div>
      </div>

      {/* Card Footer Meta */}
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