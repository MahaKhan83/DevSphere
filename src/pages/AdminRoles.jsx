// src/pages/AdminRoles.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const seedRoles = [
  {
    name: "Admin",
    count: 2,
    desc: "Full control over the platform, users and settings.",
  },
  {
    name: "Moderator",
    count: 3,
    desc: "Can review reports and moderate showcase / rooms.",
  },
  {
    name: "User",
    count: 37,
    desc: "Can build portfolios, join rooms and use the showcase feed.",
  },
];

const seedPermissions = [
  {
    perm: "Manage users",
    permissions: {
      Admin: true,
      Moderator: false,
      User: false,
    },
  },
  {
    perm: "Review reports",
    permissions: {
      Admin: true,
      Moderator: true,
      User: false,
    },
  },
  {
    perm: "Create rooms",
    permissions: {
      Admin: true,
      Moderator: true,
      User: true,
    },
  },
  {
    perm: "Post to showcase",
    permissions: {
      Admin: true,
      Moderator: true,
      User: true,
    },
  },
];

export default function AdminRoles() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState(seedRoles);
  const [permissionRows, setPermissionRows] = useState(seedPermissions);

  const [selectedRole, setSelectedRole] = useState(seedRoles[0]);
  const [selectedPermission, setSelectedPermission] = useState(null);

  const [actionMessage, setActionMessage] = useState(
    "This is a static demo connected to local state. Later you can hook it to backend role policies."
  );

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setActionMessage(
      `Selected role: ${role.name}. You can see and adjust its permissions in the table.`
    );
  };

  const handleCreateCustomRoleClick = () => {
    setShowCreateForm((prev) => !prev);
    setActionMessage(
      !showCreateForm
        ? "Fill in the form to create a custom role. It will appear as a new column in the table."
        : "Create role form closed."
    );
  };

  const handleSubmitNewRole = (e) => {
    e.preventDefault();
    const trimmedName = newRoleName.trim();
    if (!trimmedName) {
      setActionMessage("Please enter a role name before creating it.");
      return;
    }

    if (
      roles.some((r) => r.name.toLowerCase() === trimmedName.toLowerCase())
    ) {
      setActionMessage("A role with this name already exists.");
      return;
    }

    const newRole = {
      name: trimmedName,
      count: 0,
      desc:
        newRoleDesc.trim() ||
        "Custom role created from the Admin Roles panel.",
    };

    setRoles((prev) => [...prev, newRole]);
    setPermissionRows((prev) =>
      prev.map((row) => ({
        ...row,
        permissions: {
          ...row.permissions,
          [trimmedName]: false, // default: no permissions yet
        },
      }))
    );

    setSelectedRole(newRole);
    setNewRoleName("");
    setNewRoleDesc("");
    setShowCreateForm(false);
    setActionMessage(
      `Custom role "${trimmedName}" created. You can now toggle its permissions in the table.`
    );
  };

  const handleSelectPermission = (row) => {
    setSelectedPermission(row);
    setActionMessage(
      `Selected permission: "${row.perm}". Click ticks / crosses to change which roles can do this.`
    );
  };

  const togglePermission = (permName, roleName) => {
    setPermissionRows((prev) =>
      prev.map((row) => {
        if (row.perm !== permName) return row;
        const current = !!row.permissions[roleName];
        return {
          ...row,
          permissions: {
            ...row.permissions,
            [roleName]: !current,
          },
        };
      })
    );
    setActionMessage(
      `Updated permission "${permName}" for role "${roleName}".`
    );
  };

  const resetSelection = () => {
    setSelectedRole(seedRoles[0]);
    setSelectedPermission(null);
    setActionMessage(
      "Selection reset. This is a UI demo for roles and permissions using local state."
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-sky-50/60 to-slate-100 flex">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10 w-full">
          {/* Top */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Admin · Roles
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Role configuration
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Overview of DevSphere roles and their responsibilities.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-slate-900 text-slate-50 font-semibold hover:bg-slate-800 transition"
            >
              Back to dashboard
            </button>
          </div>

          {/* Status / info bar */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-800 shadow-sm">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="font-semibold uppercase tracking-[0.18em]">
                STATUS
              </span>
              <span className="text-[11px] font-normal text-indigo-800">
                {actionMessage}
              </span>
            </div>
          </div>

          {/* Main card */}
          <div className="cardShell sfPulseBorder bg-white/95 border border-slate-200 rounded-2xl shadow-sm p-5 space-y-5">
            {/* Header + actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Roles
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  This page uses local React state. Later you can connect it to
                  your backend to manage real roles and permissions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreateCustomRoleClick}
                  className="px-3 py-1.5 rounded-full bg-sky-500 text-white text-xs font-semibold hover:bg-sky-400 transition"
                >
                  + Create custom role
                </button>
                <button
                  onClick={resetSelection}
                  className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
                >
                  Reset selection
                </button>
              </div>
            </div>

            {/* Create custom role form (toggle) */}
            {showCreateForm && (
              <div className="mt-3 cardShell sfRow bg-gradient-to-r from-sky-50 via-white to-indigo-50 border border-sky-200 rounded-2xl px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                  New custom role
                </p>
                <form
                  onSubmit={handleSubmitNewRole}
                  className="flex flex-col md:flex-row gap-3 md:items-end"
                >
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Role name
                    </label>
                    <input
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="e.g. Reviewer, Lead, Guest"
                      className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500/40"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Description (optional)
                    </label>
                    <input
                      value={newRoleDesc}
                      onChange={(e) => setNewRoleDesc(e.target.value)}
                      placeholder="Short description for this role"
                      className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500/40"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-50 text-xs font-semibold hover:bg-slate-800 transition"
                  >
                    Save role
                  </button>
                </form>
              </div>
            )}

            {/* Role cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {roles.map((r) => {
                const isActive = selectedRole?.name === r.name;
                return (
                  <button
                    key={r.name}
                    type="button"
                    onClick={() => handleSelectRole(r)}
                    className={`sfRow rounded-2xl border px-4 py-3 flex flex-col justify-between text-left cursor-pointer transition ${
                      isActive
                        ? "border-sky-400 bg-gradient-to-br from-sky-50 via-white to-indigo-50"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {r.name}
                      </p>
                      <p className="text-[12px] text-slate-600 mt-1">
                        {r.desc}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 uppercase tracking-[0.16em]">
                        ASSIGNED
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {r.count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Permission mapping */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Permission matrix
                </p>
                <span className="text-[11px] text-slate-500">
                  Click a row to select a permission. Click any tick / cross to
                  toggle it for that role.
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm bg-white rounded-xl overflow-hidden border border-slate-200">
                  <thead className="bg-gradient-to-r from-slate-50 to-sky-50">
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-2.5">Permission</th>
                      {roles.map((role) => (
                        <th
                          key={role.name}
                          className="px-4 py-2.5 text-center"
                        >
                          {role.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionRows.map((row) => {
                      const isSelected =
                        selectedPermission?.perm === row.perm;
                      return (
                        <tr
                          key={row.perm}
                          onClick={() => handleSelectPermission(row)}
                          className={`border-t border-slate-100 sfRow cursor-pointer ${
                            isSelected ? "bg-sky-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-4 py-2.5 text-slate-800">
                            {row.perm}
                          </td>
                          {roles.map((role) => {
                            const allowed = !!row.permissions[role.name];
                            return (
                              <td
                                key={role.name}
                                className="px-4 py-2.5 text-center"
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    togglePermission(row.perm, role.name);
                                  }}
                                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border transition ${
                                    allowed
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                      : "bg-slate-50 text-slate-500 border-slate-200"
                                  }`}
                                  title={
                                    allowed
                                      ? "Click to disable for this role"
                                      : "Click to enable for this role"
                                  }
                                >
                                  {allowed ? "✔" : "✖"}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-slate-500">
                This is a local-state demo. In a real implementation, these
                permissions would be loaded from your backend and saved when
                you confirm the changes.
              </p>
            </div>

            {/* Selected role + permission summary */}
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="cardShell bg-white/95 border border-slate-200 rounded-2xl px-4 py-3 sfRow">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Selected role
                </p>
                {selectedRole ? (
                  <>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedRole.name}
                    </p>
                    <p className="text-[12px] text-slate-600 mt-1">
                      {selectedRole.desc}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Later you can open a dedicated role editor from here, with
                      save and cancel buttons that sync to your backend.
                    </p>
                  </>
                ) : (
                  <p className="text-[12px] text-slate-600">
                    Click any role card above to select it.
                  </p>
                )}
              </div>

              <div className="cardShell bg-white/95 border border-slate-200 rounded-2xl px-4 py-3 sfRow">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Selected permission
                </p>
                {selectedPermission ? (
                  <>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedPermission.perm}
                    </p>
                    <ul className="mt-2 space-y-1 text-[12px] text-slate-700">
                      {roles.map((role) => {
                        const allowed =
                          !!selectedPermission.permissions[role.name];
                        return (
                          <li key={role.name}>
                            <span className="font-semibold">{role.name}:</span>{" "}
                            {allowed ? "Allowed" : "Not allowed"}
                          </li>
                        );
                      })}
                    </ul>
                    <p className="text-[11px] text-slate-500 mt-2">
                      You can change these values directly in the matrix above
                      by clicking the ticks and crosses for each role.
                    </p>
                  </>
                ) : (
                  <p className="text-[12px] text-slate-600">
                    Click any row in the permission table to see details here.
                  </p>
                )}
              </div>
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