// src/pages/AdminPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const StatPill = ({ label, value, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col gap-0.5 text-left rounded-xl px-3 py-2 hover:bg-slate-100 cursor-pointer transition-colors"
  >
    <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
      {label}
    </span>
    <span className="text-lg font-extrabold text-slate-900">{value}</span>
  </button>
);

const ActionChip = ({ label, onClick, tone = "primary" }) => {
  const base =
    "inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer";

  const toneClass =
    tone === "danger"
      ? "border-rose-500/60 text-rose-700 bg-rose-50 hover:bg-rose-100"
      : tone === "neutral"
      ? "border-slate-400/70 text-slate-700 bg-slate-50 hover:bg-slate-100"
      : "border-sky-500/70 text-sky-700 bg-sky-50 hover:bg-sky-100";

  return (
    <button type="button" onClick={onClick} className={`${base} ${toneClass}`}>
      {label}
    </button>
  );
};

const AttentionRow = ({ title, meta, action, tone = "primary", onClick }) => {
  const badgeClass =
    tone === "danger"
      ? "bg-rose-50 text-rose-700 border-rose-400/60"
      : tone === "warning"
      ? "bg-amber-50 text-amber-700 border-amber-400/60"
      : "bg-sky-50 text-sky-700 border-sky-400/60";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
    >
      <div>
        <p className="text-[13px] font-semibold text-slate-900">{title}</p>
        <p className="text-[11px] text-slate-600 mt-0.5">{meta}</p>
      </div>
      <span
        className={`mt-0.5 inline-flex items-center px-2.5 py-[3px] rounded-full text-[10px] font-semibold border ${badgeClass}`}
      >
        {action}
      </span>
    </button>
  );
};

export default function AdminPanel() {
  const navigate = useNavigate();

  // 🔗 Central navigation helpers
  const goUsers = () => navigate("/admin/users");
  const goRoles = () => navigate("/admin/roles");
  const goReports = () => navigate("/admin/reports");
  const goModeration = () => navigate("/admin/moderation");

  const handleUserManagement = () => {
    goUsers();
  };

  const handleRoles = () => {
    goRoles();
  };

  const handleShowcaseReports = () => {
    // optionally: navigate with state for filter
    navigate("/admin/reports", { state: { filter: "showcase" } });
  };

  const handleModeration = () => {
    goModeration();
  };

  return (
    // same cardShell as other dashboard boxes → perfect alignment
    <section className="cardShell sfPulseBorder p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
            Admin controls
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Platform overview &amp; moderation
          </h2>
          <p className="text-[12px] text-slate-600 mt-1">
            Signed in as{" "}
            <span className="font-semibold text-slate-900">Admin</span>
            <span className="inline-flex items-center ml-2 px-2 py-[2px] rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
              Admin
            </span>
          </p>
        </div>

        {/* Pills → now clickable tabs */}
        <div className="flex gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={goUsers}
            className="px-3 py-1.5 rounded-full bg-slate-900 text-slate-50 font-semibold hover:bg-slate-800 transition cursor-pointer"
          >
            Users
          </button>
          <button
            type="button"
            onClick={goRoles}
            className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition cursor-pointer"
          >
            Roles
          </button>
          <button
            type="button"
            onClick={goReports}
            className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition cursor-pointer"
          >
            Reports
          </button>
        </div>
      </div>

      {/* Stats + actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatPill label="Total users" value="42" onClick={goUsers} />
          <StatPill label="Admins" value="2" onClick={goRoles} />
          <StatPill label="Moderators" value="3" onClick={goRoles} />
          <StatPill
            label="Active users (24h)"
            value="19"
            onClick={goUsers}
          />
          <StatPill
            label="Pending reports"
            value="5"
            onClick={handleShowcaseReports}
          />
          <StatPill
            label="Flagged items"
            value="3"
            onClick={handleModeration}
          />
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Quick actions
          </p>
          <div className="flex flex-wrap gap-2">
            <ActionChip
              label="Open user management"
              onClick={handleUserManagement}
            />
            <ActionChip
              label="Assign / update roles"
              onClick={handleRoles}
            />
            <ActionChip
              label="Review showcase reports"
              tone="danger"
              onClick={handleShowcaseReports}
            />
            <ActionChip
              label="Open moderation console"
              tone="neutral"
              onClick={handleModeration}
            />
          </div>
        </div>
      </div>

      {/* Items + note */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Items that need attention
          </p>

          <AttentionRow
            title="Showcase report · PRJ-239"
            meta="Content flagged as inappropriate · 12 minutes ago"
            action="Review"
            tone="danger"
            onClick={handleShowcaseReports}
          />

          <AttentionRow
            title="New signup · USR-344"
            meta="Possible spam pattern detected · 48 minutes ago"
            action="Inspect"
            tone="warning"
            onClick={handleUserManagement}
          />

          <AttentionRow
            title="Featured request · PRJ-248"
            meta="Project nominated to appear as a featured item"
            action="Consider"
            onClick={handleShowcaseReports}
          />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Note
          </p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-700 leading-relaxed">
            <p>
              This card is visible only for users with the{" "}
              <span className="font-semibold">admin</span> role. Use it to
              manage users, roles, and flagged showcase items.
            </p>
            <p className="mt-2 text-[11px] text-slate-500">
              Later you can link each button to dedicated pages such as user
              lists, role editor, and moderation tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}