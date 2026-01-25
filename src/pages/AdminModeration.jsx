// src/pages/AdminModeration.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialQueue = [
  {
    id: "MOD-001",
    label: "Showcase card",
    target: "PRJ-239",
    reason: "Inappropriate language in description",
    age: "10 minutes",
    severity: "High",
  },
  {
    id: "MOD-002",
    label: "Room message",
    target: "ROOM-12",
    reason: "Spam / self promotion",
    age: "35 minutes",
    severity: "Medium",
  },
  {
    id: "MOD-003",
    label: "User profile",
    target: "USR-344",
    reason: "Fake identity suspicion",
    age: "2 hours",
    severity: "Medium",
  },
];

export default function AdminModeration() {
  const navigate = useNavigate();

  const [queue, setQueue] = useState(
    initialQueue.map((item, idx) => ({
      ...item,
      index: idx, // for sorting demo
      decision: null, // "approved" | "removed"
    }))
  );

  const [filterSeverity, setFilterSeverity] = useState("all"); // all | high
  const [sortOrder, setSortOrder] = useState("newest"); // newest | oldest
  const [selectedId, setSelectedId] = useState(null);
  const [actionMessage, setActionMessage] = useState(
    "This is a demo moderation console using local state. Later you can connect it to your real moderation API."
  );

  const filteredQueue = useMemo(() => {
    let list = [...queue];

    if (filterSeverity === "high") {
      list = list.filter((item) => item.severity === "High");
    }

    if (sortOrder === "oldest") {
      list.sort((a, b) => a.index - b.index);
    } else {
      list.sort((a, b) => b.index - a.index);
    }

    return list;
  }, [queue, filterSeverity, sortOrder]);

  const totalItems = queue.length;

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleFilterAll = () => {
    setFilterSeverity("all");
    setSortOrder("newest");
    setSelectedId(null);
    setActionMessage("Showing all items in the moderation queue (demo data).");
  };

  const handleFilterHigh = () => {
    setFilterSeverity("high");
    setSortOrder("newest");
    setSelectedId(null);
    setActionMessage("Filtering queue to show only high severity items.");
  };

  const handleSortOldest = () => {
    setSortOrder("oldest");
    setActionMessage("Sorting queue from oldest to newest.");
  };

  const handleGoToReportsCenter = () => {
    navigate("/admin/reports");
    setActionMessage("Opening the reports center from moderation console.");
  };

  const handleSelectRow = (item) => {
    setSelectedId(item.id);
    setActionMessage(
      `Selected ${item.label.toLowerCase()} (${item.target}). You can approve, remove or open it in detail.`
    );
  };

  const updateDecision = (id, decision) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              decision,
            }
          : item
      )
    );
  };

  const handleApprove = (item) => {
    updateDecision(item.id, "approved");
    setActionMessage(
      `Marked ${item.label.toLowerCase()} (${item.target}) as "Approved & kept".`
    );
  };

  const handleRemove = (item) => {
    updateDecision(item.id, "removed");
    setActionMessage(
      `Marked ${item.label.toLowerCase()} (${item.target}) as "Removed".`
    );
  };

  const handleOpenDetail = (item) => {
    navigate("/admin/reports", { state: { fromModeration: true, target: item.target } });
    setActionMessage(
      `Opening detailed view for ${item.label.toLowerCase()} (${item.target}) in the reports center.`
    );
  };

  const handleOpenUserManagement = () => {
    navigate("/admin/users");
    setActionMessage("Opening user management from moderation console.");
  };

  const openDecisionLabel = (decision) => {
    if (decision === "approved") return "Approved & kept";
    if (decision === "removed") return "Removed";
    return null;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-sky-50/60 to-slate-100 flex">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 w-full">
          {/* Top */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Admin · Moderation
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Moderation console
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Work through your review queue and keep DevSphere healthy.
              </p>
            </div>
            <button
              onClick={handleBackToDashboard}
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

          {/* Top controls (cards with dashboard theme) */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Queue filters
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={handleFilterAll}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                    filterSeverity === "all"
                      ? "bg-slate-900 text-slate-50 hover:bg-slate-800"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  All items
                </button>
                <button
                  onClick={handleFilterHigh}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                    filterSeverity === "high"
                      ? "bg-rose-600 text-white hover:bg-rose-500"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  High severity
                </button>
                <button
                  onClick={handleSortOldest}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                    sortOrder === "oldest"
                      ? "bg-sky-600 text-white hover:bg-sky-500"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Oldest first
                </button>
              </div>
            </section>

            <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Shortcuts
              </p>
              <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
                <button
                  onClick={handleGoToReportsCenter}
                  className="px-3 py-1.5 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-400 transition"
                >
                  Go to reports center
                </button>
                <button
                  onClick={handleOpenUserManagement}
                  className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                >
                  Open user management
                </button>
              </div>
            </section>

            <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Demo state
              </p>
              <p className="text-sm text-slate-700 mt-2">
                Queue items use static demo data and local state. Later you can
                connect this to a real moderation API.
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Approve / Remove only simulate actions inside this UI.
              </p>
            </section>
          </div>

          {/* Queue list */}
          <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <p className="text-sm font-semibold text-slate-900">
                Review queue
              </p>
              <span className="text-[11px] text-slate-500">
                {filteredQueue.length} items shown · {totalItems} in demo
                queue
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredQueue.map((item) => {
                const selected = selectedId === item.id;
                const decisionLabel = openDecisionLabel(item.decision);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectRow(item)}
                    className={`px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sfRow cursor-pointer ${
                      selected ? "bg-sky-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-500">
                          {item.id}
                        </span>
                        <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold bg-slate-900 text-slate-50">
                          {item.label}
                        </span>
                        <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          Target: {item.target}
                        </span>
                        <span
                          className={`px-2 py-[2px] rounded-full text-[10px] font-semibold ${
                            item.severity === "High"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.severity} severity
                        </span>
                        {decisionLabel && (
                          <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {decisionLabel}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-900 font-semibold">
                        {item.reason}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Waiting in queue · {item.age}
                      </p>
                    </div>

                    <div className="flex flex-wrap md:flex-col gap-2 justify-end md:items-end text-[11px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(item);
                        }}
                        className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition"
                      >
                        Approve &amp; keep
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item);
                        }}
                        className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 font-semibold hover:bg-rose-100 transition"
                      >
                        Remove content
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(item);
                        }}
                        className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                      >
                        Open in detail view
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredQueue.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-slate-500">
                  No items for the selected filters (demo data).
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-100 text-[11px] text-slate-500">
              Workflow demo only — in a real setup, these actions would update
              your backend moderation state.
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