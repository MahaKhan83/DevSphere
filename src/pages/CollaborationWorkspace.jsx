// src/pages/CollaborationWorkspace.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";

/* ================= SOCKET (frontend only) =================
   NOTE: Without backend, socket won't actually deliver.
   We keep it safe + also keep local UI working.
=========================================================== */
const socket = io("http://localhost:5000", { autoConnect: false });

/* ================= Dashboard-style Icons (SVG) ================= */
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
const UserRolesIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11Zm-8 0c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11Zm0 2c-2.67 0-8 1.34-8 4v1h12v-1c0-2.66-5.33-4-8-4Zm8 0c-.33 0-.71.02-1.12.06 1.12.82 1.92 1.94 1.92 3.44v1H24v-1c0-2.66-5.33-4-8-4Z" />
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

/* Workspace Tab Icons */
const TabChatIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h16v11a3 3 0 0 1-3 3H9l-5 4v-4H7a3 3 0 0 1-3-3V4Z" />
  </svg>
);
const TabCodeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.4 16.6 3.8 12l5.6-4.6L8 5.7 1 12l7 6.3 1.4-1.7Zm5.2 0L20.2 12l-5.6-4.6L16 5.7 23 12l-7 6.3-1.4-1.7Z" />
  </svg>
);
const TabFilesIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h-8l-2-4Z" />
  </svg>
);
const TabTasksIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 11 7.5 9.5 6 11l3 3 9-9-1.5-1.5L9 11Z" />
    <path d="M4 4h16v16H4V4Zm2 2v12h12V6H6Z" />
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
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 16H6L5 6" />
  </svg>
);

/* ================= UI helpers (Dashboard-style) ================= */
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

