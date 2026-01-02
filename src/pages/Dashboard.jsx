// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";
import { getDashboardData } from "../services/api";

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
const UserRolesIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11Zm-8 0c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11Zm0 2c-2.67 0-8 1.34-8 4v1h12v-1c0-2.66-5.33-4-8-4Zm8 0c-.33 0-.71.02-1.12.06 1.12.82 1.92 1.94 1.92 3.44v1H24v-1c0-2.66-5.33-4-8-4Z" />
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

// Room Activity icons (no call)
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
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Search
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const [ddPos, setDdPos] = useState({ left: 0, top: 0, width: 0 });

  const [announcements, setAnnouncements] = useState([]);
  const [roomActivity, setRoomActivity] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Notification Counter (demo; later API)
  const [unreadCount, setUnreadCount] = useState(3);

  // Online Status (demo)
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

  // ✅ GitHub card reads from localStorage (Integration tab)
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
     Dropdown positioning (FIX)
  --------------------------- */
  const updateDropdownPos = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDdPos({
      left: rect.left,
      top: rect.bottom + 8,
      width: rect.width,
    });
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) updateDropdownPos();
  }, [searchOpen, query]);

  useEffect(() => {
    const onResize = () => searchOpen && updateDropdownPos();
    const onScroll = () => searchOpen && updateDropdownPos();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!query.trim()) setSearchOpen(false);
  }, [query]);

  /* ---------------------------
     Load dashboard
  --------------------------- */
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
            { title: "Collab Room Discussion (Frontend Sprint)", time: "14:00 – 14:30" },
            { title: "Code Review Thread (Portfolio Builder)", time: "16:00 – 16:20" },
          ]
        );

        if (res?.projects && Array.isArray(res.projects) && res.projects.length > 0) {
          setProjects(res.projects);
        } else {
          setProjects(defaultProjects);
        }

        if (typeof res?.unreadNotifications === "number") {
          setUnreadCount(res.unreadNotifications);
        }
      } catch (e) {
        console.error(e);
        setProjects(defaultProjects);
        setRoomActivity([
          { title: "Collab Room Discussion (Frontend Sprint)", time: "14:00 – 14:30" },
          { title: "Code Review Thread (Portfolio Builder)", time: "16:00 – 16:20" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const displayName = user?.name || user?.email || "Guest";
  const initials = displayName
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  /* ---------------------------
     Click helpers
  --------------------------- */
  const openAnnouncement = (item) =>
    navigate("/notifications", { state: { focus: item?.title } });

  const openProject = (project) =>
    navigate("/portfolio", { state: { focus: project?.name } });

  const openRoom = () => navigate("/collaboration");
  const openShowcase = () => navigate("/showcase");
  const openSettings = () => navigate("/settings");
  const openRoles = () => navigate("/roles");

  /* ---------------------------
     Search results
  --------------------------- */
  const searchResults = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];
    const pool = [
      ...projects.map((p) => ({ type: "project", title: p.name, onClick: () => openProject(p) })),
      ...activeRooms.map((r) => ({ type: "room", title: r.name, onClick: openRoom })),
      ...showcaseItems.map((s) => ({ type: "showcase", title: s.title, onClick: openShowcase })),
      ...announcements.map((a) => ({ type: "announcement", title: a.title, onClick: () => openAnnouncement(a) })),
    ];
    return pool.filter((x) => x.title.toLowerCase().includes(q)).slice(0, 6);
  }, [query, projects, activeRooms, showcaseItems, announcements]);

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex">
        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-2 mb-8 text-left"
            title="Go to Landing"
          >
            <img src={logo} alt="DevSphere" className="w-10 h-10 object-contain drop-shadow-md" />
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
  active={location.pathname === "/roles"}
  icon={<UserRolesIcon />}
  label="User roles"
  onClick={() => navigate("/roles")}
/>
            <NavItem
              active={location.pathname === "/notifications"}
              icon={<BellIcon />}
              label="Notifications"
              badge={unreadCount > 0 ? unreadCount : null}
              onClick={() => navigate("/notifications")}
            />
            {/* ✅ Calendar removed */}
            <NavItem
              active={location.pathname === "/settings"}
              icon={<SettingsIcon />}
              label="Settings"
              onClick={() => navigate("/settings")}
            />
          </nav>

          <button
            onClick={openSettings}
            className="mt-6 flex items-center gap-3 px-2 text-left hover:bg-slate-800/40 rounded-xl py-2 transition"
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

            <div className="min-w-0">
              <p className="text-sm font-medium truncate max-w-[160px]">{displayName}</p>
              <p className="text-xs text-slate-300 truncate max-w-[160px]">
                {isOnline ? "Online" : "Offline"} · Signed in
              </p>
            </div>
          </button>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 md:p-8 space-y-6 animate-pageIn">
          {/* Top bar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div className="animate-titleIn">
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-700">
                  Welcome back, <span className="font-semibold">{displayName}</span>.
                </p>
                <p className="text-xs text-slate-600 mt-1">{todayStr}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 animate-fadeIn">
              {/* ✅ Quick Search (fixed dropdown) */}
              <div ref={searchRef} className="relative w-full md:w-[360px]">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <SearchIcon />
                  </span>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSearchOpen(true);
                      requestAnimationFrame(updateDropdownPos);
                    }}
                    onFocus={() => {
                      setSearchOpen(true);
                      requestAnimationFrame(updateDropdownPos);
                    }}
                    placeholder="Quick search: projects, rooms, showcase"
                    className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>

                {/* ✅ DROPDOWN (position: fixed) — fixes overlay/stacking issues */}
                {searchOpen && query.trim() ? (
                  <div
                    className="fixed z-[99999] rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
                    style={{
                      left: ddPos.left,
                      top: ddPos.top,
                      width: ddPos.width,
                      maxHeight: 260,
                    }}
                  >
                    {searchResults.length > 0 ? (
                      <div className="max-h-[260px] overflow-auto">
                        {searchResults.map((r, i) => (
                          <button
                            key={`${r.type}-${i}`}
                            onClick={() => {
                              r.onClick();
                              setQuery("");
                              setSearchOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition flex items-start justify-between gap-3"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                              <p className="text-xs text-slate-600 capitalize">{r.type}</p>
                            </div>
                            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                              Open
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900">No results</p>
                        <p className="text-xs text-slate-600 mt-1">Try: portfolio, rooms, showcase</p>
                      </div>
                    )}
                  </div>
                ) : null}
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

              {/* ✅ New project removed */}
            </div>
          </div>

          {/* Quick Actions */}
          <section className="cardShell p-4 animate-cardIn delay-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Quick actions</h2>
                <p className="text-xs text-slate-700">Jump into core DevSphere modules</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => navigate("/portfolio")} className="qaBtn">
                  Build Portfolio
                </button>
                <button onClick={() => navigate("/collaboration")} className="qaBtn">
                  Join Rooms
                </button>
                <button onClick={() => navigate("/showcase")} className="qaBtn">
                  Open Showcase
                </button>
                <button onClick={() => navigate("/notifications")} className="qaBtn">
                  View Notifications
                </button>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="text-slate-700 text-sm">Loading dashboard</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* LEFT */}
              <div className="xl:col-span-2 space-y-6">
                {/* GitHub Widget (clickable connect) */}
                <section
                  className="cardShell p-5 animate-cardIn delay-2 cursor-pointer"
                  onClick={() => navigate("/settings", { state: { tab: "integrations" } })}
                  title="Connect GitHub in Settings"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">GitHub activity</h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/settings", { state: { tab: "integrations" } });
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
                    Username: <span className="font-semibold">{githubActivity.username}</span>
                  </p>
                </section>

                {/* Announcements */}
                <section className="cardShell p-5 animate-cardIn delay-3">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">Announcements</h2>
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
                        className="w-full text-left flex items-start justify-between gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 transition"
                        title="Open in Notifications"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-800 mt-0.5">{item.desc}</p>
                        </div>
                        <span className="text-xs text-slate-800 font-semibold whitespace-nowrap">
                          {item.time}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Recent Projects */}
                <section className="cardShell p-5 animate-cardIn delay-4 min-h-[420px]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">Recent projects</h2>
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
                          className="w-full text-left rounded-xl p-4 hover:bg-slate-50 transition border border-slate-200"
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
                                <h3 className="text-sm font-semibold text-slate-900">{project.name}</h3>
                                <p className="text-xs text-slate-600">Last updated: Today</p>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-slate-900">{project.progress}%</span>
                          </div>

                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-500"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>

                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-slate-600">Progress</span>
                            <span className="text-xs text-sky-600 font-medium">View details</span>
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

              {/* RIGHT */}
              <div className="space-y-6">
                {/* Collab Rooms */}
                <section className="cardShell p-5 animate-cardIn delay-3">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">Live collab rooms</h2>
                    <button
                      onClick={() => navigate("/collaboration")}
                      className="text-xs px-3 py-1 rounded-full bg-sky-500 text-white hover:bg-sky-400 transition"
                    >
                      New room
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activeRooms.map((room, idx) => (
                      <button
                        key={idx}
                        onClick={openRoom}
                        className="w-full text-left flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 hover:bg-slate-100 transition"
                        title="Open Collaboration Rooms"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{room.name}</p>
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
                <section className="cardShell p-5 animate-cardIn delay-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">Room activity</h2>
                    <button
                      onClick={() => navigate("/collaboration")}
                      className="text-xs text-sky-700 hover:text-sky-600 font-semibold"
                    >
                      Open rooms
                    </button>
                  </div>

                  <div className="space-y-3">
                    {roomActivity.map((m, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate("/collaboration")}
                        className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 bg-slate-50 hover:bg-slate-100 transition"
                        title="Open collaboration rooms"
                      >
                        <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                          {idx === 0 ? <ChatIcon /> : <TaskIcon />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{m.title}</p>
                          <p className="text-xs text-slate-800">{m.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Showcase */}
                <section className="cardShell p-5 animate-cardIn delay-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">Showcase feed</h2>
                    <button onClick={openShowcase} className="text-xs text-sky-700 hover:text-sky-600 font-semibold">
                      View feed
                    </button>
                  </div>

                  <div className="space-y-3">
                    {showcaseItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={openShowcase}
                        className="w-full text-left flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 hover:bg-slate-100 transition"
                        title="Open Showcase Feed"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-800">by {item.author}</p>
                        </div>
                        <span className="text-xs text-slate-900 font-semibold">❤ {item.likes}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* CTA Box */}
                <section
                  className="ctaBox animate-cardIn delay-5 cursor-pointer"
                  onClick={() => navigate("/collaboration")}
                  title="Join collaboration workspace"
                >
                  <h3 className="ctaTitle">Your workspace starts here</h3>
                  <p className="ctaDesc">
                    Join live rooms, discuss tasks, share snippets, and collaborate in real time inside DevSphere.
                  </p>
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
        }
        .sidebarOpen{ width: 288px; opacity:1; }
        .sidebarClosed{ width: 0px; padding: 24px 0px; opacity:0; }

        /* Cards */
        .cardShell{
          background: rgba(248,250,252,0.92);
          border-radius: 18px;
          border: 1px solid rgba(10, 24, 46, 0.65);
          box-shadow:
            0 10px 30px rgba(2,6,23,0.10),
            0 0 0 1px rgba(56,189,248,0.10);
          position: relative;
          overflow: hidden;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .cardShell::before{
          content:"";
          position:absolute;
          inset:-1px;
          border-radius: 18px;
          background: linear-gradient(120deg,
            rgba(10,24,46,0.95),
            rgba(56,189,248,0.40),
            rgba(10,24,46,0.95)
          );
          opacity: 0.32;
          filter: blur(10px);
          pointer-events:none;
        }
        .cardShell > * { position: relative; z-index: 1; }

        .cardShell:hover{
          transform: translateY(-3px);
          box-shadow:
            0 18px 45px rgba(2,6,23,0.14),
            0 0 22px rgba(56,189,248,0.22);
        }

        /* Quick Actions buttons */
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

        /* GitHub stats */
        .statBox{
          border: 1px solid rgba(148,163,184,0.45);
          background: rgba(248,250,252,0.8);
          border-radius: 16px;
          padding: 12px;
        }
        .statNum{ font-size: 18px; font-weight: 900; color: rgb(15,23,42); }
        .statLbl{ font-size: 12px; font-weight: 700; color: rgb(51,65,85); margin-top: 2px; }

        /* CTA Box */
        .ctaBox{
          width: 100%;
          border-radius: 18px;
          padding: 18px;
          background: linear-gradient(180deg, rgba(14,165,233,0.95), rgba(2,132,199,0.95));
          border: 1px solid rgba(10,24,46,0.75);
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

        /* Animations */
        @keyframes pageIn { from { opacity: 0; transform: translateY(14px);} to { opacity: 1; transform: translateY(0);} }
        .animate-pageIn { animation: pageIn .55s cubic-bezier(.2,.8,.2,1) both; }

        @keyframes titleIn { from { opacity: 0; transform: translateX(-16px);} to { opacity: 1; transform: translateX(0);} }
        .animate-titleIn { animation: titleIn .7s cubic-bezier(.2,.8,.2,1) both; }

        @keyframes fadeIn { from { opacity: 0;} to { opacity: 1;} }
        .animate-fadeIn { animation: fadeIn .8s ease-out both; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-cardIn { animation: cardIn .6s cubic-bezier(.2,.8,.2,1) both; }

        .delay-1{ animation-delay:.08s } .delay-2{ animation-delay:.16s } .delay-3{ animation-delay:.24s }
        .delay-4{ animation-delay:.32s } .delay-5{ animation-delay:.40s }
      `}</style>
    </>
  );
};

export default Dashboard;