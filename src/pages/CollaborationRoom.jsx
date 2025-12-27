// src/pages/CollaborationRoom.jsx
import React, { useMemo, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";

/* ---------- Professional Icons (same as Dashboard) ---------- */
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

const IconWrap = ({ children }) => (
  <span className="w-9 h-9 rounded-xl bg-slate-800/80 text-slate-100 flex items-center justify-center">
    {children}
  </span>
);

const NavItem = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
      active
        ? "bg-slate-800 text-slate-50 font-semibold"
        : "text-slate-200/90 hover:bg-slate-800/60"
    }`}
  >
    <IconWrap>{icon}</IconWrap>
    <span>{label}</span>
  </button>
);

/* ---------- Room Helpers ---------- */
const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200 text-sm">
    {children}
  </span>
);
const Dot = ({ className = "" }) => (
  <span className={`inline-block w-2.5 h-2.5 rounded-full ${className}`} />
);
const Avatar = ({ name = "U", color = "bg-slate-700" }) => {
  const initial = (name?.trim()?.[0] || "U").toUpperCase();
  return (
    <div className={`w-10 h-10 rounded-full grid place-items-center ${color} text-white font-semibold`}>
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
const SendIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
  </svg>
);

export default function CollaborationRoom() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Sidebar toggle (same behavior as Dashboard)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const displayName = user?.name || user?.email || "Guest";
  const initials = displayName
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const files = useMemo(
    () => [
      { id: "app", name: "App.js", path: "src > App.js" },
      { id: "header", name: "Header.js", path: "src > Header.js" },
      { id: "utils", name: "utils.js", path: "src > utils.js" },
    ],
    []
  );

  const users = useMemo(
    () => [
      { id: "ava", name: "Ava", color: "bg-slate-700" },
      { id: "james", name: "James", color: "bg-sky-700" },
      { id: "sarah", name: "Sarah", color: "bg-amber-700" },
    ],
    []
  );

  const [activeFile, setActiveFile] = useState(files[0]);
  const [connected] = useState(true);

  const [codeText, setCodeText] = useState(
`function() {
  return (Header()

  return anApp=(
    <Header>
      <h1>"Hello, world!'):

  })
}`
  );

  const [messages, setMessages] = useState([
    { id: 1, name: "Ava", time: "10:12", text: "I’ve added the Header component." },
    { id: 2, name: "James", time: "10:14", text: "Looks great, Ava!" },
    { id: 3, name: "Sarah", time: "10:16", text: "Should we start on the feature now?" },
  ]);

  const [msg, setMsg] = useState("");

  const onSend = () => {
    const t = msg.trim();
    if (!t) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    setMessages((prev) => [...prev, { id: Date.now(), name: "You", time: `${hh}:${mm}`, text: t }]);
    setMsg("");
  };

  return (
    <div className="min-h-screen bg-[#06162a] text-slate-100">
      {/* ✅ Dark glow background (same as first theme) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] bg-sky-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] bg-indigo-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-[35%] left-[35%] w-[420px] h-[420px] bg-cyan-500/5 blur-[140px] rounded-full" />
      </div>

      <div className="relative flex">
        {/* ✅ Sidebar EXACT like Dashboard */}
        <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : "sidebarClosed"}`}>
          <div className="flex items-center gap-3 px-2 mb-8">
            <img src={logo} alt="DevSphere" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="text-xl font-semibold">
              Dev<span className="text-cyan-300">Sphere</span>
            </span>
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem
              active={location.pathname === "/dashboard"}
              icon={<DashboardIcon />}
              label="Dashboard"
              onClick={() => navigate("/dashboard")}
            />
            <NavItem
              active={location.pathname === "/portfolio"}
              icon={<PortfolioIcon />}
              label="Build portfolio"
              onClick={() => navigate("/portfolio")}
            />
            <NavItem
              active={location.pathname === "/collaboration"}
              icon={<CollabIcon />}
              label="Collab rooms"
              onClick={() => navigate("/collaboration")}
            />
            <NavItem
              active={location.pathname === "/showcase"}
              icon={<ShowcaseIcon />}
              label="Showcase feed"
              onClick={() => navigate("/showcase")}
            />
            <NavItem
              active={location.pathname === "/notifications"}
              icon={<BellIcon />}
              label="Notifications"
              onClick={() => navigate("/notifications")}
            />
            <NavItem
              active={location.pathname === "/calendar"}
              icon={<CalendarIcon />}
              label="Calendar"
              onClick={() => navigate("/calendar")}
            />
            <NavItem
              active={location.pathname === "/settings"}
              icon={<SettingsIcon />}
              label="Settings"
              onClick={() => navigate("/settings")}
            />
          </nav>

          <div className="mt-6 flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold">
              {initials || "U"}
            </div>
            <div>
              <p className="text-sm font-medium truncate max-w-[140px]">{displayName}</p>
              <p className="text-xs text-slate-300">Signed in</p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-5 md:p-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-start gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="mt-1 w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition flex items-center justify-center"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                {sidebarOpen ? "⟨⟨" : "⟩⟩"}
              </button>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Collaboration Room</h1>
                <p className="text-slate-400 text-sm mt-1">
                  Live collaboration workspace (files, editor & chat)
                </p>
              </div>
            </div>

            <Pill>
              <Dot className={connected ? "bg-sky-400" : "bg-rose-400"} />
              <span className="text-slate-200">{connected ? "Connected" : "Disconnected"}</span>
            </Pill>
          </div>

          {/* Main Glass Container */}
          <div className="rounded-[28px] bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-5 md:p-6">
              <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_340px] gap-5">
                {/* LEFT */}
                <aside className="space-y-5">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-lg font-semibold mb-3">Files</div>
                    <div className="space-y-2">
                      {files.map((f) => {
                        const active = f.id === activeFile.id;
                        return (
                          <button
                            key={f.id}
                            onClick={() => setActiveFile(f)}
                            className={[
                              "w-full flex items-center gap-3 px-3 py-2 rounded-xl border transition text-left",
                              active
                                ? "bg-white/10 border-white/15"
                                : "bg-white/0 border-white/10 hover:bg-white/5",
                            ].join(" ")}
                          >
                            <span className="text-slate-200">
                              <MiniFileIcon />
                            </span>
                            <span className="text-slate-100">{f.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-lg font-semibold mb-3">Active users</div>

                    <div className="flex items-center gap-2 mb-4">
                      <Avatar name="A" color="bg-slate-700" />
                      <Avatar name="J" color="bg-sky-700" />
                      <div className="w-10 h-10 rounded-full grid place-items-center bg-amber-700 text-white font-semibold">
                        5
                      </div>
                    </div>

                    <div className="space-y-3">
                      {users.map((u) => (
                        <div key={u.id} className="flex items-center gap-3">
                          <Avatar name={u.name} color={u.color} />
                          <div className="text-slate-100">{u.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* CENTER */}
                <section className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <div className="text-slate-300 text-sm">{activeFile.path}</div>
                    <Pill>
                      <Dot className={connected ? "bg-sky-400" : "bg-rose-400"} />
                      <span className="text-slate-200">{connected ? "Connected" : "Disconnected"}</span>
                    </Pill>
                  </div>

                  <div className="p-4">
                    <div className="rounded-2xl bg-[#071a31] border border-white/10 overflow-hidden">
                      <div className="grid grid-cols-[48px_1fr]">
                        <div className="py-4 px-3 text-right text-slate-500 font-mono text-sm border-r border-white/10 select-none">
                          {Array.from({ length: 18 }).map((_, i) => (
                            <div key={i} className="leading-6">{i + 1}</div>
                          ))}
                        </div>

                        <textarea
                          value={codeText}
                          onChange={(e) => setCodeText(e.target.value)}
                          spellCheck={false}
                          className="w-full min-h-[520px] p-4 bg-transparent text-slate-100 font-mono text-sm leading-6 outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                        <input
                          className="flex-1 bg-transparent outline-none text-slate-200 placeholder:text-slate-500"
                          placeholder="Type a message..."
                          value={msg}
                          onChange={(e) => setMsg(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && onSend()}
                        />
                        <button
                          onClick={onSend}
                          className="w-10 h-10 rounded-xl grid place-items-center bg-sky-500/15 border border-sky-400/30 hover:bg-sky-500/25 transition"
                          title="Send"
                        >
                          <SendIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* RIGHT */}
                <section className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b border-white/10">
                    <div className="text-xl font-semibold">Chat</div>
                  </div>

                  <div className="p-4 space-y-4 flex-1 overflow-auto">
                    {messages.map((m) => (
                      <div key={m.id} className="flex items-start gap-3">
                        <Avatar
                          name={m.name}
                          color={
                            m.name === "Ava"
                              ? "bg-slate-700"
                              : m.name === "James"
                              ? "bg-sky-700"
                              : m.name === "Sarah"
                              ? "bg-amber-700"
                              : "bg-emerald-700"
                          }
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold">{m.name}</div>
                            <div className="text-xs text-slate-400">{m.time}</div>
                          </div>
                          <div className="text-slate-300 text-sm mt-1 leading-5">{m.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                      <input
                        className="flex-1 bg-transparent outline-none text-slate-200 placeholder:text-slate-500"
                        placeholder="Type a message..."
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSend()}
                      />
                      <button
                        onClick={onSend}
                        className="w-10 h-10 rounded-xl grid place-items-center bg-sky-500/15 border border-sky-400/30 hover:bg-sky-500/25 transition"
                        title="Send"
                      >
                        <SendIcon />
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="h-6" />
        </main>
      </div>

      {/* ✅ Sidebar show/hide styles (same as Dashboard) */}
      <style>{`
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
      `}</style>
    </div>
  );
}