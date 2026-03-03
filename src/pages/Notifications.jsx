// src/pages/Notifications.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";
import {
  getNotifications,
  markNotificationRead,
  clearAllNotifications,
} from "../services/api";

/* =========================
   Professional SVG Icons (same as Dashboard.jsx)
========================= */
const DashboardIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-9h7V4h-7v7Z" />
  </svg>
);

const PortfolioIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4h4a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2h3V6a2 2 0 0 1 2-2Zm5 3V6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1h6Z" />
  </svg>
);

const CollabIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 12a3 3 0 1 1 2.82-4H14a3 3 0 1 1 0 2H9.82A3 3 0 0 1 7 12Zm10 10a3 3 0 1 1 2.82-4H20v2h-.18A3 3 0 0 1 17 22ZM4 18h10v2H4v-2Z" />
  </svg>
);

const ShowcaseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Zm4 8 2-2 2 2 4-4 2 2v4H8v-2Z" />
  </svg>
);

const BellSolidIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2Z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94a7.49 7.49 0 0 0 .05-.94a7.49 7.49 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.06 7.06 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 1h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.22-1.12.52-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 7.48a.5.5 0 0 0 .12.64l2.03 1.58c-.03.31-.05.63-.05.94s.02.63.05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.42 1.05.73 1.63.94l.36 2.54a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.54c.58-.22 1.12-.52 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" />
  </svg>
);

/* ---------- Tiny SVG Icons ---------- */
const BellLineIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
    <path d="M9 17a3 3 0 0 0 6 0" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const FilterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);

const RefreshIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <path d="M21 3v6h-6" />
  </svg>
);

/* =========================
   Sidebar Helpers
========================= */
const IconWrap = ({ children }) => (
  <span className="w-9 h-9 rounded-xl bg-slate-800/80 text-slate-100 flex items-center justify-center">
    {children}
  </span>
);

const BadgePill = ({ children }) => (
  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-sky-500 text-white">
    {children}
  </span>
);

