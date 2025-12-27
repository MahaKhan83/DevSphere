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

/* ---------- Sidebar Icons (Dashboard style) ---------- */
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

const ShowcaseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Zm4 8 2-2 2 2 4-4 2 2v4H8v-2Z" />
  </svg>
);

const CollabIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 12a3 3 0 1 1 2.82-4H14a3 3 0 1 1 0 2H9.82A3 3 0 0 1 7 12Zm10 10a3 3 0 1 1 2.82-4H20v2h-.18A3 3 0 0 1 17 22ZM4 18h10v2H4v-2Z" />
  </svg>
);

const BellSolidIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2Z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94a7.49 7.49 0 0 0 .05-.94 7.49 7.49 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.06 7.06 0 0 0-1.63-.94l-.36-2.54A.5 0 0 0 13.9 1h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.22-1.12.52-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 7.48a.5.5 0 0 0 .12.64l2.03 1.58c-.03.31-.05.63-.05.94s.02.63.05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.42 1.05.73 1.63.94l.36 2.54a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.54c.58-.22 1.12-.52 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" />
  </svg>
);

/* ---------- Tiny SVG Icons (Notifications UI) ---------- */
const BellIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
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

/* ---------- Sidebar helpers ---------- */
const IconWrap = ({ children }) => (
  <span className="w-9 h-9 rounded-xl bg-slate-800/80 text-slate-100 flex items-center justify-center">
    {children}
  </span>
);

