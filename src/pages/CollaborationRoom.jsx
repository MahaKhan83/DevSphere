// src/pages/CollaborationRoom.jsx
import React, { useMemo, useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";

/* ---------- Professional Icons ---------- */
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
const CalendarIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M7 2v3M17 2v3M3.5 7h17M3.5 4.5h17v17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-17ZM7.5 11h4M7.5 15h4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
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
const SaveIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v5h8" />
  </svg>
);
const RunIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 5v14l11-7-11-7Z" />
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M6 6l1 16h10l1-16" />
  </svg>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200 text-sm">
    {children}
  </span>
);
const Dot = ({ className = "" }) => <span className={`inline-block w-2.5 h-2.5 rounded-full ${className}`} />;

const Avatar = ({ name = "U", color = "bg-slate-700" }) => {
  const initial = (name?.trim()?.[0] || "U").toUpperCase();
  return (
    <div className={`w-10 h-10 rounded-full grid place-items-center ${color} text-white font-semibold ring-1 ring-white/10`}>
      {initial}
    </div>
  );
};

const MiniFileIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

/* ---------- Unique room code helpers ---------- */
const genRoomCode = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};
const genUniqueRoomCode = (existingCodes = []) => {
  let code = genRoomCode();
  while (existingCodes.includes(code)) code = genRoomCode();
  return code;
};

