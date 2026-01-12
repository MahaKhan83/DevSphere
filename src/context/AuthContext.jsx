// src/context/AuthContext.jsx
import React, { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(null);

const API_BASE =
  import.meta?.env?.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

// ✅ Keep your keys
const TOKEN_KEY = "devsphere_token";
const USER_KEY = "devsphere_user";

// ✅ Compatibility keys (because App.jsx + services/api.js use "token")
const LEGACY_TOKEN_KEY = "token";

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // ✅ Read token from BOTH keys (prefer devsphere_token, fallback to token)
  const [token, setToken] = useState(() => {
    return (
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(LEGACY_TOKEN_KEY) ||
      ""
    );
  });

  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const [loading, setLoading] = useState(false);

  // ✅ Save token/user to localStorage whenever they change
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      // ✅ also keep legacy token in sync so ProtectedRoute + axios work
      localStorage.setItem(LEGACY_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
    }

    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [token, user]);

  // Helper: make authenticated requests easily
  const authFetch = async (path, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    // ✅ Attach token
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

  // REGISTER
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

      return data;
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
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

      // ✅ Your backend currently returns token = user._id (simple token)
      const nextToken = data?.token || "";
      const nextUser = data?.user || null;

      setToken(nextToken);
      setUser(nextUser);

      // ✅ keep legacy token too (extra safety)
      if (nextToken) localStorage.setItem(LEGACY_TOKEN_KEY, nextToken);

      return data;
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // OPTIONAL: refresh (only if backend endpoint exists)
  const refreshMe = async () => {
    const t =
      token ||
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(LEGACY_TOKEN_KEY);

    if (!t) return null;

    try {
      const data = await authFetch("/api/auth/me", { method: "GET" });
      const nextUser = data?.user || data;
      setUser(nextUser);
      return nextUser;
    } catch {
      logout();
      return null;
    }
  };

  // On app start: optional refresh
  useEffect(() => {
    // If you DON'T have /api/auth/me, keep this commented.
    // refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAuthenticated = !!(
    token ||
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem(LEGACY_TOKEN_KEY)
  );

  // ✅ Role helpers (for your role module)
  const role = user?.role || "user";
  const isAdmin = role === "admin";
  const isModerator = role === "moderator";
  const isUser = role === "user";

  const hasRole = (roles = []) => {
    if (!user?.role) return false;
    return roles.includes(user.role);
  };

  const value = useMemo(
    () => ({
      API_BASE,
      token,
      user,
      loading,
      isAuthenticated,

      // ✅ expose setters because your Login.jsx uses setUser
      setUser,
      setToken,

      register,
      login,
      logout,
      refreshMe,
      authFetch,

      // roles
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