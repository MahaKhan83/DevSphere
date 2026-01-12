// src/services/api.js
import axios from "axios";

// ==============================
// 🌐 BASE CONFIG
// ==============================
// ✅ Use Vite env if present, otherwise localhost
const API_BASE_URL =
  (import.meta?.env?.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "") +
  "/api";

// ✅ Same keys as AuthContext
const TOKEN_KEY = "devsphere_token";

// Reusable axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// 🔐 AUTO ATTACH JWT TOKEN
// ==============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY); // ✅ fixed key
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// ❗ ERROR HANDLER
// ==============================
const getErrorMessage = (err, fallback = "Something went wrong") => {
  return (
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
};

// ======================================================
// 🔐 AUTH MODULE
// ======================================================

// REGISTER
export const register = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return { error: getErrorMessage(err, "Signup failed") };
  }
};

// LOGIN
// ✅ IMPORTANT: Do NOT store token here anymore (AuthContext will do it)
export const login = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return { error: getErrorMessage(err, "Login failed") };
  }
};

// LOGOUT
// ✅ Remove both possible keys just in case old token exists
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("token"); // legacy cleanup
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  try {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return { error: getErrorMessage(err, "Failed to send reset email") };
  }
};

// ======================================================
// 📊 DASHBOARD MODULE
// ======================================================
export const getDashboardData = async () => {
  try {
    const res = await api.get("/dashboard");
    return res.data;
  } catch (err) {
    console.warn("DASHBOARD ERROR → Using fallback data");

    // Fallback demo data
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
      ],
      meetings: [
        { title: "Introduction call", time: "08:00 – 08:50" },
        { title: "Sprint planning", time: "14:00 – 15:00" },
      ],
      projects: [
        { name: "Website redesign", progress: 75 },
        { name: "Mobile app", progress: 25 },
      ],
    };
  }
};

// ======================================================
// 👤 PORTFOLIO BUILDER MODULE
// ======================================================
export const getPortfolio = async () => {
  try {
    const res = await api.get("/portfolio");
    return res.data;
  } catch (err) {
    return { error: getErrorMessage(err, "Failed to load portfolio") };
  }
};

export const savePortfolio = async (portfolioData) => {
  try {
    const res = await api.post("/portfolio", portfolioData);
    return res.data;
  } catch (err) {
    return { error: getErrorMessage(err, "Failed to save portfolio") };
  }
};

// ======================================================
// 🤝 REAL-TIME COLLAB ROOMS
// ======================================================
export const getCollabRooms = async () => {
  try {
    const res = await api.get("/collaboration/rooms");
    return res.data;
  } catch (err) {
    return { error: getErrorMessage(err, "Failed to load rooms") };
  }
};

export const createCollabRoom = async (data) => {
  try {
    const res = await api.post("/collaboration/rooms", data);
    return res.data;
  } catch (err) {
    return { error: getErrorMessage(err, "Failed to create room") };
  }
};

// ======================================================
// 🚀 SHOWCASE FEED
// ======================================================
export const getShowcaseFeed = async () => {
  try {
    const res = await api.get("/showcase");
    return res.data;
  } catch (err) {
    return { error: getErrorMessage(err, "Failed to load showcase") };
  }
};

export const postShowcase = async (data) => {
  try {
    const res = await api.post("/showcase", data);
    return res.data;
  } catch (err) {
    return { error: getErrorMessage(err, "Failed to post project") };
  }
};

export const likeShowcase = async (id) => {
  try {
    const res = await api.post(`/showcase/${id}/like`);
    return res.data;
  } catch (err) {
    return { error: getErrorMessage(err, "Failed to like post") };
  }
};

// ======================================================
// 🔔 NOTIFICATIONS
// ======================================================
export const getNotifications = async () => {
  try {
    const res = await api.get("/notifications");
    return res.data;
  } catch (err) {
    return { error: getErrorMessage(err, "Failed to load notifications") };
  }
};

export const markNotificationRead = async (id) => {
  try {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  } catch (err) {
    return { error: getErrorMessage(err, "Failed to update notification") };
  }
};

// ------------------------------
//  CLEAR ALL NOTIFICATIONS
// ------------------------------
export const clearAllNotifications = async () => {
  try {
    const res = await api.delete(`/notifications/clear`);
    return res.data;
  } catch (err) {
    console.error("CLEAR NOTIFICATIONS ERROR:", err.response?.data || err.message);

    return {
      error: err.response?.data?.message || "Failed to clear notifications",
    };
  }
};

// ======================================================
// 🔁 EXPORT AXIOS INSTANCE
// ======================================================
export default api;