// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";
import { getDashboardData } from "../services/api";

// ---------- Professional SVG Icons (ShowcaseFeed style) ----------
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

const CalendarIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 2v3M17 2v3M3.5 7h17M3.5 4.5h17v17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-17ZM7.5 11h4M7.5 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94a7.49 7.49 0 0 0 .05-.94 7.49 7.49 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.06 7.06 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 1h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.22-1.12.52-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 7.48a.5.5 0 0 0 .12.64l2.03 1.58c-.03.31-.05.63-.05.94s.02.63.05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.42 1.05.73 1.63.94l.36 2.54a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.54c.58-.22 1.12-.52 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" />
  </svg>
);

// ---------- Updated IconWrap Component (ShowcaseFeed style) ----------
const IconWrap = ({ children }) => (
  <span className="w-9 h-9 rounded-xl bg-slate-800/80 text-slate-100 flex items-center justify-center">
    {children}
  </span>
);

// ---------- Reusable Nav Item ----------
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

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Sidebar hide/unhide
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [announcements, setAnnouncements] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeRooms = useMemo(
    () => [
      { name: "Frontend live review", members: 4, status: "Active" },
      { name: "API integration session", members: 3, status: "Active" },
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

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      // ✅ Default projects (from your image)
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
              title: "New DevSphere release",
              desc: "v1.3 ships with live code rooms and improved insights.",
              time: "2 hours ago",
            },
            {
              title: "Team stand-up schedule",
              desc: "Daily stand-up moved to 10:00 AM for all frontend squads.",
              time: "Yesterday",
            },
            {
              title: "Maintenance window",
              desc: "Planned downtime on Saturday 01:00–02:00 AM UTC.",
              time: "3 days ago",
            },
          ]
        );

        setMeetings(
          res?.meetings ?? [
            { title: "Introduction call", time: "08:00 – 08:30" },
            { title: "Sprint planning", time: "14:00 – 15:00" },
          ]
        );

        // ✅ Always use default projects if API doesn't return any
        if (res?.projects && Array.isArray(res.projects) && res.projects.length > 0) {
          setProjects(res.projects);
        } else {
          setProjects(defaultProjects);
        }
      } catch (e) {
        console.error(e);
        // On error, use default projects
        setProjects([
          { name: "Website redesign", progress: 75 },
          { name: "Mobile app", progress: 25 },
          { name: "Dashboard UI", progress: 50 },
          { name: "Portfolio Builder", progress: 60 },
          { name: "Collaboration Module", progress: 40 },
          { name: "Notification System", progress: 30 },
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

  return (
    <>
      {/* ✅ Page background = off-white */}
      <div className="min-h-screen bg-slate-100 flex">
        {/* SIDEBAR (toggleable) */}
        <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <img
              src={logo}
              alt="DevSphere"
              className="w-10 h-10 object-contain drop-shadow-md"
            />
            <span className="text-xl font-semibold">
              Dev<span className="text-cyan-300">Sphere</span>
            </span>
          </div>

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
              onClick={() => navigate("/notifications")}
            />
            <NavItem
              active={location.pathname === "/calendar"}
              icon={<CalendarIcon />}
              label="Calendar"
              onClick={() => navigate("/calendar")}
            />
            <NavItem
              active={location.pathname === "/settings"}
              icon={<SettingsIcon />}
              label="Settings"
              onClick={() => navigate("/settings")}
            />
          </nav>

          <div className="mt-6 flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold">
              {initials || "U"}
            </div>
            <div>
              <p className="text-sm font-medium truncate max-w-[140px]">
                {displayName}
              </p>
              <p className="text-xs text-slate-300">Signed in</p>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 md:p-8 space-y-6 animate-pageIn">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              {/* ✅ Sidebar toggle button */}
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div className="animate-titleIn">
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                  Dashboard
                </h1>
                <p className="text-sm text-slate-700">
                  Welcome back,{" "}
                  <span className="font-semibold">{displayName}</span>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 animate-fadeIn">
              <button
                onClick={() => navigate("/notifications")}
                className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-300 transition"
                title="Notifications"
              >
                🔔
              </button>
              <button className="px-4 py-2 rounded-full bg-sky-500 text-white text-sm font-semibold hover:bg-sky-400 transition shadow hover:-translate-y-[2px] active:translate-y-[1px]">
                New project
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-slate-700 text-sm">Loading dashboard…</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* LEFT */}
              <div className="xl:col-span-2 space-y-6">
                {/* Announcements */}
                <section className="cardShell p-5 animate-cardIn delay-1">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Announcements
                    </h2>
                    <button className="text-xs text-sky-700 hover:text-sky-600 font-semibold">
                      View all
                    </button>
                  </div>
                  <div className="space-y-3">
                    {announcements.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => alert(`Announcement: ${item.title}`)}
                        className="w-full text-left flex items-start justify-between gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 transition"
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

                {/* Recent Projects - FIXED SECTION */}
                <section className="cardShell p-5 animate-cardIn delay-2 min-h-[420px]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Recent projects
                    </h2>
                    <button className="text-xs text-sky-700 hover:text-sky-600 font-semibold">
                      View all
                    </button>
                  </div>

                  <div className="space-y-5">
                    {projects.length > 0 ? (
                      projects.map((project, idx) => (
                        <div
                          key={`${project.name}-${idx}`}
                          className="w-full rounded-xl p-4 hover:bg-slate-50 transition border border-slate-200"
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
                            <button
                              onClick={() => alert(`Open project: ${project.name}`)}
                              className="text-xs text-sky-600 hover:text-sky-700 font-medium"
                            >
                              View details →
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-slate-600">No projects yet</p>
                        <button
                          onClick={() => alert("Create new project")}
                          className="mt-2 text-sm text-sky-600 hover:text-sky-700 font-medium"
                        >
                          + Create your first project
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
                    <h2 className="text-lg font-semibold text-slate-900">
                      Live collab rooms
                    </h2>
                    <button className="text-xs px-3 py-1 rounded-full bg-sky-500 text-white hover:bg-sky-400 transition">
                      + New room
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activeRooms.map((room, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {room.name}
                          </p>
                          <p className="text-xs text-slate-800">
                            {room.members} members · {room.status}
                          </p>
                        </div>
                        <button
                          onClick={() => navigate("/collaboration")}
                          className="text-xs px-3 py-1 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition"
                        >
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Upcoming meetings */}
                <section className="cardShell p-5 animate-cardIn delay-4">
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">
                    Upcoming meetings
                  </h2>
                  <div className="space-y-3">
                    {meetings.map((m, idx) => (
                      <button
                        key={idx}
                        onClick={() => alert(`Meeting: ${m.title}`)}
                        className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 bg-slate-50 hover:bg-slate-100 transition"
                      >
                        <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 text-lg">
                          {idx === 0 ? "📞" : "📝"}
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
                <section className="cardShell p-5 animate-cardIn delay-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Showcase feed
                    </h2>
                    <button className="text-xs text-sky-700 hover:text-sky-600 font-semibold">
                      View feed
                    </button>
                  </div>

                  <div className="space-y-3">
                    {showcaseItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate("/showcase")}
                        className="w-full text-left flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 hover:bg-slate-100 transition"
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
                          ❤️ {item.likes}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* CTA Box */}
                <section className="ctaBox animate-cardIn delay-5">
                  <h3 className="ctaTitle">All your modules in one place</h3>
                  <p className="ctaDesc">
                    Build portfolios, join live rooms, showcase projects, and
                    track progress from your DevSphere dashboard.
                  </p>
                  <button
                    onClick={() => navigate("/portfolio")}
                    className="ctaBtn"
                  >
                    Explore workspace
                  </button>
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
          transform: translateZ(0);
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