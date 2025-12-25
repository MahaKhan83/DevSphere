import React from "react";
import { useNavigate } from "react-router-dom";

export default function CollaborationRoom() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 26, fontWeight: 700 }}>Real-Time Collaboration Room</h2>
      <p style={{ marginTop: 8, color: "#555" }}>
        Yahan tum realtime chat + code sharing + rooms build karoge.
      </p>

      <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          ⬅ Back to Dashboard
        </button>

        <button
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            background: "#0ea5e9",
            color: "white",
            cursor: "pointer",
          }}
        >
          + Create Room
        </button>
      </div>

      <div style={{ marginTop: 20, padding: 14, borderRadius: 12, border: "1px solid #eee" }}>
        <p style={{ fontWeight: 600 }}>Demo Rooms</p>
        <ul style={{ marginTop: 10, lineHeight: "28px" }}>
          <li>Frontend Review Room</li>
          <li>API Integration Room</li>
          <li>Bug Fixing Room</li>
        </ul>
      </div>
    </div>
  );
}