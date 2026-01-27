import React from 'react';
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;

export default function ExperienceSummaryCard({ summary, onEdit }) {
  return (
    <div className="resume-section">
      <div className="resume-section-header"><h3>Experience Summary</h3><button className="btn-icon-action" onClick={onEdit}><EditIcon /></button></div>
      <p className="profile-text">{summary || "No summary available."}</p>
    </div>
  );
}