import React, { useState } from 'react';

// Icons
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default function PersonalInfoCard({ data, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  // We only display these specific fields from the 'personal' object
  const fields = ['name', 'email', 'phone', 'linkedin'];

  return (
    <div className="resume-card entity-card">
      <div className="card-header-action">
        <h3>Personal Info</h3>
        <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <CheckIcon /> : <EditIcon />}
        </button>
      </div>
      <div className="fields-grid">
        {fields.map((field) => (
          <div key={field} className="field-group">
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            {isEditing ? (
              <input 
                value={data[field] || ''} 
                onChange={(e) => onUpdate(field, e.target.value)}
              />
            ) : (
              <div className="read-only">{data[field] || '—'}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}