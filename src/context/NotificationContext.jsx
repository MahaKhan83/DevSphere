// src/context/NotificationContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { getNotifications, markNotificationRead, clearAllNotifications } from "../services/notificationApi";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ AUTO-REFRESH FUNCTION
  const loadNotifications = useCallback(async () => {
    try {
      const res = await getNotifications();
      console.log("🔄 Auto-refresh:", res.notifications?.length || 0, "notifications at", new Date().toLocaleTimeString());
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  }, []);

  // load notifications on mount + auto-refresh
  useEffect(() => {
    // ✅ FIRST LOAD
    const loadData = async () => {
      setLoading(true);
      await loadNotifications();
      setLoading(false);
    };
    loadData();

    // ✅ AUTO-REFRESH EVERY 10 SECONDS ⬅️ CHANGED TO 10 SECONDS
    const intervalId = setInterval(() => {
      loadNotifications();
    }, 10000); // ⬅️ 10 SECONDS = 10000 milliseconds

    // ✅ CLEANUP
    return () => clearInterval(intervalId);
  }, [loadNotifications]);

  const markRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    setNotifications([]);
    try {
      await clearAllNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, loading, markRead, clearAll, loadNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};