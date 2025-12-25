// src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">DevSphere</h1>

      <nav className="space-y-4">
        <NavLink to="/dashboard" className="block hover:text-cyan-400">
          Dashboard
        </NavLink>
        <NavLink to="/portfolio" className="block hover:text-cyan-400">
          Portfolio
        </NavLink>
        <NavLink to="/showcase" className="block hover:text-cyan-400">
          Showcase
        </NavLink>
        <NavLink to="/notifications" className="block hover:text-cyan-400">
          Notifications
        </NavLink>
        <NavLink to="/collab" className="block hover:text-cyan-400">
  Collaboration Room
</NavLink>

<NavLink to="/calendar" className="block hover:text-cyan-400">
  Calendar
</NavLink>

<NavLink to="/settings" className="block hover:text-cyan-400">
  Settings
</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;