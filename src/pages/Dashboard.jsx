// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";
import { getDashboardData } from "../services/api";
import api from "../services/api"; // axios instance
import AdminPanel from "./AdminPanel"; // 🟢 Admin panel
import ModeratorPanel from "./ModeratorPanel"; // 🟣 Moderator panel

/* =========================
   Professional SVG Icons
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

const BellIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2Z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94a7.49 7.49 0 0 0 .05-.94 7.49 7.49 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.06 7.06 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 1h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.22-1.12.52-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 7.48a.5.5 0 0 0 .12.64l2.03 1.58c-.03.31-.05.63-.05.94s.02.63.05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.42 1.05.73 1.63.94l.36 2.54a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.54c.58-.22 1.12-.52 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
    <path
      d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M16.3 16.3 21 21"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

// Room Activity icons
const ChatIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h16v11a3 3 0 0 1-3 3H9l-5 4v-4H7a3 3 0 0 1-3-3V4Z" />
  </svg>
);

const TaskIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 11 7.5 9.5 6 11l3 3 9-9-1.5-1.5L9 11Z" />
    <path d="M4 4h16v16H4V4Zm2 2v12h12V6H6Z" />
  </svg>
);

/* =========================
   UI Helpers
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

const Dashboard = () => {
  // 🟢 role helpers from context
  const { user, role, isAdmin, isModerator, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const [query, setQuery] = useState("");

  const [announcements, setAnnouncements] = useState([]);
  const [roomActivity, setRoomActivity] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [unreadCount, setUnreadCount] = useState(0);

  const isOnline = true;

  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const activeRooms = useMemo(
    () => [
      { name: "Frontend Live Review", members: 4, status: "Active" },
      { name: "API Integration Room", members: 3, status: "Active" },
    ],
    []
  );

  const showcaseItems = useMemo(
    () => [
      { title: "DevSphere UI Kit", author: "Maha", likes: 32 },
      { title: "Realtime Collab Demo", author: "Ali", likes: 18 },
    ],
    []
  );

  const githubUsername = useMemo(() => {
    return (
      user?.githubUsername ||
      localStorage.getItem("devsphere_github_username") ||
      "Not connected"
    );
  }, [user]);

  const githubActivity = useMemo(
    () => ({
      username: githubUsername,
      commits: 14,
      prs: 3,
      issues: 2,
      streak: 6,
    }),
    [githubUsername]
  );

  /* ---------------------------
     Fetch Real Notification Count
  --------------------------- */
  const fetchRealNotificationCount = async () => {
    try {
      const response = await api.get("/notifications");

      const notifications = Array.isArray(response.data)
        ? response.data
        : response.data?.notifications || [];

      const totalUnread = notifications.filter((n) => !n.read).length;
      setUnreadCount(totalUnread);
    } catch (err) {
      console.warn("Could not fetch notification count:", err?.message);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      const defaultProjects = [
        { name: "Website redesign", progress: 75 },
        { name: "Mobile app", progress: 25 },
        { name: "Dashboard UI", progress: 50 },
        { name: "Portfolio Builder", progress: 60 },
        { name: "Collaboration Module", progress: 40 },
        { name: "Notification System", progress: 30 },
      ];

      try {
        const res = await getDashboardData();

        setAnnouncements(
          res?.announcements ?? [
            {
              title: "DevSphere update shipped",
              desc: "Showcase feed improvements and faster dashboard insights.",
              time: "2 hours ago",
            },
            {
              title: "Collaboration room improvements",
              desc: "Better room navigation and smoother join experience.",
              time: "Yesterday",
            },
            {
              title: "Planned maintenance",
              desc: "Minor backend updates scheduled this weekend.",
              time: "3 days ago",
            },
          ]
        );

        setRoomActivity(
          res?.roomActivity ?? [
            {
              title: "Collab Room Discussion (Frontend Sprint)",
              time: "14:00 – 14:30",
            },
            {
              title: "Code Review Thread (Portfolio Builder)",
              time: "16:00 – 16:20",
            },
          ]
        );

        if (res?.projects && Array.isArray(res.projects) && res.projects.length > 0) {
          setProjects(res.projects);
        } else {
          setProjects(defaultProjects);
        }

        if (typeof res?.unreadNotifications === "number") {
          setUnreadCount(res.unreadNotifications);
        } else {
          await fetchRealNotificationCount();
        }
      } catch (e) {
        console.error(e);
        setProjects(defaultProjects);
        setRoomActivity([
          {
            title: "Collab Room Discussion (Frontend Sprint)",
            time: "14:00 – 14:30",
          },
          {
            title: "Code Review Thread (Portfolio Builder)",
            time: "16:00 – 16:20",
          },
        ]);
        await fetchRealNotificationCount();
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName = user?.name || user?.email || "Guest";
  const initials = displayName
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const openAnnouncement = (item) =>
    navigate("/notifications", { state: { focus: item?.title } });

  const openProject = (project) =>
    navigate("/portfolio", { state: { focus: project?.name } });

  const openRoom = () => navigate("/collaboration");
  const openShowcase = () => navigate("/showcase");
  const openSettings = () => navigate("/settings");

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex overflow-hidden">
        <div className="pointer-events-none fixed inset-0">
          <div className="sfBlob sfBlob1" />
          <div className="sfBlob sfBlob2" />
          <div className="sfShimmer" />
        </div>

        {/* SIDEBAR */}
        <aside
          className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-2 mb-8 text-left"
            title="Go to Landing"
          >
            <img
              src={logo}
              alt="DevSphere"
              className="w-10 h-10 object-contain drop-shadow-md"
            />
            <span className="text-xl font-semibold">
              Dev<span className="text-cyan-300">Sphere</span>
            </span>
          </button>

          <nav className="flex-1 space-y-2">
            <NavItem
              active={location.pathname === "/dashboard"}
              icon={<DashboardIcon />}
              label="Dashboard"
              onClick={() => navigate("/dashboard")}
            />
            <NavItem
              active={location.pathname === "/portfolio"}
              icon={<PortfolioIcon />}
              label="Build portfolio"
              onClick={() => navigate("/portfolio")}
            />
            <NavItem
              active={location.pathname === "/collaboration"}
              icon={<CollabIcon />}
              label="Collab rooms"
              onClick={() => navigate("/collaboration")}
            />
            <NavItem
              active={location.pathname === "/showcase"}
              icon={<ShowcaseIcon />}
              label="Showcase feed"
              onClick={() => navigate("/showcase")}
            />
            <NavItem
              active={location.pathname === "/notifications"}
              icon={<BellIcon />}
              label="Notifications"
              badge={unreadCount > 0 ? unreadCount : null}
              onClick={() => navigate("/notifications")}
            />
            <NavItem
              active={location.pathname === "/settings"}
              icon={<SettingsIcon />}
              label="Settings"
              onClick={() => navigate("/settings")}
            />
          </nav>

          {/* Profile + Logout */}
          <div className="mt-6 space-y-2">
            <button
              onClick={openSettings}
              className="w-full flex items-center gap-3 px-2 text-left hover:bg-slate-800/40 rounded-xl py-2 transition"
              title="Open Settings"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold">
                  {initials || "U"}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f172a] ${
                    isOnline ? "bg-emerald-400" : "bg-slate-400"
                  }`}
                  title={isOnline ? "Online" : "Offline"}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate max-w-[160px]">
                  {displayName}
                </p>
                <p className="text-xs text-slate-300 truncate max-w-[160px]">
                  {isOnline ? "Online" : "Offline"} · Signed in
                </p>
                <p className="text-xs text-slate-300 truncate max-w-[160px]">
                  Role:{" "}
                  <span className="font-semibold text-slate-100">
                    {role || "user"}
                  </span>
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                logout?.();
                navigate("/login", { replace: true });
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-100 text-sm font-semibold transition"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 md:p-8 space-y-6 relative">
          {/* Top bar */}
          <div
            className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${
              mounted ? "sfIn" : "sfPre"
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                  Dashboard
                </h1>
                <p className="text-sm text-slate-700">
                  Welcome back,{" "}
                  <span className="font-semibold">{displayName}</span>.
                </p>
                <p className="text-xs text-slate-600 mt-1">{todayStr}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search bar with Enter key functionality */}
              <div className="relative w-full md:w-[360px]">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <SearchIcon />
                  </span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && query.trim()) {
                        // Enter press par search karein
                        alert(`Searching for: ${query}`);
                        setQuery("");
                      }
                    }}
                    placeholder="Search projects, rooms, showcase (Press Enter)"
                    className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button
                onClick={() => navigate("/notifications")}
                className="relative w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-300 transition"
                title="Notifications"
              >
                <BellIcon />
                {unreadCount > 0 ? (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-sky-500 text-white text-[11px] font-extrabold flex items-center justify-center">
                    {unreadCount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <section
            className={`cardShell sfPulseBorder p-4 ${
              mounted ? "sfIn2" : "sfPre"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Quick actions
                </h2>
                <p className="text-xs text-slate-700">
                  Jump into core DevSphere modules
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => navigate("/portfolio")} className="qaBtn">
                  Build Portfolio
                </button>
                <button
                  onClick={() => navigate("/collaboration")}
                  className="qaBtn"
                >
                  Join Rooms
                </button>
                <button
                  onClick={() => navigate("/showcase")}
                  className="qaBtn"
                >
                  Open Showcase
                </button>
                <button
                  onClick={() => navigate("/notifications")}
                  className="qaBtn"
                >
                  View Notifications
                </button>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="text-slate-700 text-sm">Loading dashboard</div>
          ) : (
            <div
              className={`grid grid-cols-1 xl:grid-cols-3 gap-6 auto-rows-fr ${
                mounted ? "sfIn3" : "sfPre"
              }`}
            >
              {/* LEFT */}
              <div className="xl:col-span-2 space-y-6">
                {/* 🟢 ADMIN PANEL – only for admin */}
                {isAdmin && <AdminPanel />}

                {/* 🟣 MODERATOR PANEL – only for moderator */}
                {isModerator && <ModeratorPanel />}

                {/* GitHub Widget */}
                <section
                  className="cardShell sfPulseBorder p-5 cursor-pointer"
                  onClick={() =>
                    navigate("/settings", { state: { tab: "integrations" } })
                  }
                  title="Connect GitHub in Settings"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      GitHub activity
                    </h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/settings", {
                          state: { tab: "integrations" },
                        });
                      }}
                      className="text-xs text-sky-700 hover:text-sky-600 font-semibold"
                    >
                      Connect / Manage
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="statBox">
                      <p className="statNum">{githubActivity.commits}</p>
                      <p className="statLbl">Commits</p>
                    </div>
                    <div className="statBox">
                      <p className="statNum">{githubActivity.prs}</p>
                      <p className="statLbl">Pull Requests</p>
                    </div>
                    <div className="statBox">
                      <p className="statNum">{githubActivity.issues}</p>
                      <p className="statLbl">Issues</p>
                    </div>
                    <div className="statBox">
                      <p className="statNum">{githubActivity.streak}d</p>
                      <p className="statLbl">Streak</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 mt-3">
                    Username:{" "}
                    <span className="font-semibold">
                      {githubActivity.username}
                    </span>
                  </p>
                </section>

                {/* Announcements */}
                <section className="cardShell sfPulseBorder p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Announcements
                    </h2>
                    <button
                      onClick={() => navigate("/notifications")}
                      className="text-xs text-sky-700 hover:text-sky-600 font-semibold"
                    >
                      View all
                    </button>
                  </div>

                  <div className="space-y-3">
                    {announcements.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => openAnnouncement(item)}
                        className="w-full text-left flex items-start justify-between gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 transition sfRow"
                        title="Open in Notifications"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-800 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                        <span className="text-xs text-slate-800 font-semibold whitespace-nowrap">
                          {item.time}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Recent Projects */}
                <section className="cardShell sfPulseBorder p-5 min-h-[420px]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Recent projects
                    </h2>
                    <button
                      onClick={() => navigate("/portfolio")}
                      className="text-xs text-sky-700 hover:text-sky-600 font-semibold"
                    >
                      View all
                    </button>
                  </div>

                  <div className="space-y-5">
                    {projects.length > 0 ? (
                      projects.map((project, idx) => (
                        <button
                          key={`${project.name}-${idx}`}
                          onClick={() => openProject(project)}
                          className="w-full text-left rounded-xl p-4 hover:bg-slate-50 transition border border-slate-200 sfRow bg-white"
                          title="Open in Portfolio Builder"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                                <span className="text-sky-600 font-bold text-sm">
                                  {project.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-slate-900">
                                  {project.name}
                                </h3>
                                <p className="text-xs text-slate-600">
                                  Last updated: Today
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                              {project.progress}%
                            </span>
                          </div>

                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-500"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>

                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-slate-600">
                              Progress
                            </span>
                            <span className="text-xs text-sky-600 font-medium">
                              View details
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-slate-600">No projects yet</p>
                        <button
                          onClick={() => navigate("/portfolio")}
                          className="mt-2 text-sm text-sky-600 hover:text-sky-700 font-medium"
                        >
                          Create project
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* RIGHT – equal-height cards */}
              <div className="grid grid-cols-1 gap-6 auto-rows-fr">
                {/* Collab Rooms */}
                <section className="cardShell sfPulseBorder p-5 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Live collab rooms
                    </h2>
                    <button
                      onClick={() => navigate("/collaboration")}
                      className="text-xs px-3 py-1 rounded-full bg-sky-500 text-white hover:bg-sky-400 transition"
                    >
                      New room
                    </button>
                  </div>

                  <div className="space-y-3 flex-1">
                    {activeRooms.map((room, idx) => (
                      <button
                        key={idx}
                        onClick={openRoom}
                        className="w-full text-left flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 hover:bg-slate-100 transition sfRow"
                        title="Open Collaboration Rooms"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {room.name}
                          </p>
                          <p className="text-xs text-slate-800">
                            {room.members} members · {room.status}
                          </p>
                        </div>

                        <span className="text-xs px-3 py-1 rounded-full bg-slate-900 text-white">
                          Join
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Room Activity */}
                <section className="cardShell sfPulseBorder p-5 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Room activity
                    </h2>
                    <button
                      onClick={() => navigate("/collaboration")}
                      className="text-xs text-sky-700 hover:text-sky-600 font-semibold"
                    >
                      Open rooms
                    </button>
                  </div>

                  <div className="space-y-3 flex-1">
                    {roomActivity.map((m, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate("/collaboration")}
                        className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 bg-slate-50 hover:bg-slate-100 transition sfRow"
                        title="Open collaboration rooms"
                      >
                        <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                          {idx === 0 ? <ChatIcon /> : <TaskIcon />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {m.title}
                          </p>
                          <p className="text-xs text-slate-800">{m.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Showcase */}
                <section className="cardShell sfPulseBorder p-5 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Showcase feed
                    </h2>
                    <button
                      onClick={openShowcase}
                      className="text-xs text-sky-700 hover:text-sky-600 font-semibold"
                    >
                      View feed
                    </button>
                  </div>

                  <div className="space-y-3 flex-1">
                    {showcaseItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={openShowcase}
                        className="w-full text-left flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 hover:bg-slate-100 transition sfRow"
                        title="Open Showcase Feed"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-800">
                            by {item.author}
                          </p>
                        </div>
                        <span className="text-xs text-slate-900 font-semibold">
                          ❤ {item.likes}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* CTA Box */}
                <section
                  className="ctaBox cursor-pointer sfRow h-full flex flex-col justify-between"
                  onClick={() => navigate("/collaboration")}
                  title="Join collaboration workspace"
                >
                  <div>
                    <h3 className="ctaTitle">Your workspace starts here</h3>
                    <p className="ctaDesc">
                      Join live rooms, discuss tasks, share snippets, and
                      collaborate in real time inside DevSphere.
                    </p>
                  </div>
                  <button className="ctaBtn">Join collaboration</button>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Styles */}
      <style>{`
        /* Sidebar show/hide */
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

        /* NAVY animated blobs */
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

        .cardShell{
          background: rgba(255,255,255,0.92);
          border-radius: 18px;
          border: 1px solid rgba(226,232,240,0.85);
          box-shadow: 0 10px 30px rgba(2,6,23,0.08);
          position: relative;
          overflow: hidden;
        }

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
          opacity: .22;
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
          box-shadow: 0 0 0 1px rgba(10, 28, 64, 0.18);
        }
        @keyframes sfBorderPulse{
          0%,100%{ opacity: .16; transform: scale(1); }
          50%{ opacity: .34; transform: scale(1.01); }
        }

        .sfRow{
          transition: transform .28s ease, box-shadow .28s ease, opacity .7s ease;
          will-change: transform;
        }
        .sfRow:hover{
          transform: translateY(-4px);
          box-shadow:
            0 18px 45px rgba(2,6,23,0.10),
            0 0 0 1px rgba(8, 30, 68, 0.08);
        }

        .qaBtn{
          padding: 9px 12px;
          border-radius: 999px;
          background: rgba(15,23,42,0.92);
          color: #fff;
          font-weight: 800;
          font-size: 12px;
          transition: transform .2s ease, filter .2s ease;
        }
        .qaBtn:hover{ transform: translateY(-2px); filter: brightness(1.05); }

        .statBox{
          border: 1px solid rgba(148,163,184,0.45);
          background: rgba(248,250,252,0.8);
          border-radius: 16px;
          padding: 12px;
        }
        .statNum{ font-size: 18px; font-weight: 900; color: rgb(15,23,42); }
        .statLbl{ font-size: 12px; font-weight: 700; color: rgb(51,65,85); margin-top: 2px; }

        .ctaBox{
          width: 100%;
          border-radius: 18px;
          padding: 18px;
          background: linear-gradient(180deg, rgba(14,165,233,0.95), rgba(2,132,199,0.95));
          border: 1px solid rgba(10,24,46,0.55);
          box-shadow: 0 16px 40px rgba(2,132,199,0.18);
        }
        .ctaTitle{ font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 8px; }
        .ctaDesc{ font-size: 13px; color: rgba(255,255,255,0.92); line-height: 1.4; margin-bottom: 14px; max-width: 44ch; }
        .ctaBtn{
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.95);
          color: rgb(2,132,199);
          font-weight: 800;
          font-size: 13px;
          transition: transform .2s ease, filter .2s ease;
        }
        .ctaBtn:hover{ transform: translateY(-2px); filter: brightness(0.98); }
      `}</style>
    </>
  );
};

export default Dashboard;