const NavItem = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
      active
        ? "bg-slate-800 text-slate-50 font-semibold"
        : "text-slate-200/90 hover:bg-slate-800/60"
    }`}
  >
    <IconWrap>{icon}</IconWrap>
    <span>{label}</span>
  </button>
);

/* ---------- Helpers ---------- */
const typeMeta = (type) => {
  switch (type) {
    case "follow":
      return { label: "New follower", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-400" };
    case "invite":
      return { label: "Project invite", badge: "bg-sky-100 text-sky-700", dot: "bg-sky-400" };
    case "comment":
      return { label: "New comment", badge: "bg-violet-100 text-violet-700", dot: "bg-violet-400" };
    default:
      return { label: "Update", badge: "bg-slate-100 text-slate-700", dot: "bg-slate-400" };
  }
};

const formatTime = (t) => t || "Just now";

export default function Notifications() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // ✅ Dashboard sidebar toggle style
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ animations mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const [tab, setTab] = useState("all"); // all | unread | follow | invite | comment
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ ROUTES consistent with App.jsx (Collab = /collaboration)
  const NAV_ITEMS = [
    { label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
    { label: "Build portfolio", icon: <PortfolioIcon />, to: "/portfolio" },
    { label: "Showcase feed", icon: <ShowcaseIcon />, to: "/showcase" },
    { label: "Collab rooms", icon: <CollabIcon />, to: "/collaboration" }, // ✅ FIXED
    { label: "Notifications", icon: <BellSolidIcon />, to: "/notifications" },
    { label: "Settings", icon: <SettingsIcon />, to: "/settings" },
  ];

  // Load notifications
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getNotifications();
        if (res?.notifications) setItems(res.notifications);
        else {
          setItems([
            {
              _id: "n1",
              type: "follow",
              title: "New follower",
              message: "Ava Robinson started following you.",
              time: "2 hours ago",
              read: false,
              action: { label: "View profile", path: "/dashboard" },
            },
            {
              _id: "n2",
              type: "invite",
              title: "Project invite",
              message: "James invited you to join “DevSphere UI Kit”.",
              time: "Yesterday",
              read: false,
              action: { label: "Open project", path: "/dashboard" },
            },
            {
              _id: "n3",
              type: "comment",
              title: "New comment",
              message: "Sarah commented on your showcase post: “Nice work!”.",
              time: "3 days ago",
              read: true,
              action: { label: "Open post", path: "/dashboard" },
            },
          ]);
        }
      } catch (e) {
        console.error(e);
        setItems([
          {
            _id: "n1",
            type: "follow",
            title: "New follower",
            message: "Ava Robinson started following you.",
            time: "2 hours ago",
            read: false,
            action: { label: "View profile", path: "/dashboard" },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = [...items];

    if (tab === "unread") list = list.filter((n) => !n.read);
    if (["follow", "invite", "comment"].includes(tab)) list = list.filter((n) => n.type === tab);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (n) => (n.title || "").toLowerCase().includes(q) || (n.message || "").toLowerCase().includes(q)
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

  const isActive = (to) => location.pathname === to;

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

  const openAction = (n) => {
    if (n?.action?.path) navigate(n.action.path);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex overflow-hidden">
        {/* ✅ NAVY animated background */}
        <div className="pointer-events-none fixed inset-0">
          <div className="sfBlob sfBlob1" />
          <div className="sfBlob sfBlob2" />
          <div className="sfShimmer" />
        </div>

        {/* ✅ SIDEBAR (Dashboard style) */}
        <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
          <div className="flex items-center gap-3 px-2 mb-8">
            <img src={logo} alt="DevSphere" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="text-xl font-semibold">
              Dev<span className="text-cyan-300">Sphere</span>
            </span>
          </div>

          <nav className="flex-1 space-y-2">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.to}
                active={isActive(item.to)}
                icon={item.icon}
                label={item.label}
                onClick={() => navigate(item.to)}
              />
            ))}
          </nav>

          <div className="mt-6 flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold">
              {initials || "U"}
            </div>
            <div>
              <p className="text-sm font-medium truncate max-w-[140px]">{displayName}</p>
              <p className="text-xs text-slate-300">Signed in</p>
            </div>
          </div>
        </aside>

        {/* ✅ MAIN */}
        <main className="flex-1 p-6 md:p-8 relative">
          {/* Top Bar */}
          <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ${mounted ? "sfIn" : "sfPre"}`}>
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900 text-white shadow">
                    <BellIcon className="w-5 h-5" />
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
                onClick={handleClearAll}
                className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                Clear all
              </button>

              {/* ✅ navy button */}
              <button
                onClick={() => setTab("unread")}
                className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition shadow hover:-translate-y-[1px] active:translate-y-[1px]"
              >
                View unread
              </button>
            </div>
          </div>

          {/* Filters */}
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
                  { key: "follow", label: "Followers" },
                  { key: "invite", label: "Invites" },
                  { key: "comment", label: "Comments" },
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

          {/* List */}
          <div className={`bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden sfPulseBorder ${mounted ? "sfIn3" : "sfPre"}`}>
            {loading ? (
              <div className="p-6 text-sm text-slate-500">Loading notifications…</div>
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <BellIcon />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">No notifications</h3>
                <p className="text-sm text-slate-500 mt-1">You’re all caught up.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filtered.map((n, idx) => {
                  const meta = typeMeta(n.type);
                  return (
                    <li
                      key={n._id}
                      className={[
                        "p-4 md:p-5 flex items-start gap-4 transition sfRow",
                        n.read ? "bg-white" : "bg-slate-50/70",
                        "hover:bg-slate-50",
                        mounted ? "sfRowIn" : "sfRowPre",
                      ].join(" ")}
                      style={{ transitionDelay: `${Math.min(idx, 10) * 70}ms` }}
                    >
                      <div className="pt-2">
                        <span
                          className={`block w-2.5 h-2.5 rounded-full ${meta.dot} ${
                            n.read ? "opacity-30" : "opacity-100"
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${meta.badge}`}>
                            {meta.label}
                          </span>
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {n.title || meta.label}
                          </p>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-400">{formatTime(n.time)}</span>
                        </div>

                        <p className="text-sm text-slate-600 mt-1">{n.message}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {n?.action?.label ? (
                            <button
                              onClick={() => openAction(n)}
                              className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm hover:-translate-y-[1px] active:translate-y-[1px]"
                            >
                              {n.action.label}
                            </button>
                          ) : null}

                          {!n.read ? (
                            <button
                              onClick={() => handleMarkRead(n._id)}
                              className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition inline-flex items-center gap-1.5"
                            >
                              <CheckIcon />
                              Mark as read
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 px-3 py-1.5 rounded-full bg-slate-100">
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

      {/* ✅ NAVY ONLY animations + sidebar */}
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

        /* ✅ NAVY BLUE ONLY animated blobs */
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

        /* ✅ Entry animations */
        .sfPre{ opacity: 0; transform: translateY(12px); }
        .sfIn{ opacity: 1; transform: translateY(0); transition: all .6s cubic-bezier(.2,.8,.2,1); }
        .sfIn2{ opacity: 1; transform: translateY(0); transition: all .65s cubic-bezier(.2,.8,.2,1); transition-delay: .08s; }
        .sfIn3{ opacity: 1; transform: translateY(0); transition: all .7s cubic-bezier(.2,.8,.2,1); transition-delay: .12s; }

        /* ✅ Navy pulse border */
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

        /* ✅ List row animation */
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
      `}</style>
    </>
  );
}