import React from 'react';
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;

export default function PersonalInfoCard({ data, onEdit }) {
  return (
    <div className="resume-section">
      <div className="resume-section-header"><h3>Personal Info</h3><button className="btn-icon-action" onClick={onEdit}><EditIcon /></button></div>
      <div className="info-grid">
        <div className="info-item"><label>Full Name</label><div>{data.name}</div></div>
        <div className="info-item"><label>Email</label><div>{data.email}</div></div>
        <div className="info-item"><label>Phone</label><div>{data.phone}</div></div>
        <div className="info-item"><label>LinkedIn</label><div>{data.linkedin}</div></div>
      </div>
    </div>
  );
}