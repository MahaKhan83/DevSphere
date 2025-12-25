import React, { useState } from "react";

export default function Settings() {
  const [theme, setTheme] = useState("Light");
  const [emailNoti, setEmailNoti] = useState(true);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 26, fontWeight: 700 }}>Settings</h2>
      <p style={{ marginTop: 8, color: "#555" }}>
        Profile, privacy, notifications settings yahan manage hongi.
      </p>

      <div style={{ marginTop: 18, padding: 14, borderRadius: 12, border: "1px solid #eee" }}>
        <p style={{ fontWeight: 700, marginBottom: 10 }}>Preferences</p>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 600 }}>Theme:</label>{" "}
          <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={emailNoti}
              onChange={() => setEmailNoti(!emailNoti)}
              style={{ marginRight: 8 }}
            />
            Email Notifications
          </label>
        </div>
      </div>
    </div>
  );
}