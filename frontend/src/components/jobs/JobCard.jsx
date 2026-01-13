import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <div className="company-logo">{job.logo}</div>
      
      <div className="job-details">
        <div className="job-role">{job.title}</div>
        <div className="job-company-loc">
          {job.company}
          <span className="dot-sep"></span>
          {job.location}
        </div>
        
        <div className="job-badges">
          <span className="badge badge-salary">{job.salary}</span>
          <span className="badge badge-type">{job.type}</span>
          {job.isRemote && <span className="badge badge-remote">REMOTE</span>}
        </div>
      </div>

      <div className="job-card-meta">
        <button className="btn-save">♡</button>
        <span className="posted-time">{job.posted}</span>
      </div>
    </div>
  );
};

export default JobCard;