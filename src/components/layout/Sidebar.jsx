// src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const linkBase = "block px-3 py-2 rounded-lg transition font-medium";

const linkStyle = ({ isActive }) =>
  `${linkBase} ${
    isActive
      ? "bg-white/10 text-cyan-400"
      : "text-slate-300 hover:text-cyan-400 hover:bg-white/5"
  }`;

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-slate-900 text-white p-6 border-r border-white/10 overflow-y-auto">
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold mb-10 tracking-tight">
        DevSphere
      </h1>

      {/* Navigation */}
      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkStyle}>
          Dashboard
        </NavLink>

        <NavLink to="/portfolio" className={linkStyle}>
          Portfolio
        </NavLink>

        <NavLink to="/showcase" className={linkStyle}>
          Showcase
        </NavLink>

        <NavLink to="/notifications" className={linkStyle}>
          Notifications
        </NavLink>

        <NavLink to="/collaboration" className={linkStyle}>
          Collaboration Room
        </NavLink>

        {/* NOTE: Calendar route tumhare App.jsx me nahi, is liye isko comment kiya */}
        {/* <NavLink to="/calendar" className={linkStyle}>
          Calendar
        </NavLink> */}

        <NavLink to="/settings" className={linkStyle}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;