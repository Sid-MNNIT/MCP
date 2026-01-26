import React from 'react';

export default function ExtractedMetadataCard({ experienceYears, companies }) {
  return (
    <div className="resume-card entity-card">
      <div className="card-header-action">
        <h3>Extracted Metadata</h3>
      </div>
      <div className="metadata-grid">
        <div className="meta-item">
            <span className="label">Total Experience</span>
            <span className="value">{experienceYears} Years</span>
        </div>
        <div className="meta-item">
            <span className="label">Companies Detected</span>
            <span className="value">
              {companies && companies.length > 0 ? companies.join(", ") : "None detected"}
            </span>
        </div>
      </div>
    </div>
  );
}