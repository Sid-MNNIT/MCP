const BASE_URL = "http://localhost:5000/api";

export const signupUser = async (data) => {
  const res = await fetch(`${BASE_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getCurrentUser = async () => {
  const res = await fetch(`${BASE_URL}/user/me`, {
    credentials: "include", 
  });

  return res.json();
};

export const logoutUser = async () => {
  const res = await fetch(`${BASE_URL}/user/logout`, {
    method: "POST",
    credentials: "include", 
  });

  return res.json();
};


export const googleLogin = async (idToken) => {
  const res = await fetch(`${BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });

  return res.json();
};

/* ===================================================== */
/* Jobs APIs                                             */
/* ===================================================== */

/**
 * Search jobs
 */
export const searchJobs = async (filters) => {
  const query = new URLSearchParams(filters).toString();

  const res = await fetch(`${BASE_URL}/jobs/search?${query}`, {
    credentials: "include",
  });

  return res.json();
};

/**
 * Get job categories
 */
export const getJobCategories = async (country = "in") => {
  const res = await fetch(
    `${BASE_URL}/jobs/categories?country=${country}`,
    {
      credentials: "include",
    }
  );

  return res.json();
};

/**
 * Get recommended jobs (requires login)
 */
export const getRecommendedJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs/recommended`, {
    credentials: "include",
  });

  return res.json();
};

/**
 * Save a job
 */
export const saveJob = async (job) => {
  const res = await fetch(`${BASE_URL}/jobs/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(job),
  });

  return res.json();
};

/**
 * Get saved jobs
 */
export const getSavedJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs/saved`, {
    credentials: "include",
  });

  return res.json();
};

/**
 * Unsave a job
 */
export const unsaveJob = async (jobId) => {
  const res = await fetch(`${BASE_URL}/jobs/saved/${jobId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return res.json();
}

/**
 * Rank jobs by relevance (requires login)
 */
export const rankJobsByRelevance = async (jobs) => {
  const res = await fetch(`${BASE_URL}/jobs/rank`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ jobs }),
  });

  return res.json();
};

export const startGmailSync = () => {

  window.location.href = "http://localhost:5000/sync/google/gmail";
};


export const getGmailStatus= async()=>{
  const res=await fetch(`${BASE_URL}/user/gmail-status`,{
    credentials:"include"
  })
  return res.json()
}

export const getEmails= async()=>{
  const res=await fetch(`${BASE_URL}/emails/fetch-email`,{
    credentials :"include"
  })
  return res.json();
}


export const generateAiReplyPreview = async ({ messageId, tone }) => {
  const res = await fetch(`${BASE_URL}/emails/email-reply-preview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      messageId,
      tone
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to generate AI reply");
  }

  const result = await res.json();

  const { draft } = result;

  if (
    !draft ||
    !draft.to ||
    !draft.subject ||
    !draft.body ||
    !draft.threadId ||
    !draft.in_reply_to
  ) {
    console.error("❌ Invalid pipeline response:", result);
    throw new Error("Invalid AI draft returned from pipeline");
  }

  return {
    draft
  };
};


export const sendAiReply = async (draft) => {
  const res = await fetch(`${BASE_URL}/emails/email-reply-send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(draft)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to send email");
  }

  return await res.json();
};


export const syncEmails = async () => {
  const res = await fetch(`${BASE_URL}/emails/email-sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to sync emails");
  }

  return await res.json();
};


//profile apis
//Get logged-in user's profile
export const getMyProfile = async () => {
  const res = await fetch(`${BASE_URL}/profile/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  const data = await res.json();
  return data.profile;
};

// Update logged-in user's profile
export const updateMyProfile = async (payload) => {
  const res = await fetch(`${BASE_URL}/profile/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  const data = await res.json();
  return data.profile;
};

//skills
export const updateSkills = async (skills) => {
  const res = await fetch(
    `${BASE_URL}/profile/me/skills`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ skills }),
    }
  );

  if (!res.ok) throw new Error("Failed to update skills");
  return res.json();
};

//experience
export const addExperience = async (data) => {
  const res = await fetch(
    `${BASE_URL}/profile/me/experience`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) throw new Error("Failed to add experience");
  return res.json();
};

export const updateExperience = async (id, data) => {
  const res = await fetch(
    `${BASE_URL}/profile/me/experience/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) throw new Error("Failed to update experience");
  return res.json();
};

export const deleteExperience = async (id) => {
  const res = await fetch(
    `${BASE_URL}/profile/me/experience/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to delete experience");
  return res.json();
};
//education
export const addEducation = async (data) => {
  const res = await fetch(
    `${BASE_URL}/profile/me/education`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) throw new Error("Failed to add education");
  return res.json();
};

export const updateEducation = async (id, data) => {
  const res = await fetch(
    `${BASE_URL}/profile/me/education/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) throw new Error("Failed to update education");
  return res.json();
};

export const deleteEducation = async (id) => {
  const res = await fetch(
    `${BASE_URL}/profile/me/education/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to delete education");
  return res.json();
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  const res = await fetch(`${BASE_URL}/profile/me/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to change password");
  }

  return res.json();
};
