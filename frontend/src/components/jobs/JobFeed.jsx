import React, { useMemo } from 'react';
import JobCard from './JobCard';

// Mock Data (Keep your existing mock data here)
const MOCK_JOBS = [
  { id: 1, company: 'Zomato', logo: 'Z', title: 'Senior Frontend Engineer', location: 'Gurgaon, India', salary: '₹25L - ₹40L PA', salaryMin: 25, type: 'Full-time', category: 'IT', posted: '2h ago', isRemote: false },
  { id: 2, company: 'Razorpay', logo: 'R', title: 'Backend Developer', location: 'Bangalore, India', salary: '₹18L - ₹28L PA', salaryMin: 18, type: 'Full-time', category: 'IT', posted: '5h ago', isRemote: false },
  { id: 3, company: 'Postman', logo: 'P', title: 'Product Designer', location: 'Remote', salary: '₹20L - ₹35L PA', salaryMin: 20, type: 'Full-time', category: 'Design', posted: '1d ago', isRemote: true },
  { id: 4, company: 'Swiggy', logo: 'S', title: 'React Native Intern', location: 'Bangalore, India', salary: '₹25K - ₹35K /Mo', salaryMin: 25, type: 'Internship', category: 'IT', posted: '2d ago', isRemote: false }
];

const JobFeed = ({ filters, onToggleFilters }) => {
  const filteredJobs = useMemo(() => {
    if (!filters) return MOCK_JOBS;
    return MOCK_JOBS.filter(job => {
      if (filters.type !== job.type && filters.type !== 'Remote') {
         if (filters.type === 'Remote' && !job.isRemote) return false;
         if (filters.type !== 'Remote') return false;
      }
      if (filters.keyword && !job.title.toLowerCase().includes(filters.keyword.toLowerCase())) return false;
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.category && !filters.category.includes(job.category)) return false;
      if (job.salaryMin < filters.salary) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="jobs-feed-col">
      {/* CLEANER HEADER: Just count and sort */}
      <div className="jobs-feed-header">
        <div className="feed-title-wrapper">
          <div className="feed-count">
            Showing <span>{filteredJobs.length}</span> jobs
          </div>
        </div>
        
        <div className="feed-actions">
          {/* Mobile Filter Trigger */}
          <button 
            className="btn-filter-trigger" 
            onClick={onToggleFilters}
            title="Open Filters"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </button>

          <div className="feed-sort">
            <select className="job-select sort-select">
              <option>Sort by: Relevance</option>
              <option>Sort by: Newest</option>
              <option>Sort by: Salary</option>
            </select>
          </div>
        </div>
      </div>

      <div className="jobs-scroll-area">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            <h3>No jobs found matching your filters.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobFeed;