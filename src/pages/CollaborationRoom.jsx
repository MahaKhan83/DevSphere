// src/pages/CollaborationRoom.jsx
import React, { useContext, useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";

/* =========================
   SAME Icons as Dashboard
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

/* =========================
   Dashboard UI Helpers
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

/* =========================
   Room Code generator
========================= */
const genRoomCode = (existing = []) => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const make = () => Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  let code = make();
  while (existing.includes(code)) code = make();
  return code;
};

export default function CollaborationRoom() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ Notifications-like mount animations
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
  const [unreadCount] = useState(3);

  /* =========================
     Lobby Data (demo)
  ========================= */
  const [rooms, setRooms] = useState([
    { id: "r1", name: "Frontend Sprint", code: "DSF123", members: 4, maxMembers: 8, owner: "Maha" },
    { id: "r2", name: "API Integration", code: "AP1X99", members: 2, maxMembers: 4, owner: "Ava" },
    { id: "r3", name: "UI Polish", code: "UIP777", members: 1, maxMembers: 5, owner: "James" },
  ]);

  const roomCodes = useMemo(() => rooms.map((r) => r.code), [rooms]);

  const [joinName, setJoinName] = useState(displayName);
  const [joinCode, setJoinCode] = useState("");

  const [createName, setCreateName] = useState("");
  const [maxMembers, setMaxMembers] = useState(6);

  // join requests (demo)
  const [pendingRequests, setPendingRequests] = useState([{ id: "p1", roomCode: "DSF123", user: "Sarah", status: "pending" }]);

  // approved rooms (demo)
  const [approvedRooms, setApprovedRooms] = useState(() => ({}));

  const myOwnedRooms = useMemo(
    () => rooms.filter((r) => (r.owner || "").toLowerCase() === (displayName || "").toLowerCase()),
    [rooms, displayName]
  );

  const requestToJoin = (forcedCode) => {
    const code = (forcedCode || joinCode).trim().toUpperCase();
    const name = (joinName || "").trim() || "Guest";
    if (!code) return alert("Enter a room code.");

    const found = rooms.find((r) => r.code === code);
    if (!found) return alert("Room not found. Please enter a valid code.");
    if (found.members >= found.maxMembers) return alert("This room is full.");

    // owner -> allow directly
    if ((found.owner || "").toLowerCase() === (displayName || "").toLowerCase()) {
      setApprovedRooms((prev) => ({ ...prev, [found.code]: true }));
      return navigate(`/workspace/${found.code}`);
    }

    const already = pendingRequests.some(
      (x) => x.roomCode === found.code && (x.user || "").toLowerCase() === name.toLowerCase() && x.status === "pending"
    );
    if (already) return alert("Request already sent. Wait for approval (demo).");

    const req = { id: `p${Date.now()}`, roomCode: found.code, user: name, status: "pending" };
    setPendingRequests((prev) => [req, ...prev]);
    setJoinCode("");
    alert("Join request sent. Owner must approve (demo).");
  };

  const approveRequest = (reqId) => {
    const req = pendingRequests.find((x) => x.id === reqId);
    if (!req) return;

    const room = rooms.find((r) => r.code === req.roomCode);
    if (!room) return;

    if (room.members >= room.maxMembers) {
      alert("Room is full. Cannot approve.");
      setPendingRequests((p) => p.filter((x) => x.id !== reqId));
      return;
    }

    setRooms((prev) => prev.map((r) => (r.code === req.roomCode ? { ...r, members: r.members + 1 } : r)));
    setPendingRequests((p) => p.map((x) => (x.id === reqId ? { ...x, status: "approved" } : x)));

    if ((req.user || "").toLowerCase() === (displayName || "").toLowerCase()) {
      setApprovedRooms((prev) => ({ ...prev, [req.roomCode]: true }));
    }
  };

  const rejectRequest = (reqId) => {
    const req = pendingRequests.find((x) => x.id === reqId);
    setPendingRequests((p) => p.filter((x) => x.id !== reqId));
    if (req && (req.user || "").toLowerCase() === (displayName || "").toLowerCase()) {
      alert("Your request was rejected (demo).");
    }
  };

  const createRoom = () => {
    const name = createName.trim();
    if (!name) return alert("Enter a room name.");

    const code = genRoomCode(roomCodes);
    const newRoom = {
      id: `r${Date.now()}`,
      name,
      code,
      members: 1,
      maxMembers: Number(maxMembers) || 6,
      owner: displayName,
    };

    setRooms((prev) => [newRoom, ...prev]);
    setApprovedRooms((prev) => ({ ...prev, [code]: true }));
    setCreateName("");
    setMaxMembers(6);
    alert(`Room created! Code: ${code}`);
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Copied!");
    } catch {
      alert("Copy failed.");
    }
  };

  const goToWorkspace = (code, ownerName) => {
    const room = rooms.find((r) => r.code === code);
    if (!room) return;

    const isOwner = (ownerName || "").toLowerCase() === (displayName || "").toLowerCase();
    const ok = isOwner || approvedRooms[code];

    if (!ok) return alert("You must be approved by owner before entering workspace (demo).");
    navigate(`/workspace/${code}`);
  };

  const ownedRoomCodes = new Set(myOwnedRooms.map((r) => r.code));
  const ownerPending = pendingRequests.filter((req) => ownedRoomCodes.has(req.roomCode) && req.status === "pending");

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex overflow-hidden">
        {/* ✅ NAVY animated background (same as Notifications) */}
        <div className="pointer-events-none fixed inset-0">
          <div className="sfBlob sfBlob1" />
          <div className="sfBlob sfBlob2" />
          <div className="sfShimmer" />
        </div>

        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
          <button onClick={() => navigate("/")} className="flex items-center gap-3 px-2 mb-8 text-left" title="Go to Landing">
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

          {/* bottom profile */}
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

        {/* MAIN */}
        <main className="flex-1 p-6 md:p-8 relative">
          {/* Top Bar (Notifications-like entry animation) */}
          <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 ${mounted ? "sfIn" : "sfPre"}`}>
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Collaboration Lobby</h1>
                <p className="text-sm text-slate-500 mt-1">Create rooms, browse rooms, request to join, and enter workspace.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
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
          </div>

          {/* ✅ Main grid uses Notifications cards style */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* LEFT: Rooms list */}
            <section className={`bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden sfPulseBorder ${mounted ? "sfIn2" : "sfPre"} xl:col-span-2`}>
              <div className="p-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Available rooms</h2>
                <span className="text-xs text-slate-500">{rooms.length} total</span>
              </div>

              <div className="px-5 pb-5">
                <div className="space-y-3">
                  {rooms.map((r, idx) => {
                    const full = r.members >= r.maxMembers;
                    const isOwner = (r.owner || "").toLowerCase() === (displayName || "").toLowerCase();
                    const canEnter = isOwner || !!approvedRooms[r.code];

                    return (
                      <div
                        key={r.id}
                        className={[
                          "rounded-2xl border border-slate-200 bg-white p-4 transition sfRow",
                          "hover:bg-slate-50",
                          mounted ? "sfRowIn" : "sfRowPre",
                        ].join(" ")}
                        style={{ transitionDelay: `${Math.min(idx, 10) * 60}ms` }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{r.name}</p>
                            <p className="text-xs text-slate-600 mt-1">
                              Code: <span className="font-semibold text-sky-700">{r.code}</span> · Owner:{" "}
                              <span className="font-semibold">{r.owner}</span>
                            </p>

                            {canEnter ? (
                              <p className="text-[11px] mt-1 font-extrabold text-emerald-600">Access granted: you can enter workspace</p>
                            ) : (
                              <p className="text-[11px] mt-1 font-extrabold text-slate-500">Enter workspace after approval (demo)</p>
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
                            <CopyIcon />
                            Copy code
                          </button>

                          <button
                            onClick={() => requestToJoin(r.code)}
                            disabled={full}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition shadow-sm hover:-translate-y-[1px] active:translate-y-[1px] ${
                              full ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800"
                            }`}
                          >
                            Request to join
                          </button>

                          <button
                            onClick={() => goToWorkspace(r.code, r.owner)}
                            disabled={!canEnter}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition shadow-sm hover:-translate-y-[1px] active:translate-y-[1px] ${
                              !canEnter ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800"
                            }`}
                            title={!canEnter ? "Approval required (demo)" : "Open workspace"}
                          >
                            Enter workspace
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* Join */}
              <section className={`bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sfPulseBorder ${mounted ? "sfIn3" : "sfPre"}`}>
                <h2 className="text-lg font-semibold text-slate-900">Join a room</h2>
                <p className="text-xs text-slate-500 mt-1">Send a request. Owner will approve (demo).</p>

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
                    onClick={() =>
                      goToWorkspace(joinCode.trim().toUpperCase(), rooms.find((x) => x.code === joinCode.trim().toUpperCase())?.owner)
                    }
                    className="w-full px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                    title="Enter workspace if approved"
                  >
                    Enter workspace (by code)
                  </button>
                </div>
              </section>

              {/* Create */}
              <section className={`bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sfPulseBorder ${mounted ? "sfIn3" : "sfPre"}`}>
                <h2 className="text-lg font-semibold text-slate-900">Create a room</h2>
                <p className="text-xs text-slate-500 mt-1">Set a name and maximum members.</p>

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

                  <p className="text-[11px] text-slate-500">A unique room code is generated for every new room.</p>
                </div>
              </section>

              {/* Owner approvals */}
              <section className={`bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sfPulseBorder ${mounted ? "sfIn3" : "sfPre"}`}>
                <h2 className="text-lg font-semibold text-slate-900">Join requests (Owner)</h2>
                <p className="text-xs text-slate-500 mt-1">Only your rooms show requests here (demo).</p>

                <div className="mt-4 space-y-3">
                  {ownerPending.length === 0 ? (
                    <div className="text-sm text-slate-500">No pending requests for your rooms.</div>
                  ) : (
                    ownerPending.map((req) => (
                      <div key={req.id} className="rounded-2xl border border-slate-200 bg-white p-4 sfRow">
                        <p className="text-sm font-semibold text-slate-900">{req.user}</p>
                        <p className="text-xs text-slate-600 mt-1">
                          Requested room code: <span className="font-semibold text-sky-700">{req.roomCode}</span>
                        </p>

                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => approveRequest(req.id)}
                            className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition inline-flex items-center gap-2 shadow-sm hover:-translate-y-[1px] active:translate-y-[1px]"
                          >
                            <CheckIcon /> Approve
                          </button>
                          <button
                            onClick={() => rejectRequest(req.id)}
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
        </main>
      </div>

      {/* Styles (same theme system as Notifications.jsx) */}
      <style>{`
        /* Sidebar show/hide (same as Dashboard/Notifications) */
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

        /* NAVY BLUE ONLY animated blobs */
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

        /* Entry animations */
        .sfPre{ opacity: 0; transform: translateY(12px); }
        .sfIn{ opacity: 1; transform: translateY(0); transition: all .6s cubic-bezier(.2,.8,.2,1); }
        .sfIn2{ opacity: 1; transform: translateY(0); transition: all .65s cubic-bezier(.2,.8,.2,1); transition-delay: .08s; }
        .sfIn3{ opacity: 1; transform: translateY(0); transition: all .7s cubic-bezier(.2,.8,.2,1); transition-delay: .12s; }

        /* Navy pulse border */
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

        /* Row hover + stagger animation */
        .sfRow{
          transition: transform .28s ease, box-shadow .28s ease, opacity .7s ease;
          will-change: transform;
        }
        .sfRow:hover{
          transform: translateY(-4px);
          box-shadow:
            0 18px 45px rgba(2,6,23,0.10),
            0 0 0 1px rgba(8, 30, 68, 0.10);
        }
        .sfRowPre{ opacity: 0; transform: translateY(18px); }
        .sfRowIn{ opacity: 1; transform: translateY(0); }
      `}</style>
    </>
  );
}