import React, { useState, useMemo } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";
import EmailSidebar from "../components/emails/EmailSidebar";
import EmailList from "../components/emails/EmailList";
import EmailDetail from "../components/emails/EmailDetail";
import ComposeModal from "../components/emails/ComposeModal";
import "../styles/dashboard.css";
import "../styles/email.css";

const INITIAL_EMAILS = [

  {

    id: 1,

    sender: "Sarah Jenkins",

    company: "Google",

    logo: "https://logo.clearbit.com/google.com",

    subject: "Interview Availability: Senior Dev",

    preview: "Hi Priyangshu, thanks for your application...",

    time: "10:30 AM",

    tag: "Interview",

    tagType: "success",

    folder: "interviews",

    read: false,

    body: "Hi Priyangshu,\n\nThanks for your application to Google. We were impressed by your portfolio and would like to schedule a 45-min technical screen.\n\nPlease let us know your availability for the coming Tuesday or Wednesday.\n\nBest,\nSarah Jenkins"

  },

  {

    id: 2,

    sender: "Airbnb Team",

    company: "Airbnb",

    logo: "https://logo.clearbit.com/airbnb.com",

    subject: "Technical Task Update",

    preview: "Your code submission has been received...",

    time: "Yesterday",

    tag: "Assessment",

    tagType: "warning",

    folder: "assessments",

    read: true,

    body: "Hi Priyangshu,\n\nWe received your take-home assignment. Our engineering team will review it over the next 48 hours.\n\nRegards,\nAirbnb Talent Team"

  },

  {

    id: 3,

    sender: "Stripe Careers",

    company: "Stripe",

    logo: "https://logo.clearbit.com/stripe.com",

    subject: "Update on your application",

    preview: "Thank you for your interest in Stripe...",

    time: "2 days ago",

    tag: "Rejection",

    tagType: "error",

    folder: "rejections",

    read: true,

    body: "Hello,\n\nThank you for your interest in Stripe. After careful consideration, we have decided to move forward with other candidates.\n\nWe will keep your resume on file."

  },

  {

    id: 4,

    sender: "Microsoft HR",

    company: "Microsoft",

    logo: "https://logo.clearbit.com/microsoft.com",

    subject: "Offer Letter: Frontend Engineer",

    preview: "Congratulations! We are pleased to offer...",

    time: "Last Week",

    tag: "Offer",

    tagType: "success",

    folder: "offers",

    read: false,

    body: "Dear Priyangshu,\n\nWe are pleased to offer you the position of Frontend Engineer at Microsoft..."

  }

];

export default function Emails() {
  const [emailData, setEmailData] = useState(INITIAL_EMAILS);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // --- New Sync States ---
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState("Oct 24, 10:30 AM"); 
  
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeInitialData, setComposeInitialData] = useState(null);

  const filteredEmails = useMemo(() => {
    let data = emailData;
    if (selectedFolder !== "all") {
      data = data.filter((email) => email.folder === selectedFolder);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(email => 
        email.sender.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        email.company.toLowerCase().includes(query)
      );
    }
    return data;
  }, [selectedFolder, emailData, searchQuery]);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    if (!email.read) {
      const updatedList = emailData.map((e) => 
        e.id === email.id ? { ...e, read: true } : e
      );
      setEmailData(updatedList);
    }
  };

  // --- Updated Sync Handler ---
  const handleSync = () => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => { 
      setIsSyncing(false);
      const now = new Date();
      setLastSynced(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 2000);
  };

  const handleReply = (email) => {
    setComposeInitialData({
      to: `${email.sender} <recruiter@${email.company.toLowerCase()}.com>`,
      subject: `Re: ${email.subject}`,
      body: "" 
    });
    setIsComposeOpen(true);
  };

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-root">
        <TopHeader title="Emails" hideGreeting={true} fullName="Priyangshu Ghosh" />

        <div className={`email-container ${selectedEmail ? "split-view" : ""}`}>
          
          {/* ✅ Pass Sync Props Here */}
          <EmailSidebar 
            selectedFolder={selectedFolder} 
            onSelectFolder={(id) => { setSelectedFolder(id); setSelectedEmail(null); }}
            onComposeClick={() => { setComposeInitialData(null); setIsComposeOpen(true); }}
            lastSynced={lastSynced}
            isSyncing={isSyncing}
            onSync={handleSync}
          />
          
          <EmailList 
            emails={filteredEmails} 
            selectedEmail={selectedEmail} 
            onSelectEmail={handleEmailClick}
            fullWidth={!selectedEmail}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSync={handleSync}
            isSyncing={isSyncing}
          />
          
          {selectedEmail && (
            <EmailDetail 
              email={selectedEmail} 
              onClose={() => setSelectedEmail(null)}
              onReply={() => handleReply(selectedEmail)}
              onAiReply={() => handleReply(selectedEmail)}
              isAiLoading={false}
            />
          )}
        </div>

        {isComposeOpen && (
          <ComposeModal 
            onClose={() => setIsComposeOpen(false)} 
            initialData={composeInitialData}
          />
        )}
      </main>
    </div>
  );
}