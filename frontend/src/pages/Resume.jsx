import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";
import { getCurrentUser } from "../utils/api";

import "../styles/dashboard.css";
import "../styles/resume.css";

export default function Resume() {
  const [user, setUser] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [metadataData, setMetadataData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userRes = await getCurrentUser();
        setUser(userRes.user);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    loadUser();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setScoreData(null);
      setMetadataData(null);
    } else {
      alert("Please upload a PDF file");
    }
  };

  const handleCalculate = async () => {
    if (!uploadedFile) {
      alert("Please upload a resume first!");
      return;
    }

    setIsCalculating(true);

    // TODO: Replace with actual API call to resume MCP
    setTimeout(() => {
      setScoreData({
        final_score: 78,
        ats: {
          total_score: 78,
          breakdown: {
            contact: 15,
            experience: 18,
            skills: 20,
            education: 12,
            format: 13
          }
        },
        llm_feedback: [
          { type: 'success', text: 'Strong technical skills section with relevant keywords' },
          { type: 'warning', text: 'Experience descriptions could be more quantitative' },
          { type: 'error', text: 'Missing leadership and management keywords' },
          { type: 'success', text: 'Clear and well-structured education section' }
        ]
      });

      setMetadataData({
        entities: {
          skills: ["Python", "Flask", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes", "Git", "AWS", "MongoDB", "React", "Node.js"],
          experience_years: 3,
          companies: ["Alpha Technologies", "Beta Corp", "Gamma Solutions"],
          education_count: 1,
          certifications_count: 2
        }
      });

      setIsCalculating(false);
    }, 2000);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setScoreData(null);
    setMetadataData(null);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-root">
        <TopHeader fullName={user?.fullname || "User"} title="Resume Analysis" hideGreeting />

        <div className="resume-container">
          
          {/* LEFT: Upload */}
          <div className="resume-column">
            <div className="resume-card">
              <div className="resume-card-header">
                <h3>Upload Resume</h3>
              </div>

              {!uploadedFile ? (
                <div className="upload-area">
                  <input
                    id="resume-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="resume-file" className="upload-label">
                    <div className="upload-icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p className="upload-text">Click to upload your resume</p>
                    <p className="upload-hint">PDF format only • Maximum 5MB</p>
                  </label>
                </div>
              ) : (
                <>
                  <div className="file-info">
                    <div className="file-icon-container">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div className="file-details">
                      <p className="file-name">{uploadedFile.name}</p>
                      <p className="file-size">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={handleRemoveFile} className="btn-remove" title="Remove file">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  <button 
                    onClick={() => document.getElementById('resume-file').click()} 
                    className="btn-replace"
                  >
                    Replace File
                  </button>
                  <input
                    id="resume-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </>
              )}
            </div>
          </div>

          {/* MIDDLE: ATS Score */}
          <div className="resume-column">
            <div className="resume-card">
              <div className="resume-card-header">
                <h3>ATS Score</h3>
                {scoreData && (
                  <span 
                    className="score-badge"
                    style={{ backgroundColor: getScoreColor(scoreData.final_score) }}
                  >
                    {getScoreLabel(scoreData.final_score)}
                  </span>
                )}
              </div>

              {!scoreData ? (
                <div className="empty-state-with-button">
                  <div className="empty-message">
                    <div className="empty-icon">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <p>Upload a resume to calculate the ATS score</p>
                  </div>
                  
                  {uploadedFile && (
                    <button 
                      onClick={handleCalculate} 
                      className="btn-calculate-center"
                      disabled={isCalculating}
                    >
                      {isCalculating ? 'Analyzing Resume...' : 'Calculate ATS Score'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="score-content">
                  <div className="score-main" style={{ borderColor: getScoreColor(scoreData.final_score) }}>
                    <div className="score-number" style={{ color: getScoreColor(scoreData.final_score) }}>
                      {scoreData.final_score}
                    </div>
                    <div className="score-label">out of 100</div>
                  </div>

                  <div className="score-breakdown">
                    <h4>Score Breakdown</h4>
                    {Object.entries(scoreData.ats.breakdown).map(([key, value]) => {
                      const percentage = (value / 20) * 100;
                      const color = percentage >= 75 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444';
                      return (
                        <div key={key} className="breakdown-row">
                          <span className="breakdown-key">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                          <div className="breakdown-bar">
                            <div 
                              className="breakdown-fill" 
                              style={{ width: `${percentage}%`, backgroundColor: color }}
                            />
                          </div>
                          <span className="breakdown-value">{value}/20</span>
                        </div>
                      );
                    })}
                  </div>

                  {scoreData.llm_feedback && scoreData.llm_feedback.length > 0 && (
                    <div className="feedback-section">
                      <h4>Suggestions</h4>
                      {scoreData.llm_feedback.map((feedback, index) => (
                        <div key={index} className={`feedback-item feedback-${feedback.type}`}>
                          <span className="feedback-icon">
                            {feedback.type === 'success' && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                            {feedback.type === 'warning' && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                              </svg>
                            )}
                            {feedback.type === 'error' && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                            )}
                          </span>
                          <span className="feedback-text">{feedback.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Metadata */}
          <div className="resume-column">
            <div className="resume-card">
              <div className="resume-card-header">
                <h3>Key Insights</h3>
              </div>

              {!metadataData ? (
                <div className="empty-message">
                  <div className="empty-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <p>Key insights will appear here after analysis</p>
                </div>
              ) : (
                <div className="metadata-content">
                  <div className="metadata-stats">
                    <div className="stat-box">
                      <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div className="stat-value">{metadataData.entities.experience_years}</div>
                      <div className="stat-label">Years Experience</div>
                    </div>
                    
                    <div className="stat-box">
                      <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div className="stat-value">{metadataData.entities.companies.length}</div>
                      <div className="stat-label">Companies</div>
                    </div>
                    
                    <div className="stat-box">
                      <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <div className="stat-value">{metadataData.entities.skills.length}</div>
                      <div className="stat-label">Skills Listed</div>
                    </div>
                    
                    <div className="stat-box">
                      <div className="stat-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                      </div>
                      <div className="stat-value">{metadataData.entities.certifications_count}</div>
                      <div className="stat-label">Certifications</div>
                    </div>
                  </div>

                  <div className="metadata-section">
                    <h4>Top Skills</h4>
                    <div className="skills-list">
                      {metadataData.entities.skills.slice(0, 8).map((skill, index) => (
                        <span key={index} className="skill-item">{skill}</span>
                      ))}
                      {metadataData.entities.skills.length > 8 && (
                        <span className="skill-item skill-more">
                          +{metadataData.entities.skills.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="metadata-section">
                    <h4>Work History</h4>
                    <div className="companies-list">
                      {metadataData.entities.companies.map((company, index) => (
                        <div key={index} className="company-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                          {company}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
