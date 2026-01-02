// src/pages/Settings.jsx
import React, { useContext, useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";

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

const PlugIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 2h2v6h4V2h2v6h2a2 2 0 0 1 2 2v2a6 6 0 0 1-6 6h-1v4H9v-4H8a6 6 0 0 1-6-6v-2a2 2 0 0 1 2-2h2V2Zm-4 10a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-2H4v2Z" />
  </svg>
);

/* =========================
   Sidebar UI Helpers (EXACT Dashboard style)
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

/* =========================
   Form Helpers
========================= */
const SectionShell = ({ title, desc, children, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 sfPulseBorder sfCardHover ${
      onClick ? "cursor-pointer" : ""
    }`}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={(e) => {
      if (!onClick) return;
      if (e.key === "Enter" || e.key === " ") onClick();
    }}
    title={onClick ? "Open / interact" : undefined}
  >
    <div className="mb-4">
      <h2 className="text-lg md:text-xl font-semibold text-slate-900">{title}</h2>
      {desc ? <p className="text-sm text-slate-500 mt-1">{desc}</p> : null}
    </div>
    {/* stop clicks inside inputs from switching tab */}
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  </div>
);

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition"
    />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition resize-none"
    />
  </div>
);

const Toggle = ({ label, desc, checked, onChange }) => (
  <div
    className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer"
    onClick={onChange}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onChange()}
    title="Toggle setting"
  >
    <div>
      <p className="text-sm font-medium text-slate-900">{label}</p>
      {desc ? <p className="text-xs text-slate-500 mt-0.5">{desc}</p> : null}
    </div>

    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative w-12 h-7 rounded-full transition ${
        checked ? "bg-slate-900" : "bg-slate-300"
      }`}
      aria-pressed={checked}
      title={checked ? "Enabled" : "Disabled"}
    >
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition ${
          checked ? "left-6" : "left-0.5"
        }`}
      />
    </button>
  </div>
);

const Chip = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
      active
        ? "bg-slate-900 text-white"
        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
    }`}
  >
    {children}
  </button>
);

