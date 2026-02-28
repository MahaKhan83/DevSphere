// src/routes/collaborationCodeRoutes.js
const express = require("express");
const router = express.Router();

const archiver = require("archiver");
const RoomCodeSnapshot = require("../models/RoomCodeSnapshot");

/* helpers: accept both keys from frontend/postman */
const pickString = (v) => (typeof v === "string" ? v : "");
const normRoom = (v) => String(v || "").trim().toUpperCase();

/**
 * ✅ GET saved code for room
 * returns BOTH:
 * - { js, html, css }  (postman friendly)
 * - { code: { jsCode, htmlCode, cssCode } } (workspace friendly)
 */
router.get("/code/:roomCode", async (req, res) => {
  try {
    const roomCode = normRoom(req.params.roomCode);

    const snap = await RoomCodeSnapshot.findOne({ roomCode });

    const js = snap?.js || "";
    const html = snap?.html || "";
    const css = snap?.css || "";

    return res.json({
      roomCode,
      js,
      html,
      css,

      // ✅ workspace expects this
      code: {
        jsCode: js,
        htmlCode: html,
        cssCode: css,
      },

      lastSavedBy: snap?.lastSavedBy || "",
      lastSavedAt: snap?.lastSavedAt || null,
    });
  } catch (err) {
    console.error("GET /collaboration/code error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ POST save code for room (DB ONLY)
 * accepts BOTH:
 * - { js, html, css } (postman)
 * - { jsCode, htmlCode, cssCode } (workspace)
 */
router.post("/code/:roomCode", async (req, res) => {
  try {
    const roomCode = normRoom(req.params.roomCode);

    const body = req.body || {};
    const js = pickString(body.jsCode ?? body.js);
    const html = pickString(body.htmlCode ?? body.html);
    const css = pickString(body.cssCode ?? body.css);
    const by = String(body.by || "").trim();

    const snap = await RoomCodeSnapshot.findOneAndUpdate(
      { roomCode },
      {
        roomCode,
        js,
        html,
        css,
        lastSavedBy: by,
        lastSavedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return res.json({
      ok: true,
      roomCode,
      lastSavedBy: snap.lastSavedBy || "",
      lastSavedAt: snap.lastSavedAt || null,
    });
  } catch (err) {
    console.error("POST /collaboration/code error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ DOWNLOAD ZIP -> browser Downloads
 * URL:
 * GET /api/collaboration/code/:roomCode/download
 */
router.get("/code/:roomCode/download", async (req, res) => {
  try {
    const roomCode = normRoom(req.params.roomCode);

    const snap = await RoomCodeSnapshot.findOne({ roomCode });

    const js = snap?.js || "";
    const html = snap?.html || "";
    const css = snap?.css || "";

    const zipName = `devsphere_${roomCode}.zip`;

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${zipName}"`);

    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err) => {
      console.error("ZIP error:", err);
      try {
        res.status(500).end();
      } catch {}
    });

    archive.pipe(res);

    archive.append(html, { name: "index.html" });
    archive.append(css, { name: "style.css" });
    archive.append(js, { name: "script.js" });

    // small README (impressive)
    archive.append(
      `DevSphere Collaboration Export\nRoom: ${roomCode}\nLastSavedBy: ${snap?.lastSavedBy || ""}\nLastSavedAt: ${snap?.lastSavedAt || ""}\n`,
      { name: "README.txt" }
    );

    await archive.finalize();
  } catch (err) {
    console.error("GET /collaboration/code/download error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;