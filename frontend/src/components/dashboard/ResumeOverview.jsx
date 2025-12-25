export default function ResumeOverview({
  skillsDetected = 45,
  experienceYears = 5,
  lastUpdated = "2 days ago",
}) {
  return (
    <div className="card resume-overview">
      <h3>Resume Overview</h3>

      <div className="meta-list compact">
        <div className="meta-row">
          <span className="meta-left">🧠 Skills detected</span>
          <span className="meta-value">{skillsDetected}</span>
        </div>

        <div className="meta-row">
          <span className="meta-left">💼 Experience</span>
          <span className="meta-value">{experienceYears} years</span>
        </div>

        <div className="meta-row">
          <span className="meta-left">🕒 Last updated</span>
          <span className="meta-value">{lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
