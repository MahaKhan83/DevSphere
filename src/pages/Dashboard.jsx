// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";
import { getDashboardData } from "../services/api";

// ---------- Simple Icon Components ----------
const IconWrap = ({ children }) => (
  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/80 text-slate-100">
    {children}
  </span>
);

const PortfolioIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="11" width="7" height="10" rx="1" />
    <rect x="3" y="15" width="7" height="6" rx="1" />
  </svg>
);

const CollabIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5h9a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    <path d="M17 9h3a2 2 0 0 1 2 2v3l2 2v-2a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-7" />
  </svg>
);

const ShowcaseIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M3 12h18" />
    <path d="M8 20h8" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ProjectsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
    <path d="M9 3h6v4H9z" />
  </svg>
);

const TeamsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="3" />
    <circle cx="16" cy="8" r="3" />
    <path d="M4 19a4 4 0 0 1 4-4" />
    <path d="M12 19a4 4 0 0 1 4-4" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <path d="M3 10h18" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82v.08a2 2 0 1 1-4 0v-.08A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33h-.08a2 2 0 1 1 0-4h.08A1.65 1.65 0 0 0 4 9a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 5a1.65 1.65 0 0 0 1-.6A1.65 1.65 0 0 0 5.93 2.6V2.5a2 2 0 1 1 4 0v.08A1.65 1.65 0 0 0 13 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1.82V2.1a2 2 0 1 1 4 0v.08A1.65 1.65 0 0 0 19.4 5a1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 23.4 9a1.65 1.65 0 0 0 .6 1 1.65 1.65 0 0 0 1.82.33h.08a2 2 0 1 1 0 4h-.08A1.65 1.65 0 0 0 23.4 15z" />
  </svg>
);