export default function Settings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar toggle (same as Dashboard)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Demo notification badge (same behavior as Dashboard)
  const [unreadCount, setUnreadCount] = useState(3);

  // Online (demo)
  const isOnline = true;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const displayName = user?.name || user?.email || "Guest";
  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .map((p) => p[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }, [displayName]);

  const TABS = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
    { id: "appearance", label: "Appearance" },
    { id: "integrations", label: "Integrations" },
  ];

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const incoming = location?.state?.tab;
    if (incoming) setActiveTab(incoming);
  }, [location?.state?.tab]);

  const [profile, setProfile] = useState({
    fullName: user?.name || "",
    username: "",
    bio: "",
    website: "",
    location: "",
    github: "",
    linkedin: "",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [noti, setNoti] = useState({
    emailAnnouncements: true,
    emailProjectInvites: true,
    pushComments: true,
    pushMentions: true,
    digestWeekly: false,
  });

  // Preview removed — controls kept
  const [appearance, setAppearance] = useState({
    theme: "Light",
    density: "Comfortable",
    accent: "Navy",
  });

  /* =========================
     Integrations: GitHub
  ========================= */
  const [githubUsername, setGithubUsername] = useState(() => {
    const fromUser = user?.githubUsername || "";
    const fromLocal = localStorage.getItem("devsphere_github_username") || "";
    const fromProfileField = (profile.github || "")
      .replace("https://github.com/", "")
      .replace("github.com/", "");
    return fromUser || fromLocal || fromProfileField || "";
  });

  const githubConnected = !!localStorage.getItem("devsphere_github_username");

  const connectGitHub = () => {
    const u = (githubUsername || "")
      .trim()
      .replace("https://github.com/", "")
      .replace("github.com/", "");
    if (!u) {
      toast.error("Please enter a GitHub username.");
      return;
    }
    localStorage.setItem("devsphere_github_username", u);
    toast.success("GitHub connected. Username saved ✅");
  };

  const disconnectGitHub = () => {
    localStorage.removeItem("devsphere_github_username");
    setGithubUsername("");
    toast.info("GitHub disconnected");
  };

  const handleSave = () => {
    if (activeTab === "security") {
      if (security.newPassword && security.newPassword !== security.confirmPassword) {
        toast.error("New password and confirm password do not match.");
        return;
      }
      if (security.newPassword && security.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }
    }
    toast.success("Settings saved (demo). ✅");
  };

  const openTab = (id) => setActiveTab(id);

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex overflow-hidden">
        {/* ✅ NAVY animated background (kept) */}
        <div className="pointer-events-none fixed inset-0">
          <div className="sfBlob sfBlob1" />
          <div className="sfBlob sfBlob2" />
          <div className="sfShimmer" />
        </div>

        {/* ✅ SIDEBAR (EXACT Dashboard style) */}
        <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
          {/* Brand is a button in Dashboard */}
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
            <NavItem
              active={location.pathname === "/settings"}
              icon={<SettingsIcon />}
              label="Settings"
              onClick={() => navigate("/settings")}
            />
          </nav>

          {/* Bottom profile button EXACT Dashboard style */}
          <button
            onClick={() => openTab("profile")}
            className="mt-6 flex items-center gap-3 px-2 text-left hover:bg-slate-800/40 rounded-xl py-2 transition"
            title="Open Profile settings"
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

        {/* ✅ MAIN */}
        <main className="flex-1 p-6 md:p-8 relative">
          {/* Top bar */}
          <div
            className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ${
              mounted ? "sfIn" : "sfPre"
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Settings</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Manage your profile, notifications, appearance, and integrations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.info("Changes reset (demo).")}
                className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
                title="Reset (demo)"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold
                           hover:bg-slate-800 transition shadow hover:-translate-y-[1px] active:translate-y-[1px]"
              >
                Save changes
              </button>
            </div>
          </div>

          {/* Tabs (clickable already) */}
          <div
            className={`bg-white border border-slate-100 rounded-2xl shadow-sm p-4 md:p-5 mb-6 sfPulseBorder ${
              mounted ? "sfIn2" : "sfPre"
            }`}
          >
            <div className="flex flex-wrap gap-2">
              {TABS.map((t) => {
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={[
                      "px-4 py-2 rounded-full text-sm font-semibold transition",
                      active
                        ? "bg-slate-900 text-white shadow"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200",
                    ].join(" ")}
                    title={`Open ${t.label}`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content grid */}
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${mounted ? "sfIn3" : "sfPre"}`}>
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === "profile" && (
                <SectionShell
                  title="Profile"
                  desc="Update your public profile details."
                  onClick={() => toast.info("Tip: Edit fields and click Save changes ✅")}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full name"
                      value={profile.fullName}
                      onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                      placeholder="e.g. Maha Asif"
                    />
                    <Input
                      label="Username"
                      value={profile.username}
                      onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
                      placeholder="e.g. maha.dev"
                    />
                    <Input
                      label="Website"
                      value={profile.website}
                      onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                      placeholder="https://your-portfolio.com"
                    />
                    <Input
                      label="Location"
                      value={profile.location}
                      onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                      placeholder="e.g. Pakistan"
                    />
                    <Input
                      label="GitHub"
                      value={profile.github}
                      onChange={(e) => setProfile((p) => ({ ...p, github: e.target.value }))}
                      placeholder="github.com/username"
                    />
                    <Input
                      label="LinkedIn"
                      value={profile.linkedin}
                      onChange={(e) => setProfile((p) => ({ ...p, linkedin: e.target.value }))}
                      placeholder="linkedin.com/in/username"
                    />
                  </div>

                  <div className="mt-4">
                    <TextArea
                      label="Bio"
                      value={profile.bio}
                      onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                      placeholder="Write a short intro about you..."
                    />
                  </div>
                </SectionShell>
              )}

              {activeTab === "security" && (
                <SectionShell
                  title="Security"
                  desc="Change your password settings."
                  onClick={() => toast.info("Tip: Fill passwords then click Update password")}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Current password"
                      type="password"
                      value={security.currentPassword}
                      onChange={(e) => setSecurity((s) => ({ ...s, currentPassword: e.target.value }))}
                      placeholder="••••••••"
                    />
                    <div className="hidden md:block" />
                    <Input
                      label="New password"
                      type="password"
                      value={security.newPassword}
                      onChange={(e) => setSecurity((s) => ({ ...s, newPassword: e.target.value }))}
                      placeholder="At least 6 characters"
                    />
                    <Input
                      label="Confirm new password"
                      type="password"
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity((s) => ({ ...s, confirmPassword: e.target.value }))}
                      placeholder="Repeat new password"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    className="mt-4 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold
                               hover:bg-slate-800 transition"
                  >
                    Update password
                  </button>
                </SectionShell>
              )}

              {activeTab === "notifications" && (
                <SectionShell
                  title="Notifications"
                  desc="Choose what updates you want to receive."
                  onClick={() => toast.info("Tip: Toggle options — then Save changes")}
                >
                  <div className="space-y-3">
                    <Toggle
                      label="Email: Announcements"
                      desc="Platform updates and DevSphere news."
                      checked={noti.emailAnnouncements}
                      onChange={() => setNoti((n) => ({ ...n, emailAnnouncements: !n.emailAnnouncements }))}
                    />
                    <Toggle
                      label="Email: Project invites"
                      desc="Emails for new collaboration invites."
                      checked={noti.emailProjectInvites}
                      onChange={() => setNoti((n) => ({ ...n, emailProjectInvites: !n.emailProjectInvites }))}
                    />
                    <Toggle
                      label="Push: Comments"
                      desc="Alerts when someone comments on your Showcase posts."
                      checked={noti.pushComments}
                      onChange={() => setNoti((n) => ({ ...n, pushComments: !n.pushComments }))}
                    />
                    <Toggle
                      label="Push: Mentions"
                      desc="Alerts when someone mentions you in rooms or the feed."
                      checked={noti.pushMentions}
                      onChange={() => setNoti((n) => ({ ...n, pushMentions: !n.pushMentions }))}
                    />
                    <Toggle
                      label="Weekly digest"
                      desc="A weekly summary of your activity."
                      checked={noti.digestWeekly}
                      onChange={() => setNoti((n) => ({ ...n, digestWeekly: !n.digestWeekly }))}
                    />
                  </div>

                  {/* demo clickable badge controls */}
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <button
                      onClick={() => setUnreadCount((c) => c + 1)}
                      className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                      title="Demo: increase badge"
                    >
                      + Badge
                    </button>
                    <button
                      onClick={() => setUnreadCount(0)}
                      className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                      title="Demo: clear badge"
                    >
                      Clear badge
                    </button>
                  </div>
                </SectionShell>
              )}

              {activeTab === "appearance" && (
                <SectionShell
                  title="Appearance"
                  desc="Theme and layout preferences."
                  onClick={() => toast.info("Tip: Theme = light/dark, Density = spacing, Accent = highlights")}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Theme</label>
                      <select
                        value={appearance.theme}
                        onChange={(e) => setAppearance((a) => ({ ...a, theme: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition"
                      >
                        <option>Light</option>
                        <option>Dark</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Density</label>
                      <select
                        value={appearance.density}
                        onChange={(e) => setAppearance((a) => ({ ...a, density: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition"
                      >
                        <option>Comfortable</option>
                        <option>Compact</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-medium text-slate-700">Accent</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["Navy", "Sky", "Violet"].map((c) => (
                        <Chip
                          key={c}
                          active={appearance.accent === c}
                          onClick={() => setAppearance((a) => ({ ...a, accent: c }))}
                        >
                          {c}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    <button
                      onClick={() => toast.success("Appearance saved (demo).")}
                      className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                    >
                      Save appearance
                    </button>
                    <button
                      onClick={() => setAppearance({ theme: "Light", density: "Comfortable", accent: "Navy" })}
                      className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                    >
                      Restore defaults
                    </button>
                  </div>
                </SectionShell>
              )}

              {activeTab === "integrations" && (
                <SectionShell
                  title="Integrations"
                  desc="Connect external tools like GitHub."
                  onClick={() => toast.info("Tip: Save GitHub username — dashboard widget uses it")}
                >
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 md:p-5 sfCardHover">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                          <PlugIcon />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">GitHub</p>
                          <p className="text-xs text-slate-600 mt-1">
                            Connect your GitHub username. The Dashboard GitHub card uses this value.
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          githubConnected
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-white text-slate-700 border border-slate-200"
                        }`}
                      >
                        {githubConnected ? "Connected" : "Not connected"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <Input
                          label="GitHub username"
                          value={githubUsername}
                          onChange={(e) => setGithubUsername(e.target.value)}
                          placeholder="e.g. octocat"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                          Tip: Enter only the username (not the full URL).
                        </p>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        <button
                          onClick={connectGitHub}
                          className="w-full px-4 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-extrabold hover:bg-sky-400 transition"
                        >
                          Connect
                        </button>
                        <button
                          onClick={disconnectGitHub}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-extrabold hover:bg-slate-800 transition"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-slate-500">
                    Saved locally as:{" "}
                    <code className="px-2 py-1 rounded bg-white border border-slate-200">
                      devsphere_github_username
                    </code>
                  </div>
                </SectionShell>
              )}
            </div>

            {/* RIGHT (all clickable) */}
            <div className="space-y-6">
              <div
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sfPulseBorder sfCardHover cursor-pointer"
                onClick={() => openTab("profile")}
                title="Open Profile tab"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-semibold">
                    {initials || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                    <p className="text-xs text-slate-500">DevSphere account</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Status</span>
                    <span className="text-emerald-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Quick</span>
                    <span className="text-slate-900 font-semibold">Edit profile →</span>
                  </div>
                </div>
              </div>

              <div
                className="bg-slate-900 rounded-2xl shadow-md p-5 text-white sfPulseBorder sfCardHover cursor-pointer"
                onClick={() => openTab("integrations")}
                title="Open Integrations tab"
              >
                <h3 className="text-sm font-semibold">Tip</h3>
                <p className="text-xs text-slate-200 mt-1">
                  Connect GitHub in Integrations so your Dashboard widget can show your GitHub username.
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openTab("integrations");
                  }}
                  className="mt-3 px-4 py-2 rounded-full bg-white/90 text-slate-900 text-xs font-semibold hover:bg-white transition"
                >
                  Open integrations
                </button>
              </div>

              {/* Quick clickable shortcuts */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sfPulseBorder sfCardHover">
                <h3 className="text-sm font-semibold text-slate-900">Quick shortcuts</h3>
                <p className="text-xs text-slate-500 mt-1">One tap switching</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => openTab("profile")} className="px-3 py-2 rounded-full text-xs font-bold bg-slate-900 text-white">
                    Profile
                  </button>
                  <button onClick={() => openTab("security")} className="px-3 py-2 rounded-full text-xs font-bold bg-slate-100 text-slate-900">
                    Security
                  </button>
                  <button onClick={() => openTab("notifications")} className="px-3 py-2 rounded-full text-xs font-bold bg-slate-100 text-slate-900">
                    Notifications
                  </button>
                  <button onClick={() => openTab("appearance")} className="px-3 py-2 rounded-full text-xs font-bold bg-slate-100 text-slate-900">
                    Appearance
                  </button>
                  <button onClick={() => openTab("integrations")} className="px-3 py-2 rounded-full text-xs font-bold bg-slate-100 text-slate-900">
                    Integrations
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ✅ Animations + theme */}
      <style>{`
        /* Sidebar show/hide — SAME as Dashboard */
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
          width: 560px;
          height: 560px;
          border-radius: 999px;
          filter: blur(95px);
          opacity: .34;
          animation: sfFloat 14s ease-in-out infinite;
          background: radial-gradient(circle at 30% 30%,
            rgba(12, 42, 92, 0.65),
            rgba(6, 22, 58, 0.35),
            rgba(3, 12, 28, 0)
          );
        }
        .sfBlob1{ left: -180px; top: -180px; }
        .sfBlob2{
          right: -220px; bottom: -260px;
          width: 650px; height: 650px;
          opacity: .28;
          animation-duration: 18s;
        }

        .sfShimmer{
          position:absolute;
          inset:-2px;
          pointer-events:none;
          background:
            linear-gradient(120deg,
              rgba(3, 12, 28, 0) 0%,
              rgba(12, 42, 92, 0.22) 45%,
              rgba(3, 12, 28, 0) 70%
            );
          mix-blend-mode: multiply;
          opacity: .55;
          transform: translateX(-30%);
          animation: sfSweep 6.5s ease-in-out infinite;
        }

        @keyframes sfFloat{
          0%{ transform: translate(0px,0px) scale(1); }
          50%{ transform: translate(32px,-28px) scale(1.06); }
          100%{ transform: translate(0px,0px) scale(1); }
        }
        @keyframes sfSweep{
          0%{ transform: translateX(-35%) skewX(-8deg); opacity:.25; }
          50%{ transform: translateX(30%) skewX(-8deg); opacity:.65; }
          100%{ transform: translateX(-35%) skewX(-8deg); opacity:.25; }
        }

        .sfPre{ opacity: 0; transform: translateY(12px); }
        .sfIn{ opacity: 1; transform: translateY(0); transition: all .6s cubic-bezier(.2,.8,.2,1); }
        .sfIn2{ opacity: 1; transform: translateY(0); transition: all .65s cubic-bezier(.2,.8,.2,1); transition-delay: .08s; }
        .sfIn3{ opacity: 1; transform: translateY(0); transition: all .7s cubic-bezier(.2,.8,.2,1); transition-delay: .12s; }

        .sfPulseBorder{ position: relative; }
        .sfPulseBorder::before{
          content:"";
          position:absolute;
          inset:-1px;
          border-radius: 18px;
          background: linear-gradient(120deg,
            rgba(8, 30, 68, 0.85),
            rgba(12, 42, 92, 0.35),
            rgba(8, 30, 68, 0.85)
          );
          opacity: .28;
          filter: blur(10px);
          pointer-events:none;
          animation: sfBorderPulse 4.2s ease-in-out infinite;
        }
        .sfPulseBorder::after{
          content:"";
          position:absolute;
          inset:0;
          border-radius: 18px;
          pointer-events:none;
          box-shadow: 0 0 0 1px rgba(10, 28, 64, 0.30);
        }
        @keyframes sfBorderPulse{
          0%,100%{ opacity: .18; transform: scale(1); }
          50%{ opacity: .40; transform: scale(1.01); }
        }

        .sfCardHover{
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .sfCardHover:hover{
          transform: translateY(-3px);
          box-shadow:
            0 18px 45px rgba(2,6,23,0.10),
            0 0 0 1px rgba(8, 30, 68, 0.10);
        }
      `}</style>
    </>
  );
}