export default function CollaborationRoom() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const displayName = user?.name || user?.email || "Guest";
  const initials = displayName
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  /* ✅ Lobby-first flow */
  const [joined, setJoined] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  /* Rooms (demo) — each has UNIQUE code + owner + approval + max members */
  const [rooms, setRooms] = useState([
    { id: "r1", name: "Frontend Sprint", code: "DSF123", owner: "Ava", requireApproval: true, maxMembers: 8, members: 8, active: 4 },
    { id: "r2", name: "API Integration", code: "AP1X99", owner: "James", requireApproval: true, maxMembers: 4, members: 4, active: 2 },
    { id: "r3", name: "UI Polish", code: "UIP777", owner: "Ava", requireApproval: false, maxMembers: 15, members: 5, active: 1 },
  ]);

  const [activeRoomId, setActiveRoomId] = useState("r1");
  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  const [connected] = useState(true);

  /* Join requests per room (demo) */
  const [joinRequestsByRoom, setJoinRequestsByRoom] = useState({
    r1: [{ id: "rq1", name: "NewUser01", time: "now" }],
    r2: [],
    r3: [],
  });

  /* Approved users per room (demo) */
  const [approvedByRoom, setApprovedByRoom] = useState({
    r1: ["Ava", "James"], // demo
    r2: ["James"],
    r3: ["Ava"],
  });

  /* Mobile tabs (only after join) */
  const [mobileTab, setMobileTab] = useState("editor"); // files | editor | chat

  /* Files per room (demo) */
  const initialFilesByRoom = useMemo(
    () => ({
      r1: [
        {
          id: "f1",
          name: "App.jsx",
          path: "src > App.jsx",
          lang: "javascript",
          content: `export default function App(){\n  return <div>Hello DevSphere</div>\n}\n`,
        },
      ],
      r2: [{ id: "f4", name: "api.js", path: "src > services > api.js", lang: "javascript", content: `export async function getData(){\n  return { ok:true };\n}\n` }],
      r3: [{ id: "f6", name: "theme.css", path: "src > styles > theme.css", lang: "css", content: `:root{ --brand:#38bdf8; }\n` }],
    }),
    []
  );

  const [filesByRoom, setFilesByRoom] = useState(initialFilesByRoom);
  const files = filesByRoom[activeRoomId] || [];
  const [activeFileId, setActiveFileId] = useState(files[0]?.id || null);

  useEffect(() => {
    const roomFiles = filesByRoom[activeRoomId] || [];
    setActiveFileId(roomFiles[0]?.id || null);
  }, [activeRoomId, filesByRoom]);

  const activeFile =
    (filesByRoom[activeRoomId] || []).find((f) => f.id === activeFileId) || (filesByRoom[activeRoomId] || [])[0] || null;

  const [language, setLanguage] = useState(activeFile?.lang || "javascript");
  const [codeText, setCodeText] = useState(activeFile?.content || "");

  useEffect(() => {
    if (!activeFile) {
      setLanguage("javascript");
      setCodeText("");
      return;
    }
    setLanguage(activeFile.lang || "javascript");
    setCodeText(activeFile.content || "");
  }, [activeFileId]); // eslint-disable-line

  /* Demo users list */
  const users = useMemo(
    () => [
      { id: "ava", name: "Ava", color: "bg-slate-700", online: true },
      { id: "james", name: "James", color: "bg-sky-700", online: true },
      { id: "sarah", name: "Sarah", color: "bg-amber-700", online: false },
    ],
    []
  );

  /* Chat per room */
  const [messagesByRoom, setMessagesByRoom] = useState({
    r1: [{ id: 1, name: "Ava", time: "10:12", text: "Header component is ready.", mine: false }],
    r2: [{ id: 1, name: "James", time: "11:05", text: "API base URL set?", mine: false }],
    r3: [{ id: 1, name: "Ava", time: "09:40", text: "Let’s polish spacing & hover states.", mine: false }],
  });
  const messages = messagesByRoom[activeRoomId] || [];

  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const typingRef = useRef(null);

  const onSend = () => {
    const t = msg.trim();
    if (!t) return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    setMessagesByRoom((prev) => {
      const cur = prev[activeRoomId] || [];
      return {
        ...prev,
        [activeRoomId]: [...cur, { id: Date.now(), name: "You", time: `${hh}:${mm}`, text: t, mine: true }],
      };
    });

    setMsg("");
    setTyping(false);
  };

  const onType = (val) => {
    setMsg(val);
    setTyping(true);
    if (typingRef.current) clearTimeout(typingRef.current);
    typingRef.current = setTimeout(() => setTyping(false), 900);
  };

  /* ✅ Delete ONLY your own message */
  const deleteMessage = (id) => {
    setMessagesByRoom((prev) => {
      const cur = prev[activeRoomId] || [];
      const target = cur.find((m) => m.id === id);
      if (!target?.mine) return prev;
      return { ...prev, [activeRoomId]: cur.filter((m) => m.id !== id) };
    });
  };

  /* ✅ Create Room (Lobby only) */
  const createRoom = () => {
    const name = prompt("Room name?");
    if (!name) return;

    const maxStr = prompt("Max members allowed? (e.g., 10)");
    const maxMembers = Math.max(2, Math.min(200, Number(maxStr) || 10));

    const requireApprovalStr = prompt("Require owner approval for new users? (yes/no)");
    const requireApproval = (requireApprovalStr || "yes").trim().toLowerCase().startsWith("y");

    const existingCodes = rooms.map((r) => r.code);
    const code = genUniqueRoomCode(existingCodes);
    const id = `r${Date.now()}`;

    const newRoom = {
      id,
      name,
      code,
      owner: displayName,
      requireApproval,
      maxMembers,
      members: 1,
      active: 1,
    };

    setRooms((prev) => [newRoom, ...prev]);
    setApprovedByRoom((prev) => ({ ...prev, [id]: [displayName] }));
    setJoinRequestsByRoom((prev) => ({ ...prev, [id]: [] }));

    setFilesByRoom((prev) => ({
      ...prev,
      [id]: [
        {
          id: `f${Date.now()}`,
          name: "main.js",
          path: "src > main.js",
          lang: "javascript",
          content: `console.log("Room created: ${name}");\n`,
        },
      ],
    }));
    setMessagesByRoom((prev) => ({
      ...prev,
      [id]: [{ id: Date.now(), name: "System", time: "now", text: `Room created by ${displayName}.`, mine: false }],
    }));

    setActiveRoomId(id);
    setJoined(true);
    setMobileTab("editor");
  };

  /* ✅ Send join request if approval is required */
  const requestJoin = (room) => {
    setJoinRequestsByRoom((prev) => {
      const cur = prev[room.id] || [];
      const already = cur.some((r) => r.name === displayName);
      if (already) return prev;
      return { ...prev, [room.id]: [...cur, { id: `rq_${Date.now()}`, name: displayName, time: "now" }] };
    });
    alert("Join request sent to the room owner. Please wait for approval.");
  };

  /* ✅ Owner actions: approve/deny */
  const approveRequest = (roomId, reqId) => {
    const req = (joinRequestsByRoom[roomId] || []).find((x) => x.id === reqId);
    if (!req) return;

    // remove request
    setJoinRequestsByRoom((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter((x) => x.id !== reqId),
    }));

    // add approved
    setApprovedByRoom((prev) => {
      const cur = prev[roomId] || [];
      if (cur.includes(req.name)) return prev;
      return { ...prev, [roomId]: [...cur, req.name] };
    });

    // increase members (demo)
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        if (r.members >= r.maxMembers) return r;
        return { ...r, members: r.members + 1, active: Math.min(r.members + 1, r.active + 1) };
      })
    );

    alert(`Approved: ${req.name}`);
  };

  const denyRequest = (roomId, reqId) => {
    setJoinRequestsByRoom((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter((x) => x.id !== reqId),
    }));
    alert("Request denied.");
  };

  /* ✅ Join room */
  const joinRoom = () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) return;

    const found = rooms.find((r) => r.code === code);
    if (!found) {
      alert("Room code not found. Please check the code or create a room.");
      return;
    }

    // capacity check
    if (found.members >= found.maxMembers && displayName !== found.owner) {
      alert("This room is full. Max members limit reached.");
      return;
    }

    // approval check
    if (found.requireApproval && displayName !== found.owner) {
      const approved = (approvedByRoom[found.id] || []).includes(displayName);
      if (!approved) {
        requestJoin(found);
        return; // do not join yet
      }
    }

    // join
    setActiveRoomId(found.id);
    setJoined(true);
    setMobileTab("editor");
  };

  const leaveRoom = () => {
    setJoined(false);
    setJoinCode("");
    setMsg("");
  };

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(activeRoom?.code || "");
      alert(`Copied: ${activeRoom?.code}`);
    } catch {
      alert("Copy failed (clipboard blocked).");
    }
  };

  /* Editor actions */
  const saveFile = () => {
    if (!activeFile) return;
    setFilesByRoom((prev) => ({
      ...prev,
      [activeRoomId]: (prev[activeRoomId] || []).map((x) => (x.id === activeFile.id ? { ...x, content: codeText, lang: language } : x)),
    }));
  };
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      alert("Copied!");
    } catch {
      alert("Copy failed.");
    }
  };
  const runDemo = () => alert("Run (demo)");

  /* Files actions */
  const newFile = () => {
    const name = prompt("New file name? (e.g., index.js, App.jsx, style.css)");
    if (!name) return;

    const id = `f${Date.now()}`;
    const langGuess = name.endsWith(".css")
      ? "css"
      : name.endsWith(".html")
      ? "html"
      : name.endsWith(".md")
      ? "markdown"
      : name.endsWith(".json")
      ? "json"
      : "javascript";

    const f = { id, name, path: `src > ${name}`, lang: langGuess, content: `// ${name}\n` };

    setFilesByRoom((prev) => ({ ...prev, [activeRoomId]: [f, ...(prev[activeRoomId] || [])] }));
    setActiveFileId(id);
    setMobileTab("editor");
  };

  const renameFile = (fileId) => {
    const current = (filesByRoom[activeRoomId] || []).find((x) => x.id === fileId);
    if (!current) return;

    const name = prompt("Rename file:", current.name);
    if (!name) return;

    setFilesByRoom((prev) => ({
      ...prev,
      [activeRoomId]: (prev[activeRoomId] || []).map((x) => (x.id === fileId ? { ...x, name, path: `src > ${name}` } : x)),
    }));
  };

  const deleteFile = (fileId) => {
    const ok = window.confirm("Delete this file? (demo)");
    if (!ok) return;

    setFilesByRoom((prev) => {
      const next = (prev[activeRoomId] || []).filter((x) => x.id !== fileId);
      return { ...prev, [activeRoomId]: next };
    });

    setTimeout(() => {
      const roomFiles = (filesByRoom[activeRoomId] || []).filter((x) => x.id !== fileId);
      setActiveFileId(roomFiles[0]?.id || null);
    }, 0);
  };

  const uploadFile = () => alert("Upload (demo)");

  const isOwnerOfRoom = (room) => room?.owner === displayName;

  /* ---------- LOBBY SCREEN ---------- */
  if (!joined) {
    return (
      <div className="min-h-screen bg-[#06162a] text-slate-100 relative overflow-hidden">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="sfBlob sfBlob1" />
          <div className="sfBlob sfBlob2" />
          <div className="sfBlob sfBlob3" />
          <div className="sfShimmer" />
          <div className="sfGrid" />
          <div className="sfGrain" />
        </div>

        <div className={`relative flex ${mounted ? "pageIn" : "pageBefore"}`}>
          {/* Sidebar */}
          <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
            <div className="flex items-center gap-3 px-2 mb-8 fadeInSoft">
              <img src={logo} alt="DevSphere" className="w-10 h-10 object-contain drop-shadow-md" />
              <span className="text-xl font-semibold">
                Dev<span className="text-cyan-300">Sphere</span>
              </span>
            </div>

            <div className="navyGlowLine" />

            <nav className="flex-1 space-y-2 mt-3">
              <button onClick={() => navigate("/dashboard")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/8 transition">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <DashboardIcon />
                </span>
                Dashboard
              </button>

              <button onClick={() => navigate("/portfolio")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/8 transition">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <PortfolioIcon />
                </span>
                Build portfolio
              </button>

              <button onClick={() => navigate("/collaboration")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm bg-white/10 border border-white/12">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <CollabIcon />
                </span>
                Collab rooms
                <span className="ml-auto h-2.5 w-2.5 rounded-full bg-sky-400" />
              </button>

              <button onClick={() => navigate("/showcase")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/8 transition">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShowcaseIcon />
                </span>
                Showcase feed
              </button>

              <button onClick={() => navigate("/notifications")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/8 transition">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <BellIcon />
                </span>
                Notifications
              </button>

              <button onClick={() => navigate("/calendar")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/8 transition">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <CalendarIcon />
                </span>
                Calendar
              </button>

              <button onClick={() => navigate("/settings")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/8 transition">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <SettingsIcon />
                </span>
                Settings
              </button>
            </nav>

            <div className="mt-6 flex items-center gap-3 px-2 fadeInSoft">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold ring-1 ring-white/10">
                {initials || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate max-w-[160px]">{displayName}</p>
                <p className="text-xs text-slate-300">Signed in</p>
              </div>
            </div>
          </aside>

          {/* Lobby */}
          <main className="flex-1 p-5 md:p-6">
            <div className="flex items-center justify-between mb-5 fadeUp-1">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setSidebarOpen((v) => !v)}
                  className="mt-1 w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition flex items-center justify-center btnShine"
                  title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                >
                  {sidebarOpen ? "⟨⟨" : "⟩⟩"}
                </button>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Collaboration Lobby</h1>
                  <p className="text-slate-300/80 text-sm mt-1">
                    Join with a code, or create a new room. Owners can approve join requests here.
                  </p>
                </div>
              </div>

              <Pill>
                <Dot className={connected ? "bg-sky-400" : "bg-rose-400"} />
                <span className="text-slate-200">{connected ? "Connected" : "Disconnected"}</span>
              </Pill>
            </div>

            <div className="rounded-[28px] bg-white/5 border border-white/10 shadow-2xl overflow-hidden fadeUp-2">
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Join */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                    <h2 className="text-xl font-semibold">Join a Room</h2>
                    <p className="text-sm text-slate-300 mt-2">Enter a room code to request access or join directly.</p>

                    <div className="mt-5 flex flex-col md:flex-row gap-3">
                      <input
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Enter room code..."
                        className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-sky-400/30"
                      />
                      <button
                        onClick={joinRoom}
                        className="px-6 py-3 rounded-2xl bg-sky-500/15 border border-sky-400/30 hover:bg-sky-500/25 transition btnShine"
                      >
                        Join
                      </button>
                    </div>

                    <div className="mt-6 text-xs text-slate-400">
                      Demo note: Approval/requests are UI-only right now. Backend integration is needed for real collaboration.
                    </div>
                  </div>

                  {/* Rooms list + Create */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Available Rooms</h2>

                      <button
                        onClick={createRoom}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition btnShine text-sm"
                      >
                        + Create room
                      </button>
                    </div>

                    <p className="text-sm text-slate-300 mt-2">
                      Click any room to auto-fill the code. Owners will see requests to approve.
                    </p>

                    <div className="mt-4 space-y-2 max-h-[320px] overflow-auto chatScroll pr-1">
                      {rooms.map((r) => {
                        const pendingCount = (joinRequestsByRoom[r.id] || []).length;
                        return (
                          <div key={r.id} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                            <button onClick={() => setJoinCode(r.code)} className="w-full text-left">
                              <div className="flex items-center justify-between gap-3">
                                <div className="font-semibold text-slate-100 truncate">{r.name}</div>
                                <div className="text-xs text-slate-400">
                                  Active <span className="text-emerald-300 font-semibold">{r.active}</span> / {r.members} • Max {r.maxMembers}
                                </div>
                              </div>

                              <div className="text-xs text-slate-400 mt-1">
                                Code: <span className="text-cyan-200 font-semibold">{r.code}</span> • Owner:{" "}
                                <span className="text-slate-200 font-semibold">{r.owner}</span> • Approval:{" "}
                                <span className="text-slate-200 font-semibold">{r.requireApproval ? "Required" : "Not required"}</span>
                              </div>
                            </button>

                            {/* Owner request approvals */}
                            {isOwnerOfRoom(r) && pendingCount > 0 && (
                              <div className="mt-3 rounded-xl bg-white/5 border border-white/10 p-3">
                                <div className="text-sm font-semibold flex items-center justify-between">
                                  Join Requests
                                  <span className="text-xs text-slate-400">{pendingCount} pending</span>
                                </div>

                                <div className="mt-2 space-y-2">
                                  {(joinRequestsByRoom[r.id] || []).map((req) => (
                                    <div key={req.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                                      <div className="text-sm text-slate-200 truncate">
                                        {req.name} <span className="text-xs text-slate-500">({req.time})</span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => approveRequest(r.id, req.id)}
                                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-400/20 hover:bg-emerald-500/20 transition btnShine text-xs"
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => denyRequest(r.id, req.id)}
                                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-400/20 hover:bg-rose-500/20 transition btnShine text-xs"
                                        >
                                          Deny
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Show hint for non-owner users */}
                            {!isOwnerOfRoom(r) && r.requireApproval && (
                              <div className="mt-3 text-xs text-slate-400">
                                This room requires owner approval. Your join request will be sent if you are not approved yet.
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 text-xs text-slate-400">
                      Create-room option is available only in the Lobby ✅
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        <style>{baseStyles}</style>
      </div>
    );
  }

  /* ---------- AFTER JOIN: full room UI ---------- */
  return (
    <div className="min-h-screen bg-[#06162a] text-slate-100 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="sfBlob sfBlob1" />
        <div className="sfBlob sfBlob2" />
        <div className="sfBlob sfBlob3" />
        <div className="sfShimmer" />
        <div className="sfGrid" />
        <div className="sfGrain" />
      </div>

      <div className={`relative flex ${mounted ? "pageIn" : "pageBefore"}`}>
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
          <div className="flex items-center gap-3 px-2 mb-8 fadeInSoft">
            <img src={logo} alt="DevSphere" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="text-xl font-semibold">
              Dev<span className="text-cyan-300">Sphere</span>
            </span>
          </div>

          <div className="navyGlowLine" />

          <nav className="flex-1 space-y-2 mt-3">
            <button onClick={() => navigate("/dashboard")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/8 transition">
              <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <DashboardIcon />
              </span>
              Dashboard
            </button>

            <button onClick={() => navigate("/portfolio")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/8 transition">
              <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <PortfolioIcon />
              </span>
              Build portfolio
            </button>

            <button onClick={() => navigate("/collaboration")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm bg-white/10 border border-white/12">
              <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <CollabIcon />
              </span>
              Collab rooms
              <span className="ml-auto h-2.5 w-2.5 rounded-full bg-sky-400" />
            </button>

            <button onClick={() => navigate("/showcase")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/8 transition">
              <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <ShowcaseIcon />
              </span>
              Showcase feed
            </button>

            <button onClick={() => navigate("/notifications")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/8 transition">
              <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <BellIcon />
              </span>
              Notifications
            </button>

            <button onClick={() => navigate("/calendar")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/8 transition">
              <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <CalendarIcon />
              </span>
              Calendar
            </button>

            <button onClick={() => navigate("/settings")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/8 transition">
              <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <SettingsIcon />
              </span>
              Settings
            </button>
          </nav>

          <div className="mt-6 flex items-center gap-3 px-2 fadeInSoft">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold ring-1 ring-white/10">
              {initials || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate max-w-[160px]">{displayName}</p>
              <p className="text-xs text-slate-300">Signed in</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-5 md:p-6">
          {/* Top bar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5 fadeUp-1">
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition flex items-center justify-center btnShine"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Collaboration Room</h1>
                <p className="text-slate-300/80 text-sm mt-1">
                  {activeRoom?.name} • <span className="text-cyan-200 font-semibold">{activeRoom?.code}</span> • Active{" "}
                  <span className="text-emerald-300 font-semibold">{activeRoom?.active}</span> / {activeRoom?.members} • Max{" "}
                  {activeRoom?.maxMembers}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Pill>
                <Dot className={connected ? "bg-sky-400" : "bg-rose-400"} />
                <span className="text-slate-200">{connected ? "Connected" : "Disconnected"}</span>
              </Pill>

              <button
                onClick={copyRoomCode}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition btnShine flex items-center gap-2 text-sm"
                title="Copy room code"
              >
                <CopyIcon /> Copy code
              </button>

              <button
                onClick={leaveRoom}
                className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-400/20 hover:bg-rose-500/20 transition btnShine text-sm"
                title="Leave room"
              >
                Leave
              </button>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden mb-4 fadeUp-2">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "files", label: "Files" },
                { id: "editor", label: "Editor" },
                { id: "chat", label: "Chat" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setMobileTab(t.id)}
                  className={`px-3 py-2 rounded-xl border text-sm transition ${
                    mobileTab === t.id ? "bg-white/10 border-white/15 text-white" : "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main container */}
          <div className="rounded-[28px] bg-white/5 border border-white/10 shadow-2xl overflow-hidden fadeUp-2">
            <div className="p-5 md:p-6">
              <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_340px] gap-5">
                {/* LEFT */}
                <aside className={`space-y-5 fadeUp-3 ${mobileTab !== "files" ? "hidden md:block" : ""}`}>
                  {/* Rooms list (switch rooms) */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-lg font-semibold mb-3">Rooms</div>

                    <div className="space-y-2">
                      {rooms.map((r) => {
                        const active = r.id === activeRoomId;
                        return (
                          <button
                            key={r.id}
                            onClick={() => {
                              setActiveRoomId(r.id);
                              setMobileTab("editor");
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl border transition ${
                              active ? "bg-white/10 border-white/15" : "bg-white/0 border-white/10 hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-semibold truncate">{r.name}</div>
                              <span className="text-xs text-slate-400">
                                {r.active}/{r.members}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">Code: {r.code}</div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 text-xs text-slate-400">
                      Room creation is only available in the Lobby ✅
                    </div>
                  </div>

                  {/* Files */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-lg font-semibold">Files</div>
                      <div className="flex items-center gap-2">
                        <button onClick={newFile} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition btnShine text-sm">
                          + New
                        </button>
                        <button onClick={uploadFile} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition btnShine text-sm">
                          Upload
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {files.map((f) => {
                        const active = f.id === activeFileId;
                        return (
                          <div key={f.id} className={`rounded-xl border ${active ? "border-white/15 bg-white/10" : "border-white/10 bg-white/0"}`}>
                            <button
                              onClick={() => {
                                setActiveFileId(f.id);
                                setMobileTab("editor");
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 text-left"
                            >
                              <span className="text-slate-200">
                                <MiniFileIcon />
                              </span>
                              <span className="text-slate-100 truncate">{f.name}</span>
                              <span className="ml-auto text-xs text-slate-400">{f.lang}</span>
                            </button>

                            <div className="px-3 pb-2 flex items-center gap-2">
                              <button
                                onClick={() => renameFile(f.id)}
                                className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition btnShine text-xs"
                              >
                                Rename
                              </button>
                              <button
                                onClick={() => deleteFile(f.id)}
                                className="px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-400/20 hover:bg-rose-500/20 transition btnShine text-xs"
                              >
                                Delete
                              </button>
                              <span className="ml-auto text-[11px] text-slate-400 truncate">{f.path}</span>
                            </div>
                          </div>
                        );
                      })}
                      {files.length === 0 && <div className="text-sm text-slate-400">No files.</div>}
                    </div>
                  </div>

                  {/* Active collaborators */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-lg font-semibold mb-3">Active collaborators</div>
                    <div className="space-y-3">
                      {users.map((u) => (
                        <div key={u.id} className="flex items-center gap-3 rounded-xl px-2 py-2">
                          <Avatar name={u.name} color={u.color} />
                          <div className="text-slate-100 flex-1">{u.name}</div>
                          <span className={`text-xs ${u.online ? "text-emerald-300" : "text-slate-400"}`}>{u.online ? "Online" : "Offline"}</span>
                          <span className={`h-2.5 w-2.5 rounded-full ${u.online ? "bg-emerald-400" : "bg-slate-500"}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* CENTER (Editor) */}
                <section className={`rounded-2xl bg-white/5 border border-white/10 overflow-hidden fadeUp-3 ${mobileTab !== "editor" ? "hidden md:block" : ""}`}>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4 py-3 border-b border-white/10">
                    <div className="text-slate-300 text-sm truncate">{activeFile?.path || "No file selected"}</div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm outline-none"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="css">CSS</option>
                        <option value="html">HTML</option>
                        <option value="markdown">Markdown</option>
                        <option value="json">JSON</option>
                      </select>

                      <button onClick={saveFile} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition btnShine flex items-center gap-2 text-sm">
                        <SaveIcon /> Save
                      </button>

                      <button onClick={copyCode} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition btnShine flex items-center gap-2 text-sm">
                        <CopyIcon /> Copy
                      </button>

                      <button onClick={runDemo} className="px-3 py-2 rounded-xl bg-sky-500/15 border border-sky-400/30 hover:bg-sky-500/25 transition btnShine flex items-center gap-2 text-sm">
                        <RunIcon /> Run
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="rounded-2xl bg-[#071a31] border border-white/10 overflow-hidden">
                      <div className="grid grid-cols-[48px_1fr]">
                        <div className="py-4 px-3 text-right text-slate-500 font-mono text-sm border-r border-white/10 select-none">
                          {Array.from({ length: 22 }).map((_, i) => (
                            <div key={i} className="leading-6">
                              {i + 1}
                            </div>
                          ))}
                        </div>

                        <textarea
                          value={codeText}
                          onChange={(e) => setCodeText(e.target.value)}
                          spellCheck={false}
                          className="w-full min-h-[520px] p-4 bg-transparent text-slate-100 font-mono text-sm leading-6 outline-none resize-none"
                          placeholder="Start collaborating..."
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* RIGHT (Chat) */}
                <section className={`rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col fadeUp-3 ${mobileTab !== "chat" ? "hidden md:flex" : "flex"}`}>
                  <div className="px-4 py-3 border-b border-white/10">
                    <div className="text-xl font-semibold">Chat</div>
                  </div>

                  <div className="p-4 space-y-4 flex-1 overflow-auto chatScroll">
                    {messages.map((m) => (
                      <div key={m.id} className="flex items-start gap-3 msgIn group">
                        <Avatar
                          name={m.name}
                          color={m.name === "Ava" ? "bg-slate-700" : m.name === "James" ? "bg-sky-700" : m.name === "Sarah" ? "bg-amber-700" : "bg-emerald-700"}
                        />

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold">{m.name}</div>

                            <div className="flex items-center gap-2">
                              <div className="text-xs text-slate-400">{m.time}</div>
                              {m.mine && (
                                <button
                                  onClick={() => deleteMessage(m.id)}
                                  className="opacity-0 group-hover:opacity-100 transition px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-400/20 hover:bg-rose-500/20 btnShine"
                                  title="Delete your message"
                                >
                                  <TrashIcon />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="text-slate-300 text-sm mt-1 leading-5">{m.text}</div>
                        </div>
                      </div>
                    ))}

                    {messages.length === 0 && <div className="text-sm text-slate-400">No messages yet.</div>}
                  </div>

                  <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 inputGlow">
                      <input
                        className="flex-1 bg-transparent outline-none text-slate-200 placeholder:text-slate-500"
                        placeholder="Type a message..."
                        value={msg}
                        onChange={(e) => onType(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSend()}
                      />
                      <button
                        onClick={onSend}
                        className="w-10 h-10 rounded-xl grid place-items-center bg-sky-500/15 border border-sky-400/30 hover:bg-sky-500/25 transition btnShine"
                        title="Send"
                      >
                        <SendIcon />
                      </button>
                    </div>
                    {typing && <div className="text-xs text-slate-400 mt-2">Typing…</div>}
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="h-6" />
        </main>
      </div>

      <style>{baseStyles}</style>
    </div>
  );
}

/* ✅ Notes:
   - No moving shine on cards
   - Shine only on buttons (.btnShine)
   - Lobby has Create Room
   - Owner approval + Max members (demo UI)
*/
const baseStyles = `
  .pageBefore{ opacity:0; transform: translateY(8px); }
  .pageIn{ opacity:1; transform: translateY(0); transition: opacity .35s ease, transform .35s ease; }

  @keyframes fadeUp{ 0%{opacity:0;transform:translateY(18px)} 100%{opacity:1;transform:translateY(0)} }
  .fadeUp-1{ animation: fadeUp .55s ease-out both; }
  .fadeUp-2{ animation: fadeUp .75s ease-out both; }
  .fadeUp-3{ animation: fadeUp .95s ease-out both; }

  @keyframes softFade{ from{ opacity:0; transform: translateY(6px); } to{ opacity:1; transform: translateY(0); } }
  .fadeInSoft{ animation: softFade .45s ease-out both; }

  .sfBlob{
    position:absolute; border-radius:999px; filter: blur(110px); opacity:.55;
    animation: sfFloat 14s ease-in-out infinite;
    background: radial-gradient(circle at 30% 30%, rgba(12,42,92,.9), rgba(6,22,58,.55), rgba(3,12,28,0));
  }
  .sfBlob1{ left:-260px; top:-260px; width:760px; height:760px; }
  .sfBlob2{ right:-280px; bottom:-340px; width:820px; height:820px; opacity:.45; animation-duration:18s; }
  .sfBlob3{ left:22%; bottom:-380px; width:760px; height:760px; opacity:.28; animation-duration:22s; }

  .sfShimmer{
    position:absolute; inset:-10px;
    background: linear-gradient(120deg, rgba(3,12,28,0) 0%, rgba(12,42,92,.30) 42%, rgba(56,189,248,.18) 52%, rgba(3,12,28,0) 72%);
    opacity:.7; transform: translateX(-45%) skewX(-10deg);
    animation: sfSweep 6.6s ease-in-out infinite; mix-blend-mode: screen; pointer-events:none;
  }
  .sfGrid{
    position:absolute; inset:0; opacity:.12;
    background-image: linear-gradient(to right, rgba(148,163,184,.12) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(148,163,184,.12) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(circle at 30% 20%, black 0%, transparent 55%);
    pointer-events:none;
  }
  .sfGrain{
    position:absolute; inset:0; opacity:.10;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E");
    pointer-events:none;
  }
  @keyframes sfFloat{ 0%{ transform:translate(0,0) scale(1); } 50%{ transform:translate(42px,-32px) scale(1.08); } 100%{ transform:translate(0,0) scale(1); } }
  @keyframes sfSweep{ 0%{ transform:translateX(-55%) skewX(-10deg); opacity:.35; } 50%{ transform:translateX(35%) skewX(-10deg); opacity:.9; } 100%{ transform:translateX(-55%) skewX(-10deg); opacity:.35; } }

  .sidebar{
    background: rgba(15,23,42,.92);
    backdrop-filter: blur(10px);
    color: #f8fafc;
    display:flex; flex-direction:column;
    padding: 24px 16px;
    overflow:hidden;
    transition: width .25s ease, padding .25s ease, opacity .25s ease;
    border-right: 1px solid rgba(255,255,255,.08);
    position: sticky; top: 0; height: 100vh;
  }
  .sidebarOpen{ width: 288px; opacity:1; }
  .sidebarClosed{ width: 0px; padding: 24px 0px; opacity:0; }

  .navyGlowLine{
    height:2px; width:100%; border-radius:999px;
    background: linear-gradient(90deg, rgba(12,42,92,0) 0%, rgba(12,42,92,0.9) 30%, rgba(56,189,248,0.65) 50%, rgba(12,42,92,0.9) 70%, rgba(12,42,92,0) 100%);
    animation: glowSweep 3.8s ease-in-out infinite;
    opacity:.9;
  }
  @keyframes glowSweep{ 0%{ opacity:.25; transform: translateX(-18%); } 50%{ opacity:.85; transform: translateX(18%); } 100%{ opacity:.25; transform: translateX(-18%); } }

  .btnShine{ position:relative; overflow:hidden; }
  .btnShine::after{
    content:""; position:absolute; inset:-2px;
    background: linear-gradient(90deg, rgba(12,42,92,0), rgba(12,42,92,.35), rgba(56,189,248,.22), rgba(12,42,92,0));
    transform: translateX(-70%);
    animation: btnSheen 4.0s ease-in-out infinite;
    opacity:.7; pointer-events:none;
  }
  @keyframes btnSheen{ 0%{ transform: translateX(-70%); } 50%{ transform: translateX(70%); } 100%{ transform: translateX(-70%); } }

  @keyframes msgIn{ from{ opacity:0; transform: translateY(8px); } to{ opacity:1; transform: translateY(0); } }
  .msgIn{ animation: msgIn .25s ease-out both; }

  .inputGlow{ box-shadow: 0 0 0 1px rgba(56,189,248,.08) inset; transition: box-shadow .25s ease, background .25s ease; }
  .inputGlow:focus-within{ box-shadow: 0 0 0 2px rgba(56,189,248,.22) inset, 0 0 0 1px rgba(56,189,248,.18); background: rgba(255,255,255,.06); }

  .chatScroll::-webkit-scrollbar{ width: 10px; }
  .chatScroll::-webkit-scrollbar-thumb{ background: rgba(255,255,255,.12); border-radius: 999px; border: 2px solid rgba(0,0,0,0); background-clip: padding-box; }
  .chatScroll::-webkit-scrollbar-track{ background: transparent; }
`;