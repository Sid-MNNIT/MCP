import React from 'react';

export default function ExtractedMetadataCard({ experienceYears, companies }) {
  return (
    <div className="resume-section">
      <div className="resume-section-header"><h3>Extracted Metadata</h3></div>
      <div className="info-grid">
         <div className="info-item"><label>Experience Years</label><div>{experienceYears} Years</div></div>
         <div className="info-item"><label>Companies</label><div>{companies.join(", ")}</div></div>
      </div>
    </div>
  );
}