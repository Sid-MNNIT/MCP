import React from "react";

// actual max points per breakdown key — must match ATS scorer weights
const BREAKDOWN_MAX = {
  skills:     40,
  roles:      20,
  experience: 20,
  structure:  10,
  companies:  10,
};

const ATSScore = ({ scoreData, uploadedFile, isCalculating, isLoadingResume, onCalculate }) => {
  const scoreColor = (s) => s >= 80 ? "#10b981" : s >= 60 ? "#f59e0b" : "#ef4444";
  const scoreLabel = (s) => s >= 80 ? "Excellent" : s >= 60 ? "Good" : "Needs Improvement";

  return (
    <div className="resume-column">
      <div className="resume-card">
        <div className="resume-card-header">
          <h3>ATS Score</h3>
          {scoreData && (
            <span className="score-badge" style={{ backgroundColor: scoreColor(scoreData.final_score) }}>
              {scoreLabel(scoreData.final_score)}
            </span>
          )}
        </div>

        {isLoadingResume ? (
          <div className="empty-state-with-button">
            <div className="empty-message">
              <p>Loading score...</p>
            </div>
          </div>
        ) : scoreData?.final_score === undefined ? (
          <div className="empty-state-with-button">
            <div className="empty-message">
              <div className="empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <p>Upload a resume to calculate the ATS score</p>
            </div>
            {uploadedFile && (
              <button onClick={onCalculate} className="btn-calculate-center" disabled={isCalculating}>
                {isCalculating ? "Analyzing Resume..." : "Calculate ATS Score"}
              </button>
            )}
          </div>
        ) : (
          <div className="score-content">
            {/* main score circle */}
            <div className="score-main" style={{ borderColor: scoreColor(scoreData.final_score) }}>
              <div className="score-number" style={{ color: scoreColor(scoreData.final_score) }}>
                {scoreData.final_score}
              </div>
              <div className="score-label">out of 100</div>
            </div>

            {/* breakdown bars — uses actual max per key */}
            <div className="score-breakdown">
              <h4>Score Breakdown</h4>
              {Object.entries(scoreData.ats.breakdown).map(([key, value]) => {
                const max        = BREAKDOWN_MAX[key] ?? 20;
                const percentage = Math.min((value / max) * 100, 100);
                const color      = percentage >= 75 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444";
                return (
                  <div key={key} className="breakdown-row">
                    <span className="breakdown-key">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <div className="breakdown-bar">
                      <div className="breakdown-fill" style={{ width: `${percentage}%`, backgroundColor: color }} />
                    </div>
                    <span className="breakdown-value">{value}/{max}</span>
                  </div>
                );
              })}
            </div>

            {/* flags */}
            {scoreData.ats.flags && scoreData.ats.flags.length > 0 && (
              <div className="feedback-section">
                <h4>Flags</h4>
                {scoreData.ats.flags.map((flag, i) => (
                  <div key={i} className="feedback-item feedback-warning">
                    <span className="feedback-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </span>
                    {/* convert snake_case flag to readable label */}
                    <span className="feedback-text">
                      {flag.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* llm_feedback — server sends plain strings */}
            {scoreData.llm_feedback && scoreData.llm_feedback.length > 0 && (
              <div className="feedback-section">
                <h4>Suggestions</h4>
                {scoreData.llm_feedback.map((text, i) => (
                  <div key={i} className="feedback-item feedback-warning">
                    <span className="feedback-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </span>
                    <span className="feedback-text">{typeof text === "string" ? text : text?.text ?? ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSScore;
