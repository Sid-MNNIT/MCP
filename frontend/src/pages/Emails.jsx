


import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopHeader from "../components/layout/TopHeader";

 import EmailSidebar from "../components/emails/EmailSidebar";
import EmailList from "../components/emails/EmailList";
import EmailDetail from "../components/emails/EmailDetail";
import ComposeModal from "../components/emails/ComposeModal";
import mapEmailForUI from "../components/emails/EmailMapper.jsx";
import AiReplyPreviewModal from "../components/emails/AiReplyPreviewModal.jsx"
import "../styles/dashboard.css";
import "../styles/email.css";
import { getEmails,generateAiReplyPreview,sendAiReply,syncEmails } from "../utils/api.js";

export default function Emails() {

  const [selectedFolder, setSelectedFolder] = useState("all");

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState("Oct 24, 10:30 AM");

  // Compose
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeInitialData, setComposeInitialData] = useState(null);

  // Set Reply Loading
  const [isAiLoading, setIsAiLoading] = useState(false);


  //Ai Reply Preview
  const [aiPreviewDraft, setAiPreviewDraft] = useState(null);

  //Sending reply
  const [isSending, setIsSending] = useState(false);





  // Fetch emails
  useEffect(() => {
    const loadEmails = async () => {
      try {
        const res = await getEmails();
        const mapped = (res.emails || []).map(mapEmailForUI);
        setEmails(mapped);
      } catch (err) {
        console.error("Failed to load emails", err);
      } finally {
        setLoading(false);
      }
    };

    loadEmails();
  }, []);

  // Filter + search
  const filteredEmails = useMemo(() => {
    let data = emails;


    if (selectedFolder !== "all") {
      data = data.filter((email) => email.tag === selectedFolder);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (email) =>
          (email.sender || "").toLowerCase().includes(query) ||
          (email.subject || "").toLowerCase().includes(query) ||
          (email.company || "").toLowerCase().includes(query)
      );
    }

    return data;
  }, [emails, searchQuery]);

  // Clear selected email if it disappears due to filtering
  useEffect(() => {
    if (
      selectedEmail &&
      !filteredEmails.find((e) => e.id === selectedEmail.id)
    ) {
      setSelectedEmail(null);
    }
  }, [filteredEmails, selectedEmail]);

  // Email click
  const handleEmailClick = (email) => {
    console.log("Clicked email:", email);
    setSelectedEmail(email);

    if (!email.read) {
      setEmails((prev) =>
        prev.map((e) =>
          e.id === email.id ? { ...e, read: true } : e
        )
      );
    }
  };


const handleSync = async () => {
  try {
    setIsSyncing(true);

    // Call backend → agent → ingest pipeline
    const result = await syncEmails();
    console.log("✅ Sync result:", result);

    //  Update last synced time
    const now = new Date();
    setLastSynced(
      now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    
    const res = await getEmails();
    const mapped = (res.emails || []).map(mapEmailForUI);
    setEmails(mapped);

  } catch (err) {
    console.error("❌ Sync failed", err);
    alert("Failed to sync Gmail");
  } finally {
    setIsSyncing(false);
  }
};


  // Reply handler
const handleReply = (email) => {
  setComposeInitialData({
    to: email.senderEmail,        // ✅ THIS IS THE KEY FIX
    subject: `Re: ${email.subject}`,
    body: "",
    messageId: email.messageId,
    threadId: email.threadId,
    in_reply_to: email.messageId
  });

  setIsComposeOpen(true);
};



  
  
const handleGenerateAiReply = async (email) => {
  try {
    console.log("🟢 AI click email:", email); // ✅ keep for debug

    setIsAiLoading(true);

    const result = await generateAiReplyPreview({
      messageId: email.messageId,   
      tone: "professional"
    });

    console.log("🟢 AI preview result:", result); // ✅ IMPORTANT

    // ✅ SHOW AI PREVIEW MODAL
    setAiPreviewDraft({
      draft: result.draft,          // ← comes from backend now
      originalEmail: email
    });

  } catch (err) {
    console.error("❌ AI reply generation failed", err);
  } finally {
    setIsAiLoading(false);
  }
};



  // Loading state
  if (loading) {
    return (
      <div className="dashboard-shell">
        <Sidebar />
        <main className="dashboard-root">
          <TopHeader title="Emails" hideGreeting={true} fullName="Priyangshu Ghosh" />
          <p style={{ padding: "1rem" }}>Loading emails…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-root">
        <TopHeader title="Emails" hideGreeting={true} fullName="Priyangshu Ghosh" />

        <div className={`email-container ${selectedEmail ? "split-view" : ""}`}>

          {
       <EmailSidebar
  onComposeClick={() => {
    setComposeInitialData(null);
    setIsComposeOpen(true);
  }}
  onShowEmails={() => setSelectedEmail(null)}
  onSync={handleSync}
  isSyncing={isSyncing}
  lastSynced={lastSynced}
/>

          }

          <EmailList
            emails={filteredEmails}
            selectedEmail={selectedEmail}
            onSelectEmail={handleEmailClick}
            fullWidth={!selectedEmail}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

       {selectedEmail && (
  <EmailDetail
    email={selectedEmail}
    onClose={() => setSelectedEmail(null)}
    onReply={handleReply}
    onGenerateAiReply={handleGenerateAiReply}
    isAiLoading={isAiLoading}
  />
)}

        </div>

{isComposeOpen && (
  <ComposeModal
    initialData={composeInitialData}
    onClose={() => setIsComposeOpen(false)}
    isAiLoading={isAiLoading}
    isSending={isSending}

    onAskAi={async () => {
      setIsAiLoading(true);
      try {
        const res = await generateAiReplyPreview({
          messageId: composeInitialData.messageId,
          tone: "professional"
        });

        setComposeInitialData(prev => ({
          ...prev,
          body: res.draft.body
        }));
      } finally {
        setIsAiLoading(false);
      }
    }}

    onSend={async (draft) => {
      setIsSending(true);
      try {
        await sendAiReply(draft);
        setIsComposeOpen(false);   // ✅ close on success
      } catch (err) {
        console.error("❌ Send failed", err);
        alert("Failed to send email");
      } finally {
        setIsSending(false);
      }
    }}
  />
)}






       {aiPreviewDraft && (
  <AiReplyPreviewModal
    draft={aiPreviewDraft.draft}
    originalEmail={aiPreviewDraft.originalEmail}
    onClose={() => setAiPreviewDraft(null)}
    onEditInCompose={(draft) => {
      setComposeInitialData(draft);
      setIsComposeOpen(true);
      setAiPreviewDraft(null);
    }}
    onSend={async (draft) => {
      // Later: call send-email backend
      console.log("Sending draft:", draft);
      setAiPreviewDraft(null);
    }}
  />
)}






      </main>
    </div>
  );
}