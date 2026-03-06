// src/pages/CollaborationWorkspace.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import socket from "../sockets/socket"; // ✅ SINGLE socket instance

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

const SaveIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v5h8" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5" />
    <path d="M12 15V3" />
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
  <span className="w-9 h-9 rounded-xl bg-slate-800/80 text-slate-100 flex items-center justify-center">{children}</span>
);

const BadgePill = ({ children }) => (
  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-sky-500 text-white">{children}</span>
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
      active ? "bg-slate-900 text-white shadow" : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
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

/* ================= Soft-lock + cursor helpers ================= */
const COLOR_PALETTE = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#ef4444", "#06b6d4", "#eab308", "#14b8a6", "#8b5cf6", "#f43f5e", "#10b981", "#0ea5e9"];

const hashToIndex = (str = "", mod = COLOR_PALETTE.length) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % mod;
};

export default function CollaborationWorkspace() {
  const { user } = useContext(AuthContext);
  const { roomCode } = useParams();
  const navigate = useNavigate();

  /* ---------------- Sidebar ---------------- */
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* ---------------- Notifications-style mount animations ---------------- */
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

  // ✅ Notification Count
  const [unreadCount, setUnreadCount] = useState(0);
  const fetchRealNotificationCount = async () => {
    try {
      const response = await api.get("/notifications");
      const notifications = response.data.notifications || [];
      const totalUnread = notifications.filter((n) => !n.read).length;
      setUnreadCount(totalUnread);
    } catch (err) {
      console.warn("Could not fetch notification count:", err.message);
      setUnreadCount(0);
    }
  };

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
  const [hasNewCode, setHasNewCode] = useState(false);

  const tabRef = useRef(tab);
  useEffect(() => {
    tabRef.current = tab;
  }, [tab]);

  /* ---------------- Members ---------------- */
  const [members, setMembers] = useState([]);

  const myMember = useMemo(() => {
    const myId = String(user?._id || user?.id || "");
    return (
      members.find((m) => myId && String(m.userId || "") === myId) ||
      members.find((m) => String(m.name || "").trim().toLowerCase() === String(displayName || "").trim().toLowerCase()) ||
      null
    );
  }, [members, user, displayName]);

  const isOwner = !!myMember?.isOwner;

  /* ---------------- Chat ---------------- */
  const [messages, setMessages] = useState(() => [
    { id: `sys_${Date.now()}`, by: "System", text: `You joined room ${roomCode}`, time: new Date().toLocaleTimeString() },
  ]);
  const [msg, setMsg] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const chatEndRef = useRef(null);

  /* ---------------- Editor (Monaco) ---------------- */
  const jsKey = `devsphere_room_${roomCode}_code_js`;
  const htmlKey = `devsphere_room_${roomCode}_code_html`;
  const cssKey = `devsphere_room_${roomCode}_code_css`;

  const [language, setLanguage] = useState("javascript");

  const [jsCode, setJsCode] = useState(
    () => localStorage.getItem(jsKey) || `// DevSphere Collaboration Workspace\n// Room: ${roomCode}\n\nconsole.log("Hello DevSphere!");\n`
  );
  const [htmlCode, setHtmlCode] = useState(
    () =>
      localStorage.getItem(htmlKey) ||
      `<!doctype html>\n<html>\n  <body>\n    <div class="card">\n      <h1>Hello DevSphere</h1>\n      <p>Live Preview (HTML + CSS)</p>\n    </div>\n  </body>\n</html>\n`
  );
  const [cssCode, setCssCode] = useState(
    () => localStorage.getItem(cssKey) || `body{font-family:Arial;padding:16px;}\n.card{border:1px solid #ddd;border-radius:12px;padding:16px}\n`
  );

  useEffect(() => localStorage.setItem(jsKey, jsCode), [jsKey, jsCode]);
  useEffect(() => localStorage.setItem(htmlKey, htmlCode), [htmlKey, htmlCode]);
  useEffect(() => localStorage.setItem(cssKey, cssCode), [cssKey, cssCode]);

  const currentEditorValue = useMemo(() => {
    if (language === "html") return htmlCode;
    if (language === "css") return cssCode;
    return jsCode;
  }, [language, jsCode, htmlCode, cssCode]);

  const setCurrentEditorValue = (v) => {
    const next = v ?? "";
    if (language === "html") setHtmlCode(next);
    else if (language === "css") setCssCode(next);
    else setJsCode(next);
  };

  const previewDoc = useMemo(() => {
    const styleTag = `<style>${cssCode}</style>`;
    const raw = htmlCode || "";
    if (raw.includes("<head>")) return raw.replace("<head>", `<head>${styleTag}`);
    if (raw.includes("<html")) return `<!doctype html>${raw.replace("<body>", `<body>${styleTag}`)}`;
    return `<!doctype html><html><head>${styleTag}</head><body>${raw}</body></html>`;
  }, [htmlCode, cssCode]);

  const [output, setOutput] = useState("");

  /* ✅ Prevent loops + small debounce */
  const isRemoteUpdateRef = useRef(false);
  const sendTimerRef = useRef(null);

  // ✅ Load saved code from backend on room open
  const loadSavedCode = async () => {
    try {
      const res = await api.get(`/collaboration/code/${roomCode}`);
      const data = res?.data || null;
      if (!data) return;

      const js = data?.code?.jsCode ?? data?.js ?? "";
      const html = data?.code?.htmlCode ?? data?.html ?? "";
      const css = data?.code?.cssCode ?? data?.css ?? "";

      isRemoteUpdateRef.current = true;
      setJsCode(js);
      setHtmlCode(html);
      setCssCode(css);
      setTimeout(() => (isRemoteUpdateRef.current = false), 0);

      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `Saved code loaded for room ${roomCode}.`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      console.warn("Load saved code failed:", err?.message || err);
    }
  };

  const broadcastCode = (nextCode, nextLang = language) => {
    if (isRemoteUpdateRef.current) return;

    if (sendTimerRef.current) clearTimeout(sendTimerRef.current);
    sendTimerRef.current = setTimeout(() => {
      socket.emit("code-change", {
        roomCode,
        code: nextCode,
        language: nextLang,
        by: displayName,
        ts: Date.now(),
      });
    }, 120);
  };

  const runCode = () => {
    if (language !== "javascript" && language !== "typescript") {
      setOutput("Run only works for JavaScript / TypeScript right now.");
      return;
    }

    try {
      const logs = [];
      const originalLog = console.log;

      console.log = (...args) => {
        logs.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
      };

      new Function(jsCode)();

      console.log = originalLog;
      setOutput(logs.join("\n") || "No output (try console.log)");
    } catch (err) {
      setOutput("Error: " + (err?.message || "Unknown error"));
    }
  };

  // ✅ Save to DB
  const saveCode = async () => {
    try {
      await api.post(`/collaboration/code/${roomCode}`, {
        js: jsCode,
        html: htmlCode,
        css: cssCode,
        jsCode,
        htmlCode,
        cssCode,
        by: displayName,
      });

      socket.emit("editor-action", {
        roomCode,
        action: "save",
        by: displayName,
        language,
        ts: Date.now(),
      });

      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `${displayName} saved the code (stored in DB).`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `Save failed: ${err?.message || "Unknown error"}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  // ✅ Download ZIP
  const downloadZip = async () => {
    try {
      const res = await api.get(`/collaboration/code/${roomCode}/download`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `devsphere_${String(roomCode || "").toUpperCase()}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      socket.emit("editor-action", {
        roomCode,
        action: "download",
        by: displayName,
        language,
        ts: Date.now(),
      });

      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `ZIP downloaded (check Downloads): devsphere_${String(roomCode || "").toUpperCase()}.zip`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `Download failed: ${err?.message || "Unknown error"}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  /* ================= Soft Lock state ================= */
  const [lockState, setLockState] = useState({ lockedBy: null, lockedAt: null });
  const lockReleaseTimerRef = useRef(null);

  const myColorIndex = useMemo(() => hashToIndex(displayName), [displayName]);
  const myColor = COLOR_PALETTE[myColorIndex];

  const isLockedByOther = useMemo(() => {
    return !!lockState.lockedBy && lockState.lockedBy !== displayName;
  }, [lockState.lockedBy, displayName]);

  const requestLock = (lang) => {
    socket.emit("lock-request", { roomCode, language: lang });

    setLockState({ lockedBy: displayName, lockedAt: Date.now() });

    if (lockReleaseTimerRef.current) clearTimeout(lockReleaseTimerRef.current);
    lockReleaseTimerRef.current = setTimeout(() => {
      releaseLock(lang);
    }, 3000);
  };

  const releaseLock = (lang) => {
    if (lockReleaseTimerRef.current) clearTimeout(lockReleaseTimerRef.current);
    lockReleaseTimerRef.current = null;

    setLockState((prev) => {
      if (prev.lockedBy !== displayName) return prev;
      return { lockedBy: null, lockedAt: null };
    });

    socket.emit("lock-release", { roomCode, language: lang });
  };

  /* ================= Remote Cursors ================= */
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const cursorDecorationsRef = useRef(new Map());
  const remoteCursorPosRef = useRef(new Map());

  const ensureCursorStyles = () => {
    const id = "devsphere-remote-cursor-styles";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;

    const css = COLOR_PALETTE.map((c, i) => {
      return `
        .remoteCursor_${i} { border-left: 2px solid ${c}; }
        .remoteCursor_${i}::after{
          content: attr(data-name);
          position: absolute;
          transform: translateY(-110%);
          background: ${c};
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 999px;
          white-space: nowrap;
          box-shadow: 0 8px 18px rgba(0,0,0,.12);
        }
      `;
    }).join("\n");

    style.innerHTML = css;
    document.head.appendChild(style);
  };

  const applyRemoteCursor = (userName, lang, pos) => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    if (!pos?.lineNumber || !pos?.column) return;
    if (lang !== language) return;

    ensureCursorStyles();

    const idx = hashToIndex(userName);
    const className = `remoteCursor_${idx}`;
    const range = new monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column);

    const previousIds = cursorDecorationsRef.current.get(userName) || [];

    const newIds = editor.deltaDecorations(previousIds, [
      {
        range,
        options: {
          className: "",
          beforeContentClassName: className,
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          hoverMessage: [{ value: `**${userName}**` }],
        },
      },
    ]);

    cursorDecorationsRef.current.set(userName, newIds);

    setTimeout(() => {
      const nodes = document.querySelectorAll(`.${className}`);
      nodes.forEach((n) => n.setAttribute("data-name", userName));
    }, 0);
  };

  const sendCursorPosition = (lang) => {
    const editor = editorRef.current;
    if (!editor) return;

    const pos = editor.getPosition();
    if (!pos) return;

    socket.emit("cursor-change", {
      roomCode,
      language: lang,
      by: displayName,
      position: { lineNumber: pos.lineNumber, column: pos.column },
      ts: Date.now(),
    });
  };

  /* ---------------- Files (BACKEND + REALTIME) ---------------- */
  const [files, setFiles] = useState([]);
  const fileRef = useRef(null);

  const normFile = (v) => String(v || "").trim().toLowerCase();

  const isFileOwner = (f) => {
    const meId = user?._id ? String(user._id) : "";
    const uploaderId = f?.uploadedBy ? String(f.uploadedBy) : "";

    if (meId && uploaderId && meId === uploaderId) return true;
    return normFile(f?.by) === normFile(displayName);
  };

  const loadRoomFiles = async () => {
    try {
      const res = await api.get(`/collaboration/files/${roomCode}`);
      const list = res?.data?.files || [];
      setFiles(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Load files failed:", err?.message || err);
    }
  };

  const uploadFiles = async (fileList) => {
    const arr = Array.from(fileList || []);
    if (arr.length === 0) return;

    try {
      const form = new FormData();
      arr.forEach((f) => form.append("files", f));
      form.append("by", displayName);

      const res = await api.post(`/collaboration/files/${roomCode}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploaded = res?.data?.files || [];

      setFiles((prev) => {
        const prevIds = new Set(prev.map((x) => String(x.id)));
        return [...uploaded.filter((x) => !prevIds.has(String(x.id))), ...prev];
      });

      setTab("files");

      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `${displayName} uploaded ${uploaded.length} file(s).`,
          time: new Date().toLocaleTimeString(),
        },
      ]);

      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `Upload failed: ${err?.response?.data?.message || err?.message || "Unknown error"}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const removeFile = async (fileId) => {
    try {
      await api.delete(`/collaboration/files/${roomCode}/${fileId}`);
      setFiles((p) => p.filter((x) => String(x.id) !== String(fileId)));

      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `${displayName} removed a file.`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `Remove failed: ${err?.message || "Unknown error"}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  /* ---------------- Tasks (BACKEND + REALTIME) ---------------- */
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskAssignee, setTaskAssignee] = useState(displayName);
  const [taskDue, setTaskDue] = useState("");
  const [taskCreating, setTaskCreating] = useState(false);

  const loadRoomTasks = async () => {
    try {
      const res = await api.get(`/collaboration/tasks/${roomCode}`);
      const list = res?.data || [];
      setTasks(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn("Load tasks failed:", err?.message || err);
      setTasks([]);
    }
  };

  const norm = (v) => String(v || "").trim().toLowerCase();

  const samePersonLoose = (a, b) => {
    const A = norm(a);
    const B = norm(b);
    if (!A || !B) return false;

    if (A === B) return true;
    if (A.startsWith(B + " ")) return true;
    if (B.startsWith(A + " ")) return true;

    return false;
  };

  const meTask = {
    id: user?._id ? String(user._id) : "",
    name: user?.name || "",
    email: user?.email || "",
    display: displayName || "",
  };

  const isTaskOwner = (t) => {
    const creatorId = t?.createdBy?.userId ? String(t.createdBy.userId) : "";
    if (meTask.id && creatorId && meTask.id === creatorId) return true;

    const creatorName = t?.createdBy?.name || t?.createdByName || t?.createdBy || "";

    return (
      samePersonLoose(creatorName, meTask.name) ||
      samePersonLoose(creatorName, meTask.email) ||
      samePersonLoose(creatorName, meTask.display)
    );
  };

  const isTaskAssignee = (t) => {
    const assigneeId = t?.assignedTo?.userId ? String(t.assignedTo.userId) : "";
    if (meTask.id && assigneeId && meTask.id === assigneeId) return true;

    const assigneeName = t?.assignedTo?.name || t?.assignedTo || "";
    return (
      samePersonLoose(assigneeName, meTask.name) ||
      samePersonLoose(assigneeName, meTask.email) ||
      samePersonLoose(assigneeName, meTask.display)
    );
  };

  const canToggleTask = (t) => isTaskOwner(t) || isTaskAssignee(t);

  const toISOFromDatetimeLocal = (v) => {
    const s = String(v || "").trim();
    if (!s) return null;
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  };

  const addTask = async () => {
    const title = taskTitle.trim();
    if (!title) return;
    if (taskCreating) return;

    setTaskCreating(true);
    try {
      const payload = {
        title,
        assignedTo: taskAssignee ? { name: taskAssignee, userId: null } : { name: "", userId: null },
        dueDate: taskDue ? toISOFromDatetimeLocal(taskDue) : null,
      };

      const res = await api.post(`/collaboration/tasks/${roomCode}`, payload);
      const created = res?.data;

      if (created?._id) {
        setTasks((prev) => {
          const exists = prev.some((x) => String(x._id || x.id) === String(created._id));
          return exists ? prev : [created, ...prev];
        });
      }

      setTaskTitle("");
      setTaskDue("");

      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `Task created: "${title}" → ${taskAssignee || "Unassigned"}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `Task create failed: ${err?.response?.data?.message || err?.message || "Unknown error"}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setTaskCreating(false);
    }
  };

  const toggleTask = async (taskId) => {
    const target = tasks.find((t) => String(t._id || t.id) === String(taskId));
    if (!target) return;
    if (!canToggleTask(target)) return;

    const nextStatus = target.status === "done" ? "open" : "done";

    try {
      const res = await api.put(`/collaboration/tasks/${roomCode}/${taskId}`, {
        status: nextStatus,
      });

      const updated = res?.data || null;

      setTasks((prev) =>
        prev.map((t) => {
          if (String(t._id || t.id) !== String(taskId)) return t;
          return updated || { ...t, status: nextStatus };
        })
      );
    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `Task update failed: ${err?.response?.data?.message || err?.message || "Unknown error"}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const deleteTask = async (taskId) => {
    const target = tasks.find((t) => String(t._id || t.id) === String(taskId));
    if (!target) return;
    if (!isTaskOwner(target)) return;

    try {
      await api.delete(`/collaboration/tasks/${roomCode}/${taskId}`);

      setTasks((p) => p.filter((t) => String(t._id || t.id) !== String(taskId)));

      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `Task deleted.`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: `Task delete failed: ${err?.response?.data?.message || err?.message || "Unknown error"}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  useEffect(() => {
    fetchRealNotificationCount();
    loadSavedCode();
    loadRoomFiles();
    loadRoomTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeMember = (member) => {
    if (!member?.id) return;
    if (!isOwner) return;
    if (member.isOwner) return;

    const ok = window.confirm(`Remove ${member.name} from this room?`);
    if (!ok) return;

    socket.emit("remove-member", {
      roomCode,
      targetSocketId: member.id,
    });
  };

  /* ---------------- Socket lifecycle ---------------- */
  useEffect(() => {
    const onChatMessage = (data) => {
      const msgObj = { ...data, id: data?.id || `srv_${Date.now()}` };
      setMessages((p) => [...p, msgObj]);
      if (tabRef.current !== "chat") setHasNewMsg(true);
    };

    const onDeleteMessage = (payload) => {
      const messageId = payload?.messageId;
      if (!messageId) return;
      setMessages((p) => p.filter((m) => m.id !== messageId));
    };

    const onTyping = (name) => setTypingUser(name);
    const onStopTyping = () => setTypingUser(null);

    const onRoomMembers = (list) => {
      const myId = String(user?._id || user?.id || "");

      const mapped = (list || []).map((m) => {
        const sameMe =
          (myId && String(m.userId || "") === myId) ||
          String(m.name || "").trim().toLowerCase() === String(displayName || "").trim().toLowerCase();

        let roleLabel = m.isOwner ? "Owner" : "Member";
        if (sameMe && m.isOwner) roleLabel = "Owner (You)";
        else if (sameMe) roleLabel = "You";

        return {
          id: m.socketId,
          userId: m.userId || "",
          name: m.name,
          role: roleLabel,
          online: true,
          isOwner: !!m.isOwner,
        };
      });

      setMembers(mapped);
    };

    const onCodeChange = (payload) => {
      if (!payload) return;
      if (payload.roomCode !== roomCode) return;

      const lang = payload.language || "javascript";
      const incoming = typeof payload.code === "string" ? payload.code : "";

      isRemoteUpdateRef.current = true;

      if (lang === "html") setHtmlCode(incoming);
      else if (lang === "css") setCssCode(incoming);
      else setJsCode(incoming);

      setLanguage(lang);

      setTimeout(() => (isRemoteUpdateRef.current = false), 0);
      if (tabRef.current !== "editor") setHasNewCode(true);
    };

    const onLockState = (lock) => {
      if (!lock) {
        setLockState({ lockedBy: null, lockedAt: null });
        return;
      }
      setLockState({
        lockedBy: lock.holderName || null,
        lockedAt: lock.lastActive || Date.now(),
      });
    };

    const onCursorChange = (payload) => {
      if (!payload || payload.roomCode !== roomCode) return;

      const who = payload.name || payload.by;
      if (!who || who === displayName) return;

      const lang = payload.language || "javascript";
      const pos = payload.position;

      remoteCursorPosRef.current.set(who, { ...pos, lang });
      applyRemoteCursor(who, lang, pos);
    };

    const onEditorAction = (payload) => {
      if (!payload || payload.roomCode !== roomCode) return;
      if (payload.by === displayName) return;

      const action = payload.action || "action";
      const text =
        action === "save"
          ? `${payload.by} saved the code (DB).`
          : action === "download"
          ? `${payload.by} downloaded the ZIP.`
          : `${payload.by} did: ${action}`;

      setMessages((p) => [...p, { id: `sys_${Date.now()}`, by: "System", text, time: new Date().toLocaleTimeString() }]);
    };

    const onRemovedFromRoom = (payload) => {
      if (String(payload?.roomCode || "").toUpperCase() !== String(roomCode || "").toUpperCase()) return;

      setMessages((p) => [
        ...p,
        {
          id: `sys_${Date.now()}`,
          by: "System",
          text: payload?.message || "You were removed from the room.",
          time: new Date().toLocaleTimeString(),
        },
      ]);

      alert(payload?.message || "You were removed from the room.");
      navigate("/collaboration");
    };

    const onRemoveMemberError = (payload) => {
      if (String(payload?.roomCode || "").toUpperCase() !== String(roomCode || "").toUpperCase()) return;
      alert(payload?.message || "Could not remove member.");
    };

    const onRemoveMemberSuccess = (payload) => {
      if (String(payload?.roomCode || "").toUpperCase() !== String(roomCode || "").toUpperCase()) return;
    };

    // ✅ Files realtime
    const onFileUploaded = (payload) => {
      if (!payload || payload.roomCode !== roomCode) return;
      const f = payload.file;
      if (!f?.id) return;

      setFiles((prev) => {
        const exists = prev.some((x) => String(x.id) === String(f.id));
        if (exists) return prev;
        return [f, ...prev];
      });

      if (tabRef.current !== "files") {
        setMessages((p) => [
          ...p,
          {
            id: `sys_${Date.now()}`,
            by: "System",
            text: `${f.by || "Someone"} uploaded: ${f.name}`,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      }
    };

    const onFileDeleted = (payload) => {
      if (!payload || payload.roomCode !== roomCode) return;
      const id = payload.fileId;
      if (!id) return;
      setFiles((prev) => prev.filter((x) => String(x.id) !== String(id)));
    };

    // ✅ Tasks realtime
    const onTaskCreated = (task) => {
      if (!task) return;
      if (String(task.roomCode || "").toUpperCase() !== String(roomCode || "").toUpperCase()) return;

      setTasks((prev) => {
        const id = String(task._id || task.id || "");
        if (!id) return prev;
        const exists = prev.some((t) => String(t._id || t.id) === id);
        if (exists) return prev;
        return [task, ...prev];
      });

      if (tabRef.current !== "tasks") {
        setMessages((p) => [
          ...p,
          {
            id: `sys_${Date.now()}`,
            by: "System",
            text: `A new task was created: "${task.title || "Untitled"}"`,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      }
    };

    const onTaskUpdated = (task) => {
      if (!task) return;
      if (String(task.roomCode || "").toUpperCase() !== String(roomCode || "").toUpperCase()) return;

      const id = String(task._id || task.id || "");
      if (!id) return;

      setTasks((prev) => prev.map((t) => (String(t._id || t.id) === id ? task : t)));
    };

    const onTaskDeleted = (payload) => {
      const id = payload?.taskId || payload?.id;
      if (!id) return;
      setTasks((prev) => prev.filter((t) => String(t._id || t.id) !== String(id)));
    };

    const joinNow = () => {
      socket.emit("join-room", {
        roomCode,
        user: displayName,
        userId: user?._id || user?.id || "",
      });
    };

    if (!socket.connected) socket.connect();

    socket.off("connect", joinNow);
    socket.on("connect", joinNow);

    if (socket.connected) joinNow();

    socket.off("chat-message", onChatMessage);
    socket.off("delete-message", onDeleteMessage);
    socket.off("typing", onTyping);
    socket.off("stop-typing", onStopTyping);
    socket.off("room-members", onRoomMembers);
    socket.off("code-change", onCodeChange);

    socket.off("lock-state", onLockState);
    socket.off("cursor-change", onCursorChange);
    socket.off("editor-action", onEditorAction);

    socket.off("removed-from-room", onRemovedFromRoom);
    socket.off("remove-member:error", onRemoveMemberError);
    socket.off("remove-member:success", onRemoveMemberSuccess);

    socket.off("file-uploaded", onFileUploaded);
    socket.off("file-deleted", onFileDeleted);

    socket.off("task:created", onTaskCreated);
    socket.off("task:updated", onTaskUpdated);
    socket.off("task:deleted", onTaskDeleted);

    socket.on("chat-message", onChatMessage);
    socket.on("delete-message", onDeleteMessage);
    socket.on("typing", onTyping);
    socket.on("stop-typing", onStopTyping);
    socket.on("room-members", onRoomMembers);
    socket.on("code-change", onCodeChange);

    socket.on("lock-state", onLockState);
    socket.on("cursor-change", onCursorChange);
    socket.on("editor-action", onEditorAction);

    socket.on("removed-from-room", onRemovedFromRoom);
    socket.on("remove-member:error", onRemoveMemberError);
    socket.on("remove-member:success", onRemoveMemberSuccess);

    socket.on("file-uploaded", onFileUploaded);
    socket.on("file-deleted", onFileDeleted);

    socket.on("task:created", onTaskCreated);
    socket.on("task:updated", onTaskUpdated);
    socket.on("task:deleted", onTaskDeleted);

    return () => {
      socket.off("connect", joinNow);

      socket.off("chat-message", onChatMessage);
      socket.off("delete-message", onDeleteMessage);
      socket.off("typing", onTyping);
      socket.off("stop-typing", onStopTyping);
      socket.off("room-members", onRoomMembers);
      socket.off("code-change", onCodeChange);

      socket.off("lock-state", onLockState);
      socket.off("cursor-change", onCursorChange);
      socket.off("editor-action", onEditorAction);

      socket.off("removed-from-room", onRemovedFromRoom);
      socket.off("remove-member:error", onRemoveMemberError);
      socket.off("remove-member:success", onRemoveMemberSuccess);

      socket.off("file-uploaded", onFileUploaded);
      socket.off("file-deleted", onFileDeleted);

      socket.off("task:created", onTaskCreated);
      socket.off("task:updated", onTaskUpdated);
      socket.off("task:deleted", onTaskDeleted);

      socket.emit("leave-room", { roomCode, user: displayName });
    };
  }, [roomCode, displayName, language, navigate, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, tab]);

  useEffect(() => {
    const map = remoteCursorPosRef.current;
    for (const [name, v] of map.entries()) {
      if (v?.lang === language) applyRemoteCursor(name, v.lang, { lineNumber: v.lineNumber, column: v.column });
    }
  }, [language]);

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

    setMessages((p) => [...p, payload]);
    socket.emit("chat-message", payload);
    socket.emit("stop-typing", roomCode);
    setMsg("");
  };

  const deleteMessage = (id) => {
    setMessages((p) => p.filter((m) => m.id !== id));
    socket.emit("delete-message", { roomCode, messageId: id });
  };

  /* ---------------- Leave room ---------------- */
  const leaveRoom = () => {
    const duration = formatElapsed(Date.now() - startTime);
    setEndedDuration(duration);
    setMeetingEnded(true);

    socket.emit("leave-room", { roomCode, user: displayName });

    setTimeout(() => {
      navigate("/collaboration");
    }, 1600);
  };

  if (meetingEnded) {
    return (
      <>
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6 overflow-hidden">
          <div className="pointer-events-none fixed inset-0">
            <div className="sfBlob sfBlob1" />
            <div className="sfBlob sfBlob2" />
            <div className="sfShimmer" />
          </div>

          <div className={`w-full max-w-lg text-center relative ${mounted ? "sfIn" : "sfPre"}`}>
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 sfPulseBorder">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-extrabold shadow">
                DS
              </div>
              <h1 className="mt-5 text-2xl font-extrabold text-slate-900">Meeting ended</h1>
              <p className="mt-2 text-sm text-slate-700">
                Room <span className="font-extrabold">{roomCode}</span> ended.
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Duration: <span className="font-extrabold">{endedDuration}</span>
              </p>
              <p className="mt-4 text-xs text-slate-500">Redirecting to Collaboration Lobby…</p>
            </div>
          </div>
        </div>

        <style>{navyStyles}</style>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex overflow-hidden">
        <div className="pointer-events-none fixed inset-0">
          <div className="sfBlob sfBlob1" />
          <div className="sfBlob sfBlob2" />
          <div className="sfShimmer" />
        </div>

        <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
          <button onClick={() => navigate("/")} className="flex items-center gap-3 px-2 mb-8 text-left" title="Go to Landing">
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
              <p className="text-xs text-slate-300 truncate max-w-[160px]">{isOnline ? "Online" : "Offline"} · Signed in</p>
            </div>
          </button>
        </aside>

        <main className="flex-1 p-6 md:p-8 relative">
          <div className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6 ${mounted ? "sfIn" : "sfPre"}`}>
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center justify-center"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Workspace</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Room: <span className="font-semibold text-slate-700">{roomCode}</span> • Time:{" "}
                  <span className="font-semibold text-slate-700">{meetingTime}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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

              <button
                onClick={() => navigate("/collaboration")}
                className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                Back to Lobby
              </button>

              <button
                onClick={leaveRoom}
                className="px-4 py-2 rounded-full bg-rose-500 text-white text-sm font-semibold hover:bg-rose-400 transition shadow hover:-translate-y-[1px] active:translate-y-[1px]"
              >
                Leave room
              </button>
            </div>
          </div>

          <div className={`bg-white border border-slate-100 rounded-2xl shadow-sm p-4 md:p-5 mb-6 sfPulseBorder ${mounted ? "sfIn2" : "sfPre"}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Workspace tools</h2>
                <p className="text-xs text-slate-500 mt-1">Chat, editor, files & task assignment</p>
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
                <TabBtn
                  active={tab === "editor"}
                  icon={<TabCodeIcon />}
                  label="Editor"
                  dot={hasNewCode}
                  onClick={() => {
                    setTab("editor");
                    setHasNewCode(false);
                  }}
                />
                <TabBtn active={tab === "files"} icon={<TabFilesIcon />} label="Files" onClick={() => setTab("files")} />
                <TabBtn active={tab === "tasks"} icon={<TabTasksIcon />} label="Tasks" onClick={() => setTab("tasks")} />
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 xl:grid-cols-3 gap-6 ${mounted ? "sfIn3" : "sfPre"}`}>
            {/* Members */}
            <section className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sfPulseBorder">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900">Members</h3>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                  {members.length} online
                </span>
              </div>

              {members.length === 0 ? (
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600">Waiting for members...</div>
              ) : (
                <div className="space-y-3">
                  {members.map((m) => {
                    const canRemove = isOwner && !m.isOwner;

                    return (
                      <div key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 sfRow">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-extrabold shadow-sm">
                              {(m.name || "U").slice(0, 1).toUpperCase()}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-emerald-400" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{m.name}</p>
                            <p className="text-xs text-slate-500">{m.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                            Online
                          </span>

                          {canRemove ? (
                            <button
                              onClick={() => removeMember(m)}
                              className="text-xs px-3 py-1.5 rounded-full bg-rose-500 text-white hover:bg-rose-400 transition font-semibold shadow-sm hover:-translate-y-[1px] active:translate-y-[1px]"
                              title={`Remove ${m.name}`}
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Main panel */}
            <section className="xl:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sfPulseBorder min-h-[520px]">
              {/* CHAT */}
              {tab === "chat" ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">Room chat</h3>
                    <span className="text-xs text-slate-400">{messages.length} message(s)</span>
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
                              className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-500"
                              title="Delete for everyone"
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
                        socket.emit("typing", { roomCode, name: displayName });
                      }}
                      onBlur={() => {
                        socket.emit("stop-typing", roomCode);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type message and press Enter…"
                      className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/30 transition"
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
                      <p className="text-xs text-slate-500 mt-1">Soft-Lock (3s idle + blur) + colored cursors + Run JS + Live Preview</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={language}
                        onChange={(e) => {
                          const lang = e.target.value;
                          setLanguage(lang);

                          const codeToSend = lang === "html" ? htmlCode : lang === "css" ? cssCode : jsCode;

                          socket.emit("code-change", {
                            roomCode,
                            code: codeToSend,
                            language: lang,
                            by: displayName,
                            ts: Date.now(),
                          });

                          releaseLock(language);
                          setTimeout(() => sendCursorPosition(lang), 0);
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                      </select>

                      <button onClick={runCode} className="toolBtn" title="Run JS/TS">
                        ▶ Run
                      </button>

                      <button onClick={saveCode} className="toolBtn" title="Save to DB">
                        <SaveIcon /> Save
                      </button>

                      <button onClick={downloadZip} className="toolBtn" title="Download ZIP (index.html, style.css, script.js)">
                        <DownloadIcon /> Download
                      </button>
                    </div>
                  </div>

                  {/* LOCK banner */}
                  {lockState.lockedBy ? (
                    <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 truncate">
                          {isLockedByOther ? "Locked" : "You are editing"} •{" "}
                          <span className="font-black" style={{ color: isLockedByOther ? "#ef4444" : myColor }}>
                            {lockState.lockedBy}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">Auto unlock: after 3s idle OR when editor loses focus (blur)</p>
                      </div>

                      {!isLockedByOther ? (
                        <button
                          onClick={() => releaseLock(language)}
                          className="text-xs font-extrabold px-3 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-400 transition"
                        >
                          Release
                        </button>
                      ) : (
                        <span className="text-xs font-extrabold px-3 py-2 rounded-full bg-white border border-slate-200 text-slate-700">
                          Read-only
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="mb-3 text-xs text-slate-500">No lock • Multiple users can type, but soft-lock helps avoid clashes.</div>
                  )}

                  <div className="editorWrap relative">
                    {isLockedByOther ? (
                      <div className="absolute inset-0 z-[5] pointer-events-none">
                        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
                        <div className="absolute top-3 right-3 bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs font-extrabold text-slate-800 shadow">
                          Editing locked by {lockState.lockedBy}
                        </div>
                      </div>
                    ) : null}

                    <Editor
                      height="320px"
                      theme="vs-dark"
                      language={language}
                      value={currentEditorValue}
                      onMount={(editor, monaco) => {
                        editorRef.current = editor;
                        monacoRef.current = monaco;

                        editor.onDidChangeCursorPosition(() => {
                          sendCursorPosition(language);
                        });

                        editor.onDidBlurEditorText(() => {
                          releaseLock(language);
                        });

                        setTimeout(() => sendCursorPosition(language), 0);
                      }}
                      onChange={(v) => {
                        if (isLockedByOther) return;

                        requestLock(language);

                        const next = v ?? "";
                        setCurrentEditorValue(next);

                        broadcastCode(next, language);
                      }}
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        wordWrap: "on",
                        automaticLayout: true,
                        smoothScrolling: true,
                        readOnly: isLockedByOther,
                      }}
                    />
                  </div>

                  {/* Output */}
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-black text-green-400 p-3 text-sm font-mono h-32 overflow-auto">
                    <b>Output:</b>
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  </div>

                  {/* Preview */}
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-200 text-xs font-extrabold text-slate-700">Live Preview (HTML + CSS)</div>
                    <iframe
                      title="preview"
                      className="w-full h-[260px]"
                      sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin"
                      srcDoc={previewDoc}
                    />
                  </div>
                </>
              ) : null}

              {/* FILES */}
              {tab === "files" ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">Files</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={loadRoomFiles}
                        className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                        title="Refresh list"
                      >
                        Refresh
                      </button>
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition text-xs font-semibold shadow-sm hover:-translate-y-[1px] active:translate-y-[1px]"
                      >
                        Upload
                      </button>
                    </div>
                  </div>

                  <input type="file" multiple hidden ref={fileRef} onChange={(e) => uploadFiles(e.target.files)} />

                  {files.length === 0 ? (
                    <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50">
                      <p className="text-sm font-semibold text-slate-900">No files yet</p>
                      <p className="text-xs text-slate-500 mt-1">Upload files to share inside the room.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {files.map((f) => (
                        <div key={f.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 sfRow">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{f.name}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {((Number(f.size || 0) / 1024) || 0).toFixed(1)} KB · by <b className="text-slate-700">{f.by || "Unknown"}</b> ·{" "}
                              {f.time ? new Date(f.time).toLocaleString() : ""}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`http://localhost:5000${f.url}`}
                              download={f.name}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition font-semibold shadow-sm hover:-translate-y-[1px] active:translate-y-[1px]"
                            >
                              Download
                            </a>
                            {(() => {
                              const canRemove = isFileOwner(f);
                              return (
                                <button
                                  onClick={() => removeFile(f.id)}
                                  disabled={!canRemove}
                                  className={`text-xs px-3 py-1.5 rounded-full transition font-semibold shadow-sm hover:-translate-y-[1px] active:translate-y-[1px] ${
                                    canRemove ? "bg-rose-500 text-white hover:bg-rose-400" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                  }`}
                                  title={canRemove ? "Remove (uploader only)" : "🔒 Only uploader can remove"}
                                >
                                  Remove
                                </button>
                              );
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : null}

              {/* TASKS */}
              {tab === "tasks" ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Task assignment</h3>
                      <p className="text-xs text-slate-500 mt-1">Backend + DB + Realtime sync</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{tasks.length} task(s)</span>
                      <button
                        onClick={loadRoomTasks}
                        className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                        title="Refresh tasks"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Task title (e.g., Fix sidebar issue)"
                        className="md:col-span-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/30"
                      />
                      <select
                        value={taskAssignee}
                        onChange={(e) => setTaskAssignee(e.target.value)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none"
                      >
                        {(members.length ? members : [{ id: "me", name: displayName }]).map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="datetime-local"
                        value={taskDue}
                        onChange={(e) => setTaskDue(e.target.value)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/30"
                        title="Due date & time"
                      />
                    </div>

                    <button
                      onClick={addTask}
                      disabled={taskCreating || !taskTitle.trim()}
                      className={`mt-3 sendBtn w-full ${taskCreating || !taskTitle.trim() ? "opacity-60 cursor-not-allowed" : ""}`}
                      title={!taskTitle.trim() ? "Enter task title first" : "Create task"}
                    >
                      {taskCreating ? "Adding..." : "Add task"}
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {tasks.length === 0 ? (
                      <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50">
                        <p className="text-sm font-semibold text-slate-900">No tasks yet</p>
                        <p className="text-xs text-slate-500 mt-1">Create a task to assign work in the room.</p>
                      </div>
                    ) : (
                      tasks.map((t) => {
                        const id = t._id || t.id;
                        const assignedName = t?.assignedTo?.name || t?.assignedTo || "Unassigned";
                        const createdName = t?.createdBy?.name || t?.createdByName || t?.createdBy || "Unknown";
                        const due = t?.dueDate ? new Date(t.dueDate).toLocaleString() : "No due date";

                        const isOverdue = t?.dueDate && t.status !== "done" && new Date(t.dueDate).getTime() < Date.now();

                        const canDelete = isTaskOwner(t);

                        return (
                          <div
                            key={String(id)}
                            className="rounded-2xl border border-slate-200 bg-white p-4 sfRow flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${t.status === "done" ? "bg-emerald-400" : "bg-sky-400"}`} />
                                {t.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Assigned to <b className="text-slate-700">{assignedName}</b> · Due:{" "}
                                <b className={isOverdue ? "text-rose-600" : "text-slate-700"}>{isOverdue ? "OVERDUE" : due}</b> · Created by{" "}
                                <b className="text-slate-700">{createdName}</b>
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${
                                  t.status === "done" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-sky-50 text-sky-700 border-sky-200"
                                }`}
                                title="Task status"
                              >
                                {t.status === "done" ? "DONE" : "OPEN"}
                              </span>

                              <button
                                onClick={() => toggleTask(id)}
                                disabled={!canToggleTask(t)}
                                className={`text-xs px-3 py-1.5 rounded-full transition font-semibold shadow-sm hover:-translate-y-[1px] active:translate-y-[1px] ${
                                  canToggleTask(t) ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                }`}
                                title={canToggleTask(t) ? "Change task status" : "🔒 View only: Only creator or assignee can change"}
                              >
                                {t.status === "done" ? "Mark open" : "Mark done"}
                              </button>

                              <button
                                onClick={() => deleteTask(id)}
                                disabled={!canDelete}
                                className={`text-xs px-3 py-1.5 rounded-full transition font-semibold shadow-sm hover:-translate-y-[1px] active:translate-y-[1px] ${
                                  canDelete ? "bg-rose-500 text-white hover:bg-rose-400" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                }`}
                                title={canDelete ? "Delete task (creator only)" : "🔒 Only creator can delete"}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              ) : null}
            </section>
          </div>
        </main>
      </div>

      <style>{navyStyles}</style>
    </>
  );
}

/* =================== NAVY THEME =================== */
const navyStyles = `
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

  .sfPre{ opacity: 0; transform: translateY(12px); }
  .sfIn{ opacity: 1; transform: translateY(0); transition: all .6s cubic-bezier(.2,.8,.2,1); }
  .sfIn2{ opacity: 1; transform: translateY(0); transition: all .65s cubic-bezier(.2,.8,.2,1); transition-delay: .08s; }
  .sfIn3{ opacity: 1; transform: translateY(0); transition: all .7s cubic-bezier(.2,.8,.2,1); transition-delay: .12s; }

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

  .chatBox{
    height:380px;overflow:auto;border-radius:18px;
    border:1px solid rgba(226,232,240,0.95);
    background:rgba(248,250,252,0.75);
    padding:12px;
  }
  .chatRow{display:flex;margin-bottom:10px;}
  .chatMe{justify-content:flex-end;}
  .chatOther{justify-content:flex-start;}
  .chatBubble{
    max-width:78%;
    border-radius:16px;
    padding:10px 12px;
    border:1px solid rgba(226,232,240,0.95);
    background:rgba(255,255,255,0.92);
  }
  .chatMe .chatBubble{
    background:rgba(15,23,42,0.06);
    border-color:rgba(15,23,42,0.12);
  }
  .chatMeta{display:flex;justify-content:space-between;gap:10px;margin-bottom:4px;}
  .chatBy{font-size:12px;font-weight:800;color:rgb(15,23,42);}
  .chatTime{font-size:11px;font-weight:700;color:rgb(100,116,139);}
  .chatText{font-size:13px;font-weight:600;color:rgb(15,23,42);white-space:pre-wrap;}

  .sendBtn{
    padding:12px 16px;border-radius:999px;background:rgb(15,23,42);
    color:#fff;font-weight:800;font-size:13px;
    transition:transform .2s ease, filter .2s ease;
    box-shadow: 0 10px 24px rgba(2,6,23,0.12);
  }
  .sendBtn:hover{transform:translateY(-2px);filter:brightness(1.02);}
  .sendBtn:active{transform:translateY(0);}

  .toolBtn{
    display:inline-flex;align-items:center;gap:8px;
    padding:10px 14px;border-radius:999px;
    background:rgb(15,23,42);color:#fff;
    font-weight:800;font-size:13px;
    transition:transform .2s ease, filter .2s ease;
    box-shadow: 0 10px 24px rgba(2,6,23,0.10);
  }
  .toolBtn:hover{transform:translateY(-2px);filter:brightness(1.02);}
  .toolBtn:active{transform:translateY(0);}

  .editorWrap{
    border-radius:18px;overflow:hidden;border:1px solid rgba(226,232,240,0.60);
    background:rgba(15,23,42,0.98);
    box-shadow: 0 12px 28px rgba(2,6,23,0.12);
  }
`;