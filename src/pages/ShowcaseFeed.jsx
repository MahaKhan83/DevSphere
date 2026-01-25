// src/pages/ShowcaseFeed.jsx
import React, { useMemo, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";

/* ---------------- Demo data ---------------- */
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

/* ---------------- Sidebar Icons ---------------- */
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

/* ---------------- Action Icons ---------------- */
const SearchIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 21l-4.3-4.3" />
    <circle cx="11" cy="11" r="7" />
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  </svg>
);
const CommentIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
  </svg>
);
const BookmarkIcon = ({ filled }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M6 3h12a1 1 0 0 1 1 1v19l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
  </svg>
);
const ShareIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
    <path d="M12 3v13" />
    <path d="M7 8l5-5 5 5" />
  </svg>
);
const InviteIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M19 8v6" />
    <path d="M22 11h-6" />
  </svg>
);
const RequestIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M12 4h9" />
    <path d="M4 9h16" />
    <path d="M4 15h16" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 16H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

/* ---------- Sidebar item UI ---------- */
const IconWrap = ({ children }) => (
  <span className="w-9 h-9 rounded-xl bg-slate-800/80 text-slate-100 flex items-center justify-center">
    {children}
  </span>
);

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

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
  { label: "Build portfolio", icon: <PortfolioIcon />, to: "/portfolio" },
 
  { label: "Collab rooms", icon: <CollabIcon />, to: "/collaboration" },
  { label: "Showcase feed", icon: <ShowcaseIcon />, to: "/showcase" },
  { label: "Notifications", icon: <BellIcon />, to: "/notifications" },
  { label: "Settings", icon: <SettingsIcon />, to: "/settings" },
];

