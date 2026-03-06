// src/pages/AdminSupport.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminSupportTickets,
  updateSupportTicketStatus,
} from "../services/api";

const FILTERS = ["All", "Open", "In Progress", "Resolved"];

const uiStatus = (apiStatus) => {
  const s = String(apiStatus || "").toLowerCase();
  if (s === "open") return "Open";
  if (s === "in_progress") return "In Progress";
  if (s === "resolved") return "Resolved";
  return "Open";
};

const apiStatusFromFilter = (filter) => {
  if (filter === "Open") return "open";
  if (filter === "In Progress") return "in_progress";
  if (filter === "Resolved") return "resolved";
  return "";
};

const timeAgo = (iso) => {
  try {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    if (Number.isNaN(diff)) return "—";

    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;

    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;

    const days = Math.floor(hrs / 24);
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  } catch {
    return "—";
  }
};

export default function AdminSupport() {
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState("All");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [actionMessage, setActionMessage] = useState("Loading support tickets...");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  const loadTickets = async (statusFilter = "", opts = { silent: false }) => {
    setError("");

    if (!opts?.silent) setLoading(true);

    const res = await getAdminSupportTickets(statusFilter);

    if (res?.error) {
      const msg = res.error || "Failed to load support tickets";
      setError(msg);
      setActionMessage(msg);
      setLoading(false);
      return;
    }

    const list = Array.isArray(res?.tickets) ? res.tickets : [];

    const mapped = list.map((t) => ({
      _id: String(t._id || ""),
      name: t.name || t.user?.name || "—",
      email: t.email || t.user?.email || "—",
      subject: t.subject || "—",
      message: t.message || "—",
      status: uiStatus(t.status),
      rawStatus: String(t.status || "").toLowerCase(),
      time: timeAgo(t.createdAt),
    }));

    setTickets(mapped);
    setLoading(false);

    if (!opts?.silent) {
      setActionMessage(
        mapped.length
          ? "Support tickets loaded from backend ✅"
          : "No support tickets found."
      );
    }

    if (selectedTicketId && !mapped.some((x) => x._id === selectedTicketId)) {
      setSelectedTicketId(null);
    }
  };

  const changeStatus = async (ticketId, nextStatus) => {
    try {
      setUpdatingId(ticketId);

      const res = await updateSupportTicketStatus(ticketId, nextStatus);

      if (res?.error) {
        const msg = res.error || "Failed to update ticket status";
        setError(msg);
        setActionMessage(msg);
        return;
      }

      const statusFilter = apiStatusFromFilter(filterType);
      await loadTickets(statusFilter, { silent: true });

      const nice =
        nextStatus === "open"
          ? "Ticket re-opened ✅"
          : nextStatus === "in_progress"
          ? "Marked In Progress ✅"
          : "Marked Resolved ✅";

      setActionMessage(nice);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const statusFilter = apiStatusFromFilter(filterType);

    loadTickets(statusFilter, { silent: false });

    const intervalId = setInterval(() => {
      loadTickets(statusFilter, { silent: true });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [filterType]);

  const filteredTickets = useMemo(() => {
    if (filterType === "All") return tickets;
    return tickets.filter((t) => t.status === filterType);
  }, [filterType, tickets]);

  const handleFilterClick = (type) => {
    setFilterType(type);
    setSelectedTicketId(null);
    setActionMessage(type === "All" ? "Showing all support tickets." : `Filtered: ${type}`);
  };

  const handleRowClick = (ticket) => {
    setSelectedTicketId(ticket._id);
    setActionMessage(`Selected support ticket: "${ticket.subject}" from ${ticket.name}.`);
  };

  const openDashboard = () => {
    navigate("/dashboard");
  };

  const openCount = filteredTickets.filter((t) => t.status === "Open").length;
  const inProgressCount = filteredTickets.filter((t) => t.status === "In Progress").length;
  const resolvedCount = filteredTickets.filter((t) => t.status === "Resolved").length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-sky-50/60 to-slate-100 flex">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 w-full">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Admin · Support
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Support center
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Review support tickets submitted by users.
              </p>
              {error && (
                <p className="text-[12px] text-rose-600 mt-2 font-semibold">
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={openDashboard}
              className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-slate-900 text-slate-50 font-semibold hover:bg-slate-800 transition"
            >
              Back to dashboard
            </button>
          </div>

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-800 shadow-sm">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="font-semibold uppercase tracking-[0.18em]">
                STATUS
              </span>
              <span className="text-[11px] font-normal text-indigo-800">
                {loading ? "Loading..." : actionMessage}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Filter by status
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
                <span className="font-semibold text-slate-900">{openCount}</span> open ·{" "}
                <span className="font-semibold text-slate-900">{inProgressCount}</span> in progress ·{" "}
                <span className="font-semibold text-slate-900">{resolvedCount}</span> resolved
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Live data from backend ✅ (auto refresh 5s)
              </p>
            </section>

            <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Actions
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => loadTickets(apiStatusFromFilter(filterType), { silent: false })}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-sky-500 text-white hover:bg-sky-400 transition"
                >
                  Refresh tickets
                </button>
              </div>
            </section>
          </div>

          <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <p className="text-sm font-semibold text-slate-900">
                Latest support tickets
              </p>
              <span className="text-[11px] text-slate-500">Live backend data</span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredTickets.map((t) => {
                const selected = selectedTicketId === t._id;

                const isOpen = t.status === "Open";
                const isResolved = t.status === "Resolved";
                const busy = updatingId === t._id;

                return (
                  <div
                    key={t._id}
                    onClick={() => handleRowClick(t)}
                    className={`px-4 py-3 flex items-start justify-between gap-3 sfRow cursor-pointer ${
                      selected ? "bg-sky-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono text-slate-500">
                          {t._id}
                        </span>
                        <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold bg-slate-900 text-slate-50">
                          Support
                        </span>
                        <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {t.name}
                        </span>
                      </div>

                      <p className="text-sm text-slate-900 font-semibold">
                        {t.subject}
                      </p>

                      <p className="text-[12px] text-slate-600 mt-1">
                        {t.email}
                      </p>

                      <p className="text-[12px] text-slate-700 mt-2 break-words">
                        {t.message}
                      </p>

                      <p className="text-[11px] text-slate-600 mt-2">
                        Submitted · {t.time}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeStatus(t._id, "in_progress");
                          }}
                          disabled={!isOpen || busy}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition ${
                            !isOpen || busy
                              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                              : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                          }`}
                        >
                          {busy && isOpen ? "Updating..." : "Mark In Progress"}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeStatus(t._id, "resolved");
                          }}
                          disabled={isResolved || busy}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition ${
                            isResolved || busy
                              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {busy && !isResolved ? "Updating..." : "Mark Resolved"}
                        </button>

                        {!isOpen && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              changeStatus(t._id, "open");
                            }}
                            disabled={busy}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition ${
                              busy
                                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                : "bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100"
                            }`}
                          >
                            {busy ? "Updating..." : "Re-open"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-right space-y-2 min-w-[130px]">
                      <span
                        className={`inline-flex px-2 py-[2px] rounded-full text-[10px] font-semibold ${
                          isOpen
                            ? "bg-rose-50 text-rose-700"
                            : t.status === "In Progress"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })}

              {!loading && filteredTickets.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-slate-500">
                  No support tickets for the selected filter.
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Showing {filteredTickets.length} tickets</span>
              <span>Pagination can be added later.</span>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .cardShell{
          background: rgba(255,255,255,0.92);
          border-radius: 18px;
          border: 1px solid rgba(226,232,240,0.85);
          box-shadow: 0 10px 30px rgba(2,6,23,0.08);
          position: relative;
          overflow: hidden;
        }
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