const TabBtn = ({ active, icon, label, dot, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-extrabold transition ${
      active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
    }`}
  >
    {icon}
    {label}
    {dot ? <span className="ml-1 w-2 h-2 rounded-full bg-sky-500" /> : null}
  </button>
);

const formatElapsed = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
};

export default function CollaborationWorkspace() {
  const { user } = useContext(AuthContext);
  const { roomCode } = useParams();
  const navigate = useNavigate();

  /* ---------------- Sidebar ---------------- */
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const displayName = user?.name || user?.email || "Guest";
  const initials = displayName
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const isOnline = true;
  const [unreadCount] = useState(3);

  /* ---------------- Meeting timer ---------------- */
  const [startTime] = useState(Date.now());
  const [elapsedMs, setElapsedMs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsedMs(Date.now() - startTime), 1000);
    return () => clearInterval(t);
  }, [startTime]);

  const meetingTime = useMemo(() => formatElapsed(elapsedMs), [elapsedMs]);

  /* ---------------- Leave screen ---------------- */
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [endedDuration, setEndedDuration] = useState("0m 00s");

  /* ---------------- Tabs ---------------- */
  const [tab, setTab] = useState("chat"); // chat | editor | files | tasks
  const [hasNewMsg, setHasNewMsg] = useState(false);

  /* ---------------- Members (demo) ---------------- */
  const [members] = useState(() => [
    { id: "m1", name: displayName, role: "You", online: true },
    { id: "m2", name: "Maha", role: "Developer", online: true },
    { id: "m3", name: "Ali", role: "Reviewer", online: true },
  ]);

  /* ---------------- Chat ---------------- */
  const [messages, setMessages] = useState(() => [
    { id: `sys_${Date.now()}`, by: "System", text: `You joined room ${roomCode}`, time: new Date().toLocaleTimeString() },
  ]);
  const [msg, setMsg] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const chatEndRef = useRef(null);

  /* ---------------- Editor (Monaco) ---------------- */
  const storageKey = `devsphere_room_${roomCode}_code`;
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(() => localStorage.getItem(storageKey) || `// DevSphere Collaboration Workspace\n// Room: ${roomCode}\n\nconsole.log("Hello DevSphere!");\n`);

  /* ---------------- Files ---------------- */
  const [files, setFiles] = useState([]);
  const fileRef = useRef(null);

  /* ---------------- Tasks (NEW) ---------------- */
  const tasksKey = `devsphere_room_${roomCode}_tasks`;
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem(tasksKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [taskTitle, setTaskTitle] = useState("");
  const [taskAssignee, setTaskAssignee] = useState(displayName);
  const [taskDue, setTaskDue] = useState(""); // string for demo

  useEffect(() => {
    localStorage.setItem(tasksKey, JSON.stringify(tasks));
  }, [tasks, tasksKey]);

  /* ---------------- Socket lifecycle ---------------- */
  useEffect(() => {
    // Connect safely (frontend-only setup)
    try {
      socket.connect();
      socket.emit("join-room", { roomCode, user: displayName });

      socket.on("chat-message", (data) => {
        setMessages((p) => [...p, { ...data, id: data?.id || `srv_${Date.now()}` }]);
        if (tab !== "chat") setHasNewMsg(true);
      });

      socket.on("typing", (name) => setTypingUser(name));
      socket.on("stop-typing", () => setTypingUser(null));
    } catch {
      // ignore
    }

    return () => {
      try {
        socket.off("chat-message");
        socket.off("typing");
        socket.off("stop-typing");
        socket.disconnect();
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, displayName, tab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, tab]);

  /* ---------------- Chat actions ---------------- */
  const sendMessage = () => {
    const t = msg.trim();
    if (!t) return;

    const payload = {
      id: `c_${Date.now()}`,
      roomCode,
      by: displayName,
      text: t,
      time: new Date().toLocaleTimeString(),
    };

    // 1) Local push so UI always works (even without backend)
    setMessages((p) => [...p, payload]);

    // 2) Try emit (works when backend exists)
    try {
      socket.emit("chat-message", payload);
      socket.emit("stop-typing", roomCode);
    } catch {
      // ignore
    }

    setMsg("");
  };

  const deleteMessage = (id) => {
    setMessages((p) => p.filter((m) => m.id !== id));
    // If you want synced delete later: emit "delete-message" with backend
  };

  /* ---------------- Editor actions ---------------- */
  const saveCode = () => {
    localStorage.setItem(storageKey, code);
    setMessages((p) => [
      ...p,
      { id: `sys_${Date.now()}`, by: "System", text: `${displayName} saved the code.`, time: new Date().toLocaleTimeString() },
    ]);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setMessages((p) => [
        ...p,
        { id: `sys_${Date.now()}`, by: "System", text: `${displayName} copied the code.`, time: new Date().toLocaleTimeString() },
      ]);
    } catch {
      // ignore
    }
  };

  /* ---------------- File actions ---------------- */
  const uploadFiles = (list) => {
    const arr = Array.from(list || []);
    if (arr.length === 0) return;

    const mapped = arr.map((f) => ({
      id: `f_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      size: (f.size / 1024).toFixed(1),
      url: URL.createObjectURL(f),
      by: displayName,
      time: new Date().toLocaleTimeString(),
    }));

    setFiles((p) => [...mapped, ...p]);
    setTab("files");

    setMessages((p) => [
      ...p,
      { id: `sys_${Date.now()}`, by: "System", text: `${displayName} uploaded ${mapped.length} file(s).`, time: new Date().toLocaleTimeString() },
    ]);

    if (fileRef.current) fileRef.current.value = "";
  };

  const removeFile = (id) => {
    setFiles((p) => {
      const f = p.find((x) => x.id === id);
      if (f?.url) URL.revokeObjectURL(f.url);
      return p.filter((x) => x.id !== id);
    });
  };

  /* ---------------- Task actions (NEW) ---------------- */
  const addTask = () => {
    const title = taskTitle.trim();
    if (!title) return;

    const t = {
      id: `t_${Date.now()}`,
      title,
      assignedTo: taskAssignee || "Unassigned",
      due: taskDue || "No due date",
      status: "open", // open | done
      createdBy: displayName,
      time: new Date().toLocaleTimeString(),
    };

    setTasks((p) => [t, ...p]);
    setTaskTitle("");
    setTaskDue("");

    setMessages((p) => [
      ...p,
      { id: `sys_${Date.now()}`, by: "System", text: `Task created: "${title}" → ${t.assignedTo}`, time: new Date().toLocaleTimeString() },
    ]);
  };

  const toggleTask = (id) => {
    setTasks((p) =>
      p.map((t) => (t.id === id ? { ...t, status: t.status === "done" ? "open" : "done" } : t))
    );
  };

  const deleteTask = (id) => setTasks((p) => p.filter((t) => t.id !== id));

  /* ---------------- Leave room ---------------- */
  const leaveRoom = () => {
    const duration = formatElapsed(Date.now() - startTime);
    setEndedDuration(duration);
    setMeetingEnded(true);

    // Optional: emit leave later with backend
    try {
      socket.emit("leave-room", { roomCode, user: displayName });
    } catch {
      // ignore
    }

    // After showing end screen, navigate
    setTimeout(() => {
      navigate("/collaboration");
    }, 1600);
  };

  // Meeting end screen
  if (meetingEnded) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
        <div className="cardShell p-8 w-full max-w-lg text-center animate-pageIn">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-extrabold">
            DS
          </div>
          <h1 className="mt-5 text-2xl font-extrabold text-slate-900">Meeting ended</h1>
          <p className="mt-2 text-sm text-slate-700">
            Room <span className="font-extrabold">{roomCode}</span> ended.
          </p>
          <p className="mt-1 text-sm text-slate-700">
            Duration: <span className="font-extrabold">{endedDuration}</span>
          </p>
          <p className="mt-4 text-xs text-slate-600">Redirecting to Collaboration Lobby…</p>

          <style>{sharedStyles}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex">
        {/* SIDEBAR (Dashboard exact style) */}
        <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-2 mb-8 text-left"
            title="Go to Landing"
          >
            <img src={logo} alt="DevSphere" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="text-xl font-semibold">
              Dev<span className="text-cyan-300">Sphere</span>
            </span>
          </button>

          <nav className="flex-1 space-y-2">
            <NavItem active={false} icon={<DashboardIcon />} label="Dashboard" onClick={() => navigate("/dashboard")} />
            <NavItem active={false} icon={<PortfolioIcon />} label="Build portfolio" onClick={() => navigate("/portfolio")} />
            <NavItem active={true} icon={<CollabIcon />} label="Collab rooms" onClick={() => navigate("/collaboration")} />
            <NavItem active={false} icon={<ShowcaseIcon />} label="Showcase feed" onClick={() => navigate("/showcase")} />
            <NavItem active={false} icon={<UserRolesIcon />} label="User roles" onClick={() => navigate("/roles")} />
            <NavItem
              active={false}
              icon={<BellIcon />}
              label="Notifications"
              badge={unreadCount > 0 ? unreadCount : null}
              onClick={() => navigate("/notifications")}
            />
            <NavItem active={false} icon={<SettingsIcon />} label="Settings" onClick={() => navigate("/settings")} />
          </nav>

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
              <p className="text-xs text-slate-300 truncate max-w-[160px]">
                {isOnline ? "Online" : "Offline"} · Signed in
              </p>
            </div>
          </button>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 md:p-8 space-y-6 animate-pageIn">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div className="animate-titleIn">
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Workspace</h1>
                <p className="text-sm text-slate-700">
                  Room: <span className="font-extrabold">{roomCode}</span> · Time:{" "}
                  <span className="font-extrabold">{meetingTime}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/collaboration")}
                className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-800 font-extrabold text-sm hover:bg-slate-50 transition"
              >
                Back to Lobby
              </button>
              <button
                onClick={leaveRoom}
                className="px-4 py-2 rounded-full bg-rose-500 text-white font-extrabold text-sm hover:bg-rose-400 transition"
              >
                Leave room
              </button>
            </div>
          </div>

          {/* Tabs */}
          <section className="cardShell p-4 animate-cardIn delay-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Workspace tools</h2>
                <p className="text-xs text-slate-700">Chat, editor, files & task assignment</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <TabBtn
                  active={tab === "chat"}
                  icon={<TabChatIcon />}
                  label="Chat"
                  dot={hasNewMsg}
                  onClick={() => {
                    setTab("chat");
                    setHasNewMsg(false);
                  }}
                />
                <TabBtn active={tab === "editor"} icon={<TabCodeIcon />} label="Editor" onClick={() => setTab("editor")} />
                <TabBtn active={tab === "files"} icon={<TabFilesIcon />} label="Files" onClick={() => setTab("files")} />
                <TabBtn active={tab === "tasks"} icon={<TabTasksIcon />} label="Tasks" onClick={() => setTab("tasks")} />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Members */}
            <section className="cardShell p-5 animate-cardIn delay-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900">Members</h3>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-800">
                  {members.length} online
                </span>
              </div>

              <div className="space-y-3">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/70 px-3 py-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-extrabold">
                          {(m.name || "U").slice(0, 1).toUpperCase()}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                            m.online ? "bg-emerald-400" : "bg-slate-400"
                          }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-slate-900 truncate">{m.name}</p>
                        <p className="text-xs text-slate-600">{m.role}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-extrabold px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      {m.online ? "Online" : "Offline"}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Main */}
            <section className="xl:col-span-2 cardShell p-5 animate-cardIn delay-3 min-h-[520px]">
              {/* CHAT */}
              {tab === "chat" ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">Room chat</h3>
                    <span className="text-xs text-slate-600">{messages.length} message(s)</span>
                  </div>

                  <div className="chatBox">
                    {messages.map((m) => (
                      <div key={m.id} className={`chatRow ${m.by === displayName ? "chatMe" : "chatOther"}`}>
                        <div className="chatBubble">
                          <div className="chatMeta">
                            <span className="chatBy">{m.by}</span>
                            <span className="chatTime">{m.time || ""}</span>
                          </div>
                          <div className="chatText">{m.text}</div>

                          {m.by === displayName && !String(m.id).startsWith("sys_") ? (
                            <button
                              onClick={() => deleteMessage(m.id)}
                              className="mt-2 inline-flex items-center gap-2 text-xs font-extrabold text-rose-600 hover:text-rose-500"
                              title="Delete message (local)"
                            >
                              <TrashIcon /> Delete
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}

                    {typingUser ? <p className="text-xs text-slate-500 mt-2">{typingUser} is typing…</p> : null}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <input
                      value={msg}
                      onChange={(e) => {
                        setMsg(e.target.value);
                        try {
                          socket.emit("typing", displayName);
                        } catch {
                          // ignore
                        }
                      }}
                      onBlur={() => {
                        try {
                          socket.emit("stop-typing", roomCode);
                        } catch {
                          // ignore
                        }
                      }}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type message and press Enter…"
                      className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
                    />
                    <button onClick={sendMessage} className="sendBtn">
                      Send
                    </button>
                  </div>
                </>
              ) : null}

              {/* EDITOR */}
              {tab === "editor" ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Monaco editor</h3>
                      <p className="text-xs text-slate-700">Local save/copy — realtime sync later with backend</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-slate-800 outline-none"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="json">JSON</option>
                        <option value="python">Python</option>
                      </select>

                      <button onClick={copyCode} className="toolBtn">
                        <CopyIcon /> Copy
                      </button>
                      <button onClick={saveCode} className="toolBtn">
                        <SaveIcon /> Save
                      </button>
                    </div>
                  </div>

                  <div className="editorWrap">
                    <Editor
                      height="420px"
                      theme="vs-dark"
                      language={language}
                      value={code}
                      onChange={(v) => setCode(v ?? "")}
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        wordWrap: "on",
                        automaticLayout: true,
                        smoothScrolling: true,
                      }}
                    />
                  </div>
                </>
              ) : null}

              {/* FILES */}
              {tab === "files" ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">Files</h3>
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="text-xs px-3 py-1 rounded-full bg-sky-500 text-white hover:bg-sky-400 transition font-extrabold"
                    >
                      Upload
                    </button>
                  </div>

                  <input type="file" multiple hidden ref={fileRef} onChange={(e) => uploadFiles(e.target.files)} />

                  {files.length === 0 ? (
                    <div className="p-6 rounded-2xl border border-slate-200 bg-white/70">
                      <p className="text-sm font-extrabold text-slate-900">No files yet</p>
                      <p className="text-xs text-slate-700 mt-1">Upload files to share inside the room.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {files.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/70 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-extrabold text-slate-900 truncate">{f.name}</p>
                            <p className="text-xs text-slate-600">
                              {f.size} KB · by <b>{f.by}</b> · {f.time}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={f.url}
                              download={f.name}
                              className="text-xs px-3 py-1 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition font-extrabold"
                            >
                              Download
                            </a>
                            <button
                              onClick={() => removeFile(f.id)}
                              className="text-xs px-3 py-1 rounded-full bg-rose-500 text-white hover:bg-rose-400 transition font-extrabold"
                              title="Remove (local)"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : null}

              {/* TASKS (NEW) */}
              {tab === "tasks" ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Task assignment</h3>
                      <p className="text-xs text-slate-700">Assign tasks to room members (local demo)</p>
                    </div>
                    <span className="text-xs text-slate-600">{tasks.length} task(s)</span>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Task title (e.g., Fix sidebar issue)"
                        className="md:col-span-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
                      />
                      <select
                        value={taskAssignee}
                        onChange={(e) => setTaskAssignee(e.target.value)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-800 outline-none"
                      >
                        {members.map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                      <input
                        value={taskDue}
                        onChange={(e) => setTaskDue(e.target.value)}
                        placeholder="Due (e.g., Today 6pm)"
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-200"
                      />
                    </div>

                    <button onClick={addTask} className="mt-3 sendBtn w-full">
                      Add task
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {tasks.length === 0 ? (
                      <div className="p-6 rounded-2xl border border-slate-200 bg-white/70">
                        <p className="text-sm font-extrabold text-slate-900">No tasks yet</p>
                        <p className="text-xs text-slate-700 mt-1">Create a task to assign work in the room.</p>
                      </div>
                    ) : (
                      tasks.map((t) => (
                        <div
                          key={t.id}
                          className="rounded-2xl border border-slate-200 bg-white/70 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-extrabold text-slate-900 truncate">
                              {t.status === "done" ? "✅" : "🟦"} {t.title}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              Assigned to <b>{t.assignedTo}</b> · Due: <b>{t.due}</b> · Created by <b>{t.createdBy}</b>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleTask(t.id)}
                              className="text-xs px-3 py-1 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition font-extrabold"
                            >
                              {t.status === "done" ? "Mark open" : "Mark done"}
                            </button>
                            <button
                              onClick={() => deleteTask(t.id)}
                              className="text-xs px-3 py-1 rounded-full bg-rose-500 text-white hover:bg-rose-400 transition font-extrabold"
                              title="Delete task (local)"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : null}
            </section>
          </div>
        </main>
      </div>

      <style>{sharedStyles}</style>
    </>
  );
}

/* Shared styles (same vibe as Dashboard) */
const sharedStyles = `
  /* Sidebar show/hide */
  .sidebar{
    background: #0f172a;
    color: #f8fafc;
    display:flex;
    flex-direction:column;
    padding: 24px 16px;
    overflow:hidden;
    transition: width .25s ease, padding .25s ease, opacity .25s ease;
  }
  .sidebarOpen{ width: 288px; opacity:1; }
  .sidebarClosed{ width: 0px; padding: 24px 0px; opacity:0; }

  /* Cards */
  .cardShell{
    background: rgba(248,250,252,0.92);
    border-radius: 18px;
    border: 1px solid rgba(10, 24, 46, 0.65);
    box-shadow:
      0 10px 30px rgba(2,6,23,0.10),
      0 0 0 1px rgba(56,189,248,0.10);
    position: relative;
    overflow: hidden;
    transition: transform .25s ease, box-shadow .25s ease;
  }
  .cardShell::before{
    content:"";
    position:absolute;
    inset:-1px;
    border-radius: 18px;
    background: linear-gradient(120deg,
      rgba(10,24,46,0.95),
      rgba(56,189,248,0.40),
      rgba(10,24,46,0.95)
    );
    opacity: 0.32;
    filter: blur(10px);
    pointer-events:none;
  }
  .cardShell > * { position: relative; z-index: 1; }

  .cardShell:hover{
    transform: translateY(-3px);
    box-shadow:
      0 18px 45px rgba(2,6,23,0.14),
      0 0 22px rgba(56,189,248,0.22);
  }

  /* Chat */
  .chatBox{
    height:380px;overflow:auto;border-radius:18px;
    border:1px solid rgba(148,163,184,0.45);
    background:rgba(255,255,255,0.7);
    padding:12px;
  }
  .chatRow{display:flex;margin-bottom:10px;}
  .chatMe{justify-content:flex-end;}
  .chatOther{justify-content:flex-start;}
  .chatBubble{
    max-width:78%;
    border-radius:16px;
    padding:10px 12px;
    border:1px solid rgba(148,163,184,0.45);
    background:rgba(248,250,252,0.95);
  }
  .chatMe .chatBubble{
    background:rgba(14,165,233,0.12);
    border-color:rgba(14,165,233,0.28);
  }
  .chatMeta{display:flex;justify-content:space-between;gap:10px;margin-bottom:4px;}
  .chatBy{font-size:12px;font-weight:900;color:rgb(15,23,42);}
  .chatTime{font-size:11px;font-weight:800;color:rgb(100,116,139);}
  .chatText{font-size:13px;font-weight:700;color:rgb(15,23,42);white-space:pre-wrap;}

  /* Buttons */
  .sendBtn{
    padding:12px 16px;border-radius:999px;background:rgba(15,23,42,0.92);
    color:#fff;font-weight:900;font-size:13px;transition:transform .2s ease,filter .2s ease;
  }
  .sendBtn:hover{transform:translateY(-2px);filter:brightness(1.05);}

  .toolBtn{
    display:inline-flex;align-items:center;gap:8px;
    padding:10px 14px;border-radius:999px;
    background:rgba(15,23,42,0.92);color:#fff;
    font-weight:900;font-size:13px;
    transition:transform .2s ease,filter .2s ease;
  }
  .toolBtn:hover{transform:translateY(-2px);filter:brightness(1.05);}

  /* Editor shell */
  .editorWrap{
    border-radius:18px;overflow:hidden;border:1px solid rgba(148,163,184,0.45);
    background:rgba(15,23,42,0.95);
  }

  /* Animations */
  @keyframes pageIn{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
  .animate-pageIn{animation:pageIn .55s cubic-bezier(.2,.8,.2,1) both;}
  @keyframes titleIn{from{opacity:0;transform:translateX(-16px);}to{opacity:1;transform:translateX(0);}}
  .animate-titleIn{animation:titleIn .7s cubic-bezier(.2,.8,.2,1) both;}
  @keyframes cardIn{from{opacity:0;transform:translateY(14px) scale(.98);}to{opacity:1;transform:translateY(0) scale(1);}}
  .animate-cardIn{animation:cardIn .6s cubic-bezier(.2,.8,.2,1) both;}
  .delay-1{animation-delay:.08s}.delay-2{animation-delay:.16s}.delay-3{animation-delay:.24s}
`;