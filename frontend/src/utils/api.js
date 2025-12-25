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
