import React from 'react';

// Icons
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>;
const CheckCircle = ({color}) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const AlertTriangle = ({color}) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

export default function ATSScoreCard({ scoreData, isCalculating, onCalculate }) {
  if (!scoreData) {
    return (
      <div className="resume-card score-card">
        <div className="score-cta-state">
          <div className="cta-icon-bg">
            <SparklesIcon />
          </div>
          <h3>Ready to Analyze?</h3>
          <p>Extract insights and check your ATS compatibility instantly.</p>
          <button 
            className={`btn-primary full-width ${isCalculating ? 'loading' : ''}`}
            onClick={onCalculate}
            disabled={isCalculating}
          >
            {isCalculating ? "Analyzing..." : "Calculate ATS Score"}
          </button>
        </div>
      </div>
    );
  }

  // Calculate Dash Offset for Gauge Animation (0 to 100 mapping)
  // 251 is full circle circumference approximation for this SVG
  // We want to map score (0-100) to offset (251-60)
  // formula: 251 - (score / 100 * (251 - 60))
  const offset = 251 - (scoreData.total / 100 * 191);

  return (
    <div className="resume-card score-card">
      <div className="score-result-state animate-fade-in">
        <div className="score-header">
          <h3>ATS Score Analysis</h3>
          <button className="refresh-icon" onClick={onCalculate} title="Recalculate"><RefreshIcon /></button>
        </div>

        <div className="gauge-wrapper">
          <svg viewBox="0 0 100 55" className="gauge-svg">
            <path d="M 10 50 A 40 40 0 0 1 90 50" className="gauge-bg" />
            <path 
              d="M 10 50 A 40 40 0 0 1 85 20" 
              className="gauge-fill" 
              style={{ strokeDashoffset: offset }} // Dynamic style for animation
            />
          </svg>
          <div className="gauge-value">
            <span className="number">{scoreData.total}</span>
            <span className="total">/100</span>
          </div>
          <span className="gauge-label">
            {scoreData.total >= 80 ? "Excellent!" : scoreData.total >= 60 ? "Good" : "Needs Work"}
          </span>
        </div>

        <div className="insights-list">
          <h4>Key Insights</h4>
          {scoreData.insights.map((insight, idx) => (
            <div key={idx} className={`insight-item ${insight.type}`}>
              {insight.type === 'success' && <CheckCircle color="var(--success-solid)"/>}
              {insight.type === 'warning' && <AlertTriangle color="var(--warning-solid)"/>}
              {insight.type === 'info' && <CheckCircle color="var(--text-muted)"/>}
              <span>{insight.text}</span>
            </div>
          ))}
        </div>

        <button className="btn-secondary full-width">Download Report</button>
      </div>
    </div>
  );
}