// src/services/api.js
import axios from "axios";

// this must match your backend port + /api
const API_BASE_URL = "http://localhost:5000/api";

// SIGN UP
export const register = async (data) => {
  try {
    // this must match: app.post("/api/auth/register", ...) from server.js
    const res = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return res.data;
  } catch (err) {
    console.error("REGISTER ERROR:", err.response?.data || err.message);
    return {
      error: err.response?.data?.error || err.response?.data?.message || "Signup failed",
    };
  }
};

// LOGIN
export const login = async (data) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, data);
    return res.data;
  } catch (err) {
    console.error("LOGIN ERROR:", err.response?.data || err.message);
    return {
      error: err.response?.data?.error || err.response?.data?.message || "Login failed",
    };
  }
};

// FORGOT PASSWORD
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