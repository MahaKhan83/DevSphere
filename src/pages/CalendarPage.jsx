import React from "react";

export default function CalendarPage() {
  const today = new Date().toDateString();

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 26, fontWeight: 700 }}>Calendar</h2>
      <p style={{ marginTop: 8, color: "#555" }}>Today: {today}</p>

      <div style={{ marginTop: 18, padding: 14, borderRadius: 12, border: "1px solid #eee" }}>
        <p style={{ fontWeight: 600 }}>Upcoming (Demo)</p>
        <ul style={{ marginTop: 10, lineHeight: "28px" }}>
          <li>📌 Standup Meeting — 10:00 AM</li>
          <li>📌 Sprint Planning — 2:00 PM</li>
          <li>📌 Portfolio Review — 6:00 PM</li>
        </ul>
      </div>
    </div>
  );
}