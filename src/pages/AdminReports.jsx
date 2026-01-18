// src/pages/AdminReports.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const demoReports = [
  {
    id: "RPT-239",
    type: "Showcase",
    target: "PRJ-239",
    reason: "Inappropriate content",
    status: "Open",
    time: "12 minutes ago",
  },
  {
    id: "RPT-240",
    type: "Room",
    target: "ROOM-12",
    reason: "Spam links",
    status: "In review",
    time: "1 hour ago",
  },
  {
    id: "RPT-241",
    type: "User",
    target: "USR-344",
    reason: "Fake profile",
    status: "Resolved",
    time: "Yesterday",
  },
];

const FILTERS = ["All", "Showcase", "Rooms", "Users"];

export default function AdminReports() {
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState("All");
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [actionMessage, setActionMessage] = useState(
    "This is a demo reports center using local state. Later you can connect it to your backend moderation system."
  );

  const filteredReports = useMemo(() => {
    if (filterType === "All") return demoReports;
    if (filterType === "Rooms")
      return demoReports.filter((r) => r.type === "Room");
    if (filterType === "Users")
      return demoReports.filter((r) => r.type === "User");
    // Showcase
    return demoReports.filter((r) => r.type === "Showcase");
  }, [filterType]);

  const openModerationConsole = () => {
    navigate("/admin/moderation");
    setActionMessage("Opening moderation console view for detailed actions.");
  };

  const handleFilterClick = (type) => {
    setFilterType(type);
    setSelectedReportId(null);
    setActionMessage(
      type === "All"
        ? "Showing all demo reports."
        : `Filtered by type: ${type}.`
    );
  };

  const handleRowClick = (report) => {
    setSelectedReportId(report.id);
    setActionMessage(
      `Selected report ${report.id} about "${report.reason}". You can open it in moderation or view related item.`
    );
  };

  const handleOpenInModeration = (report) => {
    navigate("/admin/moderation", { state: { reportId: report.id } });
    setActionMessage(
      `Navigating to moderation console for report ${report.id}.`
    );
  };

  const handleViewRelatedItem = (report) => {
    if (report.type === "Showcase") {
      navigate("/showcase", { state: { focus: report.target } });
    } else if (report.type === "Room") {
      navigate("/collaboration", { state: { roomId: report.target } });
    } else if (report.type === "User") {
      navigate("/admin/users", { state: { userId: report.target } });
    }
    setActionMessage(
      `Opening related ${report.type.toLowerCase()} item: ${report.target}.`
    );
  };

  const openDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-sky-50/60 to-slate-100 flex">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 w-full">
          {/* Top */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Admin · Reports
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Reports center
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                See content and users that have been flagged by the community.
              </p>
            </div>
            <button
              onClick={openDashboard}
              className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-slate-900 text-slate-50 font-semibold hover:bg-slate-800 transition"
            >
              Back to dashboard
            </button>
          </div>

          {/* Status pill */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-800 shadow-sm">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="font-semibold uppercase tracking-[0.18em]">
                STATUS
              </span>
              <span className="text-[11px] font-normal text-indigo-800">
                {actionMessage}
              </span>
            </div>
          </div>

          {/* Filters + stats + actions (cards with navy theme) */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Filter by type
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {FILTERS.map((f) => {
                  const active = filterType === f;
                  return (
                    <button
                      key={f}
                      onClick={() => handleFilterClick(f)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                        active
                          ? "bg-slate-900 text-slate-50 hover:bg-slate-800"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Status overview
              </p>
              <p className="text-sm text-slate-700 mt-2">
                <span className="font-semibold text-slate-900">2</span> open /
                in review ·{" "}
                <span className="font-semibold text-slate-900">1</span>{" "}
                resolved (demo)
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Later you can replace this with live stats from your backend.
              </p>
            </section>

            <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Actions
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={openModerationConsole}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-sky-500 text-white hover:bg-sky-400 transition"
                >
                  Open moderation console
                </button>
              </div>
            </section>
          </div>

          {/* Reports list card */}
          <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <p className="text-sm font-semibold text-slate-900">
                Latest reports
              </p>
              <span className="text-[11px] text-slate-500">
                Static demo data · Integrate with backend later
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredReports.map((r) => {
                const selected = selectedReportId === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleRowClick(r)}
                    className={`px-4 py-3 flex items-start justify-between gap-3 sfRow cursor-pointer ${
                      selected ? "bg-sky-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono text-slate-500">
                          {r.id}
                        </span>
                        <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold bg-slate-900 text-slate-50">
                          {r.type}
                        </span>
                        <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          Target: {r.target}
                        </span>
                      </div>
                      <p className="text-sm text-slate-900 font-semibold">
                        {r.reason}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Reported · {r.time}
                      </p>
                    </div>

                    <div className="text-right space-y-2 min-w-[140px]">
                      <span
                        className={`inline-flex px-2 py-[2px] rounded-full text-[10px] font-semibold ${
                          r.status === "Open"
                            ? "bg-rose-50 text-rose-700"
                            : r.status === "In review"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {r.status}
                      </span>
                      <div className="flex flex-col gap-1 text-[11px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenInModeration(r);
                          }}
                          className="text-sky-700 hover:text-sky-600"
                        >
                          Open in moderation
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewRelatedItem(r);
                          }}
                          className="text-slate-700 hover:text-slate-900"
                        >
                          View related item
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredReports.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-slate-500">
                  No reports for the selected filter (demo data).
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>
                Showing {filteredReports.length} of {demoReports.length} demo
                reports
              </span>
              <span>Later you can add pagination here.</span>
            </div>
          </section>
        </div>
      </div>

      {/* Dashboard-style animations for this page */}
      <style>{`
        .cardShell{
          background: rgba(255,255,255,0.92);
          border-radius: 18px;
          border: 1px solid rgba(226,232,240,0.85);
          box-shadow: 0 10px 30px rgba(2,6,23,0.08);
          position: relative;
          overflow: hidden;
        }

        .sfPulseBorder{
          position: relative;
        }
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
          opacity: .18;
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
          box-shadow: 0 0 0 1px rgba(10, 28, 64, 0.18);
        }
        @keyframes sfBorderPulse{
          0%,100%{ opacity: .16; transform: scale(1); }
          50%{ opacity: .30; transform: scale(1.01); }
        }

        .sfRow{
          transition: transform .28s ease, box-shadow .28s ease, opacity .3s ease, background-color .2s ease;
          will-change: transform;
        }
        .sfRow:hover{
          transform: translateY(-3px);
          box-shadow:
            0 16px 40px rgba(2,6,23,0.10),
            0 0 0 1px rgba(8, 30, 68, 0.08);
        }
      `}</style>
    </>
  );
}