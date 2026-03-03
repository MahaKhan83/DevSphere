import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  getNotifications,
  markNotificationRead,
  clearAllNotifications,
} from "../services/notificationApi";
import socket from "../sockets/socket";
import { AuthContext } from "../context/AuthContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const myId = user?._id || user?.id || null;

  // ✅ AUTO-REFRESH FUNCTION (keep simple)
  const loadNotifications = useCallback(async () => {
    try {
      const res = await getNotifications();
      const list = res?.notifications || [];
      setNotifications(list);

      console.log(
        "🔄 Auto-refresh:",
        list.length,
        "notifications at",
        new Date().toLocaleTimeString()
      );
    } catch (err) {
      console.error("Error loading notifications:", err?.message || err);
    }
  }, []);

  // ✅ load notifications on mount + interval refresh (same)
  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      if (!alive) return;
      setLoading(true);
      await loadNotifications();
      if (!alive) return;
      setLoading(false);
    };

    loadData();

    const intervalId = setInterval(() => {
      loadNotifications();
    }, 5000); // 10 sec

    return () => {
      alive = false;
      clearInterval(intervalId);
    };
  }, [loadNotifications]);

  // ✅ Socket realtime refresh (badge + list update instantly)
  useEffect(() => {
    if (!myId) return;

    const join = () => {
      // join personal room/user channel on backend (same)
      console.log("👤 auth:join for notifications:", myId);
      socket.emit("auth:join", { userId: myId });
    };

    const onNew = () => {
      console.log("📩 notification:new -> refreshing");
      loadNotifications();
    };

    // ✅ connect only if needed
    try {
      if (!socket.connected) socket.connect();
    } catch {}

    // join now + after connect (both safe)
    join();
    socket.on("connect", join);

    // listen new notification
    socket.on("notification:new", onNew);

    return () => {
      socket.off("connect", join);
      socket.off("notification:new", onNew);
    };
  }, [myId, loadNotifications]);

  const markRead = async (id) => {
    // UI first
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );

    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error("markRead error:", err?.message || err);
      // optional rollback (agar chaho):
      // setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: false } : n)));
    }
  };

  const clearAll = async () => {
    setNotifications([]);
    try {
      await clearAllNotifications();
    } catch (err) {
      console.error("clearAll error:", err?.message || err);
    }
  };

  // ✅ UNREAD COUNT (fast + stable)
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        markRead,
        clearAll,
        loadNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};