import { Sparkles, TrendingUp, Zap, Target, ArrowRight } from "lucide-react";
import polishIllustration from "../../assets/polish-resume.png";

const SCORE_METRICS = [
  { label: "ATS Readiness", key: "atsScore",       icon: Zap,       color: "#16a34a" },
  { label: "Impact",        key: "impactScore",     icon: TrendingUp, color: "#d97706" },
  { label: "Skill Match",   key: "skillAlignment",  icon: Target,    color: "#1d4ed8" },
];

export default function ResumePolishCard({
  resumeScore   = 68,
  atsScore       = "Good",
  impactScore    = "Moderate",
  skillAlignment = "High",
  focusAreas     = [
    "Improve quantified impact in experience",
    "Reorder skills for ATS relevance",
    "Add measurable outcomes to projects",
  ],
  lastAnalyzed = "yesterday",
}) {
  const vals = { atsScore, impactScore, skillAlignment };

  // SVG ring calc
  const r   = 28;
  const circ = 2 * Math.PI * r;
  const dash = (resumeScore / 100) * circ;

  return (
    <div className="card polish-card">

      {/* ── Top row: illustration + title + score ring ── */}
      <div className="polish-top">
        <img src={polishIllustration} alt="" className="polish-illustration" />

        <div className="polish-title-block">
          <div className="polish-eyebrow">
            <Sparkles size={13} strokeWidth={2.5} />
            AI-Powered Analysis
          </div>
          <h3 className="polish-title">Polish your resume</h3>
          <p className="polish-sub">Strengthen your profile for better shortlisting</p>
        </div>

        {/* Score ring */}
        <div className="polish-score-ring">
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={r} fill="none" stroke="var(--border-color)" strokeWidth="5" />
            <circle
              cx="36" cy="36" r={r} fill="none"
              stroke="var(--accent-primary)" strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
              strokeDashoffset={circ * 0.25}
              style={{ transition: "stroke-dasharray 0.8s ease" }}
            />
          </svg>
          <div className="polish-score-label">
            <strong>{resumeScore}</strong>
            <span>/100</span>
          </div>
        </div>
      </div>

      <div className="polish-divider" />

      {/* ── Metric pills ── */}
      <div className="polish-metrics">
        {SCORE_METRICS.map(({ label, key, icon: Icon, color }) => (
          <div key={key} className="polish-metric" style={{ "--metric-color": color }}>
            <div className="polish-metric__icon">
              <Icon size={14} strokeWidth={2} />
            </div>
            <div className="polish-metric__text">
              <span className="polish-metric__label">{label}</span>
              <span className="polish-metric__value">{vals[key]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="polish-divider" />

      {/* ── Focus areas ── */}
      <div className="polish-focus">
        <span className="focus-title">Focus areas</span>
        <ul className="focus-list">
          {focusAreas.map((item, i) => (
            <li key={i} className="focus-item">
              <span className="focus-dot" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ── CTA ── */}
      <div className="polish-footer">
        <button className="btn-primary polish-cta">
          Improve Resume
          <ArrowRight size={15} strokeWidth={2.5} />
        </button>
        <span className="polish-meta">Last analyzed {lastAnalyzed}</span>
      </div>
    </div>
  );
}
