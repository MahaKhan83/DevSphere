// src/pages/CollaborationRoom.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import socket from "../sockets/socket";
import api from "../services/api"; // ✅ ADD: for report submit

/* ================= Icons ================= */
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

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <rect x="2" y="2" width="13" height="13" rx="2" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

// ✅ NEW: Report icon (added)
const ReportIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 21V4a1 1 0 0 1 1-1h10l4 4v14a1 1 0 0 1-1 1H4Z" />
    <path d="M14 3v5h5" />
    <path d="M8 11h8" />
    <path d="M8 15h6" />
  </svg>
);

/* ================= UI Helpers ================= */
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
      active ? "bg-slate-800 text-slate-50 font-semibold" : "text-slate-200/90 hover:bg-slate-800/60"
    }`}
  >
    <span className="flex items-center gap-3">
      <IconWrap>{icon}</IconWrap>
      <span>{label}</span>
    </span>
    {badge ? <BadgePill>{badge}</BadgePill> : null}
  </button>
);

export default function CollaborationRoom() {
  const { user } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const displayName = user?.name || user?.email || "Guest";
  const initials = displayName
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
  const isOnline = true;

  // ✅ Lobby state from backend
  const [rooms, setRooms] = useState([]);
  const [pendingByRoom, setPendingByRoom] = useState({}); // {ROOMCODE: [reqs]}

  const myOwnedRooms = useMemo(
    () => rooms.filter((r) => (r.owner || "").toLowerCase() === (displayName || "").toLowerCase()),
    [rooms, displayName]
  );
  const ownedCodes = useMemo(() => new Set(myOwnedRooms.map((r) => r.code)), [myOwnedRooms]);

  const ownerPending = useMemo(() => {
    return Object.entries(pendingByRoom)
      .filter(([code]) => ownedCodes.has(code))
      .flatMap(([, list]) => (Array.isArray(list) ? list : []).filter((x) => x.status === "pending"));
  }, [pendingByRoom, ownedCodes]);

  const [joinName, setJoinName] = useState(displayName);
  const [joinCode, setJoinCode] = useState("");

  const [createName, setCreateName] = useState("");
  const [maxMembers, setMaxMembers] = useState(6);

  /* ================== helpers for approval/pending ================== */
  const norm = (v) => String(v || "").trim().toLowerCase();

  const getMyRequestStatusForRoom = (roomCode) => {
    const list = pendingByRoom?.[roomCode] || [];
    const me = norm(joinName || displayName);
    const found = list.find((r) => norm(r.user) === me);
    return found?.status || null; // "pending" | "approved" | "rejected" | null
  };

  const canEnterRoom = (room) => {
    if (!room?.code) return false;
    const isOwner = norm(room.owner) === norm(displayName);
    if (isOwner) return true;
    const st = getMyRequestStatusForRoom(room.code);
    return st === "approved";
  };

  /* ================== ✅ NEW: Report room state ================== */
  const [reportRoom, setReportRoom] = useState(null); // { code, name, owner }
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const openRoomReport = (room) => {
    setReportRoom({ code: room.code, name: room.name, owner: room.owner });
    setReportReason("");
  };

  const submitRoomReport = async () => {
    if (!reportRoom) return;
    const reason = reportReason.trim();
    if (!reason) return alert("Please write a report reason.");

    setReportSubmitting(true);
    try {
      // POST /api/reports  { type: "room", target: "<roomCode>", reason: "<text>" }
      await api.post("/reports", {
        type: "room",
        target: reportRoom.code,
        reason,
      });

      alert("Report submitted.");
      setReportRoom(null);
      setReportReason("");
    } catch (e) {
      alert(e?.response?.data?.message || "Report failed.");
    } finally {
      setReportSubmitting(false);
    }
  };

  /* ✅ Socket lobby listeners */
  useEffect(() => {
    const ensureConnected = () => {
      try {
        if (!socket.connected) socket.connect();
      } catch {}
    };

    const onRooms = (list) => setRooms(Array.isArray(list) ? list : []);

    const onRoomCreated = (room) => {
      alert(`Room created. Code: ${room.code}`);
      socket.emit("lobby:sync");
    };

    const onPendingUpdated = ({ roomCode, pending }) => {
      if (!roomCode) return;
      setPendingByRoom((prev) => ({ ...prev, [roomCode]: Array.isArray(pending) ? pending : [] }));
    };

    const onError = (msg) => alert(msg || "Something went wrong.");

    const onAlreadyApproved = ({ roomCode }) => {
      alert("You are already approved. You can enter the workspace.");
      navigate(`/workspace/${roomCode}`);
    };

    const onCanEnterResult = ({ ok, room }) => {
      if (!ok) return alert("Approval required or invalid code.");
      navigate(`/workspace/${room.code}`);
    };

    const onRequested = (req) => {
      alert(`Request sent.\nRoom: ${req?.roomCode}\nWaiting for owner approval.`);
      socket.emit("lobby:sync");
    };

    const onApproved = ({ roomCode, user: approvedUser }) => {
      if (norm(approvedUser) === norm(joinName || displayName)) {
        alert(`Approved.\nYou can enter the workspace now.\nRoom: ${roomCode}`);
        socket.emit("lobby:sync");
      }
    };

    ensureConnected();

    socket.on("lobby:rooms", onRooms);
    socket.on("lobby:room-created", onRoomCreated);
    socket.on("lobby:pending-updated", onPendingUpdated);
    socket.on("lobby:error", onError);
    socket.on("lobby:already-approved", onAlreadyApproved);
    socket.on("lobby:can-enter:result", onCanEnterResult);

    socket.on("lobby:requested", onRequested);
    socket.on("lobby:approved", onApproved);

    // ✅ IMPORTANT: lobby open pe always sync
    socket.emit("lobby:sync");

    return () => {
      socket.off("lobby:rooms", onRooms);
      socket.off("lobby:room-created", onRoomCreated);
      socket.off("lobby:pending-updated", onPendingUpdated);
      socket.off("lobby:error", onError);
      socket.off("lobby:already-approved", onAlreadyApproved);
      socket.off("lobby:can-enter:result", onCanEnterResult);

      socket.off("lobby:requested", onRequested);
      socket.off("lobby:approved", onApproved);
    };
  }, [navigate, displayName, joinName]);

  // ✅ Also sync whenever route is /collaboration (back to lobby case)
  useEffect(() => {
    if (location.pathname === "/collaboration") {
      try {
        if (!socket.connected) socket.connect();
      } catch {}
      socket.emit("lobby:sync");
    }
  }, [location.pathname]);

  const createRoom = () => {
    const name = createName.trim();
    if (!name) return alert("Enter a room name.");
    try {
      if (!socket.connected) socket.connect();
    } catch {}

    socket.emit("lobby:create-room", {
      name,
      maxMembers,
      owner: user?.name || user?.email || "Owner",
      ownerId: user?._id || user?.id,
    });

    setCreateName("");
    setMaxMembers(6);
  };

  const requestToJoin = (forcedCode) => {
    const code = (forcedCode || joinCode).trim().toUpperCase();
    const nm = (joinName || "").trim() || "Guest";

    if (!code) return alert("Enter a room code.");
    if (!(user?._id || user?.id)) return alert("UserId missing. Please sign in again.");

    try {
      if (!socket.connected) socket.connect();
    } catch {}

    socket.emit("lobby:request-join", {
      code,
      user: user?.name || user?.email || nm,
      userId: user?._id || user?.id,
      force: true,
    });

    setJoinCode("");
  };

  const approveRequest = (req) => {
    socket.emit("lobby:approve", { roomCode: req.roomCode, reqId: req.id, owner: displayName });
  };

  const rejectRequest = (req) => {
    socket.emit("lobby:reject", { roomCode: req.roomCode, reqId: req.id, owner: displayName });
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Copied.");
    } catch {
      alert("Copy failed.");
    }
  };

  const enterWorkspaceByCode = () => {
    const code = (joinCode || "").trim().toUpperCase();
    const who = (joinName || displayName || "Guest").trim();
    if (!code) return alert("Enter room code first.");

    const room = rooms.find((r) => String(r.code || "").toUpperCase() === code);
    if (room && !canEnterRoom(room)) {
      return alert("Approval required. The owner has not approved yet.");
    }

    try {
      if (!socket.connected) socket.connect();
    } catch {}
    socket.emit("lobby:can-enter", { code, user: who });
  };

  const goToWorkspace = (code) => {
    const roomCode = String(code || "").trim().toUpperCase();
    const room = rooms.find((r) => String(r.code || "").toUpperCase() === roomCode);

    if (room && !canEnterRoom(room)) {
      return alert("Approval required. The owner has not approved yet.");
    }

    try {
      if (!socket.connected) socket.connect();
    } catch {}
    socket.emit("lobby:can-enter", { code: roomCode, user: displayName });
  };

  const deleteRoom = (code) => {
    const ok = window.confirm("Delete this room?");
    if (!ok) return;
    socket.emit("lobby:delete-room", { code, owner: displayName });
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex overflow-hidden">
        <div className="pointer-events-none fixed inset-0">
          <div className="sfBlob sfBlob1" />
          <div className="sfBlob sfBlob2" />
          <div className="sfShimmer" />
        </div>

        <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-2 mb-8 text-left"
            title="Go to landing"
          >
            <img src={logo} alt="DevSphere" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="text-xl font-semibold">
              Dev<span className="text-cyan-300">Sphere</span>
            </span>
          </button>

          <nav className="flex-1 space-y-2">
            <NavItem active={location.pathname === "/dashboard"} icon={<DashboardIcon />} label="Dashboard" onClick={() => navigate("/dashboard")} />
            <NavItem active={location.pathname === "/portfolio"} icon={<PortfolioIcon />} label="Build portfolio" onClick={() => navigate("/portfolio")} />
            <NavItem active={location.pathname === "/collaboration"} icon={<CollabIcon />} label="Collab rooms" onClick={() => navigate("/collaboration")} />
            <NavItem active={location.pathname === "/showcase"} icon={<ShowcaseIcon />} label="Showcase feed" onClick={() => navigate("/showcase")} />
            <NavItem
              active={location.pathname === "/notifications"}
              icon={<BellIcon />}
              label="Notifications"
              badge={unreadCount > 0 ? unreadCount : null}
              onClick={() => navigate("/notifications")}
            />
            <NavItem active={location.pathname === "/settings"} icon={<SettingsIcon />} label="Settings" onClick={() => navigate("/settings")} />
          </nav>

          <button
            onClick={() => navigate("/settings")}
            className="mt-6 flex items-center gap-3 px-2 text-left hover:bg-slate-800/40 rounded-xl py-2 transition"
            title="Open settings"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold">
                {initials || "U"}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f172a] ${
                  isOnline ? "bg-emerald-400" : "bg-slate-400"
                }`}
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

        <main className="flex-1 p-6 md:p-8 relative">
          <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 ${mounted ? "sfIn" : "sfPre"}`}>
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center"
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Collaboration Lobby</h1>
                <p className="text-sm text-slate-500 mt-1">Backend-synced: create, request, approve, enter by code.</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/notifications")}
              className="relative w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-300 transition"
              title="Notifications"
            >
              <BellIcon />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-sky-500 text-white text-[11px] font-extrabold flex items-center justify-center">
                  {unreadCount}
                </span>
              ) : null}
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <section className={`bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden sfPulseBorder ${mounted ? "sfIn2" : "sfPre"} xl:col-span-2`}>
              <div className="p-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Available rooms</h2>
                <span className="text-xs text-slate-500">{rooms.length} total</span>
              </div>

              <div className="px-5 pb-5">
                <div className="space-y-3">
                  {rooms.map((r, idx) => {
                    const full = r.members >= r.maxMembers;
                    const isOwner = norm(r.owner) === norm(displayName);

                    const st = getMyRequestStatusForRoom(r.code);
                    const pendingMe = st === "pending";
                    const approvedMe = st === "approved";
                    const enterAllowed = isOwner || approvedMe;

                    return (
                      <div
                        key={r.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 transition sfRow hover:bg-slate-50"
                        style={{ transitionDelay: `${Math.min(idx, 10) * 60}ms` }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{r.name}</p>
                            <p className="text-xs text-slate-600 mt-1">
                              Code: <span className="font-semibold text-sky-700">{r.code}</span> · Owner:{" "}
                              <span className="font-semibold">{r.owner}</span>
                            </p>

                            {!isOwner ? (
                              <p className="text-[11px] mt-1 font-semibold">
                                {pendingMe ? (
                                  <span className="text-amber-600">Status: Pending approval…</span>
                                ) : approvedMe ? (
                                  <span className="text-emerald-600">Status: Approved</span>
                                ) : null}
                              </p>
                            ) : (
                              <p className="text-[11px] mt-1 font-semibold text-slate-500">You are the owner</p>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">
                              {r.members}/{r.maxMembers}
                            </p>
                            <p className={`text-xs font-semibold ${full ? "text-rose-600" : "text-emerald-600"}`}>
                              {full ? "Full" : "Open"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => copyCode(r.code)}
                            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition inline-flex items-center gap-2"
                          >
                            <CopyIcon /> Copy code
                          </button>

                          <button
                            onClick={() => requestToJoin(r.code)}
                            disabled={full || pendingMe || approvedMe || isOwner}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition shadow-sm hover:-translate-y-[1px] active:translate-y-[1px] ${
                              full || pendingMe || approvedMe || isOwner
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-slate-900 text-white hover:bg-slate-800"
                            }`}
                            title={
                              isOwner
                                ? "You are the owner"
                                : approvedMe
                                ? "Already approved"
                                : pendingMe
                                ? "Already requested (pending)"
                                : "Request to join"
                            }
                          >
                            {isOwner ? "Owner" : approvedMe ? "Approved" : pendingMe ? "Pending…" : "Request to join"}
                          </button>

                          <button
                            onClick={() => goToWorkspace(r.code)}
                            disabled={!enterAllowed}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition shadow-sm hover:-translate-y-[1px] active:translate-y-[1px] ${
                              enterAllowed ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                            title={enterAllowed ? "Enter workspace" : "Disabled until owner approves"}
                          >
                            Enter workspace
                          </button>

                          {/* ✅ NEW: Report room (not for owner) */}
                          {!isOwner ? (
                           <button
  onClick={() => openRoomReport(r)}
  className="px-3 py-1.5 rounded-full text-xs font-semibold transition bg-rose-600 text-white hover:bg-rose-500 inline-flex items-center gap-2"
  title="Report this room"
>
  <ReportIcon /> Report
</button>
                          ) : null}

                          {isOwner ? (
                            <button
                              onClick={() => deleteRoom(r.code)}
                              className="px-3 py-1.5 rounded-full text-xs font-semibold transition bg-rose-500 text-white hover:bg-rose-400"
                            >
                              Delete
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <div className="space-y-6">
              <section className={`bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sfPulseBorder ${mounted ? "sfIn3" : "sfPre"}`}>
                <h2 className="text-lg font-semibold text-slate-900">Join a room</h2>
                <p className="text-xs text-slate-500 mt-1">Send a request first. The owner must approve.</p>

                <div className="mt-4 space-y-3">
                  <input
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    placeholder="Your display name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/30 transition"
                  />
                  <input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter room code (e.g., DSF123)"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/30 transition"
                  />

                  <button
                    onClick={() => requestToJoin()}
                    className="w-full px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition shadow hover:-translate-y-[1px] active:translate-y-[1px]"
                  >
                    Send join request
                  </button>

                  <button
                    onClick={enterWorkspaceByCode}
                    disabled={(() => {
                      const code = (joinCode || "").trim().toUpperCase();
                      const room = rooms.find((r) => String(r.code || "").toUpperCase() === code);
                      if (!room) return false;
                      return !canEnterRoom(room);
                    })()}
                    className="w-full px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                  >
                    Enter workspace (by code)
                  </button>
                </div>
              </section>

              <section className={`bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sfPulseBorder ${mounted ? "sfIn3" : "sfPre"}`}>
                <h2 className="text-lg font-semibold text-slate-900">Create a room</h2>
                <p className="text-xs text-slate-500 mt-1">The backend creates a real shared room.</p>

                <div className="mt-4 space-y-3">
                  <input
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="Room name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/30 transition"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-xs text-slate-600 font-semibold">Max members</p>
                      <input
                        type="number"
                        min={2}
                        max={50}
                        value={maxMembers}
                        onChange={(e) => setMaxMembers(e.target.value)}
                        className="w-full mt-1 outline-none bg-transparent font-bold text-slate-900"
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-xs text-slate-600 font-semibold">Owner</p>
                      <p className="mt-1 font-bold text-slate-900 truncate">{displayName}</p>
                    </div>
                  </div>

                  <button
                    onClick={createRoom}
                    className="w-full px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition shadow hover:-translate-y-[1px] active:translate-y-[1px]"
                  >
                    Create room
                  </button>
                </div>
              </section>

              <section className={`bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sfPulseBorder ${mounted ? "sfIn3" : "sfPre"}`}>
                <h2 className="text-lg font-semibold text-slate-900">Join requests (Owner)</h2>
                <p className="text-xs text-slate-500 mt-1">Only requests for your rooms appear here.</p>

                <div className="mt-4 space-y-3">
                  {ownerPending.length === 0 ? (
                    <div className="text-sm text-slate-500">No pending requests.</div>
                  ) : (
                    ownerPending.map((req) => (
                      <div key={req.id} className="rounded-2xl border border-slate-200 bg-white p-4 sfRow">
                        <p className="text-sm font-semibold text-slate-900">{req.user}</p>
                        <p className="text-xs text-slate-600 mt-1">
                          Requested room code: <span className="font-semibold text-sky-700">{req.roomCode}</span>
                        </p>

                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => approveRequest(req)}
                            className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition inline-flex items-center gap-2 shadow-sm hover:-translate-y-[1px] active:translate-y-[1px]"
                          >
                            <CheckIcon /> Approve
                          </button>
                          <button
                            onClick={() => rejectRequest(req)}
                            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition inline-flex items-center gap-2"
                          >
                            <XIcon /> Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* ✅ NEW: Report Room Modal */}
          {reportRoom && (
            <div
              className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
              onClick={() => setReportRoom(null)}
            >
              <div
                className="w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-xl sfModal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Report room</h3>
                    <p className="text-sm text-slate-500">
                      {reportRoom.name} • Code: {reportRoom.code}
                    </p>
                  </div>
                  <button
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition grid place-items-center"
                    onClick={() => setReportRoom(null)}
                    disabled={reportSubmitting}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-5">
                  <label className="text-xs font-semibold text-slate-600">Reason</label>
                  <textarea
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-200 min-h-[130px]"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Describe the issue (spam, abuse, inappropriate content, etc.)"
                  />

                  <div className="flex flex-wrap gap-3 mt-5">
                    <button
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition"
                      onClick={() => setReportRoom(null)}
                      disabled={reportSubmitting}
                    >
                      Cancel
                    </button>

                    <button
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow transition inline-flex items-center gap-2 disabled:opacity-60"
                      onClick={submitRoomReport}
                      disabled={reportSubmitting}
                    >
                      <ReportIcon />
                      {reportSubmitting ? "Submitting..." : "Submit report"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{styles}</style>
    </>
  );
}

const styles = `
  .sidebar{background:#0f172a;color:#f8fafc;display:flex;flex-direction:column;padding:24px 16px;overflow:hidden;transition:width .25s ease,padding .25s ease,opacity .25s ease;z-index:10;}
  .sidebarOpen{width:288px;opacity:1;}
  .sidebarClosed{width:0px;padding:24px 0px;opacity:0;}
  .sfBlob{position:absolute;width:560px;height:560px;border-radius:999px;filter:blur(95px);opacity:.34;animation:sfFloat 14s ease-in-out infinite;
    background:radial-gradient(circle at 30% 30%, rgba(12,42,92,.65), rgba(6,22,58,.35), rgba(3,12,28,0));}
  .sfBlob1{left:-180px;top:-180px;}
  .sfBlob2{right:-220px;bottom:-260px;width:650px;height:650px;opacity:.28;animation-duration:18s;}
  .sfShimmer{position:absolute;inset:-2px;pointer-events:none;background:linear-gradient(120deg, rgba(3,12,28,0) 0%, rgba(12,42,92,.22) 45%, rgba(3,12,28,0) 70%);
    mix-blend-mode:multiply;opacity:.55;transform:translateX(-30%);animation:sfSweep 6.5s ease-in-out infinite;}
  @keyframes sfFloat{0%{transform:translate(0,0) scale(1);}50%{transform:translate(32px,-28px) scale(1.06);}100%{transform:translate(0,0) scale(1);}}
  @keyframes sfSweep{0%{transform:translateX(-35%) skewX(-8deg);opacity:.25;}50%{transform:translateX(30%) skewX(-8deg);opacity:.65;}100%{transform:translateX(-35%) skewX(-8deg);opacity:.25;}}
  .sfPre{opacity:0;transform:translateY(12px);}
  .sfIn{opacity:1;transform:translateY(0);transition:all .6s cubic-bezier(.2,.8,.2,1);}
  .sfIn2{opacity:1;transform:translateY(0);transition:all .65s cubic-bezier(.2,.8,.2,1);transition-delay:.08s;}
  .sfIn3{opacity:1;transform:translateY(0);transition:all .7s cubic-bezier(.2,.8,.2,1);transition-delay:.12s;}
  .sfPulseBorder{position:relative;}
  .sfPulseBorder::before{content:"";position:absolute;inset:-1px;border-radius:18px;background:linear-gradient(120deg, rgba(8,30,68,.85), rgba(12,42,92,.35), rgba(8,30,68,.85));
    opacity:.28;filter:blur(10px);pointer-events:none;animation:sfBorderPulse 4.2s ease-in-out infinite;}
  .sfPulseBorder::after{content:"";position:absolute;inset:0;border-radius:18px;pointer-events:none;box-shadow:0 0 0 1px rgba(10,28,64,.30);}
  @keyframes sfBorderPulse{0%,100%{opacity:.18;transform:scale(1);}50%{opacity:.40;transform:scale(1.01);}}
  .sfRow{transition:transform .28s ease, box-shadow .28s ease, opacity .7s ease;will-change:transform;}
  .sfRow:hover{transform:translateY(-4px);box-shadow:0 18px 45px rgba(2,6,23,.10), 0 0 0 1px rgba(8,30,68,.10);}
`;