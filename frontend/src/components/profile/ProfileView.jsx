import React from "react";

export default function ProfileView({ user, onEditExperience, onEditEducation }) {
  return (
    <div className="profile-view-grid">
      {/* Left Column */}
      <div className="profile-left-col">
        <div className="card profile-section">
          <h3>About Me</h3>
          <p className="profile-text">{user.about || "No bio added yet."}</p>
        </div>

        <div className="card profile-section">
          <h3>Socials</h3>
          <div className="social-links-col">
            {user.socials?.linkedin && <a href={`https://${user.socials.linkedin}`} target="_blank" rel="noreferrer" className="social-link-item">🔗 LinkedIn</a>}
            {user.socials?.github && <a href={`https://${user.socials.github}`} target="_blank" rel="noreferrer" className="social-link-item">🐙 GitHub</a>}
            {user.socials?.website && <a href={`https://${user.socials.website}`} target="_blank" rel="noreferrer" className="social-link-item">🌐 Portfolio</a>}
            {!user.socials?.linkedin && !user.socials?.github && !user.socials?.website && <span className="text-muted" style={{fontSize: '13px'}}>No social links added.</span>}
          </div>
        </div>

        <div className="card profile-section">
          <h3>Contact</h3>
          <div className="contact-row">
            <span className="icon">📧</span> {user.email}
          </div>
        </div>

        <div className="card profile-section">
          <h3>Skills</h3>
          <div className="skills-wrapper">
            {user.skills.length > 0 ? user.skills.map((skill, index) => (
              <span key={index} className="skill-pill">{skill}</span>
            )) : <span className="text-muted" style={{fontSize: '13px'}}>No skills added</span>}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="profile-right-col">
         
         {/* EXPERIENCE */}
         <div className="card profile-section">
          <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ border: 'none', padding: 0, margin: 0 }}>Experience</h3>
            <button className="btn-icon-add" onClick={() => onEditExperience(null)}>+ Add</button>
          </div>
          <div className="timeline">
            {user.experience.map((exp) => (
              <div key={exp.id} className="timeline-item group">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 className="timeline-role">{exp.role}</h4>
                    <button className="btn-icon-edit" onClick={() => onEditExperience(exp)}>✎</button>
                  </div>
                  <span className="timeline-company">{exp.company} • {exp.startDate} - {exp.endDate}</span>
                  <p className="timeline-desc">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EDUCATION */}
        <div className="card profile-section">
          <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ border: 'none', padding: 0, margin: 0 }}>Education</h3>
            <button className="btn-icon-add" onClick={() => onEditEducation(null)}>+ Add</button>
          </div>
          <div className="timeline">
            {user.education.map((edu) => (
              <div key={edu.id} className="timeline-item">
                 <div className="timeline-dot"></div>
                 <div className="timeline-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       {/* ✅ UPDATED DISPLAY LOGIC */}
                       <h4 className="timeline-role">
                         {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                       </h4>
                       <button className="btn-icon-edit" onClick={() => onEditEducation(edu)}>✎</button>
                    </div>
                    <span className="timeline-company">{edu.school} • {edu.year}</span>
                 </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}