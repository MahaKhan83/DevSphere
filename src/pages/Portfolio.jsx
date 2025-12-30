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

/* =========================
   Professional Icons (SVG)
========================= */
const IconWrap = ({ children }) => <span className="pfIconWrap">{children}</span>;

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" className="pfSvg" fill="none" stroke="currentColor">
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-9h7V4h-7v7Z"
    />
  </svg>
);
const PortfolioIcon = () => (
  <svg viewBox="0 0 24 24" className="pfSvg" fill="none" stroke="currentColor">
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 4h4a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3V6a2 2 0 0 1 2-2Zm6 3V6H8v1h8Z"
    />
  </svg>
);
const ShowcaseIcon = () => (
  <svg viewBox="0 0 24 24" className="pfSvg" fill="none" stroke="currentColor">
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z"
    />
  </svg>
);
const CollabIcon = () => (
  <svg viewBox="0 0 24 24" className="pfSvg" fill="none" stroke="currentColor">
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 11a4 4 0 1 0-8 0m14 8v-1a4 4 0 0 0-4-4h-1m-10 0H6a4 4 0 0 0-4 4v1m7-8a4 4 0 1 0-8 0"
    />
  </svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" className="pfSvg" fill="none" stroke="currentColor">
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.2-1.2A2 2 0 0 1 18 14.4V11a6 6 0 0 0-12 0v3.4a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0"
    />
  </svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" className="pfSvg" fill="none" stroke="currentColor">
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.4 15a7.8 7.8 0 0 0 .1-2l2-1.2-2-3.4-2.3.7a8 8 0 0 0-1.7-1l-.4-2.4H9l-.4 2.4a8 8 0 0 0-1.7 1L4.6 8.4l-2 3.4 2 1.2a7.8 7.8 0 0 0 .1 2l-2 1.2 2 3.4 2.3-.7a8 8 0 0 0 1.7 1l.4 2.4h6l.4-2.4a8 8 0 0 0 1.7-1l2.3.7 2-3.4-2-1.2Z"
    />
  </svg>
);

