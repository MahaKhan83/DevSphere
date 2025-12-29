// src/pages/Portfolio.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import "./Portfolio.css";

const STORAGE_KEY = "devsphere_portfolio_builder_v9";

/* ------------------ Helpers ------------------ */

const uid = () => Math.random().toString(36).slice(2, 10);

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function withOpacity(hex, opacity) {
  const c = String(hex || "").replace("#", "");
  if (c.length !== 6) return hex;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatTitle(text, mode) {
  if (!text) return "";
  if (mode === "upper") return String(text).toUpperCase();
  return String(text);
}

/* ------------------ Defaults ------------------ */

const DEFAULT_PROFILE = {
  name: "",
  role: "Full-Stack Developer",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin: "",
  github: "",
  portfolioSlug: "",
  photo: "",
};

const DEFAULT_THEME = {
  appBg: "#0B1220",
  paperBg: "#FFFFFF",
  cardBg: "#F8FAFC",
  ink: "#0F172A",
  muted: "#475569",
  line: "#E2E8F0",
  accent: "#38BDF8",
  radius: 16,
  spacing: 16,
  fontSize: 15,
  font: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  viewMode: "FULL",
  headerStyle: "clean",
  showDividers: true,
  cardShadow: 18,
  cardOpacity: 1,
  density: "comfortable",
  skillsStyle: "badges",
  sectionTitleCase: "title",
};

/* ------------------ Professional Icons (SVG) ------------------ */

const Svg = ({ children }) => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const AboutI = () => (
  <Svg>
    <path d="M20 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10l6 6v10a2 2 0 0 1-2 2Z" />
    <path d="M14 3v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h6" />
  </Svg>
);

const ProjectsI = () => (
  <Svg>
    <path d="M10 6h10" />
    <path d="M10 12h10" />
    <path d="M10 18h10" />
    <path d="M4 6h.01" />
    <path d="M4 12h.01" />
    <path d="M4 18h.01" />
  </Svg>
);

const SkillsI = () => (
  <Svg>
    <path d="M12 2l2.2 4.6 5 .7-3.6 3.6.9 5-4.5-2.4-4.5 2.4.9-5L4.8 7.3l5-.7L12 2z" />
  </Svg>
);

const GithubI = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.86 3.16 8.98 7.55 10.43.55.1.75-.24.75-.53v-1.9c-3.07.67-3.72-1.31-3.72-1.31-.5-1.28-1.22-1.62-1.22-1.62-1-.68.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.69-1.47-2.45-.28-5.02-1.22-5.02-5.43 0-1.2.43-2.18 1.14-2.95-.11-.28-.5-1.4.11-2.92 0 0 .93-.3 3.04 1.13.88-.24 1.82-.36 2.76-.36.94 0 1.88.12 2.76.36 2.11-1.43 3.04-1.13 3.04-1.13.61 1.52.22 2.64.11 2.92.71.77 1.14 1.75 1.14 2.95 0 4.22-2.58 5.15-5.04 5.42.39.33.74 1 .74 2.02v2.99c0 .29.2.64.76.53 4.39-1.45 7.54-5.57 7.54-10.43C23.25 5.48 18.27.5 12 .5Z" />
  </svg>
);

const TestimonialsI = () => (
  <Svg>
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
    <path d="M8 9h8" />
    <path d="M8 13h6" />
  </Svg>
);

const ExperienceI = () => (
  <Svg>
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M4 7h16a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z" />
    <path d="M9 13h6" />
  </Svg>
);

const EducationI = () => (
  <Svg>
    <path d="M22 10L12 5 2 10l10 5 10-5Z" />
    <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
  </Svg>
);

const ICONS = {
  about: <AboutI />,
  projects: <ProjectsI />,
  skills: <SkillsI />,
  github: <GithubI />,
  testimonials: <TestimonialsI />,
  experience: <ExperienceI />,
  education: <EducationI />,
};

/* ------------------ Section Templates (NO EMOJIS) ------------------ */

const SECTION_TEMPLATES = [
  {
    id: "about",
    title: "About",
    iconKey: "about",
    data: {
      headline: "Professional Summary",
      text:
        "I’m a full-stack developer focused on building clean, scalable web applications using the MERN stack. I enjoy solving real problems, designing smooth user experiences, and collaborating with teams.",
    },
  },
  {
    id: "experience",
    title: "Experience",
    iconKey: "experience",
    data: {
      headline: "Work Experience",
      items: [
        {
          role: "Frontend Developer (Intern)",
          company: "DevSphere Labs",
          period: "Jun 2025 — Aug 2025",
          details: "Built reusable UI components, improved UX flows, and integrated REST APIs using React.",
        },
      ],
    },
  },
  {
    id: "education",
    title: "Education",
    iconKey: "education",
    data: {
      headline: "Education",
      items: [
        {
          degree: "BS Software Engineering",
          institute: "Your University",
          year: "2022 — 2026",
          details: "Final Year Project: DevSphere – Developer Collaboration & Portfolio Platform",
        },
      ],
    },
  },
  {
    id: "projects",
    title: "Projects",
    iconKey: "projects",
    data: {
      headline: "Projects",
      items: [
        {
          name: "DevSphere",
          desc: "Developer Collaboration & Portfolio Platform with portfolio builder, showcase feed, and real-time rooms.",
          link: "",
        },
        {
          name: "Portfolio UI",
          desc: "Modern responsive portfolio with reusable components, clean typography, and optimized layout.",
          link: "",
        },
      ],
    },
  },
  {
    id: "skills",
    title: "Skills",
    iconKey: "skills",
    data: {
      headline: "Skills",
      items: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS", "Git/GitHub"],
    },
  },
  {
    id: "github",
    title: "GitHub Repos",
    iconKey: "github",
    data: { headline: "GitHub Repositories", username: "octocat", repos: [] },
  },
  {
    id: "testimonials",
    title: "Testimonials",
    iconKey: "testimonials",
    data: {
      headline: "Testimonials",
      items: [
        { name: "Teammate", quote: "Very reliable, communicates well, and delivers quality work." },
        { name: "Mentor", quote: "Strong fundamentals, clean code style, and great growth mindset." },
      ],
    },
  },
];

/* ------------------ Clone Template ------------------ */

