import React from 'react';

// Icons
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;

export default function SkillsCloudCard({ skills }) {
  // Note: For now, this is visual only as requested, 
  // but set up to be expandable for add/remove logic later.
  
  return (
    <div className="resume-card entity-card">
      <div className="card-header-action">
        <h3>Skills Cloud</h3>
        <button className="edit-btn"><EditIcon /></button>
      </div>
      <div className="skills-wrapper">
        {skills && skills.map((skill, i) => (
          <span key={i} className="skill-pill">{skill}</span>
        ))}
        <button className="add-skill-btn">+ Add</button>
      </div>
    </div>
  );
}