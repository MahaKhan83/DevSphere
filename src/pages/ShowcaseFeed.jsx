// src/pages/ShowcaseFeed.jsx
import React, { useMemo, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";

/* ---------------- Demo data (later API se replace) ---------------- */
const DEMO_PROJECTS = [
  {
    id: "p1",
    title: "React Dashboard",
    tech: ["React", "Dashboard"],
    likes: 115,
    comments: 24,
    saves: 18,
    author: "Ava Robinson",
    time: "2h ago",
    desc: "A clean admin dashboard UI with charts, filters, and responsive layout.",
    github: "https://github.com/",
    thumb:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "p2",
    title: "Mobile App UI",
    tech: ["React Native", "Mobile"],
    likes: 83,
    comments: 20,
    saves: 11,
    author: "James Clark",
    time: "1d ago",
    desc: "Mobile-first UI kit for RN apps with reusable components.",
    github: "https://github.com/",
    thumb:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "p3",
    title: "E-commerce Store",
    tech: ["Next.js", "Commerce"],
    likes: 86,
    comments: 19,
    saves: 14,
    author: "Sarah Johnson",
    time: "3d ago",
    desc: "Modern store with product search, cart, checkout and payments.",
    github: "https://github.com/",
    thumb:
      "https://images.unsplash.com/photo-1557825835-70d97c4aa567?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "p4",
    title: "Analytics UI",
    tech: ["React", "Charts"],
    likes: 64,
    comments: 12,
    saves: 9,
    author: "Mohsin Ali",
    time: "5d ago",
    desc: "Charts + KPI tiles with smooth interactions and insights view.",
    github: "https://github.com/",
    thumb:
      "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "p5",
    title: "Admin Panel API",
    tech: ["MERN", "Admin"],
    likes: 71,
    comments: 14,
    saves: 10,
    author: "Fatima Noor",
    time: "1w ago",
    desc: "Role-based admin panel with JWT, CRUD, and audit logs.",
    github: "https://github.com/",
    thumb:
      "https://images.unsplash.com/photo-1556155092-8707de31f9c4?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "p6",
    title: "Portfolio Website",
    tech: ["React", "UI"],
    likes: 92,
    comments: 17,
    saves: 16,
    author: "Subhaan",
    time: "2w ago",
    desc: "Portfolio with sections, projects, skills and downloadable resume.",
    github: "https://github.com/",
    thumb:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=60",
  },
];

/* ---------------- Icons (Dashboard style) ---------------- */
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

/* ---------------- NAV (✅ routes fixed) ----------------
   IMPORTANT: your App.jsx route is /collaboration
*/
const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
  { label: "Build portfolio", icon: <PortfolioIcon />, to: "/portfolio" },
  { label: "Showcase feed", icon: <ShowcaseIcon />, to: "/showcase" },
  { label: "Collab rooms", icon: <CollabIcon />, to: "/collaboration" }, // ✅ FIXED
  { label: "Notifications", icon: <BellIcon />, to: "/notifications" },
  { label: "Settings", icon: <SettingsIcon />, to: "/settings" },
];

