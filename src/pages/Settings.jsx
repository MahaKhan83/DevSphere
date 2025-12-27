// src/pages/Settings.jsx
import React, { useContext, useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";

/* ---------- Sidebar Icons (Dashboard/Notifications style) ---------- */
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

const BellSolidIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2Z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94a7.49 7.49 0 0 0 .05-.94 7.49 7.49 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.06 7.06 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 1h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.22-1.12.52-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 7.48a.5.5 0 0 0 .12.64l2.03 1.58c-.03.31-.05.63-.05.94s.02.63.05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.42 1.05.73 1.63.94l.36 2.54a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.54c.58-.22 1.12-.52 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" />
  </svg>
);

/* ---------- Sidebar UI helpers ---------- */
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

/* ---------- Form helpers ---------- */
const SectionShell = ({ title, desc, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 sfPulseBorder sfCardHover">
    <div className="mb-4">
      <h2 className="text-lg md:text-xl font-semibold text-slate-900">{title}</h2>
      {desc ? <p className="text-sm text-slate-500 mt-1">{desc}</p> : null}
    </div>
    {children}
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
  <div className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50">
    <div>
      <p className="text-sm font-medium text-slate-900">{label}</p>
      {desc ? <p className="text-xs text-slate-500 mt-0.5">{desc}</p> : null}
    </div>
    <button
      type="button"
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition ${
        checked ? "bg-slate-900" : "bg-slate-300"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition ${
          checked ? "left-6" : "left-0.5"
        }`}
      />
    </button>
  </div>
);

export default function Settings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ same sidebar behavior as notifications page
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ entry animations like notifications page
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

  // Left tabs (inside settings page)
  const TABS = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
    { id: "appearance", label: "Appearance" },
  ];
  const [activeTab, setActiveTab] = useState("profile");

  // Demo state
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
    twoFA: false,
  });

  const [noti, setNoti] = useState({
    emailAnnouncements: true,
    emailProjectInvites: true,
    pushComments: true,
    pushMentions: true,
    digestWeekly: false,
  });

  const [appearance, setAppearance] = useState({
    theme: "Light",
    density: "Comfortable",
  });

  // ✅ App routes sidebar (same as Notifications.jsx)
  const NAV_ITEMS = [
    { label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
    { label: "Build portfolio", icon: <PortfolioIcon />, to: "/portfolio" },
    { label: "Showcase feed", icon: <ShowcaseIcon />, to: "/showcase" },
    { label: "Collab rooms", icon: <CollabIcon />, to: "/collaboration" },
    { label: "Notifications", icon: <BellSolidIcon />, to: "/notifications" },
    { label: "Settings", icon: <SettingsIcon />, to: "/settings" },
  ];

  const isActive = (to) => location.pathname === to;

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

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex overflow-hidden">
        {/* ✅ NAVY animated background */}
        <div className="pointer-events-none fixed inset-0">
          <div className="sfBlob sfBlob1" />
          <div className="sfBlob sfBlob2" />
          <div className="sfShimmer" />
          <div className="sfGrid" />
          <div className="sfSparkles" />
        </div>

        {/* ✅ LEFT APP SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
          <div className="flex items-center gap-3 px-2 mb-8 sfBrandGlow">
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
              <p className="text-xs text-slate-300">Account</p>
            </div>
          </div>
        </aside>

        {/* ✅ MAIN */}
        <main className="flex-1 p-5 md:p-8 relative">
          {/* Top bar */}
          <div
            className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ${
              mounted ? "sfIn" : "sfPre"
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center sfShineBtn"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Settings</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Manage your profile, privacy, notifications & appearance settings here.
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold
                         hover:bg-slate-800 transition shadow hover:-translate-y-[1px] active:translate-y-[1px] sfShineBtn"
            >
              Save changes
            </button>
          </div>

          {/* Mobile tabs */}
          <div className={`md:hidden mb-5 ${mounted ? "sfIn2" : "sfPre"}`}>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-2 rounded-full text-sm whitespace-nowrap transition ${
                    activeTab === t.id
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-slate-200 text-slate-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content grid */}
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${mounted ? "sfIn3" : "sfPre"}`}>
            {/* LEFT CONTENT */}
            <div className="lg:col-span-2 space-y-6">
              {/* Desktop settings tabs */}
              <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm p-3 sfPulseBorder sfCardHover">
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
                            ? "bg-slate-900 text-white shadow sfTabActive"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200",
                        ].join(" ")}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeTab === "profile" && (
                <SectionShell title="Profile" desc="Update your public profile details.">
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
                <SectionShell title="Security" desc="Change your password and manage security options.">
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

                  <div className="mt-4">
                    <Toggle
                      label="Two-factor authentication (2FA)"
                      desc="Enable 2FA for extra security (demo toggle)."
                      checked={security.twoFA}
                      onChange={() => setSecurity((s) => ({ ...s, twoFA: !s.twoFA }))}
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    className="mt-4 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold
                               hover:bg-slate-800 transition sfShineBtn"
                  >
                    Update password
                  </button>
                </SectionShell>
              )}

              {activeTab === "notifications" && (
                <SectionShell title="Notifications" desc="Choose what updates you want to receive.">
                  <div className="space-y-3">
                    <Toggle
                      label="Email: Announcements"
                      desc="DevSphere updates and platform news."
                      checked={noti.emailAnnouncements}
                      onChange={() => setNoti((n) => ({ ...n, emailAnnouncements: !n.emailAnnouncements }))}
                    />
                    <Toggle
                      label="Email: Project invites"
                      desc="New collaboration room invites."
                      checked={noti.emailProjectInvites}
                      onChange={() => setNoti((n) => ({ ...n, emailProjectInvites: !n.emailProjectInvites }))}
                    />
                    <Toggle
                      label="Push: Comments"
                      desc="Notifications for Showcase feed comments."
                      checked={noti.pushComments}
                      onChange={() => setNoti((n) => ({ ...n, pushComments: !n.pushComments }))}
                    />
                    <Toggle
                      label="Push: Mentions"
                      desc="When someone mentions you in rooms or the feed."
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
                </SectionShell>
              )}

              {activeTab === "appearance" && (
                <SectionShell title="Appearance" desc="Theme and layout preferences.">
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

                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 sfCardHover">
                    <p className="text-sm font-medium text-slate-900">Preview</p>
                    <p className="text-xs text-slate-500 mt-1">
                      This is a demo preview. Later we can apply these settings globally.
                    </p>
                  </div>
                </SectionShell>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sfPulseBorder sfCardHover">
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
                    <span className="text-slate-600">Role</span>
                    <span className="text-slate-900 font-medium">Developer</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Status</span>
                    <span className="text-emerald-600 font-medium">Active</span>
                  </div>
                </div>
              </div>

              {/* Navy CTA */}
              <div className="bg-slate-900 rounded-2xl shadow-md p-5 text-white sfPulseBorder sfCardHover">
                <h3 className="text-sm font-semibold">Tip</h3>
                <p className="text-xs text-slate-200 mt-1">
                  Completing your profile helps auto-fill the Portfolio Builder.
                </p>
                <button
                  onClick={() => toast.info("Next: Portfolio Builder auto-fill (demo).")}
                  className="mt-3 px-4 py-2 rounded-full bg-white/90 text-slate-900 text-xs font-semibold hover:bg-white transition sfShineBtn"
                >
                  Learn more
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ✅ Animations + theme */}
      <style>{`
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

        /* ✅ Extra subtle layers */
        .sfGrid{
          position:absolute;
          inset:0;
          background-image:
            linear-gradient(rgba(15,23,42,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.08) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: radial-gradient(circle at 50% 30%, rgba(0,0,0,1), rgba(0,0,0,0));
          opacity: .6;
          animation: sfGridDrift 14s ease-in-out infinite;
        }
        @keyframes sfGridDrift{
          0%{ transform: translate(0px,0px); opacity:.35; }
          50%{ transform: translate(16px,-10px); opacity:.65; }
          100%{ transform: translate(0px,0px); opacity:.35; }
        }

        .sfSparkles{
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at 18% 28%, rgba(12,42,92,0.22) 0 2px, rgba(0,0,0,0) 3px),
            radial-gradient(circle at 72% 18%, rgba(12,42,92,0.18) 0 2px, rgba(0,0,0,0) 3px),
            radial-gradient(circle at 84% 66%, rgba(12,42,92,0.16) 0 2px, rgba(0,0,0,0) 3px),
            radial-gradient(circle at 28% 78%, rgba(12,42,92,0.16) 0 2px, rgba(0,0,0,0) 3px);
          opacity: .35;
          filter: blur(.2px);
          animation: sfSparkle 7.5s ease-in-out infinite;
        }
        @keyframes sfSparkle{
          0%,100%{ opacity:.18; transform: translateY(0); }
          50%{ opacity:.45; transform: translateY(-6px); }
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

        .sfPulseBorder{ position: relative; overflow: hidden; }
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
          opacity: .22;
          filter: blur(10px);
          pointer-events:none;
          animation: sfBorderPulse 4.2s ease-in-out infinite;
        }
        .sfPulseBorder > * { position: relative; z-index: 1; }

        @keyframes sfBorderPulse{
          0%,100%{ opacity: .16; transform: scale(1); }
          50%{ opacity: .36; transform: scale(1.01); }
        }

        /* ✅ Extra Navy Animations (subtle & professional) */
        .sfCardHover {
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }
        .sfCardHover:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px rgba(2, 6, 23, 0.12);
          border-color: rgba(12, 42, 92, 0.25);
        }

        .sfBrandGlow {
          position: relative;
        }
        .sfBrandGlow::after {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: 16px;
          background: radial-gradient(circle at 30% 30%,
            rgba(12, 42, 92, 0.35),
            rgba(12, 42, 92, 0),
            rgba(12, 42, 92, 0)
          );
          filter: blur(14px);
          opacity: .35;
          animation: sfBrandPulse 3.6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes sfBrandPulse {
          0%, 100% { opacity: .18; transform: scale(1); }
          50% { opacity: .45; transform: scale(1.02); }
        }

        /* Save button subtle shine */
        .sfShineBtn {
          position: relative;
          overflow: hidden;
        }
        .sfShineBtn::after{
          content:"";
          position:absolute;
          top:-40%;
          left:-60%;
          width: 40%;
          height: 180%;
          background: linear-gradient(120deg,
            rgba(255,255,255,0),
            rgba(255,255,255,.22),
            rgba(255,255,255,0)
          );
          transform: rotate(18deg);
          opacity: 0;
          transition: opacity .25s ease;
        }
        .sfShineBtn:hover::after{
          opacity: 1;
          animation: sfShineSweep 1.1s ease;
        }
        @keyframes sfShineSweep{
          0%{ left:-60%; }
          100%{ left:140%; }
        }

        /* Tabs underline shimmer */
        .sfTabActive {
          position: relative;
        }
        .sfTabActive::after{
          content:"";
          position:absolute;
          left:14px;
          right:14px;
          bottom:6px;
          height:2px;
          border-radius:999px;
          background: linear-gradient(90deg,
            rgba(34, 211, 238, 0),
            rgba(12, 42, 92, 0.6),
            rgba(34, 211, 238, 0)
          );
          opacity: .5;
          animation: sfUnderline 2.6s ease-in-out infinite;
        }
        @keyframes sfUnderline{
          0%,100%{ opacity: .25; transform: translateX(-6px); }
          50%{ opacity: .65; transform: translateX(6px); }
        }
      `}</style>
    </>
  );
}