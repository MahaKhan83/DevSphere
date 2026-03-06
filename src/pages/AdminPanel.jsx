// src/pages/AdminPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const StatPill = ({ label, value, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col gap-0.5 text-left rounded-xl px-3 py-2 hover:bg-slate-100 cursor-pointer transition-colors"
  >
    <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
      {label}
    </span>
    <span className="text-lg font-extrabold text-slate-900">{value}</span>
  </button>
);

const ActionChip = ({ label, onClick, tone = "primary" }) => {
  const base =
    "inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer";

  const toneClass =
    tone === "danger"
      ? "border-rose-500/60 text-rose-700 bg-rose-50 hover:bg-rose-100"
      : tone === "neutral"
      ? "border-slate-400/70 text-slate-700 bg-slate-50 hover:bg-slate-100"
      : "border-sky-500/70 text-sky-700 bg-sky-50 hover:bg-sky-100";

  return (
    <button type="button" onClick={onClick} className={`${base} ${toneClass}`}>
      {label}
    </button>
  );
};

const AttentionRow = ({ title, meta, action, tone = "primary", onClick }) => {
  const badgeClass =
    tone === "danger"
      ? "bg-rose-50 text-rose-700 border-rose-400/60"
      : tone === "warning"
      ? "bg-amber-50 text-amber-700 border-amber-400/60"
      : "bg-sky-50 text-sky-700 border-sky-400/60";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
    >
      <div>
        <p className="text-[13px] font-semibold text-slate-900">{title}</p>
        <p className="text-[11px] text-slate-600 mt-0.5">{meta}</p>
      </div>
      <span
        className={`mt-0.5 inline-flex items-center px-2.5 py-[3px] rounded-full text-[10px] font-semibold border ${badgeClass}`}
      >
        {action}
      </span>
    </button>
  );
};

const uiType = (apiType) => {
  const t = String(apiType || "").toLowerCase();
  if (t === "showcase") return "Showcase";
  if (t === "room") return "Room";
  if (t === "user") return "User";
  return "Item";
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
    if (Number.isNaN(diff)) return "Recently";

    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;

    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;

    const days = Math.floor(hrs / 24);
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  } catch {
    return "Recently";
  }
};