export default function ShowcaseFeed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // ✅ Same as Dashboard
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ page entry animation (stagger)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const [query, setQuery] = useState("");
  const [techFilter, setTechFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Trending");

  const [likedIds, setLikedIds] = useState(() => new Set());
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [openProject, setOpenProject] = useState(null);

  const displayName = user?.name || user?.email || "GuestUser";
  const initials = displayName
    .split(" ")
    .map((x) => x[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const techOptions = useMemo(() => {
    const all = new Set();
    DEMO_PROJECTS.forEach((p) => p.tech.forEach((t) => all.add(t)));
    return ["All", ...Array.from(all)];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = DEMO_PROJECTS.filter((p) => {
      const matchesQ = !q
        ? true
        : `${p.title} ${p.tech.join(" ")} ${p.author} ${p.desc}`
            .toLowerCase()
            .includes(q);

      const matchesTech = techFilter === "All" ? true : p.tech.includes(techFilter);

      return matchesQ && matchesTech;
    });

    if (sortBy === "MostLiked") list = [...list].sort((a, b) => b.likes - a.likes);
    else if (sortBy === "Newest") {
      const weight = (t) => (t.includes("h") ? 3 : t.includes("d") ? 2 : t.includes("w") ? 1 : 0);
      list = [...list].sort((a, b) => weight(b.time) - weight(a.time));
    } else {
      const score = (p) => p.likes + p.comments * 3 + p.saves * 2;
      list = [...list].sort((a, b) => score(b) - score(a));
    }

    return list;
  }, [query, techFilter, sortBy]);

  const toggleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSave = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex overflow-hidden">
        {/* ✅ soft animated background glow */}
        <div className="pointer-events-none fixed inset-0">
          <div className="sfBlob sfBlob1" />
          <div className="sfBlob sfBlob2" />
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
          {/* TOPBAR */}
          <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 ${mounted ? "sfIn" : "sfPre"}`}>
            <div className="flex items-start gap-3">
              {/* Sidebar toggle same as Dashboard */}
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                  Showcase Feed
                </h1>
                <p className="text-sm text-slate-600">
                  Discover projects, connect with developers, and get inspired.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                <span className="text-slate-400">⌕</span>
                <input
                  className="outline-none w-full sm:w-[320px] text-sm text-slate-700"
                  placeholder="Search projects, tech, authors..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <button
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow transition hover:-translate-y-[1px] active:translate-y-[1px]"
                onClick={() => alert("Upload modal next ✅")}
              >
                + Upload
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className={`flex flex-wrap items-center gap-3 mb-6 ${mounted ? "sfIn2" : "sfPre"}`}>
            <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm flex items-center gap-3">
              <span className="text-xs text-slate-500 font-semibold">Tech</span>
              <select
                className="text-sm outline-none bg-transparent"
                value={techFilter}
                onChange={(e) => setTechFilter(e.target.value)}
              >
                {techOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm flex items-center gap-3">
              <span className="text-xs text-slate-500 font-semibold">Sort</span>
              <select
                className="text-sm outline-none bg-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Trending">Trending</option>
                <option value="Newest">Newest</option>
                <option value="MostLiked">Most liked</option>
              </select>
            </div>

            <div className="ml-auto text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
              results
            </div>
          </div>

          {/* GRID */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((p, idx) => {
              const liked = likedIds.has(p.id);
              const saved = savedIds.has(p.id);

              return (
                <article
                  key={p.id}
                  className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sfCard ${
                    mounted ? "sfCardIn" : "sfCardPre"
                  }`}
                  style={{ transitionDelay: `${Math.min(idx, 8) * 70}ms` }}
                >
                  {/* Thumb */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img src={p.thumb} alt={p.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

                    <div className="absolute left-3 bottom-3 flex flex-wrap gap-2">
                      {p.tech.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-1 rounded-full bg-white/90 text-slate-800 font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Save */}
                    <button
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full grid place-items-center transition ${
                        saved ? "bg-sky-500 text-white" : "bg-white/90 text-slate-700"
                      }`}
                      onClick={() => toggleSave(p.id)}
                      title="Bookmark"
                    >
                      {saved ? "★" : "☆"}
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{p.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <span className="font-medium text-slate-700">{p.author}</span> • {p.time}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mt-3 line-clamp-2">{p.desc}</p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 text-sm">
                        <button
                          className={`px-3 py-1 rounded-full border transition ${
                            liked
                              ? "bg-rose-50 border-rose-200 text-rose-600"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                          onClick={() => toggleLike(p.id)}
                          title="Like"
                        >
                          ♥ <span className="ml-1">{p.likes + (liked ? 1 : 0)}</span>
                        </button>
                        <span className="text-slate-500">💬 {p.comments}</span>
                        <span className="text-slate-500">🔖 {p.saves + (saved ? 1 : 0)}</span>
                      </div>

                      <button
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                        onClick={() => setOpenProject(p)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* MODAL */}
          {openProject && (
            <div
              className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
              onClick={() => setOpenProject(null)}
            >
              <div
                className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-xl sfModal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{openProject.title}</h3>
                    <p className="text-sm text-slate-500">
                      {openProject.author} • {openProject.time}
                    </p>
                  </div>
                  <button
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition grid place-items-center"
                    onClick={() => setOpenProject(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="p-5">
                  <img
                    className="w-full h-64 object-cover rounded-xl border border-slate-200"
                    src={openProject.thumb}
                    alt={openProject.title}
                  />

                  <p className="text-sm text-slate-600 mt-4">{openProject.desc}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {openProject.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-5">
                    <button
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition"
                      onClick={() => window.open(openProject.github, "_blank")}
                    >
                      GitHub
                    </button>
                    <button
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow transition"
                      onClick={() => alert("Details page next ✅")}
                    >
                      Open details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ✅ CSS Animations + Sidebar exact Dashboard */}
      <style>{`
        /* Sidebar show/hide (Dashboard) */
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

        /* Background blobs */
        .sfBlob{
          position:absolute;
          width: 520px;
          height: 520px;
          border-radius: 999px;
          filter: blur(90px);
          opacity: .35;
          animation: sfFloat 12s ease-in-out infinite;
        }
        .sfBlob1{ left: -160px; top: -160px; background: rgba(56,189,248,0.45); }
        .sfBlob2{ right: -180px; bottom: -220px; background: rgba(99,102,241,0.35); animation-duration: 15s; }
        @keyframes sfFloat{
          0%{ transform: translate(0px,0px) scale(1); }
          50%{ transform: translate(25px,-30px) scale(1.05); }
          100%{ transform: translate(0px,0px) scale(1); }
        }

        /* Entry animations */
        .sfPre{ opacity: 0; transform: translateY(12px); }
        .sfIn{ opacity: 1; transform: translateY(0); transition: all .6s cubic-bezier(.2,.8,.2,1); }
        .sfIn2{ opacity: 1; transform: translateY(0); transition: all .65s cubic-bezier(.2,.8,.2,1); transition-delay: .08s; }

        /* Cards */
        .sfCard{
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .sfCard:hover{
          transform: translateY(-6px);
          box-shadow: 0 18px 45px rgba(2,6,23,0.14);
        }
        .sfCardPre{ opacity: 0; transform: translateY(16px) scale(.98); }
        .sfCardIn{
          opacity: 1; transform: translateY(0) scale(1);
          transition: opacity .6s cubic-bezier(.2,.8,.2,1), transform .6s cubic-bezier(.2,.8,.2,1);
        }

        /* Modal pop */
        .sfModal{
          animation: sfPop .22s ease-out both;
        }
        @keyframes sfPop{
          from{ transform: scale(.98); opacity: .7; }
          to{ transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}