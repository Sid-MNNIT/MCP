import React, { useState } from 'react';
import '../styles/jobs.css';
import Sidebar from '../components/layout/Sidebar';
import JobFilters from '../components/jobs/JobFilters';
import JobFeed from '../components/jobs/JobFeed';
import TopHeader from '../components/layout/TopHeader';

const Jobs = () => {
  const [filters, setFilters] = useState({
    keyword: '', location: '', category: '', type: 'Full-time', salary: 12, timeline: ''
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="jobs-container">
      {/* 1. Sidebar */}
      <div className="jobs-sidebar">
        <Sidebar />
      </div>

      {/* 2. Main Area */}
      <div className="jobs-main-area">
        {/* Added specific class to target this header in CSS */}
        <div className="jobs-page-header">
           <TopHeader title="Find your next role" hideGreeting={true} />
        </div>

        <div className="jobs-content-grid">
          
          {/* Mobile Overlay */}
          {showMobileFilters && (
            <div 
              className="mobile-filter-overlay" 
              onClick={() => setShowMobileFilters(false)}
            />
          )}

          {/* Filters */}
          <JobFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
          />

          {/* Feed */}
          <JobFeed 
            filters={filters} 
            onToggleFilters={() => setShowMobileFilters(true)}
          />
          
        </div>
      </div>
    </div>
  );
};

export default Jobs;