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

/* ---------------- Icons ---------------- */
// ... (icons same as before) ...

/* Section Icons - Professional & Clean */
// ... (section icons same as before) ...

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
        { role: "Frontend Intern", company: "DevSphere Lab", period: "2025", details: "Built UI modules. Improved UX. Collaborated in sprints." },
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

  const [sections, setSections] = useState(() =>
    ["about", "experience", "projects", "skills", "education", "github"].map(cloneTemplate).filter(Boolean)
  );
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [theme, setTheme] = useState(DEFAULT_THEME);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [editMode, setEditMode] = useState(true);
  const [openEditorId, setOpenEditorId] = useState(null);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [accOpen, setAccOpen] = useState({ sections: false, editor: false, theme: false });

  // ✅ NEW: State for floating palette
  const [paletteVisible, setPaletteVisible] = useState(false);
  const [palettePosition, setPalettePosition] = useState({ x: 100, y: 100 });

  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState("");

  const unreadCount = 3;

  useEffect(() => {
    if (!user) return;
    setProfile((p) => ({ ...p, name: p.name || user?.name || "", email: p.email || user?.email || "" }));
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

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: theme.appBg,
        fontFamily: theme.font,
        fontSize: theme.fontSize,
        color: theme.ink,
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="pfShell">
          {/* LEFT SIDEBAR */}
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
                      <span className="w-9 h-9 rounded-xl bg-slate-800/80 text-slate-100 flex items-center justify-center">
                        {it.icon}
                      </span>
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
                <p className="text-xs text-slate-300 truncate max-w-[160px]">{isOnline ? "Online" : "Offline"} · Signed in</p>
              </div>
            </button>
          </aside>

          {/* MAIN CONTENT */}
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
                  <h1 className="pfMainTitle">Portfolio Builder</h1>
                  <p className="pfSubTitle">
                    Welcome back, <span className="font-semibold">{displayName}</span> • Drag sections from floating palette
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

                {/* ✅ FLOATING PALETTE TOGGLE BUTTON */}
                <button 
                  type="button" 
                  className="pfBtnPrimary"
                  onClick={() => setPaletteVisible(!paletteVisible)}
                >
                  {paletteVisible ? "Hide Sections" : "Show Sections"}
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

            {/* ✅ FLOATING DRAG & DROP PALETTE */}
            {paletteVisible && (
              <div 
                className="floatingPalette"
                style={{
                  left: `${palettePosition.x}px`,
                  top: `${palettePosition.y}px`,
                }}
              >
                <div className="floatingPaletteHeader">
                  <div className="floatingPaletteTitle">
                    <span>📦 Sections</span>
                    <span className="floatingPaletteSub">Drag to portfolio</span>
                  </div>
                  <div className="floatingPaletteControls">
                    <button 
                      type="button" 
                      className="floatingPaletteClose"
                      onClick={() => setPaletteVisible(false)}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="floatingPaletteContent">
                  <Droppable droppableId="palette" isDropDisabled={true}>
                    {(provided) => (
                      <div className="floatingPaletteGrid" ref={provided.innerRef} {...provided.droppableProps}>
                        {palette.map((id, idx) => {
                          const t = SECTION_TEMPLATES.find((x) => x.id === id);
                          const disabled = !canAddTemplate(id);
                          return (
                            <Draggable draggableId={`tpl-${id}`} index={idx} key={id} isDragDisabled={disabled}>
                              {(p) => (
                                <div
                                  ref={p.innerRef}
                                  {...p.draggableProps}
                                  {...p.dragHandleProps}
                                  className={`floatingPaletteCard ${disabled ? "disabled" : ""}`}
                                  title={disabled ? "Already added" : `Drag to add ${t?.title}`}
                                >
                                  <div className="floatingPaletteIcon">
                                    {SECTION_ICON[id]}
                                  </div>
                                  <div className="floatingPaletteCardTitle">{t?.title}</div>
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

                <div className="floatingPaletteFooter">
                  <div className="floatingPaletteHint">
                    💡 Drag sections directly onto your portfolio
                  </div>
                </div>
              </div>
            )}

            {/* PORTFOLIO CONTENT */}
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
                    {profile.photo ? (
                      <img src={profile.photo} alt="Profile" className="stPhotoImgV2" />
                    ) : (
                      <div className="stPhotoEmptyV2">
                        <div className="stPhotoCircle">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                    <div className="pfSections" style={{ gap: theme.sectionGap, padding: theme.sectionPad }} ref={provided.innerRef} {...provided.droppableProps}>
                      {sections.map((sec, index) => {
                        const isOpen = openEditorId === sec.instanceId;
                        return (
                          <Draggable draggableId={sec.instanceId} index={index} key={sec.instanceId} isDragDisabled={!editMode}>
                            {(p) => (
                              <div ref={p.innerRef} {...p.draggableProps} className="pfSectionCard">
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
                                  {/* ... (section content same as before) ... */}
                                </div>

                                {/* Inline Editor */}
                                {editMode && isOpen && (
                                  <div className="pfInlineEditor">
                                    {/* ... (editor content same as before) ... */}
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

        @keyframes pageIn { from { opacity: 0; transform: translateY(14px);} to { opacity: 1; transform: translateY(0);} }
        .animate-pageIn { animation: pageIn .55s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes titleIn { from { opacity: 0; transform: translateX(-16px);} to { opacity: 1; transform: translateX(0);} }
        .animate-titleIn { animation: titleIn .7s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0;} to { opacity: 1;} }
        .animate-fadeIn { animation: fadeIn .8s ease-out both; }
      `}</style>
    </div>
  );
}