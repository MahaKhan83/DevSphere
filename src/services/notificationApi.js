import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

// ✅ Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getNotifications = async () => {
  try {
    const res = await axios.get(API_URL, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("Error fetching notifications:", error.response?.data || error.message);
    throw error;
  }
};

export const markNotificationRead = async (id) => {
  try {
    // ✅ CORRECT URL: /api/notifications/read/:id (not /api/notifications/:id/read)
    await axios.put(`http://localhost:5000/api/notifications/read/${id}`, {}, getAuthHeaders());
  } catch (error) {
    console.error("Error marking as read:", error.response?.data || error.message);
    throw error;
  }
};

export const clearAllNotifications = async () => {
  try {
    // ✅ CORRECT URL: /api/notifications/clear (not /api/notifications)
    await axios.delete("http://localhost:5000/api/notifications/clear", getAuthHeaders());
  } catch (error) {
    console.error("Error clearing notifications:", error.response?.data || error.message);
    throw error;
  }
};