function cloneTemplate(templateId) {
  const t = SECTION_TEMPLATES.find((x) => x.id === templateId);
  if (!t) return null;
  return {
    instanceId: `${t.id}-${uid()}`,
    templateId: t.id,
    title: t.title,
    iconKey: t.iconKey,
    data: JSON.parse(JSON.stringify(t.data)),
  };
}
/* ------------------ Sidebar Icons (App Nav) ------------------ */

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
    <path d="M19.14 12.94a7.49 7.49 0 0 0 .05-.94 7.49 7.49 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.06 7.06 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 1h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.22-1.12.52-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 7.48a.5.5 0 0 0 .12.64l2.03 1.58c-.03.31-.05.63-.05.94s.02.63.05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.42 1.05.73 1.63.94l.36 2.54a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.54c.58-.22 1.12-.52 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.0 0 0 1 0 7.5Z" />
  </svg>
);

const IconWrap = ({ children }) => (
  <span className="w-9 h-9 rounded-xl bg-slate-800/80 text-slate-100 flex items-center justify-center">
    {children}
  </span>
);

const NavItem = ({ active, icon, label, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
      active ? "bg-slate-800 text-slate-50 font-semibold" : "text-slate-200/90 hover:bg-slate-800/60"
    }`}
    title={collapsed ? label : undefined}
  >
    <IconWrap>{icon}</IconWrap>
    {!collapsed && <span className="truncate">{label}</span>}
  </button>
);

/* ------------------ Component ------------------ */

export default function Portfolio() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const printRef = useRef(null);

  const available = useMemo(() => SECTION_TEMPLATES, []);
  const [sections, setSections] = useState(() =>
    [
      cloneTemplate("about"),
      cloneTemplate("experience"),
      cloneTemplate("education"),
      cloneTemplate("projects"),
      cloneTemplate("skills"),
      cloneTemplate("github"),
      cloneTemplate("testimonials"),
    ].filter(Boolean)
  );

  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);

  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightTab, setRightTab] = useState("sections"); // sections | editor | theme

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const selectedSection = useMemo(
    () => sections.find((s) => s.instanceId === selectedInstanceId) || null,
    [sections, selectedInstanceId]
  );

  useEffect(() => {
    if (selectedInstanceId) setRightTab("editor");
  }, [selectedInstanceId]);

  useEffect(() => {
    if (!user) return;
    setProfile((p) => {
      const name = p.name?.trim() || user?.name?.trim() || (user?.email ? user.email.split("@")[0] : "");
      const email = p.email?.trim() || user?.email?.trim() || "";
      const slug =
        p.portfolioSlug?.trim() ||
        (user?.name
          ? user.name.toLowerCase().replace(/\s+/g, "-")
          : email
          ? email.split("@")[0]
          : "my-portfolio");
      return { ...p, name, email, portfolioSlug: slug };
    });
  }, [user]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.sections?.length) setSections(parsed.sections);
      if (parsed?.profile) setProfile((p) => ({ ...p, ...parsed.profile }));
      if (parsed?.theme) setTheme((t) => ({ ...t, ...parsed.theme }));
      if (typeof parsed?.sidebarOpen === "boolean") setSidebarOpen(parsed.sidebarOpen);
      if (parsed?.rightTab) setRightTab(parsed.rightTab);
    } catch (e) {
      console.warn("Failed to load builder state:", e);
    }
  }, []);
  const save = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ sections, profile, theme, sidebarOpen, rightTab })
    );
    toast("Saved successfully ✅");
  };

  const reset = () => {
    setSections(
      [
        cloneTemplate("about"),
        cloneTemplate("experience"),
        cloneTemplate("education"),
        cloneTemplate("projects"),
        cloneTemplate("skills"),
        cloneTemplate("github"),
        cloneTemplate("testimonials"),
      ].filter(Boolean)
    );
    setProfile((p) => ({
      ...DEFAULT_PROFILE,
      name: user?.name || "",
      email: user?.email || "",
      portfolioSlug:
        user?.name?.toLowerCase().replace(/\s+/g, "-") ||
        (user?.email ? user.email.split("@")[0] : ""),
    }));
    setTheme(DEFAULT_THEME);
    setSelectedInstanceId(null);
    setSidebarOpen(true);
    setRightTab("sections");
    localStorage.removeItem(STORAGE_KEY);
    toast("Reset done ✅");
  };

  const publish = () => {
    save();
    toast("Published (demo) ✅ Your layout is saved.");
  };

  const removeSection = (instanceId) => {
    setSections((prev) => prev.filter((s) => s.instanceId !== instanceId));
    if (selectedInstanceId === instanceId) setSelectedInstanceId(null);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === "preview" &&
      destination.droppableId === "preview"
    ) {
      setSections((prev) => reorder(prev, source.index, destination.index));
      return;
    }

    if (
      source.droppableId === "available" &&
      destination.droppableId === "preview"
    ) {
      const template = available[source.index];
      const newInstance = cloneTemplate(template.id);
      if (!newInstance) return;

      setSections((prev) => {
        const copy = Array.from(prev);
        copy.splice(destination.index, 0, newInstance);
        return copy;
      });
      setSelectedInstanceId(newInstance.instanceId);
      setRightTab("editor");
    }
  };

  const downloadAsPDF = () => window.print();

  const isA4 = theme.viewMode === "A4";

  const shareLink = useMemo(() => {
    const slug = (profile.portfolioSlug || "my-portfolio").trim();
    return `${window.location.origin}/portfolio/view?u=${encodeURIComponent(
      slug
    )}`;
  }, [profile.portfolioSlug]);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast("Link copied ✅");
    } catch {
      alert("Copy failed. Please copy manually:\n" + shareLink);
    }
  };

  const fetchGithubRepos = async () => {
    setGithubError("");
    setGithubLoading(true);

    try {
      const githubSection = sections.find((s) => s.templateId === "github");
      const username = githubSection?.data?.username?.trim();

      if (!username) {
        setGithubError("GitHub username is empty.");
        setGithubLoading(false);
        return;
      }

      const res = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`
      );
      if (!res.ok) throw new Error("GitHub API error");

      const repos = await res.json();

      setSections((prev) =>
        prev.map((s) =>
          s.templateId !== "github"
            ? s
            : {
                ...s,
                data: {
                  ...s.data,
                  repos: Array.isArray(repos)
                    ? repos.map((r) => ({
                        name: r.name,
                        url: r.html_url,
                        desc: r.description || "",
                        stars: r.stargazers_count || 0,
                        language: r.language || "",
                      }))
                    : [],
                },
              }
        )
      );
    } catch (e) {
      setGithubError("Failed to fetch repos. Check username or rate limit.");
    } finally {
      setGithubLoading(false);
    }
  };

  const onPickPhoto = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please select an image file.");
    if (file.size > 2.5 * 1024 * 1024) return alert("Image too large. Please choose <= 2.5MB.");

    const base64 = await readFileAsDataURL(file);
    setProfile((p) => ({ ...p, photo: base64 }));
  };

  const clearPhoto = () => setProfile((p) => ({ ...p, photo: "" }));

  const densityMap = {
    compact: { pad: theme.spacing * 0.75, gap: theme.spacing * 0.75 },
    comfortable: { pad: theme.spacing, gap: theme.spacing },
    spacious: { pad: theme.spacing * 1.25, gap: theme.spacing * 1.25 },
  };
  const density = densityMap[theme.density] || densityMap.comfortable;

  const printCss = `
    @page { size: A4; margin: 12mm; }
    @media print {
      body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      .app-shell { background: white !important; }
      .paper-wrap { padding: 0 !important; }
      .paper { box-shadow: none !important; border: none !important; width: auto !important; }
    }
  `;

  const NAV_ITEMS = [
    { label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
    { label: "Build portfolio", icon: <PortfolioIcon />, to: "/portfolio" },
    { label: "Showcase feed", icon: <ShowcaseIcon />, to: "/showcase" },
    { label: "Collab rooms", icon: <CollabIcon />, to: "/collaboration" },
    { label: "Notifications", icon: <BellIcon />, to: "/notifications" },
    { label: "Settings", icon: <SettingsIcon />, to: "/settings" },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <div
        className="min-h-screen w-full app-shell"
        style={{
          background: "#eef2f6",
          fontFamily: theme.font,
          fontSize: theme.fontSize,
          color: theme.ink,
        }}
      >
        <style>{printCss}</style>

        {/* Navy animated background */}
        <div className="sfBg">
  <div className="sfBlob sfBlob1" />
  <div className="sfBlob sfBlob2" />
  <div className="sfShimmer" />
  <div className="sfGrid" />
  <div className="sfGrain" />
</div>
        
          
        <div className="min-h-screen w-full flex relative">
          {/* LEFT SIDEBAR */}
          <aside
            className={`sidebar ${
              sidebarOpen ? "sidebarOpen" : "sidebarClosed"
            } no-print`}
          >
            <div className="flex items-center gap-3 px-2 mb-8">
              <img
                src={logo}
                alt="DevSphere"
                className="w-10 h-10 object-contain drop-shadow-md"
              />
              {sidebarOpen && (
                <span className="text-xl font-semibold text-white">
                  Dev<span className="text-cyan-300">Sphere</span>
                </span>
              )}
            </div>

            <nav className="flex-1 space-y-2">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.to}
                  active={isActive(item.to)}
                  icon={item.icon}
                  label={item.label}
                  collapsed={!sidebarOpen}
                  onClick={() => navigate(item.to)}
                />
              ))}
            </nav>

            <div className="mt-6 flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold overflow-hidden text-white">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (profile.name || user?.name || user?.email || "U")
                    .trim()
                    .slice(0, 1)
                    .toUpperCase()
                )}
              </div>

              {sidebarOpen && (
                <div>
                  <p className="text-sm font-medium truncate max-w-[140px] text-white">
                    {profile.name || user?.name || user?.email || "Guest"}
                  </p>
                  <p className="text-xs text-slate-300">Signed in</p>
                </div>
              )}
            </div>
          </aside>

          {/* MAIN */}
          <div className="flex-1 min-w-0">
            {/* TOP BAR */}
            <div className="no-print sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur border-b border-slate-800">
              <div
                className={`px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 ${
                  mounted ? "sfIn" : "sfPre"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen((v) => !v)}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-slate-700 text-white hover:bg-white/10 transition grid place-items-center"
                    title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                  >
                    {sidebarOpen ? "⟨⟨" : "⟩⟩"}
                  </button>

                  <div>
                    <h1 className="text-white font-bold text-lg tracking-wide">
                      Build Portfolio
                    </h1>
                    <div className="text-xs text-slate-300">
                      Drag sections • Customize • Export PDF
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      setTheme((t) => ({
                        ...t,
                        viewMode: t.viewMode === "A4" ? "FULL" : "A4",
                      }))
                    }
                    className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-700 bg-white/5 text-white hover:bg-white/10 transition"
                    title="Toggle A4 / Full width"
                  >
                    {isA4 ? "A4 Mode ✅" : "Full Width ✅"}
                  </button>

                  <button
                    onClick={downloadAsPDF}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-sky-400 text-slate-900 hover:bg-sky-300 transition shadow"
                  >
                    Download PDF
                  </button>

                  <button
                    onClick={save}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-400/20 hover:bg-emerald-400/30 transition"
                  >
                    Save
                  </button>

                  <button
                    onClick={reset}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-200 border border-rose-400/20 hover:bg-rose-500/25 transition"
                  >
                    Reset
                  </button>

                  <button
                    onClick={publish}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-emerald-400 text-slate-900 hover:bg-emerald-300 transition shadow"
                  >
                    Publish
                  </button>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="paper-wrap px-4 sm:px-6 py-6">
                <div className={`mx-auto max-w-7xl ${mounted ? "sfIn2" : "sfPre"}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* PREVIEW */}
                    <div className="lg:col-span-8">
                      <div
                        ref={printRef}
                        className="paper settingsCard w-auto  overflow-hidden sfPulseBorder"
                        style={{
                          background: theme.paperBg,
                          borderRadius: theme.radius,
                          border: `1px solid ${theme.line}`,
                          boxShadow: `0 ${theme.cardShadow}px ${
                            theme.cardShadow * 2.3
                          }px rgba(0,0,0,0.22)`,
                          width: isA4 ? "210mm" : "100%",
                          maxWidth: "100%",
                        }}
                      >
                        <div style={{ padding: isA4 ? "14mm" : density.pad }}>
                          <HeaderPro
                            profile={profile}
                            theme={theme}
                            density={density}
                            onPickPhoto={onPickPhoto}
                            clearPhoto={clearPhoto}
                          />

                          {theme.showDividers ? (
                            <div
                              style={{
                                marginTop: density.gap,
                                borderTop: `1px solid ${theme.line}`,
                              }}
                            />
                          ) : null}

                          {/* Share Link */}
                          <div className="no-print mt-5">
                            <div className="text-xs font-extrabold text-slate-600">
                              Shareable Portfolio Link
                            </div>
                            <div className="mt-2 flex gap-2">
                              <input
                                value={shareLink}
                                readOnly
                                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none text-sm"
                              />
                              <button
                                onClick={copyShareLink}
                                className="px-4 py-2 rounded-xl font-extrabold text-sm text-white shadow hover:opacity-95 transition"
                                style={{ background: theme.accent }}
                              >
                                Copy
                              </button>
                            </div>

                            <div className="mt-3">
                              <div className="text-xs font-extrabold text-slate-600 mb-1">
                                Slug
                              </div>
                              <input
                                value={profile.portfolioSlug}
                                onChange={(e) =>
                                  setProfile((p) => ({
                                    ...p,
                                    portfolioSlug: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white outline-none text-sm"
                              />
                            </div>
                          </div>

                          {/* Preview Sections */}
                          <div style={{ marginTop: density.gap }}>
                            <Droppable droppableId="preview">
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className="grid transition-all"
                                  style={{
                                    gap: density.gap,
                                    outline: snapshot.isDraggingOver
                                      ? `2px dashed ${theme.accent}`
                                      : "none",
                                    borderRadius: 14,
                                    padding: 2,
                                  }}
                                >
                                  {sections.map((sec, index) => (
                                    <Draggable
                                      key={sec.instanceId}
                                      draggableId={sec.instanceId}
                                      index={index}
                                    >
                                      {(prov, snap) => (
                                        <div
                                          ref={prov.innerRef}
                                          {...prov.draggableProps}
                                          style={{ ...prov.draggableProps.style }}
                                        >
                                          <div
                                            onClick={() =>
                                              setSelectedInstanceId(sec.instanceId)
                                            }
                                            className={`group cursor-pointer transition-all ${
                                              selectedInstanceId === sec.instanceId
                                                ? "ring-2 ring-sky-300/50"
                                                : ""
                                            }`}
                                            style={{
                                              border: `1px solid ${theme.line}`,
                                              borderRadius: theme.radius,
                                              padding: density.pad * 0.9,
                                              background: withOpacity(
                                                theme.cardBg,
                                                theme.cardOpacity
                                              ),
                                              boxShadow: snap.isDragging
                                                ? "0 14px 34px rgba(15, 23, 42, 0.16)"
                                                : "0 10px 25px rgba(15, 23, 42, 0.06)",
                                              transform: snap.isDragging
                                                ? "scale(1.01)"
                                                : "scale(1)",
                                              transition:
                                                "transform .18s ease, box-shadow .18s ease",
                                              outlineColor: theme.accent,
                                            }}
                                          >
                                            <div className="flex justify-between items-start gap-3">
                                              <div className="flex items-center gap-3">
                                                <div
                                                  className="w-9 h-9 rounded-xl grid place-items-center"
                                                  style={{
                                                    background:
                                                      "rgba(56,189,248,0.16)",
                                                    color: theme.ink,
                                                  }}
                                                >
                                                  {ICONS[sec.iconKey] || <AboutI />}
                                                </div>

                                                <div className="font-extrabold text-sm text-slate-900">
                                                  {formatTitle(
                                                    sec.data.headline || sec.title,
                                                    theme.sectionTitleCase
                                                  )}
                                                </div>
                                              </div>

                                              <div className="no-print flex items-center gap-2">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeSection(sec.instanceId);
                                                  }}
                                                  className="px-3 py-1.5 rounded-lg text-xs font-extrabold border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                                                >
                                                  Remove
                                                </button>

                                                <div
                                                  {...prov.dragHandleProps}
                                                  className="px-3 py-1.5 rounded-lg text-xs font-extrabold border border-slate-200 bg-white text-slate-600 select-none hover:bg-slate-50 transition"
                                                  title="Drag to reorder"
                                                >
                                                  ⋮⋮
                                                </div>
                                              </div>
                                            </div>

                                            <div className="mt-3">
                                              <SectionPreviewPro
                                                section={sec}
                                                theme={theme}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>

                          <div className="no-print mt-4 text-xs text-slate-600">
                            Tip: <b>A4 Mode</b> ON for perfect PDF export.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT PANEL (TABS SYSTEM) */}
                    <div className="lg:col-span-4 no-print">
                      <div className="sfTabs">
                        <button
                          className={`sfTab ${
                            rightTab === "sections" ? "sfTabActive" : ""
                          }`}
                          onClick={() => setRightTab("sections")}
                        >
                          Sections
                        </button>
                        <button
                          className={`sfTab ${
                            rightTab === "editor" ? "sfTabActive" : ""
                          }`}
                          onClick={() => setRightTab("editor")}
                        >
                          Editor
                        </button>
                        <button
                          className={`sfTab ${
                            rightTab === "theme" ? "sfTabActive" : ""
                          }`}
                          onClick={() => setRightTab("theme")}
                        >
                          Theme
                        </button>
                      </div>

                      {rightTab === "sections" && (
                        <Panel title="Available Sections" subtitle="Drag and drop into the preview">
                          <Droppable droppableId="available" isDropDisabled={true}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="grid gap-2"
                              >
                                {available.map((item, index) => (
                                  <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                  >
                                    {(prov, snap) => (
                                      <div
                                        ref={prov.innerRef}
                                        {...prov.draggableProps}
                                        {...prov.dragHandleProps}
                                        className={`flex items-center gap-3 p-3 rounded-xl border border-slate-700/60 transition ${
                                          snap.isDragging
                                            ? "bg-sky-500/20"
                                            : "bg-white/5 hover:bg-white/10"
                                        }`}
                                        style={{ ...prov.draggableProps.style }}
                                      >
                                        <div className="w-10 h-10 rounded-xl grid place-items-center bg-sky-400/20 text-sky-200">
                                          {ICONS[item.iconKey] || <AboutI />}
                                        </div>
                                        <div className="font-extrabold text-sm text-white">
                                          {item.title}
                                        </div>
                                        <div className="ml-auto opacity-70">⠿</div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </Panel>
                      )}

                      {rightTab === "editor" && (
                        <Panel title="Edit Section" subtitle="Preview me section pe click karo">
                          {!selectedSection ? (
                            <div className="text-sm text-slate-300">
                              Preview me section select karo, yahan edit hoga.
                            </div>
                          ) : (
                            <SectionEditorPro
                              section={selectedSection}
                              onChange={(updated) => {
                                setSections((prev) =>
                                  prev.map((s) =>
                                    s.instanceId === updated.instanceId ? updated : s
                                  )
                                );
                              }}
                              profile={profile}
                              setProfile={setProfile}
                              onPickPhoto={onPickPhoto}
                              clearPhoto={clearPhoto}
                              onFetchGithub={fetchGithubRepos}
                              githubLoading={githubLoading}
                              githubError={githubError}
                            />
                          )}
                        </Panel>
                      )}

                      {rightTab === "theme" && (
                        <Panel title="Customization (Advanced)" subtitle="Theme ko readable & visible banao">
                          <ColorRow
                            label="App Background"
                            value={theme.appBg}
                            onChange={(v) => setTheme((t) => ({ ...t, appBg: v }))}
                          />
                          <ColorRow
                            label="Paper Background"
                            value={theme.paperBg}
                            onChange={(v) => setTheme((t) => ({ ...t, paperBg: v }))}
                          />
                          <ColorRow
                            label="Card Background"
                            value={theme.cardBg}
                            onChange={(v) => setTheme((t) => ({ ...t, cardBg: v }))}
                          />
                          <ColorRow
                            label="Text Color"
                            value={theme.ink}
                            onChange={(v) => setTheme((t) => ({ ...t, ink: v }))}
                          />
                          <ColorRow
                            label="Muted Text"
                            value={theme.muted}
                            onChange={(v) => setTheme((t) => ({ ...t, muted: v }))}
                          />
                          <ColorRow
                            label="Border Line"
                            value={theme.line}
                            onChange={(v) => setTheme((t) => ({ ...t, line: v }))}
                          />
                          <ColorRow
                            label="Accent"
                            value={theme.accent}
                            onChange={(v) => setTheme((t) => ({ ...t, accent: v }))}
                          />

                          <RangeRow
                            label="Radius"
                            min={10}
                            max={24}
                            value={theme.radius}
                            onChange={(v) => setTheme((t) => ({ ...t, radius: v }))}
                          />
                          <RangeRow
                            label="Spacing"
                            min={10}
                            max={28}
                            value={theme.spacing}
                            onChange={(v) => setTheme((t) => ({ ...t, spacing: v }))}
                          />
                          <RangeRow
                            label="Font Size"
                            min={13}
                            max={19}
                            value={theme.fontSize}
                            onChange={(v) => setTheme((t) => ({ ...t, fontSize: v }))}
                          />
                          <RangeRow
                            label="Card Shadow"
                            min={0}
                            max={30}
                            value={theme.cardShadow}
                            onChange={(v) => setTheme((t) => ({ ...t, cardShadow: v }))}
                          />
                          <RangeRow
                            label="Card Opacity"
                            min={60}
                            max={100}
                            value={Math.round(theme.cardOpacity * 100)}
                            onChange={(v) =>
                              setTheme((t) => ({ ...t, cardOpacity: v / 100 }))
                            }
                          />

                          <SelectRow
                            label="Density"
                            value={theme.density}
                            onChange={(v) => setTheme((t) => ({ ...t, density: v }))}
                            options={[
                              ["compact", "Compact"],
                              ["comfortable", "Comfortable"],
                              ["spacious", "Spacious"],
                            ]}
                          />

                          <SelectRow
                            label="Header Style"
                            value={theme.headerStyle}
                            onChange={(v) =>
                              setTheme((t) => ({ ...t, headerStyle: v }))
                            }
                            options={[
                              ["clean", "Clean"],
                              ["accent", "Accent"],
                              ["minimal", "Minimal"],
                            ]}
                          />

                          <SelectRow
                            label="Skills Style"
                            value={theme.skillsStyle}
                            onChange={(v) =>
                              setTheme((t) => ({ ...t, skillsStyle: v }))
                            }
                            options={[
                              ["badges", "Badges"],
                              ["chips", "Chips"],
                              ["minimal", "Minimal"],
                            ]}
                          />

                          <SelectRow
                            label="Section Titles"
                            value={theme.sectionTitleCase}
                            onChange={(v) =>
                              setTheme((t) => ({ ...t, sectionTitleCase: v }))
                            }
                            options={[
                              ["title", "Title Case"],
                              ["upper", "UPPERCASE"],
                            ]}
                          />

                          <ToggleRow
                            label="Show dividers"
                            checked={theme.showDividers}
                            onChange={(v) =>
                              setTheme((t) => ({ ...t, showDividers: v }))
                            }
                          />

                          <div className="mt-3 text-xs text-slate-300">
                            Best look: <b>Paper = White</b> + <b>Card = Light</b> +{" "}
                            <b>Medium shadow</b>
                          </div>
                        </Panel>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------ Header ------------------ */

function HeaderPro({ profile, theme, density, onPickPhoto, clearPhoto }) {
  const hasAnyContact =
    profile.email ||
    profile.phone ||
    profile.location ||
    profile.website ||
    profile.linkedin ||
    profile.github;

  const headerBg =
    theme.headerStyle === "accent"
      ? `linear-gradient(135deg, ${withOpacity(theme.accent, 0.18)}, rgba(255,255,255,0.0))`
      : theme.headerStyle === "minimal"
      ? "transparent"
      : "rgba(248,250,252,0.95)";

  return (
    <div
      style={{
        border: theme.headerStyle === "minimal" ? "none" : `1px solid ${theme.line}`,
        borderRadius: theme.radius,
        padding: density.pad,
        background: headerBg,
      }}
    >
      <div className="flex gap-4 items-center">
        <div
          className="relative group"
          style={{
            width: 80,
            height: 80,
            borderRadius: 18,
            border: `1px solid ${theme.line}`,
            overflow: "hidden",
            background: "white",
            display: "grid",
            placeItems: "center",
            fontWeight: 900,
            color: theme.muted,
            flexShrink: 0,
          }}
        >
          {profile.photo ? (
            <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            (profile.name || "U").trim().slice(0, 1).toUpperCase()
          )}

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/40 flex items-center justify-center gap-2">
            <label className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-extrabold cursor-pointer">
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickPhoto(e.target.files?.[0])}
              />
            </label>
            <button
              onClick={clearPhoto}
              className="px-3 py-1.5 rounded-lg bg-rose-200 text-rose-900 text-xs font-extrabold"
            >
              Remove
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-3xl font-black tracking-tight text-slate-900">
            {profile.name || "Your Name"}
          </div>
          <div className="text-sm font-extrabold" style={{ color: theme.muted }}>
            {profile.role || "Full-Stack Developer"}
          </div>

          {hasAnyContact ? (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {profile.email ? <TagLite text={profile.email} theme={theme} /> : null}
              {profile.phone ? <TagLite text={profile.phone} theme={theme} /> : null}
              {profile.location ? <TagLite text={profile.location} theme={theme} /> : null}
              {profile.website ? <TagLite text={profile.website} theme={theme} accent /> : null}
              {profile.linkedin ? <TagLite text={profile.linkedin} theme={theme} accent /> : null}
              {profile.github ? <TagLite text={profile.github} theme={theme} accent /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TagLite({ text, theme, accent }) {
  return (
    <span
      className="px-3 py-1.5 rounded-full border font-extrabold bg-white"
      style={{
        borderColor: theme.line,
        color: accent ? theme.accent : theme.muted,
      }}
    >
      {text}
    </span>
  );
}

/* ------------------ Section Preview ------------------ */

function SectionPreviewPro({ section, theme }) {
  const muted = theme.muted;

  switch (section.templateId) {
    case "about":
      return (
        <div className="text-sm leading-relaxed" style={{ color: muted }}>
          {section.data.text}
        </div>
      );

    case "experience":
      return (
        <div className="grid gap-2">
          {section.data.items?.slice(0, 4)?.map((x, i) => (
            <div key={i} className="rounded-xl p-3" style={{ border: `1px solid ${theme.line}`, background: "white" }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-extrabold text-sm">{x.role}</div>
                <div className="text-xs font-extrabold" style={{ color: muted }}>
                  {x.period}
                </div>
              </div>
              <div className="text-xs font-extrabold mt-1" style={{ color: theme.ink }}>
                {x.company}
              </div>
              <div className="text-xs mt-2 leading-relaxed" style={{ color: muted }}>
                {x.details}
              </div>
            </div>
          ))}
        </div>
      );

    case "education":
      return (
        <div className="grid gap-2">
          {section.data.items?.slice(0, 4)?.map((x, i) => (
            <div key={i} className="rounded-xl p-3" style={{ border: `1px solid ${theme.line}`, background: "white" }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-extrabold text-sm">{x.degree}</div>
                <div className="text-xs font-extrabold" style={{ color: muted }}>
                  {x.year}
                </div>
              </div>
              <div className="text-xs font-extrabold mt-1" style={{ color: theme.ink }}>
                {x.institute}
              </div>
              <div className="text-xs mt-2 leading-relaxed" style={{ color: muted }}>
                {x.details}
              </div>
            </div>
          ))}
        </div>
      );

    case "projects":
      return (
        <div className="grid gap-2">
          {section.data.items?.slice(0, 4)?.map((p, i) => (
            <div key={i} className="rounded-xl p-3 transition hover:-translate-y-[1px]" style={{ border: `1px solid ${theme.line}`, background: "white" }}>
              <div className="flex justify-between gap-3">
                <div className="font-extrabold text-sm">{p.name}</div>
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noreferrer" className="text-xs font-extrabold" style={{ color: theme.accent }}>
                    View
                  </a>
                ) : null}
              </div>
              <div className="text-xs mt-1 leading-relaxed" style={{ color: muted }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      );

    case "skills": {
      const style = theme.skillsStyle;
      return (
        <div className="flex flex-wrap gap-2">
          {section.data.items?.slice(0, 28)?.map((s, i) => (
            <span
              key={i}
              className={`text-xs font-extrabold ${style === "minimal" ? "underline" : ""}`}
              style={{
                padding: style === "minimal" ? 0 : "6px 10px",
                borderRadius: style === "minimal" ? 0 : 999,
                border: style === "minimal" ? "none" : `1px solid ${theme.line}`,
                background:
                  style === "chips"
                    ? "rgba(15, 23, 42, 0.04)"
                    : style === "minimal"
                    ? "transparent"
                    : "rgba(56,189,248,0.14)",
                color: theme.ink,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      );
    }

    case "github":
      return (
        <div className="grid gap-2">
          <div className="text-xs" style={{ color: muted }}>
            Username: <span className="font-extrabold">{section.data.username}</span>
          </div>

          {section.data.repos?.length ? (
            section.data.repos.slice(0, 6).map((r, i) => (
              <div key={i} className="rounded-xl p-3" style={{ border: `1px solid ${theme.line}`, background: "white" }}>
                <div className="flex justify-between gap-3">
                  <a href={r.url} target="_blank" rel="noreferrer" className="font-extrabold text-sm" style={{ color: theme.accent }}>
                    {r.name}
                  </a>
                  <div className="text-xs font-extrabold" style={{ color: muted }}>
                    ⭐ {r.stars} {r.language ? `• ${r.language}` : ""}
                  </div>
                </div>
                {r.desc ? (
                  <div className="text-xs mt-1 leading-relaxed" style={{ color: muted }}>
                    {r.desc}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-xs" style={{ color: muted }}>
              No repos loaded. Use editor to fetch GitHub repos.
            </div>
          )}
        </div>
      );

    case "testimonials":
      return (
        <div className="grid gap-2">
          {section.data.items?.slice(0, 4)?.map((t, i) => (
            <div key={i} className="rounded-xl p-3" style={{ border: `1px solid ${theme.line}`, background: "white" }}>
              <div className="font-extrabold text-sm">{t.name}</div>
              <div className="text-xs mt-1 leading-relaxed" style={{ color: muted }}>
                “{t.quote}”
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="text-xs" style={{ color: muted }}>
          Preview unavailable.
        </div>
      );
  }
}

/* ------------------ Editor ------------------ */

function SectionEditorPro({
  section,
  onChange,
  profile,
  setProfile,
  onPickPhoto,
  clearPhoto,
  onFetchGithub,
  githubLoading,
  githubError,
}) {
  const update = (patch) => onChange({ ...section, ...patch });
  const updateData = (patch) => update({ data: { ...section.data, ...patch } });

  return (
    <div className="grid gap-3">
      <div className="border border-slate-700/70 rounded-2xl p-4 bg-white/5 text-white">
        <div className="font-extrabold mb-3">Profile</div>

        <div className="flex gap-3 items-center mb-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 bg-white/5 grid place-items-center font-extrabold">
            {profile.photo ? (
              <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              (profile.name || "U").trim().slice(0, 1).toUpperCase()
            )}
          </div>

          <div className="flex-1">
            <div className="text-xs font-extrabold text-slate-300 mb-2">Profile Photo</div>
            <div className="flex gap-2 flex-wrap">
              <label className="px-4 py-2 rounded-xl bg-white/10 border border-slate-700 text-xs font-extrabold cursor-pointer hover:bg-white/15 transition">
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickPhoto(e.target.files?.[0])} />
              </label>
              <button
                onClick={clearPhoto}
                className="px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-400/20 text-rose-200 text-xs font-extrabold hover:bg-rose-500/25 transition"
              >
                Remove Photo
              </button>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">Max size: 2.5MB</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Name" value={profile.name} onChange={(v) => setProfile((p) => ({ ...p, name: v }))} />
          <Field label="Role" value={profile.role} onChange={(v) => setProfile((p) => ({ ...p, role: v }))} />
          <Field label="Email" value={profile.email} onChange={(v) => setProfile((p) => ({ ...p, email: v }))} />
          <Field label="Phone" value={profile.phone} onChange={(v) => setProfile((p) => ({ ...p, phone: v }))} />
          <Field label="Location" value={profile.location} onChange={(v) => setProfile((p) => ({ ...p, location: v }))} />
          <Field label="Website" value={profile.website} onChange={(v) => setProfile((p) => ({ ...p, website: v }))} />
          <Field label="LinkedIn" value={profile.linkedin} onChange={(v) => setProfile((p) => ({ ...p, linkedin: v }))} />
          <Field label="GitHub" value={profile.github} onChange={(v) => setProfile((p) => ({ ...p, github: v }))} />
        </div>
      </div>

      <div className="border border-slate-700/70 rounded-2xl p-4 bg-white/5 text-white">
        <div className="font-extrabold mb-3">Section</div>
        <Field label="Headline" value={section.data.headline || ""} onChange={(v) => updateData({ headline: v })} />
      </div>

      {section.templateId === "about" && (
        <div className="border border-slate-700/70 rounded-2xl p-4 bg-white/5 text-white">
          <div className="font-extrabold mb-3">Summary Text</div>
          <textarea
            value={section.data.text || ""}
            onChange={(e) => updateData({ text: e.target.value })}
            className="w-full min-h-[110px] px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none"
          />
        </div>
      )}

      {section.templateId === "skills" && <SkillsEditorPro items={section.data.items || []} onChange={(items) => updateData({ items })} />}

      {section.templateId === "projects" && <ProjectsEditorPro items={section.data.items || []} onChange={(items) => updateData({ items })} />}

      {section.templateId === "testimonials" && <TestimonialsEditorPro items={section.data.items || []} onChange={(items) => updateData({ items })} />}

      {section.templateId === "experience" && <ExperienceEditorPro items={section.data.items || []} onChange={(items) => updateData({ items })} />}

      {section.templateId === "education" && <EducationEditorPro items={section.data.items || []} onChange={(items) => updateData({ items })} />}

      {section.templateId === "github" && (
        <div className="border border-slate-700/70 rounded-2xl p-4 bg-white/5 text-white">
          <div className="font-extrabold mb-3">GitHub</div>
          <Field label="Username" value={section.data.username || ""} onChange={(v) => updateData({ username: v })} />

          <button
            onClick={onFetchGithub}
            disabled={githubLoading}
            className={`mt-3 px-4 py-2 rounded-xl text-xs font-extrabold text-slate-900 transition shadow ${
              githubLoading ? "bg-slate-500 cursor-not-allowed" : "bg-sky-300 hover:bg-sky-200"
            }`}
          >
            {githubLoading ? "Fetching..." : "Fetch GitHub Repos"}
          </button>

          {githubError ? <div className="mt-2 text-sm text-rose-200">{githubError}</div> : null}
        </div>
      )}
    </div>
  );
}

/* ------------------ Sub Editors ------------------ */

function SkillsEditorPro({ items, onChange }) {
  const [value, setValue] = useState("");

  const add = () => {
    const v = value.trim();
    if (!v) return;
    if (items.includes(v)) return;
    onChange([v, ...items]);
    setValue("");
  };

  return (
    <div className="border border-slate-700/70 rounded-2xl p-4 bg-white/5 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="font-extrabold">Skills</div>
        <div className="text-xs text-slate-300">Add / remove skills</div>
      </div>

      <div className="flex gap-2 mt-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. React"
          className="flex-1 px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none"
        />
        <button onClick={add} className="px-4 py-2 rounded-xl bg-sky-300 text-slate-900 text-xs font-extrabold hover:bg-sky-200 transition">
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {items.map((s, i) => (
          <span
            key={i}
            className="px-3 py-1.5 rounded-full bg-sky-400/20 border border-slate-700 text-xs font-extrabold text-sky-100 inline-flex items-center gap-2"
          >
            {s}
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-sky-100 hover:text-white transition font-black" title="Remove">
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectsEditorPro({ items, onChange }) {
  const add = () => onChange([{ name: "New Project", desc: "Write project description...", link: "" }, ...items]);
  const updateItem = (index, patch) => onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="border border-slate-700/70 rounded-2xl p-4 bg-white/5 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="font-extrabold">Projects</div>
        <button onClick={add} className="px-4 py-2 rounded-xl bg-sky-300 text-slate-900 text-xs font-extrabold hover:bg-sky-200 transition">
          + Add
        </button>
      </div>

      <div className="grid gap-3 mt-3">
        {items.map((p, i) => (
          <div key={i} className="border border-slate-700 rounded-2xl p-3 bg-white/5">
            <div className="flex gap-2 items-center">
              <input
                value={p.name}
                onChange={(e) => updateItem(i, { name: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none font-extrabold"
                placeholder="Project name"
              />
              <button
                onClick={() => remove(i)}
                className="px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-400/20 text-rose-200 text-xs font-extrabold hover:bg-rose-500/25 transition"
              >
                Remove
              </button>
            </div>

            <textarea
              value={p.desc}
              onChange={(e) => updateItem(i, { desc: e.target.value })}
              className="w-full mt-2 min-h-[90px] px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none"
              placeholder="Project description..."
            />

            <input
              value={p.link || ""}
              onChange={(e) => updateItem(i, { link: e.target.value })}
              className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none"
              placeholder="Project link (live / github) https://..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsEditorPro({ items, onChange }) {
  const add = () => onChange([{ name: "Name", quote: "Write testimonial..." }, ...items]);
  const updateItem = (index, patch) => onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="border border-slate-700/70 rounded-2xl p-4 bg-white/5 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="font-extrabold">Testimonials</div>
        <button onClick={add} className="px-4 py-2 rounded-xl bg-sky-300 text-slate-900 text-xs font-extrabold hover:bg-sky-200 transition">
          + Add
        </button>
      </div>

      <div className="grid gap-3 mt-3">
        {items.map((t, i) => (
          <div key={i} className="border border-slate-700 rounded-2xl p-3 bg-white/5">
            <div className="flex gap-2 items-center">
              <input
                value={t.name}
                onChange={(e) => updateItem(i, { name: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none font-extrabold"
                placeholder="Name"
              />
              <button
                onClick={() => remove(i)}
                className="px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-400/20 text-rose-200 text-xs font-extrabold hover:bg-rose-500/25 transition"
              >
                Remove
              </button>
            </div>

            <textarea
              value={t.quote}
              onChange={(e) => updateItem(i, { quote: e.target.value })}
              className="w-full mt-2 min-h-[90px] px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none"
              placeholder="Quote..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceEditorPro({ items, onChange }) {
  const add = () =>
    onChange([
      {
        role: "Role",
        company: "Company",
        period: "2025",
        details: "What you did / achievements...",
      },
      ...items,
    ]);

  const updateItem = (index, patch) =>
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="border border-slate-700/70 rounded-2xl p-4 bg-white/5 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="font-extrabold">Experience</div>
        <button onClick={add} className="px-4 py-2 rounded-xl bg-sky-300 text-slate-900 text-xs font-extrabold hover:bg-sky-200 transition">
          + Add
        </button>
      </div>

      <div className="grid gap-3 mt-3">
        {items.map((x, i) => (
          <div key={i} className="border border-slate-700 rounded-2xl p-3 bg-white/5">
            <div className="flex gap-2 items-center">
              <input
                value={x.role}
                onChange={(e) => updateItem(i, { role: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none font-extrabold"
                placeholder="Role"
              />
              <button
                onClick={() => remove(i)}
                className="px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-400/20 text-rose-200 text-xs font-extrabold hover:bg-rose-500/25 transition"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <input
                value={x.company}
                onChange={(e) => updateItem(i, { company: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none"
                placeholder="Company"
              />
              <input
                value={x.period}
                onChange={(e) => updateItem(i, { period: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none"
                placeholder="Period (e.g. 2024 — 2025)"
              />
            </div>

            <textarea
              value={x.details}
              onChange={(e) => updateItem(i, { details: e.target.value })}
              className="w-full mt-2 min-h-[90px] px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none"
              placeholder="Details / achievements..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationEditorPro({ items, onChange }) {
  const add = () =>
    onChange([
      {
        degree: "Degree",
        institute: "Institute",
        year: "2022 — 2026",
        details: "Major / achievements / FYP details...",
      },
      ...items,
    ]);

  const updateItem = (index, patch) =>
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="border border-slate-700/70 rounded-2xl p-4 bg-white/5 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="font-extrabold">Education</div>
        <button onClick={add} className="px-4 py-2 rounded-xl bg-sky-300 text-slate-900 text-xs font-extrabold hover:bg-sky-200 transition">
          + Add
        </button>
      </div>

      <div className="grid gap-3 mt-3">
        {items.map((x, i) => (
          <div key={i} className="border border-slate-700 rounded-2xl p-3 bg-white/5">
            <div className="flex gap-2 items-center">
              <input
                value={x.degree}
                onChange={(e) => updateItem(i, { degree: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none font-extrabold"
                placeholder="Degree"
              />
              <button
                onClick={() => remove(i)}
                className="px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-400/20 text-rose-200 text-xs font-extrabold hover:bg-rose-500/25 transition"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <input
                value={x.institute}
                onChange={(e) => updateItem(i, { institute: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none"
                placeholder="Institute"
              />
              <input
                value={x.year}
                onChange={(e) => updateItem(i, { year: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none"
                placeholder="Years (e.g. 2022 — 2026)"
              />
            </div>

            <textarea
              value={x.details}
              onChange={(e) => updateItem(i, { details: e.target.value })}
              className="w-full mt-2 min-h-[90px] px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none"
              placeholder="Details..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------ Right Panels ------------------ */

function Panel({ title, subtitle, children }) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-white mb-4 shadow sfPulseBorder">
      <div className="font-extrabold">{title}</div>
      {subtitle ? <div className="text-sm text-slate-300 mt-1 mb-3">{subtitle}</div> : null}
      {children}
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="text-xs font-extrabold text-slate-300">{label}</div>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-8 rounded-lg border-0 bg-transparent" />
        <div className="text-xs text-slate-300">{value}</div>
      </div>
    </div>
  );
}

function RangeRow({ label, min, max, value, onChange }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-extrabold text-slate-300">{label}</div>
        <div className="text-xs text-slate-300">{value}</div>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}

function SelectRow({ label, value, onChange, options }) {
  return (
    <div className="mb-3">
      <div className="text-xs font-extrabold text-slate-300 mb-2">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none">
        {options.map(([val, lab]) => (
          <option key={val} value={val} className="text-slate-900">
            {lab}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 mt-2">
      <div className="text-xs font-extrabold text-slate-300">{label}</div>
      <button
        onClick={() => onChange(!checked)}
        className={`px-4 py-2 rounded-full text-xs font-extrabold border transition ${
          checked ? "bg-emerald-400/20 border-emerald-400/20 text-emerald-200" : "bg-white/5 border-slate-700 text-white hover:bg-white/10"
        }`}
      >
        {checked ? "ON" : "OFF"}
      </button>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <div className="text-xs font-extrabold text-slate-300 mb-2">{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-white/5 text-white outline-none" />
    </div>
  );
}