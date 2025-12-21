// src/services/api.js
import axios from "axios";

// Your backend API URL
const API_BASE_URL = "http://localhost:5000/api";

// ------------------------------
//  REGISTER
// ------------------------------
export const register = async (data) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return res.data;
  } catch (err) {
    console.error("REGISTER ERROR:", err.response?.data || err.message);

    return {
      error:
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Signup failed",
    };
  }
};

// ------------------------------
//  LOGIN
// ------------------------------
export const login = async (data) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, data);
    return res.data;
  } catch (err) {
    console.error("LOGIN ERROR:", err.response?.data || err.message);

    return {
      error:
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed",
    };
  }
};

// ------------------------------
//  FORGOT PASSWORD
// ------------------------------
export const forgotPassword = async (email) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      email,
    });
    return res.data;
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err.response?.data || err.message);

    return {
      error:
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to send reset email",
    };
  }
};

// ------------------------------
//  GET DASHBOARD DATA (Dynamic)
// ------------------------------
export const getDashboardData = async () => {
  try {
    // Attach token if exists
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_BASE_URL}/dashboard`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res.data;

  } catch (err) {
    console.warn(
      "DASHBOARD DATA ERROR (Fallback to sample data):",
      err.response?.data || err.message
    );

    // --- Fallback Data (if backend is not ready) ---
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