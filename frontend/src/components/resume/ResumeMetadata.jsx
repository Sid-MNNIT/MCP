import React from "react";

const ResumeMetadata = ({ metadataData }) => {
  if (!metadataData) {
    return (
      <div className="resume-column">
        <div className="resume-card">
          <div className="resume-card-header"><h3>Key Insights</h3></div>
          <div className="empty-message">
            <div className="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p>Key insights will appear here after analysis</p>
          </div>
        </div>
      </div>
    );
  }

  // server sends full parsed_resume: { entities: {...}, sections: {...} }
  const entities = metadataData.entities || {};
  const skills    = entities.skills    || [];
  const companies = entities.companies || [];
  const roles     = entities.roles     || [];
  const expYears  = entities.experience_years  ?? 0;
  const expMonths = entities.experience_months ?? 0;

  // format experience display: "2yr 3mo" or "3mo" or "0mo"
  const expDisplay =
    expYears > 0
      ? `${expYears}yr ${expMonths > 0 ? `${expMonths}mo` : ""}`.trim()
      : `${expMonths}mo`;

  return (
    <div className="resume-column">
      <div className="resume-card">
        <div className="resume-card-header"><h3>Key Insights</h3></div>

        <div className="metadata-content">
          <div className="metadata-stats">

            {/* Experience */}
            <div className="stat-box">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="stat-value">{expDisplay}</div>
              <div className="stat-label">Experience</div>
            </div>

            {/* Companies */}
            <div className="stat-box">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="stat-value">{companies.length}</div>
              <div className="stat-label">Companies</div>
            </div>

            {/* Skills */}
            <div className="stat-box">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="stat-value">{skills.length}</div>
              <div className="stat-label">Skills Listed</div>
            </div>

            {/* Roles detected — replaces certifications_count which server doesn't send */}
            <div className="stat-box">
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div className="stat-value">{roles.length}</div>
              <div className="stat-label">Roles Detected</div>
            </div>

          </div>

          {/* Top Skills */}
          {skills.length > 0 && (
            <div className="metadata-section">
              <h4>Top Skills</h4>
              <div className="skills-list">
                {skills.slice(0, 8).map((skill, i) => (
                  <span key={i} className="skill-item">{skill}</span>
                ))}
                {skills.length > 8 && (
                  <span className="skill-item skill-more">+{skills.length - 8} more</span>
                )}
              </div>
            </div>
          )}

          {/* Work History */}
          {companies.length > 0 && (
            <div className="metadata-section">
              <h4>Work History</h4>
              <div className="companies-list">
                {companies.map((company, i) => (
                  <div key={i} className="company-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    {company}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected Roles */}
          {roles.length > 0 && (
            <div className="metadata-section">
              <h4>Detected Roles</h4>
              <div className="skills-list">
                {roles.map((role, i) => (
                  <span key={i} className="skill-item">{role}</span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResumeMetadata;
