// src/pages/AdminUsers.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const demoUsers = [
  {
    id: "USR-001",
    name: "Maha Khan",
    email: "maha@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Ali Raza",
    email: "ali@example.com",
    role: "Moderator",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Laiba Tariq",
    email: "laiba@example.com",
    role: "User",
    status: "Pending",
  },
  {
    id: "USR-004",
    name: "Mehak Abbas",
    email: "mehak@example.com",
    role: "User",
    status: "Active",
  },
];

export default function AdminUsers() {
  const navigate = useNavigate();

  // UI state
  const [filter, setFilter] = useState("all"); // all | admins | moderators | users | pending
  const [selectedUser, setSelectedUser] = useState(demoUsers[0] || null);
  const [actionMessage, setActionMessage] = useState(
    "Showing all demo users. Use filters or click a row to see details."
  );

  const handleFilter = (type, label) => {
    setFilter(type);
    setActionMessage(`Filter applied: ${label}`);
  };

  const filteredUsers = demoUsers.filter((u) => {
    if (filter === "all") return true;
    if (filter === "admins") return u.role === "Admin";
    if (filter === "moderators") return u.role === "Moderator";
    if (filter === "users") return u.role === "User";
    if (filter === "pending") return u.status === "Pending";
    return true;
  });

  const handleView = (user) => {
    setSelectedUser(user);
    setActionMessage(`Viewing user: ${user.name}`);
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setActionMessage(`Edit role flow for ${user.name} will be added later.`);
  };

  const handleInvite = () => {
    setActionMessage("Invite user flow will be added in a later version.");
  };

  const resetFilters = () => {
    setFilter("all");
    setActionMessage("Filters reset. Showing all demo users.");
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
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-slate-900 text-slate-50 font-semibold hover:bg-slate-800 transition"
            >
              Back to dashboard
            </button>
          </div>

          {/* Action message / status bar */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-sky-50 border border-sky-100 text-[11px] text-sky-800 shadow-sm">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span className="font-semibold uppercase tracking-[0.18em]">
                STATUS
              </span>
              <span className="text-[11px] font-normal text-sky-800">
                {actionMessage}
              </span>
            </div>
          </div>

          {/* Filters + summary */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Filters card */}
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
              </div>
            </div>

            {/* Summary card */}
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
                  {demoUsers.length}
                </span>{" "}
                demo users in this view.
                <br />
                <span className="text-[11px] text-slate-500">
                  Click here to reset all filters.
                </span>
              </p>
            </button>
          </div>

          {/* Main layout: table + selected user panel */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Users table card */}
            <div className="lg:col-span-2 cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-sky-50">
                <p className="text-sm font-semibold text-slate-900">
                  Users list
                </p>
                <button
                  onClick={handleInvite}
                  className="text-xs px-3 py-1.5 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-400 transition"
                >
                  + Invite user
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gradient-to-r from-slate-50 to-sky-50">
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-2.5">ID</th>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5">Role</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
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
                          {u.id}
                        </td>
                        <td className="px-4 py-2.5 text-slate-900">
                          {u.name}
                        </td>
                        <td className="px-4 py-2.5 text-slate-700">
                          {u.email}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              u.status === "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(u);
                            }}
                            className="text-[11px] font-semibold text-sky-700 hover:text-sky-600 mr-2"
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditRole(u);
                            }}
                            className="text-[11px] font-semibold text-slate-700 hover:text-slate-900"
                          >
                            Edit role
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredUsers.length === 0 && (
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
                  Showing {filteredUsers.length} of {demoUsers.length} demo
                  users
                </span>
                <span>Pagination can be added here in the future.</span>
              </div>
            </div>

            {/* Selected user / detail side card */}
            <div className="cardShell sfRow bg-white/95 border border-slate-200 rounded-2xl shadow-sm px-4 py-4 border-l-4 border-sky-400/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                Selected user
              </p>

              {selectedUser ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedUser.name}
                  </p>
                  <p className="text-xs text-slate-700">
                    {selectedUser.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {selectedUser.role}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        selectedUser.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {selectedUser.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-3">
                    This is a UI demo. Later you can show full profile details,
                    recent activity and role changes for the selected user here.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-600">
                  Click any row in the table to view basic details about that
                  user here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard-style animations for this page */}
      <style>{`
        .cardShell{
          background: rgba(255,255,255,0.92);
          border-radius: 18px;
          border: 1px solid rgba(226,232,240,0.85);
          box-shadow: 0 10px 30px rgba(2,6,23,0.08);
          position: relative;
          overflow: hidden;
        }

        .sfPulseBorder{
          position: relative;
        }
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