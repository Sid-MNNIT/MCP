import React from 'react';
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>;
const CheckCircle = ({color}) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const AlertTriangle = ({color}) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

export default function ATSScoreCard({ scoreData, isCalculating, onCalculate }) {
  const gaugeOffset = scoreData ? 251 - (scoreData.total / 100 * 191) : 251;
  return (
    <div className="resume-section" style={{textAlign:'center'}}>
      <div className="resume-section-header"><h3>ATS Score Analysis</h3>{scoreData && <button className="btn-icon-action" onClick={onCalculate}><RefreshIcon /></button>}</div>
      {!scoreData ? (
        <div style={{ padding: '20px 0' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>Ready to analyze? Check your ATS compatibility.</p>
          <button className="btn-calculate" onClick={onCalculate} disabled={isCalculating}>{isCalculating ? "Analyzing..." : "Calculate Score"}</button>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="gauge-container">
            <svg viewBox="0 0 100 55" className="gauge-svg">
              <path d="M 10 50 A 40 40 0 0 1 90 50" className="gauge-bg" />
              <path d="M 10 50 A 40 40 0 0 1 85 20" className="gauge-fill" style={{ strokeDashoffset: gaugeOffset }}/>
            </svg>
            <div className="gauge-text"><div className="score-num">{scoreData.total}</div><div className="score-total">/100</div></div>
          </div>
          <div className="insights-list">
            {scoreData.insights.map((insight, idx) => (
              <div key={idx} className={`insight-item ${insight.type}`}>
                {insight.type === 'success' && <CheckCircle color="var(--success-solid)"/>}
                {insight.type === 'warning' && <AlertTriangle color="var(--warning-solid)"/>}
                {insight.type === 'info' && <CheckCircle color="var(--text-muted)"/>}
                <span>{insight.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}