/* Section Icons */
const SecObjectiveIcon = () => (
  <svg viewBox="0 0 24 24" className="pfSvg" fill="none" stroke="currentColor">
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const SecExperienceIcon = () => (
  <svg viewBox="0 0 24 24" className="pfSvg" fill="none" stroke="currentColor">
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M9 6h6m-8 4h10m-10 4h10m-10 4h6" />
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M5 4h14v16H5z" />
  </svg>
);
const SecProjectsIcon = () => (
  <svg viewBox="0 0 24 24" className="pfSvg" fill="none" stroke="currentColor">
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
  </svg>
);
const SecSkillsIcon = () => (
  <svg viewBox="0 0 24 24" className="pfSvg" fill="none" stroke="currentColor">
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M4 19h16M4 15h10M4 11h14M4 7h8" />
  </svg>
);
const SecEducationIcon = () => (
  <svg viewBox="0 0 24 24" className="pfSvg" fill="none" stroke="currentColor">
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 3 2 8l10 5 10-5-10-5Z" />
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M6 10v6c0 2 3 4 6 4s6-2 6-4v-6" />
  </svg>
);
const SecGithubIcon = () => (
  <svg viewBox="0 0 24 24" className="pfSvg" fill="none" stroke="currentColor">
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 19c-4 1.2-4-2-5-2m10 4v-3.2c0-.9.3-1.6.8-2-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.4-2.7 5.4-5.3 5.7.5.4.9 1.2.9 2.4V21"
    />
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

/* ------------------ Templates ------------------ */
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
  { id: "projects", title: "Projects", data: { items: [{ name: "DevSphere", desc: "Developer Collaboration & Portfolio Platform (MERN).", link: "" }] } },
  { id: "skills", title: "Expertise", data: { items: [{ name: "React", level: 85 }, { name: "Node.js", level: 70 }, { name: "MongoDB", level: 65 }] } },
  { id: "education", title: "Education", data: { items: [{ degree: "BS Software Engineering", institute: "Your University", year: "2022–2026", details: "FYP: DevSphere" }] } },
  { id: "github", title: "GitHub", data: { username: "octocat", repos: [] } },
];

function cloneTemplate(templateId) {
  const t = SECTION_TEMPLATES.find((x) => x.id === templateId);
  if (!t) return null;
  return { instanceId: `${t.id}-${uid()}`, templateId: t.id, title: t.title, data: JSON.parse(JSON.stringify(t.data)) };
}

const DEFAULT_PROFILE = { name: "", role: "Full-Stack Developer", email: "", phone: "", location: "", photo: "" };

/* ✅ Settings-style gray background default + navy accents */
const DEFAULT_THEME = {
  appBg: "#eef3f7",
  paperBg: "#FFFFFF",
  ink: "#0F172A",
  muted: "#475569",
  line: "#E2E8F0",
  accent: "#0ea5e9",
  radius: 18,
  fontSize: 14,
  font: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  viewMode: "A4",
  cardShadow: 18,
  sectionGap: 14,
  sectionPad: 18,
  headerCompact: false,
};

const ColorRow = ({ label, value, onChange }) => (
  <div className="pfRow">
    <div className="pfRowTop">
      <span className="pfRowLabel">{label}</span>
      <span className="pfRowValue">{value}</span>
    </div>
    <div className="pfRowInputs">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="pfColor" />
      <input value={value} onChange={(e) => onChange(e.target.value)} className="pfText" />
    </div>
  </div>
);

const RangeRow = ({ label, min, max, value, onChange }) => (
  <div className="pfRow">
    <div className="pfRowTop">
      <span className="pfRowLabel">{label}</span>
      <span className="pfRowValue">{value}</span>
    </div>
    <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="pfRange" />
  </div>
);

function AccordionItem({ title, subtitle, open, onToggle, children }) {
  return (
    <div className="pfAccItem">
      <button type="button" className="pfAccHead" onClick={onToggle}>
        <div>
          <div className="pfAccTitle">{title}</div>
          {subtitle ? <div className="pfAccSub">{subtitle}</div> : null}
        </div>
        <div className={`pfAccChevron ${open ? "open" : ""}`}>⌄</div>
      </button>

      <div className={`pfAccBody ${open ? "open" : ""}`}>
        <div className="pfAccInner">{children}</div>
      </div>
    </div>
  );
}

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

  const [toolsOpen, setToolsOpen] = useState(false);

  const [accOpen, setAccOpen] = useState({
    sections: false,
    editor: false,
    theme: false,
  });

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
      if (parsed?.accOpen) setAccOpen((a) => ({ ...a, ...parsed.accOpen }));
      if (typeof parsed?.toolsOpen === "boolean") setToolsOpen(parsed.toolsOpen);
    } catch {}
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sections, profile, theme, sidebarOpen, editMode, accOpen, toolsOpen }));
    toast("Saved ✅");
  };

  const reset = () => {
    setSections(["about", "experience", "projects", "skills", "education", "github"].map(cloneTemplate).filter(Boolean));
    setProfile({ ...DEFAULT_PROFILE, name: user?.name || "", email: user?.email || "" });
    setTheme(DEFAULT_THEME);
    setSidebarOpen(true);
    setEditMode(true);
    setOpenEditorId(null);
    setToolsOpen(false);
    setAccOpen({ sections: false, editor: false, theme: false });
    localStorage.removeItem(STORAGE_KEY);
    toast("Reset ✅");
  };

  const publish = () => {
    save();
    toast("Published (demo) ✅");
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
    } catch {
      setGithubError("Failed to fetch repos. Check username / rate limit.");
    } finally {
      setGithubLoading(false);
    }
  };

  const NAV_ITEMS = [
    { label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
    { label: "Build portfolio", icon: <PortfolioIcon />, to: "/portfolio" },
    { label: "Showcase feed", icon: <ShowcaseIcon />, to: "/showcase" },
    { label: "Collab rooms", icon: <CollabIcon />, to: "/collaboration" },
    { label: "Notifications", icon: <BellIcon />, to: "/notifications" },
    { label: "Settings", icon: <SettingsIcon />, to: "/settings" },
  ];

  const isActive = (to) => location.pathname === to;

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
      setToolsOpen(true);
      setAccOpen((a) => ({ ...a, editor: true }));
    }
  };

  const printCss = `@page { size: A4; margin: 12mm; }
  @media print {
    body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none !important; }
    .pfApp { background: white !important; }
    .pfPaper { box-shadow: none !important; border: none !important; }
  }`;

  return (
    <div
      className={`pfApp pfSettingsTheme ${editMode ? "isEdit" : "isView"}`}
      style={{
        background: theme.appBg,
        fontFamily: theme.font,
        fontSize: theme.fontSize,
        color: theme.ink,
      }}
    >
      <style>{printCss}</style>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="pfShell">
          {/* LEFT NAV */}
          <aside className={`pfNav no-print ${sidebarOpen ? "pfNavOpen" : "pfNavClosed"}`}>
            <div className="pfBrand">
              <img src={logo} alt="DevSphere" className="pfLogo" />
              {sidebarOpen && (
                <span className="pfBrandTxt">
                  Dev<span>Sphere</span>
                </span>
              )}
            </div>

            <nav className="pfNavList">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => navigate(item.to)}
                  className={`pfNavBtn ${isActive(item.to) ? "active" : ""}`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <IconWrap>{item.icon}</IconWrap>
                  {sidebarOpen && <span className="pfNavLabel">{item.label}</span>}
                </button>
              ))}
            </nav>
          </aside>

          {/* MAIN */}
          <main className="pfMain">
            {/* TOP BAR */}
            <div className="pfTopbar no-print">
              <div className="pfTopLeft">
                <button type="button" className="pfSquareBtn" onClick={() => setSidebarOpen((v) => !v)} title="Toggle sidebar">
                  {sidebarOpen ? "⟨⟨" : "⟩⟩"}
                </button>

                <div>
                  <div className="pfTitle">Portfolio Builder</div>
                  <div className="pfSubtitle">Drag sections from right panel • Edit inside cards • Done = clean view</div>
                </div>
              </div>

              <div className="pfTopRight">
                <button
                  type="button"
                  className={`pfPill ${editMode ? "pfPillOn" : ""}`}
                  onClick={() => {
                    setEditMode(true);
                    toast("Edit mode ✅");
                  }}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className={`pfPill ${!editMode ? "pfPillOn" : ""}`}
                  onClick={() => {
                    setEditMode(false);
                    setOpenEditorId(null);
                    setToolsOpen(false);
                    toast("Done ✅");
                  }}
                >
                  Done
                </button>

                <button type="button" className="pfBtnPrimary" onClick={downloadAsPDF}>
                  Download PDF
                </button>
                <button type="button" className="pfBtnGhost" onClick={save}>
                  Save
                </button>
                <button type="button" className="pfBtnDanger" onClick={reset}>
                  Reset
                </button>
                <button type="button" className="pfBtnPrimaryGreen" onClick={publish}>
                  Publish
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="pfBody">
              {/* CENTER PAPER */}
              <div className="pfCenter">
                <div
                  className="pfPaper"
                  style={{
                    background: theme.paperBg,
                    borderRadius: theme.radius,
                    border: `1px solid ${theme.line}`,
                    boxShadow: `0 ${theme.cardShadow}px ${theme.cardShadow * 2.2}px rgba(0,0,0,0.14)`,
                    width: theme.viewMode === "A4" ? "210mm" : "100%",
                    maxWidth: "100%",
                    minHeight: "297mm",
                  }}
                >
                  {/* HEADER */}
                  <div className={`stHeaderV2 ${theme.headerCompact ? "compact" : ""}`}>
                    <div className="stLeft">
                      {editMode ? (
                        <>
                          <input
                            className="stNameInpV2"
                            value={profile.name}
                            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                            placeholder="Your Name"
                          />
                          <input
                            className="stRoleInpV2"
                            value={profile.role}
                            onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                            placeholder="Full-Stack Developer"
                          />
                        </>
                      ) : (
                        <>
                          <div className="stNameTextV2">{profile.name || "Your Name"}</div>
                          <div className="stRoleTextV2">{profile.role || "Full-Stack Developer"}</div>
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
                      {profile.photo ? <img src={profile.photo} alt="Profile" className="stPhotoImgV2" /> : <div className="stPhotoEmptyV2">No Photo</div>}

                      {editMode && (
                        <div className="stPhotoBtns no-print">
                          <label className="stMiniBtn" style={{ background: theme.accent }}>
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

                  {/* Sections */}
                  <Droppable droppableId="portfolio">
                    {(provided) => (
                      <div className="pfSections" style={{ gap: theme.sectionGap, padding: theme.sectionPad }} ref={provided.innerRef} {...provided.droppableProps}>
                        {sections.map((sec, index) => {
                          const isOpen = openEditorId === sec.instanceId;

                          return (
                            <Draggable draggableId={sec.instanceId} index={index} key={sec.instanceId} isDragDisabled={!editMode}>
                              {(p) => (
                                <div ref={p.innerRef} {...p.draggableProps} className={`pfSectionCard ${editMode ? "pfSectionEdit" : "pfSectionView"}`}>
                                  <div className="pfSectionTop">
                                    <div className="pfSecLeft">
                                      <div className="pfSecBadge">{SECTION_ICON[sec.templateId] || <SecProjectsIcon />}</div>
                                      <div className="pfSecTitle">{sec.title}</div>
                                    </div>

                                    {editMode && (
                                      <div className="pfSecActions">
                                        <button type="button" className="pfMiniBtn" onClick={() => setOpenEditorId((v) => (v === sec.instanceId ? null : sec.instanceId))}>
                                          {isOpen ? "Close" : "Edit"}
                                        </button>
                                        <button type="button" className="pfMiniBtnDanger" onClick={() => removeSection(sec.instanceId)}>
                                          Remove
                                        </button>
                                        <button type="button" className="pfDragHandle" {...p.dragHandleProps} title="Drag to reorder">
                                          ⋮⋮
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  <div className="pfSectionBody">
                                    {sec.templateId === "about" && <div className="pfTextPreview">{sec.data?.text || ""}</div>}

                                    {sec.templateId === "experience" && (
                                      <div className="pfList">
                                        {(sec.data?.items || []).map((it, i) => (
                                          <div className="pfItem" key={i}>
                                            <div className="pfItemTop">
                                              <div>
                                                <div className="pfItemTitle">{it.role || "Role"}</div>
                                                <div className="pfItemSub">{it.company || "Company"}</div>
                                              </div>
                                              <div className="pfPill">{it.period || "Year"}</div>
                                            </div>
                                            {it.details ? <div className="pfItemText">{it.details}</div> : null}
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {sec.templateId === "projects" && (
                                      <div className="pfList">
                                        {(sec.data?.items || []).map((it, i) => (
                                          <div className="pfItem" key={i}>
                                            <div className="pfItemTitle">{it.name || "Project"}</div>
                                            <div className="pfItemText">{it.desc || ""}</div>
                                            {it.link ? (
                                              <a className="pfLink" href={it.link} target="_blank" rel="noreferrer">
                                                {it.link}
                                              </a>
                                            ) : null}
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {sec.templateId === "skills" && (
                                      <div className="pfBars">
                                        {(sec.data?.items || []).map((it, i) => (
                                          <div className="pfBarRow" key={i}>
                                            <div className="pfBarLabel">{it.name || "Skill"}</div>
                                            <div className="pfTrack">
                                              <div className="pfFill" style={{ width: `${it.level ?? 70}%`, background: theme.accent }} />
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {sec.templateId === "education" && (
                                      <div className="pfList">
                                        {(sec.data?.items || []).map((it, i) => (
                                          <div className="pfItem" key={i}>
                                            <div className="pfItemTop">
                                              <div>
                                                <div className="pfItemTitle">{it.degree || "Degree"}</div>
                                                <div className="pfItemSub">{it.institute || "Institute"}</div>
                                              </div>
                                              <div className="pfPill">{it.year || "Year"}</div>
                                            </div>
                                            {it.details ? <div className="pfItemText">{it.details}</div> : null}
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {sec.templateId === "github" && (
                                      <div>
                                        <div className="pfTextPreview">
                                          Username: <b>{sec.data?.username || "not set"}</b>
                                        </div>

                                        {(sec.data?.repos || []).length ? (
                                          <div className="pfList" style={{ marginTop: 10 }}>
                                            {(sec.data.repos || []).slice(0, 3).map((r, i) => (
                                              <div className="pfItem" key={i}>
                                                <div className="pfItemTitle">{r.name}</div>
                                                {r.desc ? <div className="pfItemText">{r.desc}</div> : null}
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="pfMuted" style={{ marginTop: 6 }}>
                                            No repos loaded yet.
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* INLINE EDITOR */}
                                  {editMode && isOpen && (
                                    <div className="pfInlineEditor">
                                      {sec.templateId === "about" && (
                                        <>
                                          <label className="pfLbl">Objective Text</label>
                                          <textarea
                                            className="pfArea"
                                            rows={4}
                                            value={sec.data?.text || ""}
                                            onChange={(e) => updateSectionData(sec.instanceId, { text: e.target.value })}
                                            placeholder="Write your objective/summary..."
                                          />
                                        </>
                                      )}

                                      {["experience", "projects", "education", "skills"].includes(sec.templateId) && (
                                        <>
                                          <div className="pfInlineTop">
                                            <div className="pfInlineTitle">Edit {sec.title}</div>
                                            <button type="button" className="pfMiniBtn" onClick={() => addItem(sec.instanceId, sec.templateId)}>
                                              + Add Item
                                            </button>
                                          </div>

                                          <div className="pfInlineList">
                                            {(sec.data?.items || []).map((it, i) => (
                                              <div key={i} className="pfInlineCard">
                                                <div className="pfInlineCardTop">
                                                  <div className="pfMuted">Item #{i + 1}</div>
                                                  <button type="button" className="pfLinkDanger" onClick={() => removeItem(sec.instanceId, i)}>
                                                    Remove
                                                  </button>
                                                </div>

                                                {sec.templateId === "experience" && (
                                                  <>
                                                    <div className="pf2col">
                                                      <input className="pfInp" value={it.role || ""} onChange={(e) => updateSectionItem(sec.instanceId, i, { role: e.target.value })} placeholder="Role" />
                                                      <input className="pfInp" value={it.company || ""} onChange={(e) => updateSectionItem(sec.instanceId, i, { company: e.target.value })} placeholder="Company" />
                                                    </div>
                                                    <input className="pfInp" value={it.period || ""} onChange={(e) => updateSectionItem(sec.instanceId, i, { period: e.target.value })} placeholder="Year/Period" />
                                                    <textarea className="pfArea" rows={2} value={it.details || ""} onChange={(e) => updateSectionItem(sec.instanceId, i, { details: e.target.value })} placeholder="Details (short)" />
                                                  </>
                                                )}

                                                {sec.templateId === "projects" && (
                                                  <>
                                                    <input className="pfInp" value={it.name || ""} onChange={(e) => updateSectionItem(sec.instanceId, i, { name: e.target.value })} placeholder="Project name" />
                                                    <textarea className="pfArea" rows={2} value={it.desc || ""} onChange={(e) => updateSectionItem(sec.instanceId, i, { desc: e.target.value })} placeholder="Project description" />
                                                    <input className="pfInp" value={it.link || ""} onChange={(e) => updateSectionItem(sec.instanceId, i, { link: e.target.value })} placeholder="Project link (optional)" />
                                                  </>
                                                )}

                                                {sec.templateId === "education" && (
                                                  <>
                                                    <div className="pf2col">
                                                      <input className="pfInp" value={it.degree || ""} onChange={(e) => updateSectionItem(sec.instanceId, i, { degree: e.target.value })} placeholder="Degree" />
                                                      <input className="pfInp" value={it.institute || ""} onChange={(e) => updateSectionItem(sec.instanceId, i, { institute: e.target.value })} placeholder="Institute" />
                                                    </div>
                                                    <input className="pfInp" value={it.year || ""} onChange={(e) => updateSectionItem(sec.instanceId, i, { year: e.target.value })} placeholder="Year" />
                                                    <textarea className="pfArea" rows={2} value={it.details || ""} onChange={(e) => updateSectionItem(sec.instanceId, i, { details: e.target.value })} placeholder="Details" />
                                                  </>
                                                )}

                                                {sec.templateId === "skills" && (
                                                  <div className="pf2col">
                                                    <input className="pfInp" value={it.name || ""} onChange={(e) => updateSectionItem(sec.instanceId, i, { name: e.target.value })} placeholder="Skill name" />
                                                    <div className="pfRangeRow">
                                                      <input className="pfRange" type="range" min="0" max="100" value={it.level ?? 70} onChange={(e) => updateSectionItem(sec.instanceId, i, { level: parseInt(e.target.value) })} />
                                                      <span className="pfRangeVal">{it.level ?? 70}%</span>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </>
                                      )}

                                      {sec.templateId === "github" && (
                                        <>
                                          <label className="pfLbl">GitHub Username</label>
                                          <div className="pfInlineTop">
                                            <input className="pfInp" value={sec.data?.username || ""} onChange={(e) => updateSectionData(sec.instanceId, { username: e.target.value })} placeholder="Enter username" />
                                            <button type="button" className="pfBtnPrimarySm" disabled={githubLoading} onClick={() => fetchGithubRepos(sec.data?.username || "")}>
                                              {githubLoading ? "Loading..." : "Fetch"}
                                            </button>
                                          </div>
                                          {githubError ? <div className="pfError">{githubError}</div> : null}
                                          <div className="pfMuted">Fetches latest 10 repositories.</div>
                                        </>
                                      )}
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

              {/* RIGHT PANEL */}
              <aside className={`pfRight no-print ${toolsOpen ? "pfRightOpen" : "pfRightClosed"}`}>
                <button type="button" className="pfRightToggle" onClick={() => setToolsOpen((v) => !v)} title="Open Builder Tools">
                  <span>Builder Tools</span>
                  <span className={`pfRightChev ${toolsOpen ? "open" : ""}`}>⌄</span>
                </button>

                <div className="pfRightHeader">
                  <div className="pfRightTitle">Builder Tools</div>
                  <div className="pfRightSub">Sections • Editor • Theme</div>
                </div>

                <div className="pfPanel pfPanelAccordion">
                  <AccordionItem
                    title="Available Sections"
                    subtitle="Drag & drop into portfolio"
                    open={accOpen.sections}
                    onToggle={() => setAccOpen((a) => ({ ...a, sections: !a.sections }))}
                  >
                    <Droppable droppableId="palette" isDropDisabled={true}>
                      {(provided) => (
                        <div className="pfPalette" ref={provided.innerRef} {...provided.droppableProps}>
                          {palette.map((id, idx) => {
                            const t = SECTION_TEMPLATES.find((x) => x.id === id);
                            const disabled = !canAddTemplate(id);
                            return (
                              <Draggable draggableId={`tpl-${id}`} index={idx} key={id} isDragDisabled={disabled}>
                                {(p) => (
                                  <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className={`pfPaletteItem ${disabled ? "disabled" : ""}`}>
                                    <div className="pfPaletteLeft">
                                      <div className="pfSecBadge small">{SECTION_ICON[id]}</div>
                                      <div>
                                        <div className="pfPaletteTitle">{t?.title || id}</div>
                                        <div className="pfMuted">{disabled ? "Already added" : "Drag to add"}</div>
                                      </div>
                                    </div>
                                    <div className="pfDragHint">⠿</div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {!editMode && <div className="pfNotice">Switch to <b>Edit</b> mode to reorder & edit sections.</div>}
                  </AccordionItem>

                  <AccordionItem
                    title="Editor Panel"
                    subtitle="Edit inside portfolio cards"
                    open={accOpen.editor}
                    onToggle={() => setAccOpen((a) => ({ ...a, editor: !a.editor }))}
                  >
                    <div className="pfGuide">
                      <div className="pfGuideItem">
                        <div className="pfGuideTitle">How to edit?</div>
                        <div className="pfGuideText">Open a section card → click <b>Edit</b>. Editor opens inside the card.</div>
                      </div>

                      <div className="pfGuideItem">
                        <div className="pfGuideTitle">Professional view</div>
                        <div className="pfGuideText">Press <b>Done</b> → all edit/remove/drag & tools disappear.</div>
                      </div>

                      <div className="pfGuideItem">
                        <div className="pfGuideTitle">Quick Actions</div>
                        <div className="pfGuideActions">
                          <button className="pfBtnGhostSmall" type="button" onClick={() => { setEditMode(true); toast("Edit mode ✅"); }}>
                            Switch to Edit
                          </button>
                          <button className="pfBtnGhostSmall" type="button" onClick={() => { setEditMode(false); setOpenEditorId(null); setToolsOpen(false); toast("Done ✅"); }}>
                            Switch to Done
                          </button>
                          <button className="pfBtnGhostSmall" type="button" onClick={save}>
                            Save now
                          </button>
                        </div>
                      </div>
                    </div>
                  </AccordionItem>

                  <AccordionItem
                    title="Theme Customization"
                    subtitle="Presets, fonts, spacing, layout"
                    open={accOpen.theme}
                    onToggle={() => setAccOpen((a) => ({ ...a, theme: !a.theme }))}
                  >
                    <div className="pfPresetRow">
                      <button type="button" className="pfPresetBtn" onClick={() => setTheme((t) => ({ ...t, appBg: "#eef3f7", paperBg: "#FFFFFF", ink: "#0F172A", muted: "#475569", line: "#E2E8F0", accent: "#0ea5e9" }))}>
                        Settings Gray + Blue
                      </button>
                      <button type="button" className="pfPresetBtn" onClick={() => setTheme((t) => ({ ...t, appBg: "#eef3f7", paperBg: "#FFFFFF", ink: "#0B1220", muted: "#334155", line: "#E5E7EB", accent: "#22c3d6" }))}>
                        Gray + Teal
                      </button>
                      <button type="button" className="pfPresetBtn" onClick={() => setTheme((t) => ({ ...t, appBg: "#eef3f7", paperBg: "#F8FAFC", ink: "#0F172A", muted: "#475569", line: "#E2E8F0", accent: "#34D399" }))}>
                        Gray + Mint
                      </button>
                    </div>

                    <ColorRow label="App Background" value={theme.appBg} onChange={(v) => setTheme((t) => ({ ...t, appBg: v }))} />
                    <ColorRow label="Paper Background" value={theme.paperBg} onChange={(v) => setTheme((t) => ({ ...t, paperBg: v }))} />
                    <ColorRow label="Text (Ink)" value={theme.ink} onChange={(v) => setTheme((t) => ({ ...t, ink: v }))} />
                    <ColorRow label="Muted Text" value={theme.muted} onChange={(v) => setTheme((t) => ({ ...t, muted: v }))} />
                    <ColorRow label="Border Line" value={theme.line} onChange={(v) => setTheme((t) => ({ ...t, line: v }))} />
                    <ColorRow label="Accent Color" value={theme.accent} onChange={(v) => setTheme((t) => ({ ...t, accent: v }))} />

                    <RangeRow label="Border Radius" min={10} max={28} value={theme.radius} onChange={(v) => setTheme((t) => ({ ...t, radius: v }))} />
                    <RangeRow label="Shadow" min={0} max={34} value={theme.cardShadow} onChange={(v) => setTheme((t) => ({ ...t, cardShadow: v }))} />
                    <RangeRow label="Section Padding" min={12} max={28} value={theme.sectionPad} onChange={(v) => setTheme((t) => ({ ...t, sectionPad: v }))} />
                    <RangeRow label="Section Gap" min={10} max={22} value={theme.sectionGap} onChange={(v) => setTheme((t) => ({ ...t, sectionGap: v }))} />

                    <div className="pfRow">
                      <div className="pfRowTop">
                        <span className="pfRowLabel">Header Compact</span>
                        <span className="pfRowValue">{theme.headerCompact ? "ON" : "OFF"}</span>
                      </div>
                      <button type="button" className="pfBtnGhostSmall" onClick={() => setTheme((t) => ({ ...t, headerCompact: !t.headerCompact }))}>
                        Toggle
                      </button>
                    </div>
                  </AccordionItem>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </DragDropContext>
    </div>
  );
}