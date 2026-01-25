// src/pages/ModeratorPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ModeratorPanel() {
  const navigate = useNavigate();

  // 🔹 Moderator actions (sab clickable)
  const actions = [
    {
      title: "Review Showcase & Rooms",
      desc: "Check collaboration rooms and showcase items that need attention.",
      btn: "Open Moderation Console",
      // 🔗 AdminModeration.jsx
      onClick: () => navigate("/admin/moderation"),
    },
    {
      title: "Handle Reports",
      desc: "View and resolve reported content from users.",
      btn: "Open Reports",
      // 🔗 AdminReports.jsx
      onClick: () => navigate("/admin/reports"),
    },
    {
      title: "Moderate Users",
      desc: "Warn, restrict or review user activity.",
      btn: "Open User List",
      // 🔗 AdminUsers.jsx
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "Roles & Permissions",
      desc: "See which users are Admin / Moderator / User.",
      btn: "Open Roles View",
      // 🔗 AdminRoles.jsx
      onClick: () => navigate("/admin/roles"),
    },
    {
      title: "Bug / Issue Tracker",
      desc: "View bugs and issues reported by users.",
      btn: "Open Support & Bugs",
      onClick: () => navigate("/support", { state: { section: "bugs" } }),
    },
    {
      title: "Notifications & Alerts",
      desc: "System and moderation alerts for you.",
      btn: "Open Notifications",
      onClick: () => navigate("/notifications"),
    },
  ];

  return (
    <section className="cardShell sfPulseBorder p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
            Moderator controls
          </p>
          <h2 className="text-xl font-bold text-slate-900">
            Community & content moderation
          </h2>
          <p className="text-[12px] text-slate-600 mt-1 max-w-xl">
            Use these tools to keep DevSphere&apos;s showcase, rooms and users
            safe, respectful and high quality.
          </p>
        </div>
      </div>

      {/* Actions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
        {actions.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col justify-between sfRow"
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
            </div>

            <button
              type="button"
              onClick={item.onClick}
              className="mt-3 inline-flex items-center justify-center text-xs px-3 py-1.5 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-400 transition"
            >
              {item.btn}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}