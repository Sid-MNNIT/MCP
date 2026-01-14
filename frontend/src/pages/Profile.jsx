import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileView from "../components/profile/ProfileView";
import ProfileEdit from "../components/profile/ProfileEdit";
import ChangePasswordModal from "../components/profile/ChangePasswordModal";
import ExperienceModal from "../components/profile/ExperienceModal";
import EducationModal from "../components/profile/EducationModal";
import AvatarModal from "../components/profile/AvatarModal";
import "../styles/dashboard.css";
import "../styles/profile.css";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [user, setUser] = useState({
    fullname: "",
    email: "",
    headline: "",
    location: "",
    about: "",
    avatar: "",
    socials: { linkedin: "", github: "", website: "" },
    skills: [],
    experience: [],
    education: []
  });

  useEffect(() => {
    setTimeout(() => {
      setUser({
        fullname: "Priyangshu Ghosh",
        email: "priyangshu@example.com",
        headline: "Full Stack Developer",
        location: "Bangalore, India",
        about: "Passionate developer building SaaS tools for the future of work.",
        avatar: "", 
        socials: { linkedin: "", github: "", website: "" },
        skills: ["React", "Node.js", "MongoDB", "Figma"],
        experience: [
          { 
            id: 1, 
            role: "Senior Frontend Engineer", 
            company: "TechCorp", 
            startDate: "Jan 2023", 
            endDate: "Present", 
            description: "Leading the frontend migration to React 19." 
          }
        ],
        education: [
          { 
            id: 1, 
            degree: "B.Tech", 
            fieldOfStudy: "Computer Science", // ✅ NEW FIELD
            school: "Engineering University", 
            year: "2021" 
          }
        ]
      });
      setLoading(false);
    }, 500);
  }, []);

  const handleSaveProfile = (formData) => { setUser({ ...user, ...formData }); setIsEditing(false); };
  const handleAvatarUpdate = (newUrl) => { setUser({ ...user, avatar: newUrl }); setShowAvatarModal(false); };

  const openExpModal = (item = null) => { setCurrentItem(item); setShowExpModal(true); };
  const handleSaveExperience = (expData) => {
    let newExpList = currentItem 
      ? user.experience.map(e => e.id === currentItem.id ? { ...expData, id: e.id } : e)
      : [...user.experience, { ...expData, id: Date.now() }];
    setUser({ ...user, experience: newExpList });
    setShowExpModal(false);
  };
  const handleDeleteExperience = (id) => {
    if(window.confirm("Delete this?")) { setUser({ ...user, experience: user.experience.filter(e => e.id !== id) }); setShowExpModal(false); }
  };

  const openEduModal = (item = null) => { setCurrentItem(item); setShowEduModal(true); };
  const handleSaveEducation = (eduData) => {
    let newEduList = currentItem 
      ? user.education.map(e => e.id === currentItem.id ? { ...eduData, id: e.id } : e)
      : [...user.education, { ...eduData, id: Date.now() }];
    setUser({ ...user, education: newEduList });
    setShowEduModal(false);
  };
  const handleDeleteEducation = (id) => {
    if(window.confirm("Delete this?")) { setUser({ ...user, education: user.education.filter(e => e.id !== id) }); setShowEduModal(false); }
  };

  if (loading) return <div className="dashboard-shell"><div className="dashboard-root" style={{paddingTop: '50px'}}>Loading Profile...</div></div>;

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-root">
        <TopHeader fullName={user.fullname} hideGreeting={true} title="Profile" />
        <div className="profile-container">
          <ProfileHeader user={user} isEditing={isEditing} toggleEdit={() => setIsEditing(!isEditing)} onAvatarClick={() => setShowAvatarModal(true)} defaultAvatar={DEFAULT_AVATAR} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "-10px" }}>
            <button className="btn-social" onClick={() => setShowPasswordModal(true)}>🔒 Change Password</button>
          </div>
          <div className="profile-content">
            {isEditing ? (
              <ProfileEdit user={user} onSave={handleSaveProfile} onCancel={() => setIsEditing(false)} />
            ) : (
              <ProfileView user={user} onEditExperience={openExpModal} onEditEducation={openEduModal} />
            )}
          </div>
        </div>
        {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
        {showExpModal && <ExperienceModal initialData={currentItem} onClose={() => setShowExpModal(false)} onSave={handleSaveExperience} onDelete={handleDeleteExperience} />}
        {showEduModal && <EducationModal initialData={currentItem} onClose={() => setShowEduModal(false)} onSave={handleSaveEducation} onDelete={handleDeleteEducation} />}
        {showAvatarModal && <AvatarModal currentAvatar={user.avatar || DEFAULT_AVATAR} onClose={() => setShowAvatarModal(false)} onSave={handleAvatarUpdate} />}
      </main>
    </div>
  );
}