import { Link } from "react-router-dom";

export default function RecruiterActivity({
  interviews = 3,
  rejections = 8,
  assessments = 2,
}) {
  return (
    <div className="card recruiter-activity compact-card">
      <h3>Recruiter Activity</h3>

      <div className="activity-row">
        <div className="activity-item">
          <span className="activity-label">Interviews</span>
          <strong className="activity-value">{interviews}</strong>
        </div>

        <div className="activity-item">
          <span className="activity-label">Rejections</span>
          <strong className="activity-value">{rejections}</strong>
        </div>

        <div className="activity-item">
          <span className="activity-label">Assessments</span>
          <strong className="activity-value">{assessments}</strong>
        </div>

        <Link to="/emails" className="activity-link">
          View Emails
        </Link>
      </div>
    </div>
  );
}
