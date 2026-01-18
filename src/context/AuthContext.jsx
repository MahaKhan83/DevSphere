// src/context/AuthContext.jsx
import React, { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(null);

// ✅ Backend base URL (env se lo, warna localhost)
const API_BASE =
  import.meta?.env?.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

// ✅ Main keys
const TOKEN_KEY = "devsphere_token";
const USER_KEY = "devsphere_user";

// ✅ Compatibility key (kuch jagah "token" use ho raha hai)
const LEGACY_TOKEN_KEY = "token";

// Safely parse JSON
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // ---------------- State ----------------

  // token: devsphere_token ya legacy token se
  const [token, setToken] = useState(() => {
    return (
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(LEGACY_TOKEN_KEY) ||
      ""
    );
  });

  // user: devsphere_user se
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // ---------------- LocalStorage Sync ----------------

  useEffect(() => {
    // token sync
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(LEGACY_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
    }

    // user sync
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [token, user]);

  // ---------------- Helper: authFetch ----------------

  const authFetch = async (path, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    const t =
      token ||
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(LEGACY_TOKEN_KEY);

    if (t) headers.Authorization = `Bearer ${t}`;

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const data = await safeJson(res);

    if (!res.ok) {
      const msg = data?.message || data?.error || "Request failed";
      throw new Error(msg);
    }

    return data;
  };

  // ---------------- REGISTER ----------------

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await safeJson(res);

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Registration failed");
      }

      // signup ke baad hum auto-login nahi kar rahe
      return data;
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGIN (IMPORTANT FIX) ----------------

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await safeJson(res);

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Login failed");
      }

      // Debug ke liye dekh sakti ho backend kya bhej raha:
      console.log("LOGIN RESPONSE:", data);

      const nextToken = data?.token || "";

      // 👉 Yahan ensure kar rahe hain ke user ke andar role hamesha ho
      const rawUser = data?.user || null;
      const nextUser = rawUser
        ? {
            ...rawUser,
            role: rawUser.role || "user", // agar backend bhool bhi jaye to kam az kam "user"
          }
        : null;

      setToken(nextToken);
      setUser(nextUser);

      if (nextToken) {
        localStorage.setItem(LEGACY_TOKEN_KEY, nextToken);
      }

      // Login.jsx ko updated user wapas mile jisme role confirm hai
      return { ...data, user: nextUser };
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGOUT ----------------

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // ---------------- OPTIONAL: refreshMe ----------------

  const refreshMe = async () => {
    const t =
      token ||
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(LEGACY_TOKEN_KEY);

    if (!t) return null;

    try {
      // Agar backend me /api/auth/me route hai to ye use karo
      const data = await authFetch("/api/auth/me", { method: "GET" });
      const nextUser = data?.user || data || null;

      if (nextUser) {
        setUser(nextUser);
      }

      return nextUser;
    } catch {
      logout();
      return null;
    }
  };

  // (Agar tumhare paas /api/auth/me nahi hai to ye useEffect commented rehne do)
  useEffect(() => {
    // refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- Role Helpers ----------------

  const isAuthenticated = !!(
    token ||
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem(LEGACY_TOKEN_KEY)
  );

  const role = user?.role || "user";
  const isAdmin = role === "admin";
  const isModerator = role === "moderator";
  const isUser = role === "user";

  const hasRole = (roles = []) => {
    if (!user?.role) return false;
    return roles.includes(user.role);
  };

  // ---------------- Context Value ----------------

  const value = useMemo(
    () => ({
      API_BASE,
      token,
      user,
      loading,
      isAuthenticated,

      setUser,
      setToken,

      register,
      login,
      logout,
      refreshMe,
      authFetch,

      role,
      isAdmin,
      isModerator,
      isUser,
      hasRole,
    }),
    [token, user, loading, isAuthenticated, role, isAdmin, isModerator, isUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}