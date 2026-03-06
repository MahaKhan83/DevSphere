// src/pages/AdminModeration.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../sockets/socket"; // ✅ ADD

const API = "http://localhost:5000";
const TOKEN_KEY = "devsphere_token";

const getToken = () => localStorage.getItem(TOKEN_KEY);

const isMongoId = (v) => /^[a-f\d]{24}$/i.test(String(v || "").trim());
const isRoomCode = (v) => /^[A-Z0-9]{4,10}$/i.test(String(v || "").trim()); // ✅ ADD (room code validation)

const uiType = (apiType) => {
  const t = String(apiType || "").toLowerCase();
  if (t === "showcase") return "Showcase card";
  if (t === "room") return "Room message";
  if (t === "user") return "User profile";
  return "Unknown";
};

const uiStatus = (apiStatus) => {
  const s = String(apiStatus || "").toLowerCase();
  if (s === "open") return "Open";
  if (s === "in_review") return "In review";
  if (s === "resolved") return "Resolved";
  return "Open";
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

// ✅ helper: socket request with timeout
const socketRequest = (eventName, payload, responseEvent, timeoutMs = 5000) =>
  new Promise((resolve, reject) => {
    let done = false;

    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      try {
        socket.off(responseEvent, onResponse);
      } catch {}
      reject(new Error("Room delete timeout (no response from server)."));
    }, timeoutMs);

    const onResponse = (data) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try {
        socket.off(responseEvent, onResponse);
      } catch {}
      resolve(data);
    };

    try {
      socket.on(responseEvent, onResponse);
      if (!socket.connected) socket.connect();
      socket.emit(eventName, payload);
    } catch (e) {
      clearTimeout(timer);
      try {
        socket.off(responseEvent, onResponse);
      } catch {}
      reject(new Error(e?.message || "Socket request failed"));
    }
  });

