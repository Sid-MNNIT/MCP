import { useState } from "react";
import "../styles/dashboard.css"; 
import "../styles/resume.css";

import TopHeader from "../components/layout/TopHeader";
import Sidebar from "../components/layout/Sidebar";

// Sub-components
import FilePreview from "../components/resume/FilePreview";
import ATSScoreCard from "../components/resume/ATSScoreCard";
import PersonalInfoCard from "../components/resume/PersonalInfoCard";
import ExperienceSummaryCard from "../components/resume/ExperienceSummaryCard";
import SkillsCloudCard from "../components/resume/SkillsCloudCard";
import ExtractedMetadataCard from "../components/resume/ExtractedMetadataCard";

// --- MOCK DATA (Matches your Python Extract Output) ---
const initialEntities = {
  personal: {
    name: "Priyangshu Ghosh",
    email: "priyangshu@example.com",
    phone: "+91 98765 43210",
    linkedin: "linkedin.com/in/priyangshu"
  },
  summary: "Senior Software Engineer at TechSolutions (2020-Present). Specialized in building scalable backend systems and AI integrations.",
  skills: ["Python", "React.js", "AWS", "Machine Learning", "SQL", "Agile", "FastAPI", "Docker"],
  roles: ["Senior Software Engineer", "Software Developer"],
  companies: ["TechSolutions", "InnovateInc"],
  experience_years: 5
};

export default function ResumePage() {
  const [entities, setEntities] = useState(initialEntities);
  
  // Score State
  const [scoreData, setScoreData] = useState(null); 
  const [isCalculating, setIsCalculating] = useState(false);

  // --- HANDLERS ---
  const handleCalculate = () => {
    setIsCalculating(true);
    // Simulate Backend API Call
    setTimeout(() => {
      setScoreData({
        total: 85,
        breakdown: { skills: 40, roles: 20, experience: 20, structure: 5 },
        insights: [
          { type: 'success', text: "Contact Information found and clear" },
          { type: 'warning', text: "Missing some common leadership keywords" },
          { type: 'success', text: "Strong skills alignment detected" },
          { type: 'info', text: "Formatting is ATS-friendly" }
        ]
      });
      setIsCalculating(false);
    }, 1500);
  };

  // Generic updater for deep nested state
  const handlePersonalUpdate = (field, value) => {
    setEntities(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const handleSummaryUpdate = (newSummary) => {
    setEntities(prev => ({ ...prev, summary: newSummary }));
  };

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-root">
        <TopHeader fullName="Priyangshu Ghosh" />

        <div className="resume-page-header">
          <h1 className="page-heading">Resume Parsing</h1>
        </div>

        <div className="resume-grid-layout">
          
          {/* --- LEFT COLUMN --- */}
          <div className="left-column">
            <FilePreview 
              fileName="priyangshu_cv_final.pdf" 
              fileSize="1.2 MB" 
              uploadTime="Uploaded just now" 
            />
            
            <ATSScoreCard 
              scoreData={scoreData} 
              isCalculating={isCalculating} 
              onCalculate={handleCalculate} 
            />
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="right-column">
            <PersonalInfoCard 
              data={entities.personal} 
              onUpdate={handlePersonalUpdate} 
            />

            <ExperienceSummaryCard 
              summary={entities.summary} 
              onUpdate={handleSummaryUpdate} 
            />

            <SkillsCloudCard 
              skills={entities.skills} 
            />

            <ExtractedMetadataCard 
              experienceYears={entities.experience_years} 
              companies={entities.companies} 
            />
          </div>

        </div>
      </main>
    </div>
  );
}