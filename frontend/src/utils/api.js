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
};