export default function AdminModeration() {
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedId, setSelectedId] = useState(null);
  const [actionMessage, setActionMessage] = useState("Loading moderation queue...");

  const [updatingId, setUpdatingId] = useState(null);

  // ✅ Get current user from token (for moderatorId)
  const getMyUserIdFromToken = () => {
    try {
      const token = getToken();
      if (!token) return null;
      const part = token.split(".")[1];
      if (!part) return null;
      const json = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
      return json?.id || json?._id || json?.userId || null;
    } catch {
      return null;
    }
  };

  // ✅ Ensure socket auth room join (for notifications etc.)
  useEffect(() => {
    const uid = getMyUserIdFromToken();
    if (!uid) return;
    try {
      if (!socket.connected) socket.connect();
      socket.emit("auth:join", { userId: uid });
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadQueue = async (opts = { silent: false }) => {
    if (!opts?.silent) setLoading(true);
    setError("");

    const token = getToken();
    if (!token) {
      const msg = "Token missing. Please login again.";
      setError(msg);
      setActionMessage(msg);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/api/reports/admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        const msg =
          data?.message ||
          (res.status === 401
            ? "Unauthorized (401). Please login again."
            : res.status === 403
            ? "Admin/Moderator access required (403)."
            : `Failed to load moderation queue (Error ${res.status}).`);
        setError(msg);
        setActionMessage(msg);
        setLoading(false);
        return;
      }

      const list = Array.isArray(data) ? data : data?.reports || [];

      const mapped = list
        .map((r, idx) => ({
          id: String(r._id || r.id || ""),
          label: uiType(r.type),
          typeRaw: String(r.type || "").toLowerCase(), // showcase | room | user
          target: String(r.target || "—"),
          reason: r.reason || "—",
          age: timeAgo(r.createdAt),
          status: uiStatus(r.status),
          index: idx,
        }))
        .filter((x) => x.typeRaw !== "user")
        .filter((x) => x.status === "Open" || x.status === "In review");

      setQueue(mapped);
      setLoading(false);

      if (!opts?.silent) setActionMessage(mapped.length ? "Moderation queue loaded ✅" : "Queue is empty.");

      if (selectedId && !mapped.some((x) => x.id === selectedId)) setSelectedId(null);
    } catch {
      const msg = "Backend not reachable. Make sure server is running on :5000";
      setError(msg);
      setActionMessage(msg);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue({ silent: false });
    const id = setInterval(() => loadQueue({ silent: true }), 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredQueue = useMemo(() => {
    let list = [...queue];
    if (sortOrder === "oldest") list.sort((a, b) => a.index - b.index);
    else list.sort((a, b) => b.index - a.index);
    return list;
  }, [queue, sortOrder]);

  const totalItems = queue.length;

  const handleBackToDashboard = () => navigate("/dashboard");

  const handleFilterAll = () => {
    setSortOrder("newest");
    setSelectedId(null);
    setActionMessage("Showing all items in the moderation queue.");
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
    setActionMessage(`Selected ${item.label.toLowerCase()} (${item.target}).`);
  };

  const updateReportStatus = async (reportId, nextStatus) => {
    const token = getToken();
    if (!token) {
      const msg = "Token missing. Please login again.";
      setError(msg);
      setActionMessage(msg);
      return false;
    }

    try {
      const res = await fetch(`${API}/api/reports/${reportId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        const msg =
          data?.message ||
          (res.status === 401
            ? "Unauthorized (401). Please login again."
            : res.status === 403
            ? "Admin/Moderator access required (403)."
            : `Update failed (Error ${res.status}).`);
        setError(msg);
        setActionMessage(msg);
        return false;
      }

      return true;
    } catch {
      const msg = "Update failed. Backend not reachable.";
      setError(msg);
      setActionMessage(msg);
      return false;
    }
  };

  // ✅ DELETE SHOWCASE CONTENT (moderator/admin)
  const deleteShowcasePost = async (postId) => {
    const token = getToken();
    if (!token) throw new Error("Token missing");

    const res = await fetch(`${API}/api/showcase/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      const msg =
        data?.message ||
        (res.status === 403
          ? "Not allowed (403). Make sure backend allows admin/moderator delete."
          : `Delete failed (Error ${res.status}).`);
      throw new Error(msg);
    }

    return true;
  };

  // ✅ NEW: DELETE ROOM CONTENT (moderator/admin) via socket
  const deleteRoomByCode = async (roomCode) => {
    const code = String(roomCode || "").trim().toUpperCase();
    if (!code) throw new Error("Room code missing.");
    if (!isRoomCode(code)) throw new Error(`Invalid room code: "${roomCode}"`);

    const moderatorId = getMyUserIdFromToken();
    if (!moderatorId) throw new Error("ModeratorId missing (token decode). Please login again.");

    const resp = await socketRequest(
      "lobby:moderator-delete-room",
      { code, moderatorId },
      "lobby:moderator-delete-room:result",
      6000
    );

    if (!resp?.ok) {
      throw new Error(resp?.message || "Room delete failed.");
    }

    return true;
  };

  const handleApprove = async (item) => {
    try {
      setUpdatingId(item.id);
      setError("");

      const ok = await updateReportStatus(item.id, "resolved");
      if (!ok) return;

      await loadQueue({ silent: true });
      setActionMessage(`Approved & kept ✅ (Report resolved) · Target: ${item.target}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (item) => {
    try {
      setUpdatingId(item.id);
      setError("");

      // 1) validate + delete content
      if (item.typeRaw === "showcase") {
        if (!isMongoId(item.target)) {
          const msg = `Invalid target for showcase. Backend report.target must be a Post ID (24 chars). Got: "${item.target}"`;
          setError(msg);
          setActionMessage(msg);
          return;
        }
        await deleteShowcasePost(item.target);
      }

      if (item.typeRaw === "room") {
        // ✅ actually delete room now
        await deleteRoomByCode(item.target);
      }

      // 2) resolve report
      const ok = await updateReportStatus(item.id, "resolved");
      if (!ok) return;

      await loadQueue({ silent: true });

      if (item.typeRaw === "showcase") {
        setActionMessage(`Removed content ✅ (Post deleted + Report resolved) · ${item.target}`);
      } else if (item.typeRaw === "room") {
        setActionMessage(`Removed content ✅ (Room deleted + Report resolved) · ${item.target}`);
      } else {
        setActionMessage(`Removed action ✅ (Report resolved) · ${item.target}`);
      }
    } catch (e) {
      const msg = e?.message || "Remove failed.";
      setError(msg);
      setActionMessage(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenDetail = (item) => {
    navigate("/admin/reports", { state: { fromModeration: true, target: item.target } });
    setActionMessage(`Opening detail view for ${item.label.toLowerCase()} (${item.target}).`);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-sky-50/60 to-slate-100 flex">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 w-full">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Admin · Moderation</p>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Moderation console</h1>
              <p className="text-sm text-slate-600 mt-1">Work through your review queue and keep DevSphere healthy.</p>
              {error && <p className="text-[12px] text-rose-600 mt-2 font-semibold">{error}</p>}
            </div>

            <button
              onClick={handleBackToDashboard}
              className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-slate-900 text-slate-50 font-semibold hover:bg-slate-800 transition"
            >
              Back to dashboard
            </button>
          </div>

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-800 shadow-sm">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="font-semibold uppercase tracking-[0.18em]">STATUS</span>
              <span className="text-[11px] font-normal text-indigo-800">{loading ? "Loading..." : actionMessage}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Queue filters</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={handleFilterAll}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition bg-slate-900 text-slate-50 hover:bg-slate-800"
                >
                  All items
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
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Shortcuts</p>
              <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
                <button
                  onClick={handleGoToReportsCenter}
                  className="px-3 py-1.5 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-400 transition"
                >
                  Go to reports center
                </button>
              </div>
            </section>

            <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Live backend</p>
              <p className="text-sm text-slate-700 mt-2">Queue is loaded from backend reports ✅ (auto refresh 5s)</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Remove content will DELETE showcase post (and now room too ✅) if target is valid.
              </p>
            </section>
          </div>

          <section className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <p className="text-sm font-semibold text-slate-900">Review queue</p>
              <span className="text-[11px] text-slate-500">
                {filteredQueue.length} items shown · {totalItems} in queue
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredQueue.map((item) => {
                const selected = selectedId === item.id;
                const busy = updatingId === item.id;

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
                        <span className="text-xs font-mono text-slate-500">{item.id}</span>
                        <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold bg-slate-900 text-slate-50">
                          {item.label}
                        </span>
                        <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          Target: {item.target}
                        </span>
                        <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {item.status}
                        </span>
                      </div>

                      <p className="text-sm text-slate-900 font-semibold">{item.reason}</p>
                      <p className="text-[11px] text-slate-600 mt-1">Reported · {item.age}</p>
                    </div>

                    <div className="flex flex-wrap md:flex-col gap-2 justify-end md:items-end text-[11px]">
                      <button
                        disabled={busy}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(item);
                        }}
                        className={`px-3 py-1.5 rounded-full font-semibold transition ${
                          busy
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {busy ? "Updating..." : "Approve & keep"}
                      </button>

                      <button
                        disabled={busy}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item);
                        }}
                        className={`px-3 py-1.5 rounded-full font-semibold transition ${
                          busy
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                        }`}
                      >
                        {busy ? "Removing..." : "Remove content"}
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

              {!loading && filteredQueue.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-slate-500">No items in queue.</div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-100 text-[11px] text-slate-500">
              Connected to backend reports ✅
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