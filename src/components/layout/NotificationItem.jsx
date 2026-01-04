import React from "react";
import { CheckIcon } from "../icons"; // ya tumhare Notifications.jsx me defined SVG

export default function NotificationItem({ n, handleMarkRead, openAction, typeMeta }) {
  const meta = typeMeta(n.type);

  return (
    <li className={`p-4 md:p-5 flex items-start gap-4 ${n.read ? "bg-white" : "bg-slate-50/70"} hover:bg-slate-50`}>
      <div className="pt-2">
        <span className={`block w-2.5 h-2.5 rounded-full ${meta.dot} ${n.read ? "opacity-30" : "opacity-100"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${meta.badge}`}>{meta.label}</span>
          <p className="text-sm font-semibold text-slate-900 truncate">{n.title || meta.label}</p>
        </div>
        <p className="text-sm text-slate-600 mt-1">{n.message}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {n?.action?.label && (
            <button
              onClick={() => openAction(n)}
              className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold"
            >
              {n.action.label}
            </button>
          )}
          {!n.read ? (
            <button
              onClick={() => handleMarkRead(n._id)}
              className="px-3 py-1.5 rounded-full bg-white border text-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <CheckIcon />
              Mark as read
            </button>
          ) : (
            <span className="text-xs text-slate-400 px-3 py-1.5 rounded-full bg-slate-100">Read</span>
          )}
        </div>
      </div>
    </li>
  );
}