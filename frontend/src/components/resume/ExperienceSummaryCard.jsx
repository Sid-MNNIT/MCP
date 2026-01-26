import React, { useState } from 'react';

// Icons
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default function ExperienceSummaryCard({ summary, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="resume-card entity-card">
      <div className="card-header-action">
        <h3>Experience Summary</h3>
        <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <CheckIcon /> : <EditIcon />}
        </button>
      </div>
      <div className="field-single">
        {isEditing ? (
          <textarea 
            rows="4" 
            value={summary || ''}
            onChange={(e) => onUpdate(e.target.value)}
          />
        ) : (
          <p className="read-only-text">{summary || 'No summary available.'}</p>
        )}
      </div>
    </div>
  );
}