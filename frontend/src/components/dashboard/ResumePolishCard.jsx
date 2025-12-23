import polishIllustration from "../../assets/polish-resume.png";

export default function ResumePolishCard({
  resumeScore = 68,
  atsScore = "Good",
  impactScore = "Moderate",
  skillAlignment = "High",
  focusAreas = [
    "Improve quantified impact in experience",
    "Reorder skills for ATS relevance",
    "Add measurable outcomes to projects",
  ],
  lastAnalyzed = "yesterday",
}) {
  return (
    <div className="card polish-card">
      {/* HEADER */}
      <div className="polish-header">
        <img
          src={polishIllustration}
          alt="Resume illustration"
          className="polish-illustration"
        />

        <div className="polish-header-text">
          <h3>Polish your resume</h3>
          <p className="polish-sub">
            Strengthen your resume for better shortlisting
          </p>
          <span className="polish-score">
            Resume Score <strong>{resumeScore}/100</strong>
          </span>
        </div>
      </div>

      <div className="polish-divider" />

      {/* SUMMARY */}
      <div className="polish-summary">
        <div>
          <span className="label">ATS Readiness</span>
          <strong>{atsScore}</strong>
        </div>
        <div>
          <span className="label">Impact</span>
          <strong>{impactScore}</strong>
        </div>
        <div>
          <span className="label">Skill Match</span>
          <strong>{skillAlignment}</strong>
        </div>
      </div>

      <div className="polish-divider" />

      {/* FOCUS AREAS */}
      <div className="polish-focus">
        <span className="focus-title">Focus areas</span>
        <ul>
          {focusAreas.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button className="btn-primary polish-cta">
        Improve Resume
      </button>

      <span className="polish-meta">
        Last analyzed {lastAnalyzed}
      </span>
    </div>
  );
}
