// src/pages/AdminUsers.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const navigate = useNavigate();

  // UI state
  const [filter, setFilter] = useState("all"); // all | admins | moderators | users | pending | blocked
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionMessage, setActionMessage] = useState(
    "Loading users from backend..."
  );

  // backend users + loading/error
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Invite modal
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "pending",
  });
  const [inviteSaving, setInviteSaving] = useState(false);

  // Edit role modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleForm, setRoleForm] = useState({ id: "", role: "user" });
  const [roleSaving, setRoleSaving] = useState(false);

  // ✅ NEW: Edit status modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState({ id: "", status: "active" });
  const [statusSaving, setStatusSaving] = useState(false);

  const normalizeRole = (role) => {
    const r = String(role || "").toLowerCase();
    if (r === "admin") return "Admin";
    if (r === "moderator") return "Moderator";
    return "User";
  };

  const normalizeStatus = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "pending") return "Pending";
    if (s === "blocked") return "Blocked";
    return "Active";
  };

  const uiStatusToApi = (ui) => {
    const s = String(ui || "").toLowerCase();
    if (s === "pending") return "pending";
    if (s === "blocked") return "blocked";
    return "active";
  };

  const apiStatusToUi = (api) => normalizeStatus(api);

  const getToken = () => localStorage.getItem("devsphere_token");

  const loadUsers = async () => {
    setError("");

    const token = getToken();
    if (!token) {
      setError("Token missing. Please login again.");
      setLoading(false);
      setActionMessage("Token missing. Please login again.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
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
            : `Failed to load users (Error ${res.status}).`);
        setError(msg);
        setLoading(false);
        setActionMessage(msg);
        return;
      }

      const list = Array.isArray(data) ? data : data?.users || [];

      const mapped = list.map((u) => ({
        id: u._id ? String(u._id) : String(u.id || ""),
        name: u.name || "—",
        email: u.email || "—",
        role: normalizeRole(u.role),
        status: normalizeStatus(u.status),
      }));

      setUsers(mapped);
      setLoading(false);

      if (!selectedUser && mapped.length > 0) {
        setSelectedUser(mapped[0]);
      }

      setActionMessage(
        mapped.length
          ? "Users loaded from backend. Use filters or click a row to see details."
          : "No users found."
      );
    } catch (e) {
      const msg = "Backend not reachable. Make sure server is running on :5000";
      setError(msg);
      setLoading(false);
      setActionMessage(msg);
    }
  };

  // initial load + auto refresh every 5s
  useEffect(() => {
    setLoading(true);
    loadUsers();

    const intervalId = setInterval(() => {
      loadUsers();
    }, 5000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (type, label) => {
    setFilter(type);
    setActionMessage(`Filter applied: ${label}`);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filter === "all") return true;
      if (filter === "admins") return u.role === "Admin";
      if (filter === "moderators") return u.role === "Moderator";
      if (filter === "users") return u.role === "User";
      if (filter === "pending") return u.status === "Pending";
      if (filter === "blocked") return u.status === "Blocked";
      return true;
    });
  }, [users, filter]);

  const handleView = (user) => {
    setSelectedUser(user);
    setActionMessage(`Viewing user: ${user.name}`);
  };

  // -------- Invite user --------
  const openInvite = () => {
    setInviteForm({
      name: "",
      email: "",
      password: "",
      role: "user",
      status: "pending",
    });
    setShowInvite(true);
    setActionMessage("Invite modal opened.");
  };

  const closeInvite = () => {
    if (inviteSaving) return;
    setShowInvite(false);
  };

  const submitInvite = async (e) => {
    e.preventDefault();
    setError("");

    const token = getToken();
    if (!token) {
      setError("Token missing. Please login again.");
      setActionMessage("Token missing. Please login again.");
      return;
    }

    if (
      !inviteForm.name.trim() ||
      !inviteForm.email.trim() ||
      !inviteForm.password.trim()
    ) {
      setError("Name, email and password are required.");
      setActionMessage("Invite failed: missing fields.");
      return;
    }

    setInviteSaving(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inviteForm.name.trim(),
          email: inviteForm.email.trim(),
          password: inviteForm.password,
          role: inviteForm.role,
          status: inviteForm.status,
        }),
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
            : res.status === 409
            ? "Email already exists (409)."
            : `Invite failed (Error ${res.status}).`);
        setError(msg);
        setActionMessage(msg);
        setInviteSaving(false);
        return;
      }

      setActionMessage("User created ✅");
      setShowInvite(false);
      setInviteSaving(false);

      loadUsers();
    } catch (err) {
      const msg = "Invite failed: backend not reachable.";
      setError(msg);
      setActionMessage(msg);
      setInviteSaving(false);
    }
  };

  // -------- Role change (REAL) --------
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setRoleForm({
      id: user.id,
      role:
        user.role === "Admin"
          ? "admin"
          : user.role === "Moderator"
          ? "moderator"
          : "user",
    });
    setShowRoleModal(true);
    setActionMessage(`Editing role for ${user.name}`);
  };

  const closeRoleModal = () => {
    if (roleSaving) return;
    setShowRoleModal(false);
  };

  const saveRole = async () => {
    setError("");

    const token = getToken();
    if (!token) {
      setError("Token missing. Please login again.");
      setActionMessage("Token missing. Please login again.");
      return;
    }

    setRoleSaving(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${roleForm.id}/role`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: roleForm.role }),
        }
      );

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
            : `Role update failed (Error ${res.status}).`);
        setError(msg);
        setActionMessage(msg);
        setRoleSaving(false);
        return;
      }

      setActionMessage("Role updated ✅");
      setShowRoleModal(false);
      setRoleSaving(false);
      loadUsers();
    } catch (e) {
      const msg = "Backend not reachable. Make sure server is running on :5000";
      setError(msg);
      setActionMessage(msg);
      setRoleSaving(false);
    }
  };

  // ✅ NEW: Status change modal (REAL)
  const openStatusModal = (user) => {
    setSelectedUser(user);
    setStatusForm({
      id: user.id,
      status: uiStatusToApi(user.status),
    });
    setShowStatusModal(true);
    setActionMessage(`Editing status for ${user.name}`);
  };

  const closeStatusModal = () => {
    if (statusSaving) return;
    setShowStatusModal(false);
  };

  const saveStatus = async () => {
    setError("");

    const token = getToken();
    if (!token) {
      setError("Token missing. Please login again.");
      setActionMessage("Token missing. Please login again.");
      return;
    }

    setStatusSaving(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${statusForm.id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: statusForm.status }), // active|pending|blocked
        }
      );

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
            : `Status update failed (Error ${res.status}).`);
        setError(msg);
        setActionMessage(msg);
        setStatusSaving(false);
        return;
      }

      const newUi = apiStatusToUi(statusForm.status);
      setActionMessage(`Status updated ✅ (${newUi})`);
      setShowStatusModal(false);
      setStatusSaving(false);
      loadUsers();
    } catch (e) {
      const msg = "Backend not reachable. Make sure server is running on :5000";
      setError(msg);
      setActionMessage(msg);
      setStatusSaving(false);
    }
  };

  const resetFilters = () => {
    setFilter("all");
    setActionMessage("Filters reset. Showing all users.");
  };

  const statusPillClass = (status) => {
    if (status === "Active") return "bg-emerald-50 text-emerald-700";
    if (status === "Blocked") return "bg-rose-50 text-rose-700";
    return "bg-amber-50 text-amber-700";
  };

  const actionBtnClass = (variant) => {
    // ✅ nicer colored pills
    if (variant === "role") {
      return "px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100";
    }
    if (variant === "status") {
      return "px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100";
    }
    return "px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200";
  };

  const shortId = (id) => {
    const s = String(id || "");
    if (s.length <= 10) return s;
    return `${s.slice(0, 6)}…${s.slice(-4)}`;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-sky-50/60 to-slate-100 flex">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 w-full">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Admin · Users
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                User management
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                View, search and review DevSphere users.
              </p>
              {error && (
                <p className="text-[12px] text-rose-600 mt-2 font-semibold">
                  {error}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-slate-900 text-slate-50 font-semibold hover:bg-slate-800 transition"
            >
              Back to dashboard
            </button>
          </div>

          {/* Status bar */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-sky-50 border border-sky-100 text-[11px] text-sky-800 shadow-sm">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span className="font-semibold uppercase tracking-[0.18em]">
                STATUS
              </span>
              <span className="text-[11px] font-normal text-sky-800">
                {loading ? "Loading..." : actionMessage}
              </span>
            </div>
          </div>

          {/* Filters + summary */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 cardShell sfRow px-4 py-3 bg-white/95 border border-slate-200 rounded-2xl shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                Quick filters
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilter("all", "All users")}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                    filter === "all"
                      ? "bg-slate-900 text-slate-50 hover:bg-slate-800"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  All users
                </button>
                <button
                  onClick={() => handleFilter("admins", "Admins")}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                    filter === "admins"
                      ? "bg-slate-900 text-slate-50 hover:bg-slate-800"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Admins
                </button>
                <button
                  onClick={() => handleFilter("moderators", "Moderators")}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                    filter === "moderators"
                      ? "bg-slate-900 text-slate-50 hover:bg-slate-800"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Moderators
                </button>
                <button
                  onClick={() => handleFilter("users", "Users")}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                    filter === "users"
                      ? "bg-slate-900 text-slate-50 hover:bg-slate-800"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Users
                </button>
                <button
                  onClick={() => handleFilter("pending", "Pending")}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                    filter === "pending"
                      ? "bg-amber-500 text-white hover:bg-amber-400"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleFilter("blocked", "Blocked")}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                    filter === "blocked"
                      ? "bg-rose-600 text-white hover:bg-rose-500"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                  }`}
                >
                  Blocked
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="cardShell sfRow bg-gradient-to-br from-sky-50 via-white to-indigo-50 border border-slate-200 rounded-2xl shadow-sm px-4 py-3 text-left"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Summary
              </p>
              <p className="text-sm text-slate-700 mt-1">
                <span className="font-semibold text-slate-900">
                  {users.length}
                </span>{" "}
                users in this view.
                <br />
                <span className="text-[11px] text-slate-500">
                  Click here to reset all filters.
                </span>
              </p>
            </button>
          </div>

          {/* Main layout */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Users table */}
            <div className="lg:col-span-2 cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-sky-50">
                <p className="text-sm font-semibold text-slate-900">
                  Users list
                </p>
                <button
                  onClick={openInvite}
                  className="text-xs px-3 py-1.5 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-400 transition"
                >
                  + Invite user
                </button>
              </div>

              <div className="overflow-x-auto">
                {/* ✅ make table wider so less scroll */}
                <table className="min-w-[980px] w-full text-sm">
                  <thead className="bg-gradient-to-r from-slate-50 to-sky-50">
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-2.5 w-[140px]">ID</th>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5 w-[120px]">Role</th>
                      <th className="px-4 py-2.5 w-[120px]">Status</th>
                      <th className="px-4 py-2.5 text-right w-[260px]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((u, idx) => (
                      <tr
                        key={u.id}
                        onClick={() => handleView(u)}
                        className={`border-t border-slate-100 sfRow cursor-pointer ${
                          idx % 2 === 1 ? "bg-slate-50/60" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-2.5 text-xs font-mono text-slate-500">
                          <span title={u.id}>{shortId(u.id)}</span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-900">{u.name}</td>
                        <td className="px-4 py-2.5 text-slate-700">{u.email}</td>

                        <td className="px-4 py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {u.role}
                          </span>
                        </td>

                        <td className="px-4 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusPillClass(
                              u.status
                            )}`}
                          >
                            {u.status}
                          </span>
                        </td>

                        <td className="px-4 py-2.5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openRoleModal(u);
                              }}
                              className={actionBtnClass("role")}
                              title="Edit role"
                            >
                              Edit role
                            </button>

                            {/* ✅ NEW: Status dropdown modal button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openStatusModal(u);
                              }}
                              className={actionBtnClass("status")}
                              title="Edit status"
                            >
                              Edit status
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!loading && filteredUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-6 text-center text-sm text-slate-500"
                        >
                          No users match this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/70">
                <span>
                  Showing {filteredUsers.length} of {users.length} users
                </span>
                <span>Pagination can be added here in the future.</span>
              </div>
            </div>

            {/* Selected user */}
            <div className="cardShell sfRow bg-white/95 border border-slate-200 rounded-2xl shadow-sm px-4 py-4 border-l-4 border-sky-400/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                Selected user
              </p>

              {selectedUser ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedUser.name}
                  </p>
                  <p className="text-xs text-slate-700">{selectedUser.email}</p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {selectedUser.role}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusPillClass(
                        selectedUser.status
                      )}`}
                    >
                      {selectedUser.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-3">
                    Edit role + Edit status are real ✅
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-600">
                  Click any row in the table to view user details.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Admin
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Invite / Create user
                </h3>
                <p className="text-[12px] text-slate-600 mt-1">
                  Creates a user in database (status default pending).
                </p>
              </div>
              <button
                onClick={closeInvite}
                className="px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-100"
                type="button"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitInvite} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] text-slate-600 font-semibold">
                  Full name
                </label>
                <input
                  value={inviteForm.name}
                  onChange={(e) =>
                    setInviteForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-semibold">
                  Email
                </label>
                <input
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-semibold">
                  Temporary password
                </label>
                <input
                  type="password"
                  value={inviteForm.password}
                  onChange={(e) =>
                    setInviteForm((p) => ({ ...p, password: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="********"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-600 font-semibold">
                    Role
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) =>
                      setInviteForm((p) => ({ ...p, role: e.target.value }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="user">user</option>
                    <option value="moderator">moderator</option>
                    <option value="admin">admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-semibold">
                    Status
                  </label>
                  <select
                    value={inviteForm.status}
                    onChange={(e) =>
                      setInviteForm((p) => ({ ...p, status: e.target.value }))
                    }
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="pending">pending</option>
                    <option value="active">active</option>
                    <option value="blocked">blocked</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeInvite}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                  disabled={inviteSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-400 disabled:opacity-60"
                  disabled={inviteSaving}
                >
                  {inviteSaving ? "Creating..." : "Create user"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Admin
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Change role
                </h3>
                <p className="text-[12px] text-slate-600 mt-1">
                  Updates role in database.
                </p>
              </div>
              <button
                onClick={closeRoleModal}
                className="px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-100"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <label className="text-[11px] text-slate-600 font-semibold">
                Role
              </label>
              <select
                value={roleForm.role}
                onChange={(e) =>
                  setRoleForm((p) => ({ ...p, role: e.target.value }))
                }
                className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="user">user</option>
                <option value="moderator">moderator</option>
                <option value="admin">admin</option>
              </select>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeRoleModal}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveRole}
                  className="px-3 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60"
                  disabled={roleSaving}
                >
                  {roleSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW: Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Admin
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Change status
                </h3>
                <p className="text-[12px] text-slate-600 mt-1">
                  Active / Pending / Blocked
                </p>
              </div>
              <button
                onClick={closeStatusModal}
                className="px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-100"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <label className="text-[11px] text-slate-600 font-semibold">
                Status
              </label>
              <select
                value={statusForm.status}
                onChange={(e) =>
                  setStatusForm((p) => ({ ...p, status: e.target.value }))
                }
                className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="active">active</option>
                <option value="pending">pending</option>
                <option value="blocked">blocked</option>
              </select>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeStatusModal}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveStatus}
                  className="px-3 py-2 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-500 disabled:opacity-60"
                  disabled={statusSaving}
                >
                  {statusSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
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