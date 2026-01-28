import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";
import EditEntityModal from "../components/resume/EditEntityModal";

// Sub-components
import FilePreview from "../components/resume/FilePreview";
import ATSScoreCard from "../components/resume/ATSScoreCard";
import PersonalInfoCard from "../components/resume/PersonalInfoCard";
import ExperienceSummaryCard from "../components/resume/ExperienceSummaryCard";
import SkillsCloudCard from "../components/resume/SkillsCloudCard";
import ExtractedMetadataCard from "../components/resume/ExtractedMetadataCard";
import { getCurrentUser } from "../utils/api";

import "../styles/dashboard.css";
import "../styles/resume.css";

// --- MOCK DATA (Initial State) ---
const initialEntities = {
  personal: {
    name: "Priyangshu Ghosh",
    email: "priyangshu@example.com",
    phone: "+91 98765 43210",
    linkedin: "linkedin.com/in/priyangshu"
  },
  // Timeline Data Structure
  experience_list: [
    { 
      role: "Senior Software Engineer", 
      company: "TechSolutions", 
      date: "2020 - Present", 
      desc: "Specialized in building scalable backend systems and AI integrations." 
    },
    { 
      role: "Software Developer", 
      company: "InnovateInc", 
      date: "2017 - 2020", 
      desc: "Developed full-stack web applications using React and Node.js." 
    }
  ],
  skills: ["Python", "React.js", "AWS", "Machine Learning", "SQL", "Agile", "FastAPI", "Docker"],
  experience_years: 5,
  companies: ["TechSolutions", "InnovateInc"]
};

export default function Resume() {
  // 1. Data States
  const [user, setUser] = useState(null);
  const [entities, setEntities] = useState(initialEntities);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [editModalConfig, setEditModalConfig] = useState(null);

  // Fetch current user
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

  // 2. Handlers
  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setScoreData(null); // Reset score on new file
  };

  const handleCalculate = () => {
    if (!uploadedFile) {
      alert("Please upload a resume first!");
      return;
    }

    setIsCalculating(true);
    
    // Simulate Backend API Processing
    setTimeout(() => {
      setScoreData({
        total: 85,
        insights: [
          { type: 'success', text: "Contact Information found and clear" },
          { type: 'warning', text: "Missing some common leadership keywords" },
          { type: 'success', text: "Strong skills alignment detected" },
          { type: 'info', text: "Formatting is ATS-friendly" }
        ]
      });
      setIsCalculating(false);
    }, 1800);
  };

  // --- EDIT MODAL HANDLERS ---
  const openPersonalEdit = () => {
    setEditModalConfig({
      title: "Personal Info",
      section: "personal",
      initialData: entities.personal,
      fields: [
        { key: "name", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "linkedin", label: "LinkedIn" },
      ]
    });
  };

  const openSummaryEdit = () => {
    // Note: For timeline edits, you'd typically need a more complex modal.
    // This is a placeholder for editing the raw text or first item.
    alert("To edit timeline items, we would open a specific experience modal here (like in Profile).");
  };

  const handleSaveModal = (newData) => {
    setEntities(prev => ({
      ...prev,
      [editModalConfig.section]: newData
    }));
    setEditModalConfig(null);
  };

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-root">
        <TopHeader fullName={user?.fullname || "User"} title="Resume Analysis" hideGreeting />
        
        {/* MAIN LAYOUT CONTAINER */}
        <div className="resume-container">
          
          {/* --- LEFT COLUMN: File Upload & ATS Score --- */}
          <div className="resume-left-col">
            <FilePreview 
              file={uploadedFile} 
              onFileUpload={handleFileUpload} 
            />
            
            <ATSScoreCard 
              scoreData={scoreData} 
              isCalculating={isCalculating} 
              onCalculate={handleCalculate} 
            />
          </div>

          {/* --- RIGHT COLUMN: Parsed Data Grid --- */}
          <div className="resume-right-grid">
            
            {/* Cell 1: Personal Info */}
            <div className="grid-item">
              <PersonalInfoCard 
                data={entities.personal} 
                onEdit={openPersonalEdit} 
              />
            </div>
            
            {/* Cell 2: Experience Timeline */}
            <div className="grid-item">
              <ExperienceSummaryCard 
                experiences={entities.experience_list} 
                onEdit={openSummaryEdit} 
              />
            </div>

            {/* Cell 3 (Full Width): Skills */}
            <div className="span-full">
              <SkillsCloudCard 
                skills={entities.skills} 
              />
            </div>

            {/* Cell 4 (Full Width): Metadata */}
            <div className="span-full">
              <ExtractedMetadataCard 
                experienceYears={entities.experience_years} 
                companies={entities.companies} 
              />
            </div>

          </div>
        </div>

        {/* --- GLOBAL EDIT MODAL --- */}
        {editModalConfig && (
          <EditEntityModal 
            title={editModalConfig.title}
            fields={editModalConfig.fields}
            initialData={editModalConfig.initialData}
            onClose={() => setEditModalConfig(null)}
            onSave={handleSaveModal}
          />
        )}

      </main>
    </div>
  );
}