export default function AdminPanel() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    moderators: 0,
    activeUsers24h: 0,
    pendingReports: 0,
    flaggedItems: 0,
  });

  const [attentionItems, setAttentionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attentionLoading, setAttentionLoading] = useState(true);
  const [error, setError] = useState("");

  const goUsers = () => navigate("/admin/users");
  const goReports = () => navigate("/admin/reports");
  const goModeration = () => navigate("/admin/moderation");
  const goSupport = () => navigate("/admin/support");

  const handleUserManagement = () => {
    goUsers();
  };

  const handleAllReports = () => {
    navigate("/admin/reports");
  };

  const handleModeration = () => {
    goModeration();
  };

  const openAttentionItem = (item) => {
    if (!item) return;

    if (item.typeRaw === "showcase") {
      navigate("/admin/reports", { state: { filter: "showcase" } });
      return;
    }

    if (item.typeRaw === "room") {
      navigate("/admin/reports", { state: { filter: "room" } });
      return;
    }

    if (item.typeRaw === "user") {
      navigate("/admin/users");
      return;
    }

    navigate("/admin/reports");
  };

  useEffect(() => {
    let isMounted = true;

    const token = localStorage.getItem("devsphere_token");
    if (!token) {
      setError("Token missing. Please login again.");
      setLoading(false);
      setAttentionLoading(false);
      return;
    }

    const loadOverview = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/overview", {
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
              ? "Admin access required (403)."
              : `Failed to load overview (Error ${res.status}).`);

          if (isMounted) {
            setError(msg);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setError("");
          setStats({
            totalUsers: data.totalUsers ?? 0,
            admins: data.admins ?? 0,
            moderators: data.moderators ?? 0,
            activeUsers24h: data.activeUsers24h ?? 0,
            pendingReports: data.pendingReports ?? 0,
            flaggedItems: data.flaggedItems ?? 0,
          });
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setError("Backend not reachable. Make sure server is running on :5000");
          setLoading(false);
        }
      }
    };

    const loadAttentionItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reports/admin", {
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
          if (isMounted) {
            setAttentionItems([]);
            setAttentionLoading(false);
          }
          return;
        }

        const list = Array.isArray(data) ? data : data?.reports || [];

        const latestAttention = list
          .filter((r) => {
            const s = String(r.status || "").toLowerCase();
            return s === "open" || s === "in_review";
          })
          .slice(0, 3)
          .map((r) => {
            const typeRaw = String(r.type || "").toLowerCase();
            const status = uiStatus(r.status);
            const tone =
              status === "Open"
                ? "danger"
                : status === "In review"
                ? "warning"
                : "primary";

            return {
              id: String(r._id || r.id || ""),
              typeRaw,
              title: `${uiType(typeRaw)} report · ${String(r.target || "—")}`,
              meta: `${r.reason || "Reported content"} · ${timeAgo(r.createdAt)}`,
              action: status === "Open" ? "Review" : "Inspect",
              tone,
            };
          });

        if (isMounted) {
          setAttentionItems(latestAttention);
          setAttentionLoading(false);
        }
      } catch {
        if (isMounted) {
          setAttentionItems([]);
          setAttentionLoading(false);
        }
      }
    };

    setLoading(true);
    setAttentionLoading(true);
    setError("");

    loadOverview();
    loadAttentionItems();

    const intervalId = setInterval(() => {
      loadOverview();
      loadAttentionItems();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const v = (num) => (loading ? "—" : String(num ?? 0));

  const attentionList = useMemo(() => attentionItems || [], [attentionItems]);

  return (
    <section className="cardShell sfPulseBorder p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
            Admin controls
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Platform overview &amp; moderation
          </h2>
          <p className="text-[12px] text-slate-600 mt-1">
            Signed in as{" "}
            <span className="font-semibold text-slate-900">Admin</span>
            <span className="inline-flex items-center ml-2 px-2 py-[2px] rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
              Admin
            </span>
          </p>

          {error && (
            <p className="text-[12px] text-rose-600 mt-2 font-semibold">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={goUsers}
            className="px-3 py-1.5 rounded-full bg-slate-900 text-slate-50 font-semibold hover:bg-slate-800 transition cursor-pointer"
          >
            Users
          </button>

          <button
            type="button"
            onClick={goReports}
            className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition cursor-pointer"
          >
            Reports
          </button>

          <button
            type="button"
            onClick={goSupport}
            className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition cursor-pointer"
          >
            Support
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatPill label="Total users" value={v(stats.totalUsers)} onClick={goUsers} />
          <StatPill label="Admins" value={v(stats.admins)} onClick={goUsers} />
          <StatPill label="Moderators" value={v(stats.moderators)} onClick={goUsers} />
          <StatPill label="Active users (24h)" value={v(stats.activeUsers24h)} onClick={goUsers} />
          <StatPill label="Pending reports" value={v(stats.pendingReports)} onClick={handleAllReports} />
          <StatPill label="Flagged items" value={v(stats.flaggedItems)} onClick={handleModeration} />
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Quick actions
          </p>
          <div className="flex flex-wrap gap-2">
            <ActionChip label="Open user management" onClick={handleUserManagement} />
            <ActionChip label="Review all reports" tone="danger" onClick={handleAllReports} />
            <ActionChip label="Open moderation console" tone="neutral" onClick={handleModeration} />
            <ActionChip label="Support requests" tone="primary" onClick={goSupport} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Items that need attention
          </p>

          {attentionLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-600">
              Loading attention items...
            </div>
          ) : attentionList.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-600">
              No urgent items right now.
            </div>
          ) : (
            attentionList.map((item) => (
              <AttentionRow
                key={item.id}
                title={item.title}
                meta={item.meta}
                action={item.action}
                tone={item.tone}
                onClick={() => openAttentionItem(item)}
              />
            ))
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Note
          </p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-700 leading-relaxed">
            <p>
              This card is visible only for users with the{" "}
              <span className="font-semibold">admin</span> role. Use it to
              manage users and flagged showcase items.
            </p>
            <p className="mt-2 text-[11px] text-slate-500">
              Dashboard stats and attention items are now connected to backend data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}