// src/pages/ShowcaseFeed.jsx
import React, { useMemo, useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "./showcaseFeed.css";

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

/* ---------------- Professional Icons ---------------- */
const DashboardIcon = () => (
  <svg className="sfIco" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 13h8V3H3v10Z" />
    <path d="M13 21h8V11h-8v10Z" />
    <path d="M3 21h8v-6H3v6Z" />
    <path d="M13 9h8V3h-8v6Z" />
  </svg>
);

const PortfolioIcon = () => (
  <svg className="sfIco" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
    <path d="M4 7h16a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z" />
    <path d="M9 12h6" />
  </svg>
);

const ShowcaseIcon = () => (
  <svg className="sfIco" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z" />
    <path d="M7 15l3-3 3 3 4-4 3 3" />
  </svg>
);

const CollabIcon = () => (
  <svg className="sfIco" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="3" />
    <path d="M20 8v6" />
    <path d="M23 11h-6" />
  </svg>
);

const BellIcon = () => (
  <svg className="sfIco" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="sfIco" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" />
    <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.05.05a2.2 2.2 0 0 1-1.55 3.76 2.2 2.2 0 0 1-1.55-.64l-.05-.05a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.64V21a2.2 2.2 0 0 1-4.4 0v-.07a1.8 1.8 0 0 0-1.1-1.64 1.8 1.8 0 0 0-1.98.36l-.05.05a2.2 2.2 0 1 1-3.11-3.11l.05-.05A1.8 1.8 0 0 0 3.6 15a1.8 1.8 0 0 0-1.64-1.1H1.9a2.2 2.2 0 0 1 0-4.4h.07A1.8 1.8 0 0 0 3.6 8a1.8 1.8 0 0 0-.36-1.98l-.05-.05A2.2 2.2 0 1 1 6.3 2.86l.05.05A1.8 1.8 0 0 0 8.33 3.27 1.8 1.8 0 0 0 9.43 1.63V1.56a2.2 2.2 0 0 1 4.4 0v.07a1.8 1.8 0 0 0 1.1 1.64 1.8 1.8 0 0 0 1.98-.36l.05-.05A2.2 2.2 0 1 1 21.1 6l-.05.05A1.8 1.8 0 0 0 20.7 8c0 .74.45 1.4 1.14 1.68.32.13.67.2 1.02.2H23a2.2 2.2 0 0 1 0 4.4h-.07c-.35 0-.7.07-1.02.2A1.8 1.8 0 0 0 19.4 15Z" />
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg className="sfChev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
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
const NavItem = ({ active, icon, label, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`sfNavItem ${active ? "sfNavActive" : ""} ${collapsed ? "sfNavCollapsed" : ""}`}
    title={collapsed ? label : undefined}
  >
    <span className="sfNavIcon">{icon}</span>
    {!collapsed && <span className="sfNavLabel">{label}</span>}
  </button>
);

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
  { label: "Build portfolio", icon: <PortfolioIcon />, to: "/portfolio" },
  { label: "Showcase feed", icon: <ShowcaseIcon />, to: "/showcase" },
  { label: "Collab rooms", icon: <CollabIcon />, to: "/collaboration" },
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
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const Sidebar = ({ collapsed }) => (
    <aside className={`sfSidebar ${collapsed ? "sfSidebarCollapsed" : ""}`}>
      <div className="sfSideTop">
        <button
          className="sfCollapseBtn"
          onClick={() => setSidebarOpen((v) => !v)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronIcon open={!collapsed} />
        </button>

        <div className="sfBrand" onClick={() => navigate("/dashboard")} role="button" tabIndex={0}>
          <img src={logo} alt="DevSphere" className="sfBrandLogo" />
          {!collapsed && (
            <span className="sfBrandText">
              Dev<span className="sfBrandAccent">Sphere</span>
            </span>
          )}
        </div>
      </div>

      <nav className="sfNav">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.to}
            active={location.pathname === item.to}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
            onClick={() => {
              navigate(item.to);
              setMobileOpen(false);
            }}
          />
        ))}
      </nav>

      <div className="sfSideFooter">
        <div className="sfAvatar">{initials || "U"}</div>
        {!collapsed && (
          <div className="sfUserMeta">
            <p className="sfUserName">{displayName}</p>
            <p className="sfUserSub">Signed in</p>
          </div>
        )}
      </div>
    </aside>
  );

  const collapsed = !sidebarOpen;

  return (
    <>
      <div className="sfShell">
        {/* Background */}
        <div className="sfBg fixed inset-0 pointer-events-none">
          <div className="sfBlob sfBlob1" />
          <div className="sfBlob sfBlob2" />
          <div className="sfShimmer" />
          <div className="sfGrid" />
          <div className="sfGrain" />
        </div>

        {/* Desktop Sidebar */}
        <div className="sfSideWrap">{Sidebar({ collapsed })}</div>

        {/* Mobile toggle + drawer */}
        <button className="sfMobileMenuBtn" onClick={() => setMobileOpen(true)} title="Menu">
          ☰
        </button>
        {mobileOpen && (
          <div className="sfMobileOverlay" onClick={() => setMobileOpen(false)}>
            <div className="sfMobileDrawer" onClick={(e) => e.stopPropagation()}>
              {Sidebar({ collapsed: false })}
            </div>
          </div>
        )}

        {/* MAIN */}
        <main className="sfMain">
          {/* TOPBAR */}
          <div className={`sfTopbar ${mounted ? "sfIn" : "sfPre"}`}>
            <div className="sfTitleBlock">
              <h1 className="sfTitle">Showcase Feed</h1>
              <p className="sfSubtitle">Discover projects, connect with developers, and get inspired.</p>
            </div>

            <div className="sfTopActions">
              <div className="sfSearch">
                <span className="sfSearchIcon">
                  <SearchIcon />
                </span>
                <input
                  className="sfSearchInput"
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
          <div className={`sfFilters ${mounted ? "sfIn2" : "sfPre"}`}>
            <div className="sfPill">
              <span className="sfPillLabel">Tech</span>
              <select className="sfPillSelect" value={techFilter} onChange={(e) => setTechFilter(e.target.value)}>
                {techOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="sfPill">
              <span className="sfPillLabel">Sort</span>
              <select className="sfPillSelect" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="Trending">Trending</option>
                <option value="Newest">Newest</option>
                <option value="MostLiked">Most liked</option>
              </select>
            </div>

            <button
              className={`sfSavedFilter ${showSavedOnly ? "sfSavedFilterOn" : ""}`}
              onClick={() => setShowSavedOnly((v) => !v)}
              title="Show only saved projects"
            >
              {showSavedOnly ? "Showing: Saved" : "Filter: Saved"}
            </button>

            <div className="sfResults">
              <span className="sfResultsNum">{filtered.length}</span> results
            </div>
          </div>

          {/* GRID */}
          <section className="sfGridCards">
            {filtered.map((p, idx) => {
              const liked = likedIds.has(p.id);
              const saved = savedIds.has(p.id);
              const commentCount = (commentsByProject[p.id]?.length ?? 0) || p.comments;
              const isOwner = p.author === displayName || p.isOwner;

              return (
                <article
                  key={p.id}
                  className={`sfCard sfPulseBorder ${mounted ? "sfCardIn" : "sfCardPre"}`}
                  style={{ transitionDelay: `${Math.min(idx, 8) * 70}ms` }}
                >
                  {/* Thumb */}
                  <div className="sfThumb">
                    <img src={p.thumb} alt={p.title} className="sfImg" />
                    <div className="sfThumbFade" />

                    <div className="sfChips">
                      {p.tech.slice(0, 2).map((t) => (
                        <span key={t} className="sfChip">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="sfThumbActions">
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
                  <div className="sfBody">
                    <div className="sfHeadRow">
                      <div>
                        <h3 className="sfCardTitle">{p.title}</h3>
                        <p className="sfMeta">
                          <span className="sfMetaName">{p.author}</span> • {p.time}
                        </p>
                      </div>

                      {isOwner && (
                        <button className="sfDangerBtn" onClick={() => deleteProject(p.id)} title="Delete your project">
                          <TrashIcon />
                        </button>
                      )}
                    </div>

                    <p className="sfDesc lineClamp2">{p.desc}</p>

                    <div className="sfBottomRow">
                      <div className="sfBtns">
                        <button
                          className={`sfStatBtn ${liked ? "sfStatLiked" : ""}`}
                          onClick={() => toggleLike(p.id)}
                          title="Like"
                        >
                          <HeartIcon filled={liked} />
                          <span>{p.likes + (liked ? 1 : 0)}</span>
                        </button>

                        <button className="sfStatBtn" onClick={() => openComments(p)} title="Open comments">
                          <CommentIcon />
                          <span>{commentCount}</span>
                        </button>

                        <button
                          className={`sfStatBtn ${saved ? "sfStatSaved" : ""}`}
                          onClick={() => toggleSave(p.id)}
                          title={saved ? "Unsave" : "Save"}
                        >
                          <BookmarkIcon filled={saved} />
                          <span>{p.saves + (saved ? 1 : 0)}</span>
                        </button>
                      </div>

                      <button className="sfViewBtn" onClick={() => setOpenProject(p)}>
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

          {/* ---------------- Upload Modal ---------------- */}
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
    </>
  );
}