const NavItem = ({ active, icon, label, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
      active
        ? "bg-slate-800 text-slate-50 font-semibold"
        : "text-slate-200/90 hover:bg-slate-800/60"
    }`}
  >
    <span className="flex items-center gap-3">
      <IconWrap>{icon}</IconWrap>
      <span>{label}</span>
    </span>
    {badge ? <BadgePill>{badge}</BadgePill> : null}
  </button>
);

/* =========================
   Notification grouping + badges
========================= */
const safe = (v) => (v || "").toString();
const upper = (v) => safe(v).toUpperCase();

// ✅ GUARANTEED grouping based on your current notification text
const getGroup = (n) => {
  const t = upper(n?.type);
  const title = upper(n?.title);
  const msg = upper(n?.message);

  // Prefer entityType if backend sends it
  if (n?.entityType === "room") return "rooms";
  if (n?.entityType === "project") return "projects";
  if (n?.entityType === "post") return "comments";

  // ✅ ROOMS (covers your screenshots)
  if (
    title.includes("ROOM") ||
    title.includes("REQUEST APPROVED") ||
    title.includes("REQUEST REJECT") ||
    title.includes("COLLABORATION REQUEST") ||
    msg.includes("REQUESTED TO JOIN") ||
    msg.includes("REQUEST TO JOIN") ||
    t.includes("ROOM") ||
    t.includes("JOIN")
  ) {
    return "rooms";
  }

  // ✅ PROJECTS (work request / invite)
  if (title.includes("PROJECT") || t.includes("PROJECT") || t.includes("WORK") || t.includes("INVITE")) {
    return "projects";
  }

  // ✅ COMMENTS (showcase)
  if (title.includes("COMMENT") || msg.includes("COMMENT") || t.includes("COMMENT")) {
    return "comments";
  }

  return "other";
};

const typeMeta = (n) => {
  const title = upper(n?.title);
  const msg = upper(n?.message);
  const group = getGroup(n);

  if (group === "rooms") {
    if (title.includes("APPROV") || msg.includes("WAS APPROVED")) {
      return { label: "Room Approved", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" };
    }
    if (title.includes("REJECT") || msg.includes("WAS REJECTED")) {
      return { label: "Room Rejected", badge: "bg-rose-100 text-rose-700", dot: "bg-rose-400" };
    }
    if (title.includes("ROOM CREATED") || msg.includes("YOU CREATED")) {
      return { label: "Room Created", badge: "bg-sky-100 text-sky-700", dot: "bg-sky-400" };
    }
    if (title.includes("COLLABORATION REQUEST") || msg.includes("REQUESTED TO JOIN")) {
      return { label: "Room Join Request", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" };
    }
    return { label: "Room Update", badge: "bg-slate-100 text-slate-700", dot: "bg-slate-400" };
  }

  if (group === "projects") {
    return { label: "Project", badge: "bg-sky-100 text-sky-700", dot: "bg-sky-400" };
  }

  if (group === "comments") {
    return { label: "Comment", badge: "bg-violet-100 text-violet-700", dot: "bg-violet-400" };
  }

  return { label: "Update", badge: "bg-slate-100 text-slate-700", dot: "bg-slate-400" };
};

/* ✅ time formatter */
const formatTime = (timestamp) => {
  if (!timestamp) return "Just now";
  if (
    typeof timestamp === "string" &&
    (timestamp.includes("ago") || timestamp.includes("hour") || timestamp.includes("day") || timestamp.includes("minute") || timestamp.includes("second"))
  ) return timestamp;

  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffSeconds < 30) return "Just now";
    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return `${diffDays} days ago`;
  } catch {
    return "Just now";
  }
};

export default function Notifications() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  // ✅ NEW tabs
  const [tab, setTab] = useState("all"); // all | unread | rooms | projects | comments
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isOnline = true;

  const loadNotifications = async (opts = { showSpinner: true }) => {
    if (opts.showSpinner) setLoading(true);
    setRefreshing(true);
    try {
      const res = await getNotifications();
      setItems(res?.notifications || []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications({ showSpinner: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let list = [...items];

    if (tab === "unread") list = list.filter((n) => !n.read);
    if (["rooms", "projects", "comments"].includes(tab)) {
      list = list.filter((n) => getGroup(n) === tab);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (n) =>
          (n.title || "").toLowerCase().includes(q) ||
          (n.message || "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [items, tab, query]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const displayName = user?.name || user?.email || "Guest";
  const initials = displayName
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const resolveTarget = (n) => {
    if (n?.action?.path && n.action.path !== "/dashboard") {
      return { to: n.action.path, state: n.action.state || {} };
    }
    if (n?.entityType === "room") return { to: "/collaboration", state: {} };
    if (n?.entityType === "project") return { to: "/showcase", state: {} };
    if (n?.entityType === "post") return { to: "/showcase", state: { postId: n?.postId } };

    const group = getGroup(n);
    if (group === "rooms") return { to: "/collaboration", state: {} };
    if (group === "projects") return { to: "/showcase", state: {} };
    if (group === "comments") return { to: "/showcase", state: {} };

    return { to: "/notifications", state: {} };
  };

  const openAction = async (n) => {
    if (!n) return;

    if (!n.read) {
      setItems((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
      try {
        await markNotificationRead(n._id);
      } catch (e) {
        console.error(e);
      }
    }

    const target = resolveTarget(n);
    navigate(target.to, { state: target.state || {} });
  };

  const handleMarkRead = async (id) => {
    setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    try {
      await markNotificationRead(id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    setItems([]);
    try {
      await clearAllNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    await loadNotifications({ showSpinner: false });
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex overflow-hidden">
        <div className="pointer-events-none fixed inset-0">
          <div className="sfBlob sfBlob1" />
          <div className="sfBlob sfBlob2" />
          <div className="sfShimmer" />
        </div>

        <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
          <button onClick={() => navigate("/")} className="flex items-center gap-3 px-2 mb-8 text-left" title="Go to Landing">
            <img src={logo} alt="DevSphere" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="text-xl font-semibold">
              Dev<span className="text-cyan-300">Sphere</span>
            </span>
          </button>

          <nav className="flex-1 space-y-2">
            <NavItem active={location.pathname === "/dashboard"} icon={<DashboardIcon />} label="Dashboard" onClick={() => navigate("/dashboard")} />
            <NavItem active={location.pathname === "/portfolio"} icon={<PortfolioIcon />} label="Build portfolio" onClick={() => navigate("/portfolio")} />
            <NavItem active={location.pathname === "/collaboration"} icon={<CollabIcon />} label="Collab rooms" onClick={() => navigate("/collaboration")} />
            <NavItem active={location.pathname === "/showcase"} icon={<ShowcaseIcon />} label="Showcase feed" onClick={() => navigate("/showcase")} />
            <NavItem
              active={location.pathname === "/notifications"}
              icon={<BellSolidIcon />}
              label="Notifications"
              badge={unreadCount > 0 ? unreadCount : null}
              onClick={() => navigate("/notifications")}
            />
            <NavItem active={location.pathname === "/settings"} icon={<SettingsIcon />} label="Settings" onClick={() => navigate("/settings")} />
          </nav>

          <button
            onClick={() => navigate("/settings")}
            className="mt-6 flex items-center gap-3 px-2 text-left hover:bg-slate-800/40 rounded-xl py-2 transition"
            title="Open Settings"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold">
                {initials || "U"}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f172a] ${isOnline ? "bg-emerald-400" : "bg-slate-400"}`}
              />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium truncate max-w-[160px]">{displayName}</p>
              <p className="text-xs text-slate-300 truncate max-w-[160px]">{isOnline ? "Online" : "Offline"} · Signed in</p>
            </div>
          </button>
        </aside>

        <main className="flex-1 p-6 md:p-8 relative">
          <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ${mounted ? "sfIn" : "sfPre"}`}>
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center"
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900 text-white shadow">
                    <BellLineIcon className="w-5 h-5" />
                  </span>
                  Notifications
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  You have <span className="font-semibold text-slate-700">{unreadCount}</span> unread notifications.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={[
                  "px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium transition inline-flex items-center gap-2",
                  refreshing ? "opacity-70 cursor-not-allowed" : "hover:bg-slate-50",
                ].join(" ")}
              >
                <span className={refreshing ? "sfSpin" : ""}>
                  <RefreshIcon />
                </span>
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                Clear all
              </button>

              <button
                onClick={() => setTab("unread")}
                className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition shadow"
              >
                View unread
              </button>
            </div>
          </div>

          <div className={`bg-white border border-slate-100 rounded-2xl shadow-sm p-4 md:p-5 mb-6 sfPulseBorder ${mounted ? "sfIn2" : "sfPre"}`}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <FilterIcon />
                <span className="text-sm font-semibold">Filters</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: "All" },
                  { key: "unread", label: "Unread" },
                  { key: "rooms", label: "Rooms" },
                  { key: "projects", label: "Projects" },
                  { key: "comments", label: "Comments" },
                ].map((t) => {
                  const active = tab === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={[
                        "px-4 py-2 rounded-full text-sm font-medium transition",
                        active
                          ? "bg-slate-900 text-white shadow"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200",
                      ].join(" ")}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notifications…"
                className="w-full lg:w-[320px] px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/30 transition"
              />
            </div>
          </div>

          <div className={`bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden sfPulseBorder ${mounted ? "sfIn3" : "sfPre"}`}>
            {loading ? (
              <div className="p-6 text-sm text-slate-500">Loading notifications…</div>
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <BellLineIcon />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">No notifications</h3>
                <p className="text-sm text-slate-500 mt-1">You're all caught up.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filtered.map((n, idx) => {
                  const meta = typeMeta(n);
                  return (
                    <li
                      key={n._id}
                      onClick={() => openAction(n)}
                      className={[
                        "p-4 md:p-5 flex items-start gap-4 transition sfRow cursor-pointer",
                        n.read ? "bg-white" : "bg-slate-50/70",
                        "hover:bg-slate-50",
                        mounted ? "sfRowIn" : "sfRowPre",
                      ].join(" ")}
                      style={{ transitionDelay: `${Math.min(idx, 10) * 70}ms` }}
                    >
                      <div className="pt-2">
                        <span className={`block w-2.5 h-2.5 rounded-full ${meta.dot} ${n.read ? "opacity-30" : "opacity-100"}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${meta.badge}`}>
                            {meta.label}
                          </span>
                          <p className="text-sm font-semibold text-slate-900 truncate">{n.title || meta.label}</p>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-400">{formatTime(n.time || n.createdAt)}</span>
                        </div>

                        <p className="text-sm text-slate-600 mt-1">{n.message}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {n?.action?.label ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openAction(n);
                              }}
                              className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm"
                            >
                              {n.action.label}
                            </button>
                          ) : null}

                          {!n.read ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkRead(n._id);
                              }}
                              className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition inline-flex items-center gap-1.5"
                            >
                              <CheckIcon />
                              Mark as read
                            </button>
                          ) : (
                            <span
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-slate-400 px-3 py-1.5 rounded-full bg-slate-100"
                            >
                              Read
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </main>
      </div>

      <style>{`
        .sidebar{
          background: #0f172a;
          color: #f8fafc;
          display:flex;
          flex-direction:column;
          padding: 24px 16px;
          overflow:hidden;
          transition: width .25s ease, padding .25s ease, opacity .25s ease;
          z-index: 10;
        }
        .sidebarOpen{ width: 288px; opacity:1; }
        .sidebarClosed{ width: 0px; padding: 24px 0px; opacity:0; }

        .sfBlob{
          position:absolute;
          width: 560px;
          height: 560px;
          border-radius: 999px;
          filter: blur(95px);
          opacity: .34;
          animation: sfFloat 14s ease-in-out infinite;
          background: radial-gradient(circle at 30% 30%,
            rgba(12, 42, 92, 0.65),
            rgba(6, 22, 58, 0.35),
            rgba(3, 12, 28, 0)
          );
        }
        .sfBlob1{ left: -180px; top: -180px; }
        .sfBlob2{
          right: -220px; bottom: -260px;
          width: 650px; height: 650px;
          opacity: .28;
          animation-duration: 18s;
        }

        .sfShimmer{
          position:absolute;
          inset:-2px;
          pointer-events:none;
          background:
            linear-gradient(120deg,
              rgba(3, 12, 28, 0) 0%,
              rgba(12, 42, 92, 0.22) 45%,
              rgba(3, 12, 28, 0) 70%
            );
          mix-blend-mode: multiply;
          opacity: .55;
          transform: translateX(-30%);
          animation: sfSweep 6.5s ease-in-out infinite;
        }

        @keyframes sfFloat{
          0%{ transform: translate(0px,0px) scale(1); }
          50%{ transform: translate(32px,-28px) scale(1.06); }
          100%{ transform: translate(0px,0px) scale(1); }
        }
        @keyframes sfSweep{
          0%{ transform: translateX(-35%) skewX(-8deg); opacity:.25; }
          50%{ transform: translateX(30%) skewX(-8deg); opacity:.65; }
          100%{ transform: translateX(-35%) skewX(-8deg); opacity:.25; }
        }

        .sfPre{ opacity: 0; transform: translateY(12px); }
        .sfIn{ opacity: 1; transform: translateY(0); transition: all .6s cubic-bezier(.2,.8,.2,1); }
        .sfIn2{ opacity: 1; transform: translateY(0); transition: all .65s cubic-bezier(.2,.8,.2,1); transition-delay: .08s; }
        .sfIn3{ opacity: 1; transform: translateY(0); transition: all .7s cubic-bezier(.2,.8,.2,1); transition-delay: .12s; }

        .sfPulseBorder{ position: relative; }
        .sfPulseBorder::before{
          content:"";
          position:absolute;
          inset:-1px;
          border-radius: 18px;
          background: linear-gradient(120deg,
            rgba(8, 30, 68, 0.85),
            rgba(12, 42, 92, 0.35),
            rgba(8, 30, 68, 0.85)
          );
          opacity: .28;
          filter: blur(10px);
          pointer-events:none;
          animation: sfBorderPulse 4.2s ease-in-out infinite;
        }
        .sfPulseBorder::after{
          content:"";
          position:absolute;
          inset:0;
          border-radius: 18px;
          pointer-events:none;
          box-shadow: 0 0 0 1px rgba(10, 28, 64, 0.30);
        }
        @keyframes sfBorderPulse{
          0%,100%{ opacity: .18; transform: scale(1); }
          50%{ opacity: .40; transform: scale(1.01); }
        }

        .sfRow{
          transition: transform .28s ease, box-shadow .28s ease, opacity .7s ease;
          will-change: transform;
        }
        .sfRow:hover{
          transform: translateY(-4px);
          box-shadow:
            0 18px 45px rgba(2,6,23,0.10),
            0 0 0 1px rgba(8, 30, 68, 0.10);
        }
        .sfRowPre{ opacity: 0; transform: translateY(18px); }
        .sfRowIn{ opacity: 1; transform: translateY(0); }

        .sfSpin{
          display:inline-flex;
          animation: sfSpin 0.85s linear infinite;
        }
        @keyframes sfSpin{
          from{ transform: rotate(0deg); }
          to{ transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}