// ---------- Reusable Nav Item ----------
const NavItem = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
      active ? "bg-slate-800 text-slate-50 font-semibold" : "text-slate-200/90 hover:bg-slate-800/60"
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
      try {
        const res = await getDashboardData();

        setAnnouncements(
          res?.announcements ?? [
            { title: "New DevSphere release", desc: "v1.3 ships with live code rooms and improved insights.", time: "2 hours ago" },
            { title: "Team stand-up schedule", desc: "Daily stand-up moved to 10:00 AM for all frontend squads.", time: "Yesterday" },
            { title: "Maintenance window", desc: "Planned downtime on Saturday 01:00–02:00 AM UTC.", time: "3 days ago" },
          ]
        );

        setMeetings(res?.meetings ?? [
          { title: "Introduction call", time: "08:00 – 08:50" },
          { title: "Sprint planning", time: "14:00 – 15:00" },
        ]);

        setProjects(res?.projects ?? [
          { name: "Website redesign", progress: 75 },
          { name: "Mobile app", progress: 25 },
          { name: "Dashboard UI", progress: 50 },
        ]);
      } catch (e) {
        console.error(e);
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
      <div className="min-h-screen bg-slate-100 flex">
        {/* SIDEBAR */}
        <aside className="w-72 bg-slate-900 text-slate-100 flex flex-col py-6 px-4">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <img src={logo} alt="DevSphere" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="text-xl font-semibold">
              Dev<span className="text-cyan-300">Sphere</span>
            </span>
          </div>

          {/* Nav: Dashboard FIRST */}
          <nav className="flex-1 space-y-2">
            <NavItem active={location.pathname === "/dashboard"} icon={<DashboardIcon />} label="Dashboard" onClick={() => navigate("/dashboard")} />
            <NavItem active={location.pathname === "/portfolio"} icon={<PortfolioIcon />} label="Build portfolio" onClick={() => navigate("/portfolio")} />
            <NavItem active={false} icon={<CollabIcon />} label="Collab rooms" onClick={() => navigate("/rooms")} />
            <NavItem active={false} icon={<ShowcaseIcon />} label="Showcase feed" onClick={() => navigate("/showcase")} />
            <NavItem active={false} icon={<BellIcon />} label="Notifications" onClick={() => navigate("/notifications")} />
            <NavItem active={false} icon={<CalendarIcon />} label="Calendar" onClick={() => navigate("/calendar")} />
            <NavItem active={false} icon={<SettingsIcon />} label="Settings" onClick={() => navigate("/settings")} />
          </nav>

          {/* Logged-in user */}
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

        {/* MAIN */}
        <main className="flex-1 p-6 md:p-8 space-y-6 animate-pageIn">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="animate-titleIn">
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-600">
                Welcome back, <span className="font-semibold">{displayName}</span>.
              </p>
            </div>
            <div className="flex items-center gap-4 animate-fadeIn">
              <button className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300 transition">
                🔔
              </button>
              <button className="px-4 py-2 rounded-full bg-sky-500 text-white text-sm font-semibold hover:bg-sky-400 transition shadow hover:-translate-y-[2px] active:translate-y-[1px]">
                New project
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-slate-500 text-sm">Loading dashboard…</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* LEFT */}
              <div className="xl:col-span-2 space-y-6">
                {/* Announcements */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 animate-cardIn delay-1">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">Announcements</h2>
                    <button className="text-xs text-sky-600 hover:text-sky-500 font-semibold">View all</button>
                  </div>
                  <div className="space-y-3">
                    {announcements.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => alert(`Announcement: ${item.title}`)}
                        className="w-full text-left flex items-start justify-between gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 transition"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{item.time}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Recent Projects */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 animate-cardIn delay-2">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">Recent projects</h2>
                    <button className="text-xs text-sky-600 hover:text-sky-500 font-semibold">View all</button>
                  </div>

                  <div className="space-y-4">
                    {projects.map((project, idx) => (
                      <button
                        key={idx}
                        onClick={() => alert(`Open project: ${project.name}`)}
                        className="w-full text-left rounded-xl p-3 hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-800 font-medium">{project.name}</span>
                          <span className="text-slate-500">{project.progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full bg-sky-500" style={{ width: `${project.progress}%` }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                {/* Collab Rooms */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 animate-cardIn delay-3">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">Live collab rooms</h2>
                    <button className="text-xs px-3 py-1 rounded-full bg-sky-500 text-white hover:bg-sky-400 transition">
                      + New room
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activeRooms.map((room, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{room.name}</p>
                          <p className="text-xs text-slate-500">{room.members} members · {room.status}</p>
                        </div>
                        <button
                          onClick={() => navigate("/rooms")}
                          className="text-xs px-3 py-1 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition"
                        >
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Upcoming meetings */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 animate-cardIn delay-4">
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">Upcoming meetings</h2>
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
                          <p className="text-sm font-semibold text-slate-900">{m.title}</p>
                          <p className="text-xs text-slate-500">{m.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Showcase */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 animate-cardIn delay-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">Showcase feed</h2>
                    <button className="text-xs text-sky-600 hover:text-sky-500 font-semibold">View feed</button>
                  </div>

                  <div className="space-y-3">
                    {showcaseItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate("/showcase")}
                        className="w-full text-left flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 hover:bg-slate-100 transition"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">by {item.author}</p>
                        </div>
                        <span className="text-xs text-slate-600 font-medium">❤️ {item.likes}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pageIn { from { opacity: 0; transform: translateY(12px);} to { opacity: 1; transform: translateY(0);} }
        .animate-pageIn { animation: pageIn .5s ease-out both; }

        @keyframes titleIn { from { opacity: 0; transform: translateX(-14px);} to { opacity: 1; transform: translateX(0);} }
        .animate-titleIn { animation: titleIn .6s ease-out both; }

        @keyframes fadeIn { from { opacity: 0;} to { opacity: 1;} }
        .animate-fadeIn { animation: fadeIn .7s ease-out both; }

        @keyframes cardIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
        .animate-cardIn { animation: cardIn .55s ease-out both; }
        .delay-1{ animation-delay:.1s } .delay-2{ animation-delay:.18s } .delay-3{ animation-delay:.26s }
        .delay-4{ animation-delay:.34s } .delay-5{ animation-delay:.42s }
      `}</style>
    </>
  );
};

export default Dashboard;