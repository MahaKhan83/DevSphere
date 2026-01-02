// src/pages/Portfolio.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import "./Portfolio.css";

const STORAGE_KEY = "devsphere_portfolio_builder_v14_settings_theme";
const uid = () => Math.random().toString(36).slice(2, 10);

/* ---------------- Utils ---------------- */
function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------------- Icons (Dashboard + Section Icons) ---------------- */
/* Sidebar icons */
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

/* Section Icons */
const SecObjectiveIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
  </svg>
);

const SecExperienceIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4h4a2 2 0 0 1 2 2v1h4v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7h4V6a2 2 0 0 1 2-2Zm5 3V6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1h6Zm-7 6h2v2H8v-2Zm0-4h2v2H8V9Zm6 4h2v2h-2v-2Zm0-4h2v2h-2V9Z" />
  </svg>
);

const SecProjectsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h16v16H4V4Zm3 3v10h10V7H7Zm2 2h6v6H9V9Z" />
  </svg>
);

const SecSkillsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2 2 7l10 5 10-5-10-5Zm0 7L2 4v14l10 5 10-5V4l-10 5Z" />
  </svg>
);

const SecEducationIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Zm-6 9.5V16c0 2.2 2.7 4 6 4s6-1.8 6-4v-3.5l-6 3.27-6-3.27Z" />
  </svg>
);

const SecGithubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48v-1.69c-2.77.6-3.35-1.18-3.35-1.18-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.64-1.34-2.21-.25-4.54-1.1-4.54-4.9 0-1.08.39-1.97 1.03-2.66-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.8c.85 0 1.7.11 2.5.33 1.9-1.29 2.74-1.02 2.74-1.02.56 1.37.21 2.39.1 2.64.64.69 1.03 1.58 1.03 2.66 0 3.81-2.33 4.65-4.55 4.9.36.31.68.92.68 1.86v2.75c0 .26.18.59.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);

const SECTION_ICON = {
  about: <SecObjectiveIcon />,
  experience: <SecExperienceIcon />,
  projects: <SecProjectsIcon />,
  skills: <SecSkillsIcon />,
  education: <SecEducationIcon />,
  github: <SecGithubIcon />,
};

/* ---------------- Templates ---------------- */
const SECTION_TEMPLATES = [
  { id: "about", title: "Objective", data: { text: "Write a short objective/summary..." } },
  {
    id: "experience",
    title: "Experience",
    data: {
      items: [
        {
          role: "Frontend Intern",
          company: "DevSphere Lab",
          period: "2025",
          details: "Built UI modules. Improved UX. Collaborated in sprints.",
        },
      ],
    },
  },
  {
    id: "projects",
    title: "Projects",
    data: {
      items: [{ name: "DevSphere", desc: "Developer Collaboration & Portfolio Platform (MERN).", link: "" }],
    },
  },
  {
    id: "skills",
    title: "Expertise",
    data: { items: [{ name: "React", level: 85 }, { name: "Node.js", level: 70 }, { name: "MongoDB", level: 65 }] },
  },
  {
    id: "education",
    title: "Education",
    data: {
      items: [{ degree: "BS Software Engineering", institute: "Your University", year: "2022–2026", details: "FYP: DevSphere" }],
    },
  },
  { id: "github", title: "GitHub", data: { username: "octocat", repos: [] } },
];

function cloneTemplate(templateId) {
  const t = SECTION_TEMPLATES.find((x) => x.id === templateId);
  if (!t) return null;
  return {
    instanceId: `${t.id}-${uid()}`,
    templateId: t.id,
    title: t.title,
    data: JSON.parse(JSON.stringify(t.data)),
  };
}

/* ---------------- Defaults ---------------- */
const DEFAULT_PROFILE = { name: "", role: "Full-Stack Developer", email: "", phone: "", location: "", photo: "" };
const DEFAULT_THEME = {
  appBg: "#eef3f7",
  paperBg: "#FFFFFF",
  ink: "#0F172A",
  muted: "#475569",
  line: "#E2E8F0",
  accent: "#0ea5e9",

  // ✅ NEW: text + headings colors
  headingColor: "#0F172A",
  bodyColor: "#334155",

  radius: 18,
  fontSize: 14,
  font: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  viewMode: "A4",
  cardShadow: 18,
  sectionGap: 14,
  sectionPad: 18,
  headerCompact: false,
};

/* ---------------- Small UI pieces ---------------- */
const Field = ({ value, onChange, placeholder, className = "" }) => (
  <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`pfField ${className}`} />
);

const TextArea = ({ value, onChange, placeholder, className = "" }) => (
  <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`pfArea ${className}`} />
);

