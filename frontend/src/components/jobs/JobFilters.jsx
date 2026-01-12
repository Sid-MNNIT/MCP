import React from 'react';

const JobFilters = ({ filters, onFilterChange, isOpen, onClose }) => {
  // ⚡️ SAFETY CHECK
  if (!filters) return null;

  const { type, salary } = filters;
  const isInternship = type === 'Internship';
  const minVal = isInternship ? 5 : 3;
  const maxVal = isInternship ? 100 : 50;
  const unit = isInternship ? 'K' : 'L';
  const salaryLabel = isInternship ? 'Stipend (₹/Mo)' : 'Min Salary (LPA)';

  const handleTypeSwitch = (e) => {
    const newType = e.target.value;
    onFilterChange('type', newType);
    if (newType === 'Internship') onFilterChange('salary', 15);
    else onFilterChange('salary', 12);
  };

  return (
    <div className={`jobs-filters-col ${isOpen ? 'mobile-open' : ''}`}>
      
      {/* Mobile Header */}
      <div className="mobile-filter-header">
        <span className="filter-title">Filter Jobs</span>
        <button className="btn-close-filters" onClick={onClose}>&times;</button>
      </div>

      <div className="filter-header">
        <div className="filter-title" style={{ display: isOpen ? 'none' : 'block' }}>Filter Jobs</div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Keywords</label>
        <input type="text" className="job-input" placeholder="e.g. React, Python" onChange={(e) => onFilterChange('keyword', e.target.value)} />
      </div>

      <div className="filter-group">
        <label className="filter-label">Location</label>
        <input type="text" className="job-input" placeholder="e.g. Bangalore" onChange={(e) => onFilterChange('location', e.target.value)} />
      </div>

      <div className="filter-group">
        <label className="filter-label">Job Category</label>
        <select className="job-select" onChange={(e) => onFilterChange('category', e.target.value)}>
          <option value="">All Categories</option>
          <option value="IT">IT & Software</option>
          <option value="Finance">Accounting & Finance</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Sales & Marketing</option>
          <option value="HR">HR & Recruitment</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Job Type</label>
        <select className="job-select" value={type} onChange={handleTypeSwitch}>
          <option value="Full-time">Full-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">{salaryLabel}</label>
        <div className="salary-slider-container">
          <div className="salary-values">
            <span>₹{minVal}{unit}</span>
            <span>₹{salary}{unit}</span>
            <span>₹{maxVal}{unit}+</span>
          </div>
          <input type="range" min={minVal} max={maxVal} value={salary} onChange={(e) => onFilterChange('salary', Number(e.target.value))} className="range-slider" />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">{isInternship ? 'Duration' : 'Notice Period'}</label>
        <select className="job-select" onChange={(e) => onFilterChange('timeline', e.target.value)}>
           {isInternship ? (
             <>
               <option value="">Any</option>
               <option value="3 Months">3 Months</option>
               <option value="6 Months">6 Months</option>
             </>
           ) : (
             <>
               <option value="">Any</option>
               <option value="Immediate">Immediate</option>
               <option value="15 Days">15 Days</option>
               <option value="30 Days">30 Days</option>
             </>
           )}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Sort By</label>
        <select className="job-select">
          <option>Relevance</option>
          <option>Date (Newest)</option>
          <option>Salary (High to Low)</option>
        </select>
      </div>

      <button className="btn-search-jobs" onClick={onClose}>Apply Filters</button>
    </div>
  );
};

export default JobFilters;