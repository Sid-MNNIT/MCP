import React from "react";

const JobFilters = ({
  filters,
  onFilterChange,
  onSearch,
  isOpen,
  onClose,
}) => {
  if (!filters) return null;

  const {
    keywords,
    location,
    category,
    jobType,
    minSalary,
    maxSalary,
    sortBy,
  } = filters;

  return (
    <div className={`jobs-filters-col ${isOpen ? "mobile-open" : ""}`}>
      {/* Mobile Header */}
      <div className="mobile-filter-header">
        <span className="filter-title">Filter Jobs</span>
        <button className="btn-close-filters" onClick={onClose}>
          &times;
        </button>
      </div>

      {/* Desktop Header */}
      <div className="filter-header">
        <div
          className="filter-title"
          style={{ display: isOpen ? "none" : "block" }}
        >
          Filter Jobs
        </div>
      </div>

      {/* Keywords */}
      <div className="filter-group">
        <label className="filter-label">Keywords</label>
        <input
          type="text"
          className="job-input"
          placeholder="e.g. React, Python"
          value={keywords}
          onChange={(e) =>
            onFilterChange("keywords", e.target.value)
          }
        />
      </div>

      {/* Location */}
      <div className="filter-group">
        <label className="filter-label">Location</label>
        <input
          type="text"
          className="job-input"
          placeholder="e.g. Bangalore"
          value={location}
          onChange={(e) =>
            onFilterChange("location", e.target.value)
          }
        />
      </div>

      {/* Job Category (from backend categories later) */}
      <div className="filter-group">
        <label className="filter-label">Job Category</label>
        <select
          className="job-select"
          value={category}
          onChange={(e) =>
            onFilterChange("category", e.target.value)
          }
        >
          <option value="">All Categories</option>
          <option value="IT Jobs">IT & Software</option>
          <option value="Accounting & Finance Jobs">
            Accounting & Finance
          </option>
          <option value="Engineering Jobs">Engineering</option>
          <option value="Sales Jobs">Sales & Marketing</option>
          <option value="HR Jobs">HR & Recruitment</option>
        </select>
      </div>

      {/* Job Type */}
      <div className="filter-group">
        <label className="filter-label">Job Type</label>
        <select
          className="job-select"
          value={jobType}
          onChange={(e) =>
            onFilterChange("jobType", e.target.value)
          }
        >
          <option value="full_time">Full-time</option>
          <option value="part_time">Part-time</option>
          <option value="contract">Contract</option>
        </select>
      </div>

      {/* Salary Range */}
      <div className="filter-group">
        <label className="filter-label">Salary Range (₹)</label>
        <div className="salary-range-inputs">
          <input
            type="number"
            className="job-input"
            placeholder="Min"
            value={minSalary}
            onChange={(e) =>
              onFilterChange("minSalary", e.target.value)
            }
          />
          <input
            type="number"
            className="job-input"
            placeholder="Max"
            value={maxSalary}
            onChange={(e) =>
              onFilterChange("maxSalary", e.target.value)
            }
          />
        </div>
      </div>

      {/* Sort By */}
      <div className="filter-group">
        <label className="filter-label">Sort By</label>
        <select
          className="job-select"
          value={sortBy}
          onChange={(e) =>
            onFilterChange("sortBy", e.target.value)
          }
        >
          <option value="relevance">Relevance</option>
          <option value="date">Date (Newest)</option>
          <option value="salary">Salary (High to Low)</option>
        </select>
      </div>

      {/* Apply Button */}
      <button
        className="btn-search-jobs"
        onClick={() => {
          onSearch();
          if (isOpen) onClose();
        }}
      >
        Search Jobs
      </button>
    </div>
  );
};

export default JobFilters;