export default function ShowcaseFeed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const displayName = user?.name || user?.email || "GuestUser";
  const initials = displayName
    .split(" ")
    .map((x) => x[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const [projects, setProjects] = useState(() => DEMO_PROJECTS);

  const [query, setQuery] = useState("");
  const [techFilter, setTechFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Trending");
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [likedIds, setLikedIds] = useState(() => new Set());
  const [savedIds, setSavedIds] = useState(() => new Set());

  // Modals
  const [openProject, setOpenProject] = useState(null);
  const [openCommentsFor, setOpenCommentsFor] = useState(null);
  const [inviteProject, setInviteProject] = useState(null);
  const [requestProject, setRequestProject] = useState(null);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  // Comments
  const [commentsByProject, setCommentsByProject] = useState(() => ({
    p1: [
      { id: "c1", name: "Laiba", text: "UI boht clean hai 🔥", time: "just now", likes: 2, likedBy: new Set() },
      { id: "c2", name: "Ali", text: "Charts layout zabardast!", time: "5m ago", likes: 0, likedBy: new Set() },
    ],
    p6: [{ id: "c3", name: "Fatima", text: "Nice portfolio structure ✅", time: "1h ago", likes: 1, likedBy: new Set() }],
  }));
  const [newComment, setNewComment] = useState("");

  // Invite
  const [inviteTo, setInviteTo] = useState("");
  const [inviteMsg, setInviteMsg] = useState("Hey! Check this DevSphere project 🔥");

  // Request
  const [requestMsg, setRequestMsg] = useState("Hi! I want to work on this project. Please add me as a collaborator.");

  // Upload form
  const [upTitle, setUpTitle] = useState("");
  const [upDesc, setUpDesc] = useState("");
  const [upGithub, setUpGithub] = useState("");
  const [upTech, setUpTech] = useState("React");
  const [upThumb, setUpThumb] = useState(
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60"
  );

  const techOptions = useMemo(() => {
    const all = new Set();
    projects.forEach((p) => p.tech.forEach((t) => all.add(t)));
    return ["All", ...Array.from(all)];
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = projects.filter((p) => {
      const matchesQ = !q
        ? true
        : `${p.title} ${p.tech.join(" ")} ${p.author} ${p.desc}`.toLowerCase().includes(q);

      const matchesTech = techFilter === "All" ? true : p.tech.includes(techFilter);
      const matchesSaved = showSavedOnly ? savedIds.has(p.id) : true;

      return matchesQ && matchesTech && matchesSaved;
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
  }, [query, techFilter, sortBy, showSavedOnly, savedIds, projects]);

  const savedProjectsList = useMemo(() => projects.filter((p) => savedIds.has(p.id)), [projects, savedIds]);

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

  const openComments = (project) => {
    setOpenCommentsFor(project);
    setNewComment("");
  };

  const submitComment = () => {
    if (!openCommentsFor) return;
    const text = newComment.trim();
    if (!text) return;

    const pid = openCommentsFor.id;
    const item = {
      id: `c_${Date.now()}`,
      name: displayName,
      text,
      time: "just now",
      likes: 0,
      likedBy: new Set(),
    };

    setCommentsByProject((prev) => {
      const list = prev[pid] || [];
      return { ...prev, [pid]: [item, ...list] };
    });

    setNewComment("");
  };

  // ✅ delete only in UI; button will appear only for own comment (below)
  const deleteComment = (projectId, commentId) => {
    setCommentsByProject((prev) => {
      const list = prev[projectId] || [];
      return { ...prev, [projectId]: list.filter((c) => c.id !== commentId) };
    });
  };

  const likeComment = (projectId, commentId) => {
    setCommentsByProject((prev) => {
      const list = prev[projectId] || [];
      const next = list.map((c) => {
        if (c.id !== commentId) return c;
        const likedBy = new Set(c.likedBy || []);
        if (likedBy.has(displayName)) {
          likedBy.delete(displayName);
          return { ...c, likedBy, likes: Math.max(0, (c.likes || 0) - 1) };
        } else {
          likedBy.add(displayName);
          return { ...c, likedBy, likes: (c.likes || 0) + 1 };
        }
      });
      return { ...prev, [projectId]: next };
    });
  };

  const shareProject = async (project) => {
    const shareText = `${project.title} — DevSphere Showcase\n${project.github}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: project.title, text: shareText, url: project.github });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("Link copied ✅");
      }
    } catch {}
  };

  const openInvite = (project) => {
    setInviteProject(project);
    setInviteTo("");
    setInviteMsg("Hey! Check this DevSphere project 🔥");
  };

  const sendInvite = () => {
    if (!inviteProject) return;
    const target = inviteTo.trim();
    if (!target) return alert("Invite target likho (email/username).");
    alert(`Invite sent ✅\nTo: ${target}\nProject: ${inviteProject.title}`);
    setInviteProject(null);
  };

  const openRequest = (project) => {
    setRequestProject(project);
    setRequestMsg("Hi! I want to work on this project. Please add me as a collaborator.");
  };

  const sendRequest = () => {
    if (!requestProject) return;
    alert(`Request sent ✅\nTo owner: ${requestProject.author}\nProject: ${requestProject.title}`);
    setRequestProject(null);
  };

  const openUpload = () => {
    setUploadOpen(true);
    setUpTitle("");
    setUpDesc("");
    setUpGithub("");
    setUpTech("React");
    setUpThumb("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60");
  };

  const handleUpload = () => {
    const title = upTitle.trim();
    const desc = upDesc.trim();
    const github = upGithub.trim() || "https://github.com/";
    const thumb = upThumb.trim();

    if (!title || !desc || !thumb) return alert("Title + Description + Thumbnail required.");

    const id = `u_${Date.now()}`;
    const newP = {
      id,
      title,
      tech: [upTech],
      likes: 0,
      comments: 0,
      saves: 0,
      author: displayName,
      time: "just now",
      desc,
      github,
      thumb,
      isOwner: true,
    };

    setProjects((prev) => [newP, ...prev]);
    setUploadOpen(false);
    alert("Project uploaded ✅");
  };

  const deleteProject = (projectId) => {
    if (!window.confirm("Delete this project?")) return;

    setProjects((prev) => prev.filter((p) => p.id !== projectId));

    setSavedIds((prev) => {
      const next = new Set(prev);
      next.delete(projectId);
      return next;
    });
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.delete(projectId);
      return next;
    });

    setCommentsByProject((prev) => {
      const next = { ...prev };
      delete next[projectId];
      return next;
    });

    alert("Project deleted ✅");
  };

  return (
    <>
      <div className="min-h-screen bg-[#eef3f7] flex overflow-hidden relative">
        {/* ✅ background pointer-events fixed */}
        <div className="sfBg fixed inset-0 pointer-events-none">
          <div className="sfBlob sfBlob1" />
          <div className="sfBlob sfBlob2" />
          <div className="sfShimmer" />
          <div className="sfGrid" />
          <div className="sfGrain" />
        </div>

        {/* SIDEBAR */}
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
                active={location.pathname === item.to}
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

        {/* MAIN */}
        <main className="flex-1 p-6 md:p-8 relative z-10">
          {/* TOPBAR */}
          <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 ${mounted ? "sfIn" : "sfPre"}`}>
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Showcase Feed</h1>
                <p className="text-sm text-slate-600">Discover projects, connect with developers, and get inspired.</p>
              </div>
            </div>

            {/* ✅ Search + buttons always visible */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2 bg-white/95 border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                <span className="text-slate-400">
                  <SearchIcon />
                </span>
                <input
                  className="outline-none w-full sm:w-[320px] text-sm text-slate-700 bg-transparent"
                  placeholder="Search projects, tech, authors..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <button className="sfTopBtn sfTopBtnDark" onClick={() => setSavedDrawerOpen(true)} title="View saved">
                <BookmarkIcon filled={true} />
                <span>Saved</span>
                <span className="sfBadge">{savedProjectsList.length}</span>
              </button>

              <button className="sfTopBtn sfTopBtnSky" onClick={openUpload} title="Upload new project">
                <PlusIcon />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className={`flex flex-wrap items-center gap-3 mb-6 ${mounted ? "sfIn2" : "sfPre"}`}>
            <div className="bg-white/95 border border-slate-200 rounded-xl px-3 py-2 shadow-sm flex items-center gap-3">
              <span className="text-xs text-slate-500 font-semibold">Tech</span>
              <select className="text-sm outline-none bg-transparent" value={techFilter} onChange={(e) => setTechFilter(e.target.value)}>
                {techOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white/95 border border-slate-200 rounded-xl px-3 py-2 shadow-sm flex items-center gap-3">
              <span className="text-xs text-slate-500 font-semibold">Sort</span>
              <select className="text-sm outline-none bg-transparent" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="Trending">Trending</option>
                <option value="Newest">Newest</option>
                <option value="MostLiked">Most liked</option>
              </select>
            </div>

            <button
              className={`px-3 py-2 rounded-xl border text-sm font-semibold transition ${
                showSavedOnly ? "bg-slate-900 text-white border-slate-900" : "bg-white/95 text-slate-700 border-slate-200 hover:bg-white"
              }`}
              onClick={() => setShowSavedOnly((v) => !v)}
              title="Show only saved projects"
            >
              {showSavedOnly ? "Showing: Saved" : "Filter: Saved"}
            </button>

            <div className="ml-auto text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{filtered.length}</span> results
            </div>
          </div>

          {/* GRID */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((p, idx) => {
              const liked = likedIds.has(p.id);
              const saved = savedIds.has(p.id);
              const commentCount = (commentsByProject[p.id]?.length ?? 0) || p.comments;
              const isOwner = p.author === displayName || p.isOwner;

              return (
                <article
                  key={p.id}
                  className={`sfCard sfPulseBorder bg-white/95 rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden ${
                    mounted ? "sfCardIn" : "sfCardPre"
                  }`}
                  style={{ transitionDelay: `${Math.min(idx, 8) * 70}ms` }}
                >
                  {/* Thumb */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img src={p.thumb} alt={p.title} className="w-full h-full object-cover sfImg" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

                    <div className="absolute left-3 bottom-3 flex flex-wrap gap-2">
                      {p.tech.slice(0, 2).map((t) => (
                        <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/90 text-slate-800 font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Invite + Request + Share */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button className="sfActionBtn" onClick={() => openInvite(p)} title="Invite">
                        <InviteIcon />
                      </button>
                      <button className="sfActionBtn" onClick={() => openRequest(p)} title="Request">
                        <RequestIcon />
                      </button>
                      <button className="sfActionBtn" onClick={() => shareProject(p)} title="Share">
                        <ShareIcon />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{p.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          <span className="font-medium text-slate-700">{p.author}</span> • {p.time}
                        </p>
                      </div>

                      {isOwner && (
                        <button className="sfDangerBtn" onClick={() => deleteProject(p.id)} title="Delete your project">
                          <TrashIcon />
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 mt-3 lineClamp2">{p.desc}</p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-sm flex-wrap">
                        <button
                          className={`px-3 py-2 rounded-xl border transition inline-flex items-center gap-2 ${
                            liked ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                          onClick={() => toggleLike(p.id)}
                          title="Like"
                        >
                          <HeartIcon filled={liked} />
                          <span className="text-xs font-semibold">{p.likes + (liked ? 1 : 0)}</span>
                        </button>

                        <button
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition inline-flex items-center gap-2"
                          onClick={() => openComments(p)}
                          title="Open comments"
                        >
                          <CommentIcon />
                          <span className="text-xs font-semibold">{commentCount}</span>
                        </button>

                        <button
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition inline-flex items-center gap-2"
                          onClick={() => toggleSave(p.id)}
                          title={saved ? "Unsave" : "Save"}
                        >
                          <BookmarkIcon filled={saved} />
                          <span className="text-xs font-semibold">{p.saves + (saved ? 1 : 0)}</span>
                        </button>
                      </div>

                      <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition" onClick={() => setOpenProject(p)}>
                        View
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* ---------------- Saved Drawer ---------------- */}
          {savedDrawerOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" onClick={() => setSavedDrawerOpen(false)}>
              <div className="w-full max-w-md h-full bg-white shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Saved Projects</h3>
                  <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition grid place-items-center" onClick={() => setSavedDrawerOpen(false)}>
                    ✕
                  </button>
                </div>

                <p className="text-sm text-slate-500 mt-1">Bookmarked projects yahan show hotay hain.</p>

                <div className="mt-4 space-y-3 overflow-auto h-[calc(100vh-140px)] pr-1">
                  {savedProjectsList.length === 0 ? (
                    <div className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4">No saved projects yet.</div>
                  ) : (
                    savedProjectsList.map((p) => (
                      <button
                        key={p.id}
                        className="w-full text-left border border-slate-200 rounded-xl p-3 hover:bg-slate-50 transition"
                        onClick={() => {
                          setSavedDrawerOpen(false);
                          setOpenProject(p);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.thumb} alt={p.title} className="w-14 h-14 rounded-xl object-cover border border-slate-200" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{p.title}</p>
                            <p className="text-xs text-slate-500">
                              {p.author} • {p.time}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ---------------- Upload Modal (✅ fixed) ---------------- */}
          {uploadOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setUploadOpen(false)}>
              <div className="w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-xl sfModal" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Upload new project</h3>
                    <p className="text-sm text-slate-500">Fill details and publish</p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition grid place-items-center" onClick={() => setUploadOpen(false)}>
                    ✕
                  </button>
                </div>

                {/* ✅ scroll area so buttons never disappear */}
                <div className="sfModalBody">
                  <div className="sfField">
                    <label className="sfLabel">Title</label>
                    <input className="sfInput" value={upTitle} onChange={(e) => setUpTitle(e.target.value)} placeholder="e.g. DevSphere UI Kit" />
                  </div>

                  <div className="sfField">
                    <label className="sfLabel">Description</label>
                    <textarea className="sfTextarea" value={upDesc} onChange={(e) => setUpDesc(e.target.value)} placeholder="What did you build?" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sfField">
                      <label className="sfLabel">GitHub Link</label>
                      <input className="sfInput" value={upGithub} onChange={(e) => setUpGithub(e.target.value)} placeholder="https://github.com/..." />
                    </div>
                    <div className="sfField">
                      <label className="sfLabel">Primary Tech</label>
                      <select className="sfSelect" value={upTech} onChange={(e) => setUpTech(e.target.value)}>
                        {["React", "Node", "MERN", "Next.js", "MongoDB", "UI", "React Native"].map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sfField">
                    <label className="sfLabel">Thumbnail Image URL</label>
                    <input className="sfInput" value={upThumb} onChange={(e) => setUpThumb(e.target.value)} />
                    <img src={upThumb} alt="preview" className="mt-3 w-full h-44 object-cover rounded-xl border border-slate-200" />
                  </div>
                </div>

                {/* ✅ footer always visible */}
                <div className="sfModalFooter">
                  <button className="sfBtnGhost" onClick={() => setUploadOpen(false)}>
                    Cancel
                  </button>
                  <button className="sfBtnPrimary" onClick={handleUpload}>
                    Publish
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- Comments Modal ---------------- */}
          {openCommentsFor && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setOpenCommentsFor(null)}>
              <div className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-xl sfModal" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Comments</h3>
                    <p className="text-sm text-slate-500">
                      {openCommentsFor.title} • {openCommentsFor.author}
                    </p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition grid place-items-center" onClick={() => setOpenCommentsFor(null)}>
                    ✕
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex gap-3">
                    <input
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitComment()}
                    />
                    <button className="px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition" onClick={submitComment}>
                      Post
                    </button>
                  </div>

                  <div className="mt-5 space-y-3 max-h-[340px] overflow-auto pr-1">
                    {(commentsByProject[openCommentsFor.id] || []).length === 0 ? (
                      <div className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4">No comments yet.</div>
                    ) : (
                      (commentsByProject[openCommentsFor.id] || []).map((c) => {
                        const liked = (c.likedBy || new Set()).has(displayName);

                        // ✅ only own comment can be deleted
                        const isMyComment = (c.name || "").trim().toLowerCase() === displayName.trim().toLowerCase();

                        return (
                          <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                              <p className="text-xs text-slate-500">{c.time}</p>
                            </div>
                            <p className="text-sm text-slate-700 mt-2">{c.text}</p>

                            <div className="mt-3 flex items-center gap-2">
                              <button
                                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition inline-flex items-center gap-2 ${
                                  liked ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                }`}
                                onClick={() => likeComment(openCommentsFor.id, c.id)}
                              >
                                <HeartIcon filled={liked} />
                                {c.likes || 0}
                              </button>

                              {isMyComment && (
                                <button
                                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition inline-flex items-center gap-2 text-xs font-semibold"
                                  onClick={() => deleteComment(openCommentsFor.id, c.id)}
                                  title="Delete your comment"
                                >
                                  <TrashIcon /> Delete
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invite Modal */}
          {inviteProject && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setInviteProject(null)}>
              <div className="w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-xl sfModal" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Invite</h3>
                    <p className="text-sm text-slate-500">{inviteProject.title}</p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition grid place-items-center" onClick={() => setInviteProject(null)}>
                    ✕
                  </button>
                </div>

                <div className="p-5">
                  <label className="text-xs font-semibold text-slate-600">Invite to (email/username)</label>
                  <input className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-200" value={inviteTo} onChange={(e) => setInviteTo(e.target.value)} />

                  <label className="mt-4 block text-xs font-semibold text-slate-600">Message</label>
                  <textarea className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-200 min-h-[110px]" value={inviteMsg} onChange={(e) => setInviteMsg(e.target.value)} />

                  <div className="flex flex-wrap gap-3 mt-5">
                    <button className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition" onClick={() => setInviteProject(null)}>
                      Cancel
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow transition inline-flex items-center gap-2" onClick={sendInvite}>
                      <InviteIcon /> Send invite
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow transition inline-flex items-center gap-2" onClick={() => shareProject(inviteProject)}>
                      <ShareIcon /> Share link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Request Modal */}
          {requestProject && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setRequestProject(null)}>
              <div className="w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-xl sfModal" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Request to work</h3>
                    <p className="text-sm text-slate-500">
                      {requestProject.title} • Owner: {requestProject.author}
                    </p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition grid place-items-center" onClick={() => setRequestProject(null)}>
                    ✕
                  </button>
                </div>

                <div className="p-5">
                  <label className="text-xs font-semibold text-slate-600">Message</label>
                  <textarea className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-sky-200 min-h-[120px]" value={requestMsg} onChange={(e) => setRequestMsg(e.target.value)} />

                  <div className="flex flex-wrap gap-3 mt-5">
                    <button className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition" onClick={() => setRequestProject(null)}>
                      Cancel
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow transition inline-flex items-center gap-2" onClick={sendRequest}>
                      <RequestIcon /> Send request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Project Modal */}
          {openProject && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setOpenProject(null)}>
              <div className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-xl sfModal" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{openProject.title}</h3>
                    <p className="text-sm text-slate-500">
                      {openProject.author} • {openProject.time}
                    </p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition grid place-items-center" onClick={() => setOpenProject(null)}>
                    ✕
                  </button>
                </div>

                <div className="p-5">
                  <img className="w-full h-64 object-cover rounded-xl border border-slate-200" src={openProject.thumb} alt={openProject.title} />
                  <p className="text-sm text-slate-600 mt-4">{openProject.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {openProject.tech.map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-5">
                    <button className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition" onClick={() => window.open(openProject.github, "_blank")}>
                      GitHub
                    </button>
                    <button className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition" onClick={() => openComments(openProject)}>
                      Comments
                    </button>
                    <button className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition" onClick={() => openInvite(openProject)}>
                      Invite
                    </button>
                    <button className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition" onClick={() => openRequest(openProject)}>
                      Request
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow transition" onClick={() => shareProject(openProject)}>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CSS */}
      <style>{`
        .sidebar{
          background:#0f172a;
          color:#f8fafc;
          display:flex;
          flex-direction:column;
          padding:24px 16px;
          overflow:hidden;
          transition:width .25s ease, padding .25s ease, opacity .25s ease;
          z-index:10;
          position:relative;
        }
        .sidebarOpen{ width:288px; opacity:1; }
        .sidebarClosed{ width:0px; padding:0px; opacity:0; pointer-events:none; }

        /* ✅ make ALL bg layers non-click-blocking */
        .sfBg, .sfBlob, .sfShimmer, .sfGrid, .sfGrain{ pointer-events:none; }

        .sfBlob{
          position:absolute;
          width:560px; height:560px;
          border-radius:999px;
          filter:blur(95px);
          opacity:.32;
          animation:sfFloat 14s ease-in-out infinite;
          background:radial-gradient(circle at 30% 30%,
            rgba(12,42,92,.55),
            rgba(6,22,58,.30),
            rgba(3,12,28,0)
          );
        }
        .sfBlob1{ left:-180px; top:-180px; }
        .sfBlob2{ right:-220px; bottom:-260px; width:650px; height:650px; opacity:.26; animation-duration:18s; }
        @keyframes sfFloat{ 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(32px,-28px) scale(1.06)} 100%{transform:translate(0,0) scale(1)} }

        .sfShimmer{
          position:absolute; inset:-2px;
          background:linear-gradient(120deg, rgba(3,12,28,0) 0%, rgba(12,42,92,.18) 45%, rgba(3,12,28,0) 70%);
          mix-blend-mode:multiply;
          opacity:.55;
          transform:translateX(-35%) skewX(-8deg);
          animation:sfSweep 6.5s ease-in-out infinite;
        }
        @keyframes sfSweep{ 0%{transform:translateX(-35%) skewX(-8deg);opacity:.22} 50%{transform:translateX(30%) skewX(-8deg);opacity:.65} 100%{transform:translateX(-35%) skewX(-8deg);opacity:.22} }

        .sfGrid{
          position:absolute; inset:0; opacity:.22;
          background-image: linear-gradient(to right, rgba(15,23,42,.10) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(15,23,42,.10) 1px, transparent 1px);
          background-size:64px 64px;
        }
        .sfGrain{
          position:absolute; inset:0; opacity:.10;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
        }

        .sfPre{ opacity:0; transform:translateY(12px); }
        .sfIn{ opacity:1; transform:translateY(0); transition:all .6s cubic-bezier(.2,.8,.2,1); }
        .sfIn2{ opacity:1; transform:translateY(0); transition:all .65s cubic-bezier(.2,.8,.2,1); transition-delay:.08s; }

        .sfCard{ transition:transform .25s ease, box-shadow .25s ease; }
        .sfCard:hover{ transform:translateY(-6px); box-shadow:0 18px 45px rgba(2,6,23,.14); }
        .sfCardPre{ opacity:0; transform:translateY(16px) scale(.98); }
        .sfCardIn{ opacity:1; transform:translateY(0) scale(1); transition:opacity .6s cubic-bezier(.2,.8,.2,1), transform .6s cubic-bezier(.2,.8,.2,1); }
        .sfImg{ transition:transform .45s ease; }
        .sfCard:hover .sfImg{ transform:scale(1.06); }

        .sfPulseBorder{ position:relative; overflow:hidden; }
        .sfPulseBorder::before{
          content:"";
          position:absolute; inset:-1px;
          border-radius:18px;
          background:linear-gradient(120deg, rgba(8,30,68,.85), rgba(56,189,248,.28), rgba(8,30,68,.85));
          opacity:.18; filter:blur(10px);
          pointer-events:none;
          animation:sfBorderPulse 4.2s ease-in-out infinite;
        }
        .sfPulseBorder > *{ position:relative; z-index:1; }
        @keyframes sfBorderPulse{ 0%,100%{opacity:.14;transform:scale(1)} 50%{opacity:.34;transform:scale(1.01)} }

        .sfTopBtn{
          display:inline-flex; align-items:center; gap:10px;
          padding:10px 14px; border-radius:14px;
          font-size:14px; font-weight:800;
          border:1px solid rgba(148,163,184,.35);
          box-shadow:0 10px 25px rgba(2,6,23,.08);
          transition:transform .18s ease, filter .18s ease, background .18s ease;
        }
        .sfTopBtn:hover{ transform:translateY(-1px); filter:brightness(1.02); }
        .sfTopBtnDark{ background:#0f172a; color:#fff; }
        .sfTopBtnSky{ background:#0ea5e9; color:#fff; border-color:rgba(14,165,233,.35); }

        .sfBadge{
          margin-left:4px;
          background:rgba(255,255,255,.18);
          padding:2px 8px;
          border-radius:999px;
          font-size:12px; font-weight:900;
        }

        .sfActionBtn{
          width:38px; height:38px; border-radius:999px;
          display:grid; place-items:center;
          background:rgba(255,255,255,.92);
          border:1px solid rgba(148,163,184,.35);
          box-shadow:0 12px 30px rgba(2,6,23,.14);
          color:#0f172a;
          transition:transform .18s ease, background .18s ease;
        }
        .sfActionBtn:hover{ transform:translateY(-1px) scale(1.02); background:#fff; }

        .sfDangerBtn{
          width:40px; height:40px; border-radius:14px;
          display:grid; place-items:center;
          background:rgba(255,255,255,.95);
          border:1px solid rgba(226,232,240,.9);
          color:rgb(185,28,28);
          box-shadow:0 10px 22px rgba(2,6,23,.08);
          transition:transform .18s ease;
        }
        .sfDangerBtn:hover{ transform:translateY(-1px); }

        .sfModal{ animation:sfPop .22s ease-out both; }
        @keyframes sfPop{ from{transform:scale(.98);opacity:.7} to{transform:scale(1);opacity:1} }

        .lineClamp2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

        /* ✅ Upload modal layout fix (no table look) */
        .sfModalBody{
          padding: 18px;
          max-height: calc(100vh - 210px);
          overflow: auto;
        }
        .sfModalFooter{
          padding: 14px 18px;
          border-top: 1px solid rgba(226,232,240,.9);
          display:flex;
          justify-content:flex-end;
          gap:10px;
          background: #fff;
        }
        .sfField{ margin-bottom: 14px; }
        .sfLabel{ display:block; font-size:12px; font-weight:800; color:#475569; }
        .sfInput{
          margin-top:8px;
          width:100%;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(226,232,240,1);
          outline:none;
        }
        .sfTextarea{
          margin-top:8px;
          width:100%;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(226,232,240,1);
          outline:none;
          min-height: 110px;
          resize: vertical;
        }
        .sfSelect{
          margin-top:8px;
          width:100%;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(226,232,240,1);
          outline:none;
          background:#fff;
        }
        .sfBtnGhost{
          padding:10px 14px;
          border-radius: 14px;
          border: 1px solid rgba(203,213,225,1);
          background: #fff;
          font-weight: 800;
          color:#0f172a;
        }
        .sfBtnPrimary{
          padding:10px 14px;
          border-radius: 14px;
          border: 1px solid rgba(14,165,233,.35);
          background: #0ea5e9;
          font-weight: 900;
          color:#fff;
        }
      `}</style>
    </>
  );
}