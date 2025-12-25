// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// ✅ Axios instance (clean + reusable)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Auto attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Helper: Extract proper backend error
const getErrorMessage = (err, fallback = "Something went wrong") => {
  return (
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
};

// ------------------------------
// ✅ REGISTER
// ------------------------------
export const register = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err) {
    console.error("REGISTER ERROR:", err.response?.data || err.message);
    return { error: getErrorMessage(err, "Signup failed") };
  }
};

// ------------------------------
// ✅ LOGIN
// ------------------------------
export const login = async (data) => {
  try {
    const res = await api.post("/auth/login", data);

    // ✅ Save token if backend returns it
    if (res.data?.token) localStorage.setItem("token", res.data.token);

    return res.data;
  } catch (err) {
    console.error("LOGIN ERROR:", err.response?.data || err.message);
    return { error: getErrorMessage(err, "Login failed") };
  }
};

// ------------------------------
// ✅ FORGOT PASSWORD
// ------------------------------
export const forgotPassword = async (email) => {
  try {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err.response?.data || err.message);
    return { error: getErrorMessage(err, "Failed to send reset email") };
  }
};

// ------------------------------
// ✅ GET DASHBOARD DATA
// ------------------------------
export const getDashboardData = async () => {
  try {
    const res = await api.get("/dashboard");
    return res.data;
  } catch (err) {
    console.warn("DASHBOARD ERROR (Fallback):", err.response?.data || err.message);

    // ✅ Fallback (frontend demo data)
    return {
      announcements: [
        {
          title: "New DevSphere release",
          desc: "v1.3 ships with live coding rooms & improved collaboration.",
          time: "2 hours ago",
        },
        {
          title: "Team stand-up time updated",
          desc: "Frontend stand-up moved to 10:00 AM.",
          time: "Yesterday",
        },
        {
          title: "Scheduled maintenance",
          desc: "Downtime Saturday 01:00 – 02:00 AM UTC.",
          time: "3 days ago",
        },
      ],
      meetings: [
        { title: "Introduction call", time: "08:00 – 08:50" },
        { title: "Sprint planning", time: "14:00 – 15:00" },
      ],
      projects: [
        { name: "Website redesign", progress: 75 },
        { name: "Mobile app", progress: 25 },
        { name: "Dashboard UI", progress: 50 },
      ],
    };
  }
};

// ✅ Export axios instance if you want to use directly later
export default api;