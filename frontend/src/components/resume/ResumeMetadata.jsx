import React from "react";

// ─── SVG icon helpers ──────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const CompanyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const RoleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const ProjectIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const EducationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

// ─── Stat box ───────────────────────────────────────────────────────────────
const StatBox = ({ icon, value, label }) => (
  <div className="stat-box">
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

// ─── Count words/lines in a section string (rough project count proxy) ────────
const countProjects = (text = "") => {
  // count non-empty lines that look like project headings (start with capital or digit)
  const lines = text.split("\n").filter((l) => /^[A-Z0-9]/.test(l.trim()));
  return lines.length || (text.trim() ? 1 : 0);
};

// ─── Profile detection (mirrors ats_scorer.py logic, client-side) ────────────
const detectProfile = (entities, sections) => {
  const totalMonths   = entities.total_months ?? 0;
  const hasEducation  = !!(sections?.education?.trim());
  const hasProjects   = !!(sections?.projects?.trim());
  const seniority     = entities.seniority ?? [];
  if (totalMonths < 12 && hasEducation && hasProjects) return "student";
  if (totalMonths < 6  && (seniority.includes("intern") || seniority.includes("trainee")))
    return "student";
  if (totalMonths < 24) return "early_career";
  return "professional";
};

// ─── Component ───────────────────────────────────────────────────────────────
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

  const entities  = metadataData.entities  || {};
  const sections  = metadataData.sections  || {};
  const profile   = detectProfile(entities, sections);

  const skills    = entities.skills    || [];
  const companies = entities.companies || [];
  const roles     = entities.roles     || [];
  const expYears  = entities.experience_years  ?? 0;
  const expMonths = entities.experience_months ?? 0;

  const expDisplay =
    expYears > 0
      ? `${expYears}yr${expMonths > 0 ? ` ${expMonths}mo` : ""}`.trim()
      : `${expMonths}mo`;

  const projectCount  = countProjects(sections.projects);
  const hasEducation  = !!(sections.education?.trim());
  const hasProjects   = !!(sections.projects?.trim());
  const hasAchiev     = !!(sections.achievements?.trim());
  const hasCerts      = !!(sections.certifications?.trim());

  const isStudent     = profile === "student";
  const isEarly       = profile === "early_career";

  return (
    <div className="resume-column">
      <div className="resume-card">
        <div className="resume-card-header"><h3>Key Insights</h3></div>

        <div className="metadata-content">

          {/* ── STAT BOXES ── */}
          <div className="metadata-stats">
            {isStudent ? (
              // Student: Projects | Education | Skills | Roles
              <>
                <StatBox
                  icon={<ProjectIcon />}
                  value={hasProjects ? projectCount || "✓" : "0"}
                  label="Projects"
                />
                <StatBox
                  icon={<EducationIcon />}
                  value={hasEducation ? "✓" : "–"}
                  label="Education"
                />
                <StatBox icon={<StarIcon />}    value={skills.length}    label="Skills" />
                <StatBox icon={<RoleIcon />}    value={roles.length}     label="Roles" />
              </>
            ) : isEarly ? (
              // Early career: Experience | Companies | Skills | Roles
              <>
                <StatBox icon={<CalendarIcon />} value={expDisplay}       label="Experience" />
                <StatBox icon={<CompanyIcon />}  value={companies.length} label="Companies" />
                <StatBox icon={<StarIcon />}     value={skills.length}    label="Skills" />
                <StatBox icon={<RoleIcon />}     value={roles.length}     label="Roles" />
              </>
            ) : (
              // Professional: Experience | Companies | Skills | Roles
              <>
                <StatBox icon={<CalendarIcon />} value={expDisplay}       label="Experience" />
                <StatBox icon={<CompanyIcon />}  value={companies.length} label="Companies" />
                <StatBox icon={<StarIcon />}     value={skills.length}    label="Skills Listed" />
                <StatBox icon={<RoleIcon />}     value={roles.length}     label="Roles Detected" />
              </>
            )}
          </div>

          {/* ── TOP SKILLS (all profiles) ── */}
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

          {/* ── PROJECTS (student / early career primary signal) ── */}
          {(isStudent || isEarly) && hasProjects && (
            <div className="metadata-section">
              <h4>Projects</h4>
              <div className="projects-preview">
                {sections.projects
                  .split("\n")
                  .map((l) => l.trim())
                  .filter((l) => l && /^[A-Z0-9'"\[{]/.test(l))
                  .map((l) => {
                    // strip leading JSON artifacts like {'ProjectName': or [' and trailing ': '
                    const cleaned = l
                      .replace(/^[{\['"`]+/, "")
                      .replace(/[}\]'"`]+$/, "")
                      .replace(/^'?([^':]+)'?:\s*.*$/, "$1") // key: value → just key
                      .replace(/^\s*['"]{1}/, "")
                      .trim();
                    return cleaned;
                  })
                  .filter((l) => l.length > 1)
                  .slice(0, 5)
                  .map((name, i) => (
                    <div key={i} className="project-line">
                      <span className="project-bullet" />
                      <span className="project-name">{name}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ── EDUCATION (student primary, others if present) ── */}
          {hasEducation && (
            <div className="metadata-section">
              <h4>Education</h4>
              <div className="education-preview">
                {sections.education
                  .split("\n")
                  .map((l) => l.trim())
                  .filter((l) => l)
                  .map((l) => {
                    // extract institution name — usually the longest capitalized token
                    // strip JSON artifacts
                    const cleaned = l
                      .replace(/^[{\['"`]+/, "")
                      .replace(/[}\]'"`]+$/, "")
                      .replace(/^'?([^':]+)'?:\s*.*$/, "$1")
                      .trim();
                    return cleaned;
                  })
                  .filter((l) => l.length > 2)
                  .slice(0, 3)
                  .map((line, i) => (
                    <div key={i} className="education-line">{line}</div>
                  ))}
              </div>
            </div>
          )}

          {/* ── WORK HISTORY (early career + professional) ── */}
          {!isStudent && companies.length > 0 && (
            <div className="metadata-section">
              <h4>Work History</h4>
              <div className="companies-list">
                {companies.map((company, i) => (
                  <div key={i} className="company-item">
                    <BuildingIcon />
                    {company}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── INTERNSHIPS (student — show companies as internships) ── */}
          {isStudent && companies.length > 0 && (
            <div className="metadata-section">
              <h4>Internships</h4>
              <div className="companies-list">
                {companies.map((company, i) => (
                  <div key={i} className="company-item">
                    <BuildingIcon />
                    {company}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DETECTED ROLES ── */}
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

          {/* ── ACHIEVEMENTS (student — hackathons, scholarships) ── */}
          {(isStudent || isEarly) && hasAchiev && (
            <div className="metadata-section">
              <h4>Achievements</h4>
              <div className="projects-preview">
                {sections.achievements
                  .split("\n")
                  .map((l) => l.trim())
                  .filter((l) => l)
                  .map((l) =>
                    l.replace(/^[{\['"`]+/, "")
                     .replace(/[}\]'"`]+$/, "")
                     .replace(/^'?([^':]+)'?:\s*.*$/, "$1")
                     .trim()
                  )
                  .filter((l) => l.length > 2)
                  .slice(0, 3)
                  .map((line, i) => (
                    <div key={i} className="project-line">
                      <span className="project-bullet" />
                      <span className="project-name">{line}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ── CERTIFICATIONS (student — show initiative) ── */}
          {(isStudent || isEarly) && hasCerts && (
            <div className="metadata-section">
              <h4>Certifications</h4>
              <div className="education-preview">
                {sections.certifications
                  .split("\n")
                  .filter((l) => l.trim())
                  .slice(0, 3)
                  .map((line, i) => (
                    <div key={i} className="education-line">{line.trim()}</div>
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
