import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();

  // demo notification data (replace later with API)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "room",
      title: "Ali joined your room",
      desc: "Frontend Sprint — DS UI",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: 2,
      type: "message",
      title: "New message in API Integration Room",
      desc: "Click to open chat",
      time: "24 minutes ago",
      unread: true,
    },
    {
      id: 3,
      type: "portfolio",
      title: 'Your portfolio theme "Midnight Code" was updated',
      desc: "Theme customization saved",
      time: "1 hour ago",
      unread: false,
    },
    {
      id: 4,
      type: "like",
      title: "3 new likes on your project",
      desc: "Real-Time Collab Demo",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 5,
      type: "comment",
      title: "Sara Ahmed commented on your project DevSphere UI",
      desc: "Nice work! I like the real-time collab room layout.",
      time: "Yesterday",
      unread: true,
    },
  ]);

  const [filter, setFilter] = useState("all"); // all | unread
  const [settings, setSettings] = useState({
    emailAlerts: true,
    pushAlerts: true,
    onlyMentions: false,
  });

  const filtered = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => n.unread);
    return notifications;
  }, [filter, notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markOneRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  // optional: open the relevant module when user clicks "View"
  const openNotification = (n) => {
    markOneRead(n.id);

    if (n.type === "room" || n.type === "message") navigate("/collab-rooms");
    else if (n.type === "portfolio") navigate("/build-portfolio");
    else if (n.type === "like" || n.type === "comment")
      navigate("/showcase-feed");
  };

  const iconFor = (type) => {
    // using simple emoji so no icon library needed
    if (type === "room") return "👥";
    if (type === "message") return "💬";
    if (type === "portfolio") return "🎨";
    if (type === "like") return "❤️";
    if (type === "comment") return "💭";
    return "🔔";
  };

  const NavItem = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.08)",
        background: active ? "rgba(255,255,255,0.10)" : "transparent",
        color: "white",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 99,
          background: active ? "#7dd3fc" : "transparent",
          border: active ? "none" : "1px solid rgba(255,255,255,0.18)",
        }}
      />
      <span style={{ fontSize: 14, opacity: active ? 1 : 0.85 }}>{label}</span>
    </button>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        display: "flex",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
      }}
    >
      {/* LEFT SIDEBAR */}
      <aside
        style={{
          width: 260,
          background: "#1f3556",
          color: "white",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ padding: "8px 8px 14px 8px" }}>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: 0.2 }}>
            DS DevSphere
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <NavItem label="Dashboard" onClick={() => navigate("/dashboard")} />
          <NavItem
            label="Build portfolio"
            onClick={() => navigate("/build-portfolio")}
          />
          <NavItem
            label="Collab rooms"
            onClick={() => navigate("/collab-rooms")}
          />
          <NavItem
            label="Showcase feed"
            onClick={() => navigate("/showcase-feed")}
          />
          <NavItem label="Calendar" onClick={() => navigate("/calendar")} />
          <NavItem
            label="Notifications"
            active
            onClick={() => navigate("/notifications")}
          />
          <NavItem label="Settings" onClick={() => navigate("/settings")} />
        </div>

        <div style={{ marginTop: "auto", opacity: 0.7, fontSize: 12 }}>
          DevSphere • Notifications
        </div>
      </aside>

      {/* MAIN */}
      <main
        style={{
          flex: 1,
          padding: 24,
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* CENTER COLUMN */}
        <section>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 22, color: "#0f172a" }}>
                Notifications
              </h2>
              <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  height: 38,
                  padding: "0 10px",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  background: "white",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
              </select>

              <button
                onClick={markAllRead}
                style={{
                  height: 38,
                  padding: "0 12px",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  background: "white",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Mark all as read
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((n) => (
              <div
                key={n.id}
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  boxShadow: "0 1px 0 rgba(15,23,42,0.04)",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "#eff6ff",
                      border: "1px solid #dbeafe",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 18,
                    }}
                    title={n.type}
                  >
                    {iconFor(n.type)}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#0f172a",
                          fontSize: 14,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 520,
                        }}
                      >
                        {n.title}
                      </div>

                      {n.unread && (
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 99,
                            background: "#3b82f6",
                          }}
                        />
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        color: "#475569",
                        marginTop: 4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 520,
                      }}
                    >
                      {n.desc}
                    </div>

                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                      {n.time}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openNotification(n)}
                  style={{
                    height: 34,
                    padding: "0 12px",
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    background: "white",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#2563eb",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  View
                </button>
              </div>
            ))}

            {filtered.length === 0 && (
              <div
                style={{
                  padding: 18,
                  borderRadius: 14,
                  border: "1px dashed #cbd5e1",
                  background: "white",
                  color: "#475569",
                }}
              >
                No notifications in this filter.
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Settings card 1 */}
          <div
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: 14,
              boxShadow: "0 1px 0 rgba(15,23,42,0.04)",
            }}
          >
            <div style={{ fontWeight: 800, color: "#0f172a" }}>
              Notification settings
            </div>

            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              <SettingToggle
                label="Email alerts"
                checked={settings.emailAlerts}
                onChange={(v) => setSettings((p) => ({ ...p, emailAlerts: v }))}
              />
              <SettingToggle
                label="Push alerts"
                checked={settings.pushAlerts}
                onChange={(v) => setSettings((p) => ({ ...p, pushAlerts: v }))}
              />
              <SettingToggle
                label="Only @mentions"
                checked={settings.onlyMentions}
                onChange={(v) => setSettings((p) => ({ ...p, onlyMentions: v }))}
              />
            </div>
          </div>

          {/* Settings card 2 (like your screenshot duplicate card style) */}
          <div
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: 14,
              boxShadow: "0 1px 0 rgba(15,23,42,0.04)",
            }}
          >
            <div style={{ fontWeight: 800, color: "#0f172a" }}>
              Notification settings
            </div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              <SettingToggle
                label="Email alerts"
                checked={settings.emailAlerts}
                onChange={(v) => setSettings((p) => ({ ...p, emailAlerts: v }))}
              />
              <SettingToggle
                label="Push alerts"
                checked={settings.pushAlerts}
                onChange={(v) => setSettings((p) => ({ ...p, pushAlerts: v }))}
              />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

const SettingToggle = ({ label, checked, onChange }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: 13, color: "#334155", fontWeight: 700 }}>
        {label}
      </div>

      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 999,
          border: "1px solid #e2e8f0",
          background: checked ? "#2563eb" : "#e2e8f0",
          position: "relative",
          cursor: "pointer",
          padding: 0,
        }}
        aria-label={label}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            background: "white",
            position: "absolute",
            top: 2,
            left: checked ? 22 : 2,
            transition: "left 180ms ease",
            boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
          }}
        />
      </button>
    </div>
  );
};

export default Notifications;