const MiniBtn = ({ children, onClick, tone = "normal", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className={tone === "danger" ? "pfMiniBtn pfMiniBtnDanger" : tone === "primary" ? "pfMiniBtn pfMiniBtnPrimary" : "pfMiniBtn"}
  >
    {children}
  </button>
);

export default function Portfolio() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [sections, setSections] = useState(() => ["about", "experience", "projects", "skills", "education", "github"].map(cloneTemplate).filter(Boolean));
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [theme, setTheme] = useState(DEFAULT_THEME);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [editMode, setEditMode] = useState(true);
  const [openEditorId, setOpenEditorId] = useState(null);

  // floating palette
  const [paletteVisible, setPaletteVisible] = useState(false);
  const [palettePosition, setPalettePosition] = useState({ x: 110, y: 120 });

  // floating customization tools
  const [customizationVisible, setCustomizationVisible] = useState(false);
  const [customizationPosition, setCustomizationPosition] = useState({ x: 450, y: 120 });

  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState("");

  useEffect(() => {
    if (!user) return;
    setProfile((p) => ({
      ...p,
      name: p.name || user?.name || "",
      email: p.email || user?.email || "",
    }));
  }, [user]);

  // load saved
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.sections?.length) setSections(parsed.sections);
      if (parsed?.profile) setProfile((p) => ({ ...p, ...parsed.profile }));
      if (parsed?.theme) setTheme((t) => ({ ...t, ...parsed.theme }));
      if (typeof parsed?.sidebarOpen === "boolean") setSidebarOpen(parsed.sidebarOpen);
      if (typeof parsed?.editMode === "boolean") setEditMode(parsed.editMode);
      if (parsed?.palettePosition) setPalettePosition(parsed.palettePosition);
      if (parsed?.customizationPosition) setCustomizationPosition(parsed.customizationPosition);
    } catch {}
  }, []);

  const save = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sections,
        profile,
        theme,
        sidebarOpen,
        editMode,
        palettePosition,
        customizationPosition,
      })
    );
    toast("Saved ✅");
  };

  const reset = () => {
    setSections(["about", "experience", "projects", "skills", "education", "github"].map(cloneTemplate).filter(Boolean));
    setProfile({ ...DEFAULT_PROFILE, name: user?.name || "", email: user?.email || "" });
    setTheme(DEFAULT_THEME);
    setSidebarOpen(true);
    setEditMode(true);
    setOpenEditorId(null);
    setPaletteVisible(false);
    setCustomizationVisible(false);
    localStorage.removeItem(STORAGE_KEY);
    toast("Reset ✅");
  };

  const downloadAsPDF = () => window.print();

  const onPickPhoto = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please select an image file.");
    if (file.size > 2.5 * 1024 * 1024) return alert("Image too large. Please choose <= 2.5MB.");
    try {
      const base64 = await readFileAsDataURL(file);
      setProfile((p) => ({ ...p, photo: base64 }));
    } catch (e) {
      console.error(e);
      alert("Image load failed. Try another image.");
    }
  };

  const clearPhoto = () => setProfile((p) => ({ ...p, photo: "" }));

  const fetchGithubRepos = async (username) => {
    setGithubError("");
    setGithubLoading(true);
    try {
      const u = (username || "").trim();
      if (!u) throw new Error("Username empty");
      const res = await fetch(`https://api.github.com/users/${u}/repos?sort=updated&per_page=10`);
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
                  username: u,
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
      toast("GitHub repos updated ✅");
    } catch (e) {
      console.error(e);
      setGithubError("Failed to fetch repos. Check username / rate limit.");
    } finally {
      setGithubLoading(false);
    }
  };

  const palette = useMemo(() => SECTION_TEMPLATES.map((t) => t.id), []);
  const canAddTemplate = (templateId) => !sections.some((s) => s.templateId === templateId);

  const removeSection = (instanceId) => {
    setSections((prev) => prev.filter((s) => s.instanceId !== instanceId));
    if (openEditorId === instanceId) setOpenEditorId(null);
  };

  const updateSectionData = (instanceId, updates) => {
    setSections((prev) => prev.map((s) => (s.instanceId === instanceId ? { ...s, data: { ...s.data, ...updates } } : s)));
  };

  const updateSectionItem = (instanceId, index, updates) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.instanceId !== instanceId) return s;
        const items = Array.isArray(s.data.items) ? [...s.data.items] : [];
        items[index] = { ...items[index], ...updates };
        return { ...s, data: { ...s.data, items } };
      })
    );
  };

  const addItem = (instanceId, templateId) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.instanceId !== instanceId) return s;
        const items = Array.isArray(s.data.items) ? [...s.data.items] : [];
        const empty =
          templateId === "experience"
            ? { role: "", company: "", period: "", details: "" }
            : templateId === "education"
            ? { degree: "", institute: "", year: "", details: "" }
            : templateId === "projects"
            ? { name: "", desc: "", link: "" }
            : templateId === "skills"
            ? { name: "", level: 70 }
            : {};
        items.push(empty);
        return { ...s, data: { ...s.data, items } };
      })
    );
  };

  const removeItem = (instanceId, index) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.instanceId !== instanceId) return s;
        const items = Array.isArray(s.data.items) ? [...s.data.items] : [];
        items.splice(index, 1);
        return { ...s, data: { ...s.data, items } };
      })
    );
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === "portfolio" && destination.droppableId === "portfolio") {
      setSections((prev) => reorder(prev, source.index, destination.index));
      return;
    }

    if (source.droppableId === "palette" && destination.droppableId === "portfolio") {
      const templateId = draggableId.replace("tpl-", "");
      if (!canAddTemplate(templateId)) {
        toast("Section already exists ✅");
        return;
      }
      const newSec = cloneTemplate(templateId);
      if (!newSec) return;

      setSections((prev) => {
        const next = Array.from(prev);
        next.splice(destination.index, 0, newSec);
        return next;
      });

      if (editMode) setOpenEditorId(newSec.instanceId);
    }
  };

  // name + initials
  const displayName = user?.name || user?.email || "Guest";
  const initials = displayName
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
  const isOnline = true;

  const NAV = [
    { to: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { to: "/portfolio", label: "Build portfolio", icon: <PortfolioIcon /> },
    { to: "/collaboration", label: "Collab rooms", icon: <CollabIcon /> },
    { to: "/showcase", label: "Showcase feed", icon: <ShowcaseIcon /> },
    { to: "/roles", label: "User roles", icon: <UserRolesIcon /> },
    { to: "/notifications", label: "Notifications", icon: <BellIcon /> },
    { to: "/settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  const activePath = location.pathname;

  /* ---------------- Render helpers ---------------- */
  const SectionPreview = ({ sec }) => {
    const t = sec.templateId;

    if (t === "about") {
      return <div className="pfPreviewText" style={{ color: theme.bodyColor || theme.ink }}>{sec.data?.text || "—"}</div>;
    }

    if (t === "experience") {
      const items = sec.data?.items || [];
      return (
        <div className="pfList">
          {items.map((it, i) => (
            <div key={i} className="pfListRow">
              <div className="pfListTitle" style={{ color: theme.headingColor || theme.ink }}>
                {it.role || "Role"} · {it.company || "Company"}
              </div>
              <div className="pfListMeta">{it.period || ""}</div>
              <div className="pfListDesc" style={{ color: theme.bodyColor || theme.ink }}>{it.details || ""}</div>
            </div>
          ))}
        </div>
      );
    }

    if (t === "projects") {
      const items = sec.data?.items || [];
      return (
        <div className="pfList">
          {items.map((it, i) => (
            <div key={i} className="pfListRow">
              <div className="pfListTitle" style={{ color: theme.headingColor || theme.ink }}>{it.name || "Project"}</div>
              <div className="pfListDesc" style={{ color: theme.bodyColor || theme.ink }}>{it.desc || ""}</div>
              {it.link ? (
                <a className="pfLink" href={it.link} target="_blank" rel="noreferrer">
                  {it.link}
                </a>
              ) : null}
            </div>
          ))}
        </div>
      );
    }

    if (t === "skills") {
      const items = sec.data?.items || [];
      return (
        <div className="pfSkills">
          {items.map((it, i) => {
            const pct = Math.max(0, Math.min(100, Number(it.level) || 0));
            return (
              <div key={i} className="pfSkillRow">
                <div className="pfSkillName" style={{ color: theme.headingColor || theme.ink }}>{it.name || "Skill"}</div>
                <div className="pfSkillBar">
                  <div className="pfSkillFill" style={{ width: `${pct}%`, background: theme.accent }} />
                </div>
                <div className="pfSkillPct">{pct}%</div>
              </div>
            );
          })}
        </div>
      );
    }

    if (t === "education") {
      const items = sec.data?.items || [];
      return (
        <div className="pfList">
          {items.map((it, i) => (
            <div key={i} className="pfListRow">
              <div className="pfListTitle" style={{ color: theme.headingColor || theme.ink }}>
                {it.degree || "Degree"} · {it.institute || "Institute"}
              </div>
              <div className="pfListMeta">{it.year || ""}</div>
              <div className="pfListDesc" style={{ color: theme.bodyColor || theme.ink }}>{it.details || ""}</div>
            </div>
          ))}
        </div>
      );
    }

    if (t === "github") {
      const repos = sec.data?.repos || [];
      return (
        <div>
          <div className="pfGithubTop">
            <div className="pfGithubUser">
              Username: <span className="pfMono">{sec.data?.username || "—"}</span>
            </div>
            {githubError ? <div className="pfError">{githubError}</div> : null}
          </div>

          {repos.length === 0 ? (
            <div className="pfMuted">No repos loaded yet.</div>
          ) : (
            <div className="pfList">
              {repos.map((r, i) => (
                <div key={i} className="pfRepoRow">
                  <div className="pfRepoHead">
                    <a className="pfLink" href={r.url} target="_blank" rel="noreferrer">
                      {r.name}
                    </a>
                    <div className="pfRepoMeta">
                      ⭐ {r.stars} {r.language ? ` · ${r.language}` : ""}
                    </div>
                  </div>
                  {r.desc ? <div className="pfListDesc" style={{ color: theme.bodyColor || theme.ink }}>{r.desc}</div> : null}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <div className="pfMuted">Unknown section</div>;
  };

  const SectionEditor = ({ sec }) => {
    const t = sec.templateId;

    if (t === "about") {
      return (
        <div className="pfEditorGrid">
          <label className="pfLabel">Objective / Summary</label>
          <TextArea value={sec.data?.text || ""} onChange={(v) => updateSectionData(sec.instanceId, { text: v })} placeholder="Write a short objective/summary..." />
        </div>
      );
    }

    if (t === "experience") {
      const items = sec.data?.items || [];
      return (
        <div className="pfEditorGrid">
          <div className="pfEditorRowTop">
            <div className="pfLabel">Experience Items</div>
            <MiniBtn onClick={() => addItem(sec.instanceId, "experience")} tone="primary">
              + Add
            </MiniBtn>
          </div>

          {items.map((it, i) => (
            <div key={i} className="pfItemCard">
              <div className="pfItemGrid">
                <Field value={it.role || ""} onChange={(v) => updateSectionItem(sec.instanceId, i, { role: v })} placeholder="Role" />
                <Field value={it.company || ""} onChange={(v) => updateSectionItem(sec.instanceId, i, { company: v })} placeholder="Company" />
                <Field value={it.period || ""} onChange={(v) => updateSectionItem(sec.instanceId, i, { period: v })} placeholder="Period (e.g. 2025)" />
                <TextArea value={it.details || ""} onChange={(v) => updateSectionItem(sec.instanceId, i, { details: v })} placeholder="Details..." />
              </div>
              <div className="pfItemActions">
                <MiniBtn onClick={() => removeItem(sec.instanceId, i)} tone="danger">
                  Remove
                </MiniBtn>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (t === "projects") {
      const items = sec.data?.items || [];
      return (
        <div className="pfEditorGrid">
          <div className="pfEditorRowTop">
            <div className="pfLabel">Projects</div>
            <MiniBtn onClick={() => addItem(sec.instanceId, "projects")} tone="primary">
              + Add
            </MiniBtn>
          </div>

          {items.map((it, i) => (
            <div key={i} className="pfItemCard">
              <div className="pfItemGrid">
                <Field value={it.name || ""} onChange={(v) => updateSectionItem(sec.instanceId, i, { name: v })} placeholder="Project Name" />
                <Field value={it.link || ""} onChange={(v) => updateSectionItem(sec.instanceId, i, { link: v })} placeholder="Live/GitHub Link (optional)" />
                <TextArea value={it.desc || ""} onChange={(v) => updateSectionItem(sec.instanceId, i, { desc: v })} placeholder="Description..." />
              </div>
              <div className="pfItemActions">
                <MiniBtn onClick={() => removeItem(sec.instanceId, i)} tone="danger">
                  Remove
                </MiniBtn>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (t === "skills") {
      const items = sec.data?.items || [];
      return (
        <div className="pfEditorGrid">
          <div className="pfEditorRowTop">
            <div className="pfLabel">Skills</div>
            <MiniBtn onClick={() => addItem(sec.instanceId, "skills")} tone="primary">
              + Add
            </MiniBtn>
          </div>

          {items.map((it, i) => (
            <div key={i} className="pfItemCard">
              <div className="pfItemGrid">
                <Field value={it.name || ""} onChange={(v) => updateSectionItem(sec.instanceId, i, { name: v })} placeholder="Skill (e.g. React)" />
                <div className="pfRangeRow">
                  <span className="pfMuted">Level</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Number(it.level) || 0}
                    onChange={(e) => updateSectionItem(sec.instanceId, i, { level: Number(e.target.value) })}
                    className="pfRange"
                  />
                  <span className="pfMono">{Number(it.level) || 0}%</span>
                </div>
              </div>
              <div className="pfItemActions">
                <MiniBtn onClick={() => removeItem(sec.instanceId, i)} tone="danger">
                  Remove
                </MiniBtn>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (t === "education") {
      const items = sec.data?.items || [];
      return (
        <div className="pfEditorGrid">
          <div className="pfEditorRowTop">
            <div className="pfLabel">Education</div>
            <MiniBtn onClick={() => addItem(sec.instanceId, "education")} tone="primary">
              + Add
            </MiniBtn>
          </div>

          {items.map((it, i) => (
            <div key={i} className="pfItemCard">
              <div className="pfItemGrid">
                <Field value={it.degree || ""} onChange={(v) => updateSectionItem(sec.instanceId, i, { degree: v })} placeholder="Degree" />
                <Field value={it.institute || ""} onChange={(v) => updateSectionItem(sec.instanceId, i, { institute: v })} placeholder="Institute" />
                <Field value={it.year || ""} onChange={(v) => updateSectionItem(sec.instanceId, i, { year: v })} placeholder="Year (e.g. 2022–2026)" />
                <TextArea value={it.details || ""} onChange={(v) => updateSectionItem(sec.instanceId, i, { details: v })} placeholder="Details..." />
              </div>
              <div className="pfItemActions">
                <MiniBtn onClick={() => removeItem(sec.instanceId, i)} tone="danger">
                  Remove
                </MiniBtn>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (t === "github") {
      return (
        <div className="pfEditorGrid">
          <label className="pfLabel">GitHub Username</label>
          <div className="pfGithubEditRow">
            <Field value={sec.data?.username || ""} onChange={(v) => updateSectionData(sec.instanceId, { username: v })} placeholder="e.g. octocat" />
            <button type="button" className="pfBtnPrimary" onClick={() => fetchGithubRepos(sec.data?.username)} disabled={githubLoading}>
              {githubLoading ? "Loading..." : "Fetch"}
            </button>
          </div>
          {githubError ? <div className="pfError">{githubError}</div> : null}
        </div>
      );
    }

    return null;
  };

  /* ---------------- Floating palette/customization drag ---------------- */
  const createDragHandler = (position, setPosition) => (e) => {
    const target = e.target;
    if (!target.closest(".floatingHeader")) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const init = { ...position };

    const onMove = (ev) => {
      setPosition({
        x: Math.max(10, init.x + (ev.clientX - startX)),
        y: Math.max(10, init.y + (ev.clientY - startY)),
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onPaletteMouseDown = createDragHandler(palettePosition, setPalettePosition);
  const onCustomizationMouseDown = createDragHandler(customizationPosition, setCustomizationPosition);

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: theme.appBg,
        fontFamily: theme.font,
        fontSize: theme.fontSize,
        color: theme.bodyColor || theme.ink, // ✅ body text color
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="pfShell">
          {/* LEFT SIDEBAR (Dashboard-like) */}
          <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-3 px-2 mb-8 text-left" title="Go to Dashboard">
              <img src={logo} alt="DevSphere" className="w-10 h-10 object-contain drop-shadow-md" />
              <span className="text-xl font-semibold">
                Dev<span className="text-cyan-300">Sphere</span>
              </span>
            </button>

            <nav className="flex-1 space-y-2">
              {NAV.map((it) => {
                const isActive = activePath === it.to;
                return (
                  <button
                    key={it.to}
                    onClick={() => navigate(it.to)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                      isActive ? "bg-slate-800 text-slate-50 font-semibold" : "text-slate-200/90 hover:bg-slate-800/60"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-slate-800/80 text-slate-100 flex items-center justify-center">{it.icon}</span>
                      <span>{it.label}</span>
                    </span>
                  </button>
                );
              })}
            </nav>

            <button
              onClick={() => navigate("/settings")}
              className="mt-6 flex items-center gap-3 px-2 text-left hover:bg-slate-800/40 rounded-xl py-2 transition"
              title="Open Settings"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-white">{initials || "U"}</div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f172a] ${
                    isOnline ? "bg-emerald-400" : "bg-slate-400"
                  }`}
                  title={isOnline ? "Online" : "Offline"}
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium truncate max-w-[160px] text-white">{displayName}</p>
                <p className="text-xs text-slate-300 truncate max-w-[160px]">{isOnline ? "Online" : "Offline"} · Signed in</p>
              </div>
            </button>
          </aside>

          {/* MAIN */}
          <div className="pfMain">
            {/* TOPBAR */}
            <div className="pfTopSection">
              <div className="pfTopLeft">
                <button
                  onClick={() => setSidebarOpen((v) => !v)}
                  className="pfSidebarToggle"
                  title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                >
                  {sidebarOpen ? "⟨⟨" : "⟩⟩"}
                </button>

                <div className="pfTitleSection">
                  <h1 className="pfMainTitle" style={{ color: theme.headingColor || theme.ink }}>
                    Portfolio Builder
                  </h1>
                  <p className="pfSubTitle">
                    Welcome back, <span className="font-semibold">{displayName}</span> • Use floating tools
                  </p>
                </div>
              </div>

              <div className="pfModeButtons">
                <button type="button" className={`pfPill ${editMode ? "pfPillOn" : ""}`} onClick={() => setEditMode(true)}>
                  Edit Mode
                </button>

                <button
                  type="button"
                  className={`pfPill ${!editMode ? "pfPillOn" : ""}`}
                  onClick={() => {
                    setEditMode(false);
                    setOpenEditorId(null);
                    toast("Preview mode ✅");
                  }}
                >
                  Preview Mode
                </button>

                <button type="button" className="pfBtnPrimary" onClick={() => setPaletteVisible((v) => !v)}>
                  {paletteVisible ? "Hide Sections" : "Sections"}
                </button>

                <button type="button" className="pfBtnPrimary" onClick={() => setCustomizationVisible((v) => !v)}>
                  {customizationVisible ? "Hide Tools" : "Customize"}
                </button>

                <button type="button" className="pfBtnPrimaryGreen" onClick={downloadAsPDF}>
                  Download PDF
                </button>
                <button type="button" className="pfBtnPrimaryGreen" onClick={save}>
                  Save
                </button>
                <button type="button" className="pfBtnDanger" onClick={reset}>
                  Reset
                </button>
              </div>
            </div>

            {/* Floating Palette - Sections */}
            {paletteVisible && (
              <div className="floatingPalette" style={{ left: `${palettePosition.x}px`, top: `${palettePosition.y}px` }} onMouseDown={onPaletteMouseDown}>
                <div className="floatingHeader">
                  <div className="floatingTitle">
                    <span>📦 Sections</span>
                    <span className="floatingSub">Drag to portfolio</span>
                  </div>

                  <div className="floatingControls">
                    <button type="button" className="floatingClose" onClick={() => setPaletteVisible(false)}>
                      ✕
                    </button>
                  </div>
                </div>

                <div className="floatingContent">
                  <Droppable droppableId="palette" isDropDisabled={true}>
                    {(provided) => (
                      <div className="floatingGrid" ref={provided.innerRef} {...provided.droppableProps}>
                        {palette.map((id, idx) => {
                          const t = SECTION_TEMPLATES.find((x) => x.id === id);
                          const disabled = !canAddTemplate(id);
                          return (
                            <Draggable draggableId={`tpl-${id}`} index={idx} key={id} isDragDisabled={disabled || !editMode}>
                              {(p) => (
                                <div
                                  ref={p.innerRef}
                                  {...p.draggableProps}
                                  {...p.dragHandleProps}
                                  className={`floatingCard ${disabled ? "disabled" : ""}`}
                                  title={!editMode ? "Enable Edit Mode to drag" : disabled ? "Already added" : `Drag to add ${t?.title}`}
                                >
                                  <div className="floatingIcon">{SECTION_ICON[id]}</div>
                                  <div className="floatingCardTitle">{t?.title}</div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                <div className="floatingFooter">
                  <div className="floatingHint">💡 Drag sections directly onto your portfolio</div>
                </div>
              </div>
            )}

            {/* FLOATING CUSTOMIZATION TOOLS (✅ presets removed, font options added) */}
            {customizationVisible && (
              <div
                className="floatingCustomization"
                style={{ left: `${customizationPosition.x}px`, top: `${customizationPosition.y}px` }}
                onMouseDown={onCustomizationMouseDown}
              >
                <div className="floatingHeader">
                  <div className="floatingTitle">
                    <span>⚙️ Customization</span>
                    <span className="floatingSub">Theme & Layout</span>
                  </div>

                  <div className="floatingControls">
                    <button type="button" className="floatingClose" onClick={() => setCustomizationVisible(false)}>
                      ✕
                    </button>
                  </div>
                </div>

                <div className="floatingContent">
                  <div className="customizationGrid">
                    {/* ✅ Font & Text Customization */}
                    <div className="customizationSection">
                      <div className="customizationTitle">🔤 Font & Text</div>

                      <div className="controlBlock">
                        <label>Font Style</label>
                        <select
                          className="customSelect"
                          value={theme.font}
                          onChange={(e) => setTheme((t) => ({ ...t, font: e.target.value }))}
                        >
                          <option value='ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial'>Sans (Default)</option>
                          <option value='ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'>Serif</option>
                          <option value='ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'>Monospace</option>
                          <option value='"Poppins", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial'>Poppins-like</option>
                          <option value='"Inter", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial'>Inter-like</option>
                        </select>
                        <div className="hintLine">💡 Font style pura portfolio ka text change karega.</div>
                      </div>

                      <div className="sliderControl">
                        <label>Font Size</label>
                        <div className="sliderRow">
                          <input
                            type="range"
                            min="12"
                            max="18"
                            value={theme.fontSize}
                            onChange={(e) => setTheme((t) => ({ ...t, fontSize: parseInt(e.target.value) }))}
                          />
                          <span>{theme.fontSize}px</span>
                        </div>
                        <div className="hintLine">💡 Font size overall readability set karta hai.</div>
                      </div>

                      <div className="controlBlock">
                        <label>Headings Color</label>
                        <div className="colorPickerRow">
                          <input
                            type="color"
                            value={theme.headingColor || "#0F172A"}
                            onChange={(e) => setTheme((t) => ({ ...t, headingColor: e.target.value }))}
                            className="colorPicker"
                          />
                          <input
                            type="text"
                            value={theme.headingColor || "#0F172A"}
                            onChange={(e) => setTheme((t) => ({ ...t, headingColor: e.target.value }))}
                            className="colorInput"
                            placeholder="#0F172A"
                          />
                        </div>
                        <div className="hintLine">💡 Section titles / headings ka color change hoga.</div>
                      </div>

                      <div className="controlBlock">
                        <label>Body Text Color</label>
                        <div className="colorPickerRow">
                          <input
                            type="color"
                            value={theme.bodyColor || "#334155"}
                            onChange={(e) => setTheme((t) => ({ ...t, bodyColor: e.target.value }))}
                            className="colorPicker"
                          />
                          <input
                            type="text"
                            value={theme.bodyColor || "#334155"}
                            onChange={(e) => setTheme((t) => ({ ...t, bodyColor: e.target.value }))}
                            className="colorInput"
                            placeholder="#334155"
                          />
                        </div>
                        <div className="hintLine">💡 Paragraphs / normal content text ka color change hoga.</div>
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="customizationSection">
                      <div className="customizationTitle">Accent Color</div>
                      <div className="colorPickerRow">
                        <input type="color" value={theme.accent} onChange={(e) => setTheme((t) => ({ ...t, accent: e.target.value }))} className="colorPicker" />
                        <input
                          type="text"
                          value={theme.accent}
                          onChange={(e) => setTheme((t) => ({ ...t, accent: e.target.value }))}
                          className="colorInput"
                          placeholder="#0ea5e9"
                        />
                      </div>
                      <div className="hintLine">💡 Skill bars / buttons ka highlight color.</div>
                    </div>

                    {/* Layout Options */}
                    <div className="customizationSection">
                      <div className="customizationTitle">📐 Layout</div>
                      <div className="layoutButtons">
                        <button type="button" className={`layoutBtn ${theme.viewMode === "A4" ? "active" : ""}`} onClick={() => setTheme((t) => ({ ...t, viewMode: "A4" }))}>
                          A4 Size
                        </button>
                        <button type="button" className={`layoutBtn ${theme.viewMode === "full" ? "active" : ""}`} onClick={() => setTheme((t) => ({ ...t, viewMode: "full" }))}>
                          Full Width
                        </button>
                      </div>
                      <div className="hintLine">💡 A4 resume view ya full width web view.</div>
                    </div>

                    {/* Spacing Controls */}
                    <div className="customizationSection">
                      <div className="customizationTitle">Spacing</div>

                      <div className="sliderControl">
                        <label>Card Gap</label>
                        <div className="sliderRow">
                          <input type="range" min="8" max="30" value={theme.sectionGap} onChange={(e) => setTheme((t) => ({ ...t, sectionGap: parseInt(e.target.value) }))} />
                          <span>{theme.sectionGap}px</span>
                        </div>
                        <div className="hintLine">💡 Sections ke beech spacing.</div>
                      </div>

                      <div className="sliderControl">
                        <label>Card Shadow</label>
                        <div className="sliderRow">
                          <input type="range" min="0" max="30" value={theme.cardShadow} onChange={(e) => setTheme((t) => ({ ...t, cardShadow: parseInt(e.target.value) }))} />
                          <span>{theme.cardShadow}px</span>
                        </div>
                        <div className="hintLine">💡 Cards ka shadow depth.</div>
                      </div>

                      <div className="sliderControl">
                        <label>Border Radius</label>
                        <div className="sliderRow">
                          <input type="range" min="8" max="30" value={theme.radius} onChange={(e) => setTheme((t) => ({ ...t, radius: parseInt(e.target.value) }))} />
                          <span>{theme.radius}px</span>
                        </div>
                        <div className="hintLine">💡 Corners roundness.</div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="customizationSection">
                      <div className="customizationTitle">⚡ Quick Actions</div>
                      <div className="quickActions">
                        <button
                          type="button"
                          className="quickBtn"
                          onClick={() => {
                            setEditMode(!editMode);
                            toast(editMode ? "Preview mode ✅" : "Edit mode ✅");
                          }}
                        >
                          {editMode ? "Switch to Preview" : "Switch to Edit"}
                        </button>
                        <button type="button" className="quickBtn save" onClick={save}>
                          Save Changes
                        </button>
                        <button type="button" className="quickBtn danger" onClick={reset}>
                          Reset All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="floatingFooter">
                  <div className="floatingHint">🎯 Customize your portfolio look & feel</div>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="pfContentArea">
              <div
                className="pfPaper"
                style={{
                  background: theme.paperBg,
                  borderRadius: theme.radius,
                  border: `1px solid ${theme.line}`,
                  boxShadow: `0 ${theme.cardShadow}px ${theme.cardShadow * 2.2}px rgba(2,6,23,0.08)`,
                  width: theme.viewMode === "A4" ? "210mm" : "100%",
                  maxWidth: "100%",
                  minHeight: "297mm",
                  overflow: "hidden",
                }}
              >
                {/* HEADER */}
                <div className={`stHeaderV2 ${theme.headerCompact ? "compact" : ""}`}>
                  <div className="stLeft">
                    {editMode ? (
                      <>
                        <input className="stNameInpV2" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} placeholder="Your Name" />
                        <input className="stRoleInpV2" value={profile.role} onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))} placeholder="Full-Stack Developer" />
                      </>
                    ) : (
                      <>
                        <div className="stNameTextV2" style={{ color: theme.headingColor || theme.ink }}>
                          {profile.name || "Your Name"}
                        </div>
                        <div className="stRoleTextV2" style={{ color: theme.bodyColor || theme.ink }}>
                          {profile.role || "Full-Stack Developer"}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="stRight">
                    <div className="stInfoList">
                      {editMode ? (
                        <>
                          <input className="stInpV2" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} placeholder="Email" />
                          <input className="stInpV2" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone" />
                          <input className="stInpV2" value={profile.location} onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))} placeholder="Location" />
                        </>
                      ) : (
                        <>
                          <div className="stInfoRow">{profile.email || "Email"}</div>
                          <div className="stInfoRow">{profile.phone || "Phone"}</div>
                          <div className="stInfoRow">{profile.location || "Location"}</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="stAvatar">
                    {profile.photo ? (
                      <img src={profile.photo} alt="Profile" className="stPhotoImgV2" />
                    ) : (
                      <div className="stPhotoEmptyV2">
                        <div className="stPhotoCircle">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div className="stPhotoLabel">Add Photo</div>
                      </div>
                    )}

                    {editMode && (
                      <div className="stPhotoBtns no-print">
                        <label className="stMiniBtn" style={{ background: theme.accent, color: "#fff" }}>
                          Upload
                          <input type="file" accept="image/*" className="pfHidden" onChange={(e) => onPickPhoto(e.target.files?.[0])} />
                        </label>
                        <button type="button" className="stMiniBtnAlt" onClick={clearPhoto}>
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTIONS */}
                <Droppable droppableId="portfolio">
                  {(provided) => (
                    <div
                      className="pfSections"
                      style={{ gap: theme.sectionGap, padding: theme.sectionPad }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {sections.map((sec, index) => {
                        const isOpen = openEditorId === sec.instanceId;
                        return (
                          <Draggable draggableId={sec.instanceId} index={index} key={sec.instanceId} isDragDisabled={!editMode}>
                            {(p) => (
                              <div ref={p.innerRef} {...p.draggableProps} className="pfSectionCard">
                                <div className="pfSectionTop">
                                  <div className="pfSecLeft">
                                    <div className="pfSecBadge">{SECTION_ICON[sec.templateId] || <SecProjectsIcon />}</div>
                                    <div className="pfSecTitle" style={{ color: theme.headingColor || theme.ink }}>
                                      {sec.title}
                                    </div>
                                  </div>

                                  {editMode && (
                                    <div className="pfSecActions">
                                      <MiniBtn onClick={() => setOpenEditorId((v) => (v === sec.instanceId ? null : sec.instanceId))} tone="primary">
                                        {isOpen ? "Close" : "Edit"}
                                      </MiniBtn>

                                      <MiniBtn onClick={() => removeSection(sec.instanceId)} tone="danger">
                                        Remove
                                      </MiniBtn>

                                      <button type="button" className="pfDragHandle" {...p.dragHandleProps} title="Drag to reorder">
                                        ⋮⋮
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className="pfSectionBody">
                                  <SectionPreview sec={sec} />
                                </div>

                                {editMode && isOpen && (
                                  <div className="pfInlineEditor">
                                    <SectionEditor sec={sec} />
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* Inline CSS (includes new select + hints) */}
      <style>{`
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

        /* Editor fields */
        .pfField{
          width: 100%;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(226,232,240,0.95);
          background: #f8fafc;
          outline: none;
        }
        .pfArea{
          width: 100%;
          min-height: 88px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(226,232,240,0.95);
          background: #f8fafc;
          outline: none;
          resize: vertical;
        }
        .pfLabel{ font-weight: 700; color:#0f172a; font-size: 13px; }
        .pfEditorGrid{ display:grid; gap: 10px; }
        .pfEditorRowTop{ display:flex; align-items:center; justify-content:space-between; gap: 10px; }

        .pfMiniBtn{
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid rgba(226,232,240,0.95);
          background: #fff;
          font-weight: 700;
          font-size: 12px;
        }
        .pfMiniBtn:hover{ background:#f8fafc; }
        .pfMiniBtnDanger{ border-color: rgba(239,68,68,0.35); color:#b91c1c; }
        .pfMiniBtnPrimary{ border-color: rgba(14,165,233,0.35); color:#0369a1; }

        .pfItemCard{
          border: 1px solid rgba(226,232,240,0.95);
          background: #fff;
          border-radius: 16px;
          padding: 12px;
          display:grid;
          gap: 10px;
        }
        .pfItemGrid{ display:grid; gap: 10px; }
        .pfItemActions{ display:flex; justify-content:flex-end; }

        /* Preview blocks */
        .pfMuted{ color:#64748b; font-size: 13px; }
        .pfMono{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .pfPreviewText{ line-height: 1.55; white-space: pre-wrap; }

        .pfList{ display:grid; gap: 12px; }
        .pfListRow{ display:grid; gap: 4px; }
        .pfListTitle{ font-weight: 800; }
        .pfListMeta{ font-size: 12px; color:#64748b; }
        .pfListDesc{ line-height: 1.5; }

        .pfLink{ color:#0ea5e9; font-weight: 700; font-size: 12px; }
        .pfLink:hover{ text-decoration: underline; }

        .pfSkills{ display:grid; gap: 10px; }
        .pfSkillRow{ display:grid; grid-template-columns: 140px 1fr 44px; gap: 10px; align-items:center; }
        .pfSkillName{ font-weight: 700; }
        .pfSkillBar{
          height: 10px;
          background: #e2e8f0;
          border-radius: 999px;
          overflow: hidden;
        }
        .pfSkillFill{ height: 100%; border-radius: 999px; }
        .pfSkillPct{ font-size: 12px; color:#64748b; text-align:right; }

        .pfRangeRow{ display:flex; gap: 10px; align-items:center; }
        .pfRange{ width: 100%; }

        .pfGithubEditRow{ display:flex; gap: 10px; align-items:center; }
        .pfError{ color:#b91c1c; font-weight:700; font-size: 12px; }
        .pfGithubTop{ display:flex; justify-content:space-between; gap: 10px; align-items:center; margin-bottom: 10px; }
        .pfRepoRow{ border: 1px solid rgba(226,232,240,0.95); border-radius: 14px; padding: 10px; background:#fff; }
        .pfRepoHead{ display:flex; justify-content:space-between; gap: 10px; align-items:center; }
        .pfRepoMeta{ color:#64748b; font-size: 12px; font-weight: 700; }

        /* Floating windows common styles */
        .floatingPalette, .floatingCustomization {
          position: fixed;
          z-index: 50;
          width: 300px;
          border-radius: 18px;
          border: 1px solid rgba(226,232,240,0.95);
          background: rgba(255,255,255,0.95);
          box-shadow: 0 18px 45px rgba(2,6,23,0.15);
          overflow: hidden;
          backdrop-filter: blur(10px);
          animation: floatIn 0.3s ease-out;
        }

        .floatingCustomization { width: 320px; }

        @keyframes floatIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .floatingHeader{
          padding: 12px 16px;
          background: #0f172a;
          color: #fff;
          display:flex;
          align-items:center;
          justify-content:space-between;
          cursor: move;
          user-select: none;
        }
        .floatingTitle{ display:flex; flex-direction:column; gap:4px; font-weight:800; }
        .floatingSub{ font-size: 11px; opacity: .8; font-weight:700; }
        .floatingClose{
          width: 30px; height: 30px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.10);
          color:#fff;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: all 0.2s ease;
        }
        .floatingClose:hover { background: rgba(255,255,255,0.15); transform: rotate(90deg); }
        .floatingContent{ padding: 16px; max-height: 420px; overflow-y: auto; }
        .floatingGrid{ display:grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }

        .floatingCard{
          border: 1px solid rgba(226,232,240,0.95);
          border-radius: 14px;
          padding: 12px;
          background: #fff;
          display:flex;
          flex-direction:column;
          gap: 10px;
          align-items:flex-start;
          cursor: grab;
          transition: all 0.2s ease;
        }
        .floatingCard:hover {
          transform: translateY(-2px);
          border-color: rgba(14,165,233,0.5);
          box-shadow: 0 8px 20px rgba(14,165,233,0.1);
        }
        .floatingCard.disabled{
          opacity: .5;
          cursor: not-allowed;
        }
        .floatingCard.disabled:hover {
          transform: none;
          border-color: rgba(226,232,240,0.95);
          box-shadow: none;
        }
        .floatingIcon{
          width: 36px; height: 36px;
          border-radius: 12px;
          display:flex; align-items:center; justify-content:center;
          background: rgba(14,165,233,0.1);
          color: #0284c7;
        }
        .floatingCardTitle{ font-weight: 800; color:#0f172a; font-size: 13px; }
        .floatingFooter{
          padding: 12px 16px;
          border-top: 1px solid rgba(226,232,240,0.95);
          background: #f8fafc;
        }
        .floatingHint{ color:#64748b; font-size: 12px; font-weight: 700; text-align: center; }

        /* Customization tools */
        .customizationGrid { display: grid; gap: 20px; }
        .customizationSection {
          background: #f8fafc;
          border-radius: 16px;
          padding: 16px;
          border: 1px solid rgba(226,232,240,0.95);
        }
        .customizationTitle {
          font-weight: 800;
          color: #0f172a;
          font-size: 14px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .controlBlock{ display:grid; gap: 10px; }
        .customSelect{
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid rgba(226,232,240,0.95);
          background: #ffffff;
          font-weight: 800;
          font-size: 13px;
          color: #0f172a;
          outline: none;
        }
        .hintLine{
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
        }

        .colorPickerRow {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .colorPicker {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          border: 2px solid rgba(226,232,240,0.95);
          cursor: pointer;
        }

        .colorInput {
          flex: 1;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid rgba(226,232,240,0.95);
          background: #ffffff;
          font-weight: 700;
          font-size: 13px;
          color: #0f172a;
          outline: none;
        }

        .layoutButtons { display: flex; gap: 10px; }
        .layoutBtn {
          flex: 1;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1.5px solid rgba(226,232,240,0.95);
          background: #ffffff;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .layoutBtn.active {
          background: rgba(14,165,233,0.1);
          border-color: rgba(14,165,233,0.5);
          color: #0284c7;
        }

        .sliderControl { margin-bottom: 16px; }
        .sliderControl:last-child { margin-bottom: 0; }

        .sliderControl label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 8px;
        }

        .sliderRow {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .sliderRow input[type="range"] {
          flex: 1;
          height: 6px;
          border-radius: 10px;
          background: #e2e8f0;
          outline: none;
        }

        .sliderRow span {
          font-size: 12px;
          font-weight: 800;
          color: #0284c7;
          min-width: 40px;
          text-align: right;
        }

        .quickActions { display: flex; flex-direction: column; gap: 10px; }
        .quickBtn {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(226,232,240,0.95);
          background: #ffffff;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }
        .quickBtn:hover { background: #f8fafc; transform: translateY(-1px); }
        .quickBtn.save { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.3); color: #16a34a; }
        .quickBtn.danger { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #b91c1c; }
      `}</style>
    </div>
  );
}
