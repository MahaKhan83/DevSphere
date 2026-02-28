// routes/collaborationFileRoutes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const protect = require("../middleware/protect"); // ✅ auth
const RoomFile = require("../models/RoomFile");

// ===============================
// Helpers
// ===============================
const safeRoom = (v) => String(v || "").trim().toUpperCase();
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

// ===============================
// Multer Storage (uploads/collaboration/ROOMCODE)
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const roomCode = safeRoom(req.params.roomCode);
    const dir = path.join(__dirname, "..", "uploads", "collaboration", roomCode);
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safeOriginal = (file.originalname || "file")
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${unique}_${safeOriginal}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// ======================================================
// ✅ IMPORTANT: Your FRONTEND calls these endpoints:
//
// GET    /api/collaboration/files/:roomCode
// POST   /api/collaboration/files/:roomCode   (multipart, field = "files" multiple)
// DELETE /api/collaboration/files/:roomCode/:fileId
//
// We'll implement exactly these ✅
//
// ALSO: We'll keep your older endpoints as ALIASES:
// GET    /api/collaboration/:roomCode/files
// POST   /api/collaboration/:roomCode/files
// DELETE /api/collaboration/:roomCode/files/:fileId
// ======================================================

// ===============================
// ✅ GET: list files of a room (MAIN)
// GET /api/collaboration/files/:roomCode
// ===============================
router.get("/files/:roomCode", protect, async (req, res) => {
  try {
    const roomCode = safeRoom(req.params.roomCode);

    const list = await RoomFile.find({ roomCode }).sort({ createdAt: -1 }).lean();

    // ✅ Map into the exact shape your Workspace expects:
    // { id, name, size, url, by, time }
    const files = (list || []).map((f) => ({
      id: f._id,
      name: f.originalName,
      size: f.size,
      url: f.url,
      by: f.uploadedByName || "Unknown",
      time: f.createdAt,
      uploadedBy: f.uploadedBy, // ✅ keep for frontend permissions
    }));

    return res.json({ files });
  } catch (err) {
    console.log("List files error:", err.message);
    return res.status(500).json({ message: "Failed to load files" });
  }
});

// ===============================
// ✅ POST: upload files (MAIN)
// POST /api/collaboration/files/:roomCode
// form-data: files[] (multiple)
// ===============================
router.post("/files/:roomCode", protect, upload.array("files", 10), async (req, res) => {
  try {
    const roomCode = safeRoom(req.params.roomCode);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const docs = [];
    for (const file of req.files) {
      const fileUrl = `/uploads/collaboration/${roomCode}/${file.filename}`;

      const doc = await RoomFile.create({
        roomCode,
        originalName: file.originalname,
        filename: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        url: fileUrl,
        uploadedBy: req.user._id, // ✅ uploader
        uploadedByName: req.user.name || req.user.email || "User",
      });

      docs.push(doc);
    }

    // ✅ Emit realtime events (match your frontend listeners: file-uploaded / file-deleted)
    const io = req.app.get("io");
    if (io) {
      for (const d of docs) {
        const filePayload = {
          id: d._id,
          name: d.originalName,
          size: d.size,
          url: d.url,
          by: d.uploadedByName || "Unknown",
          time: d.createdAt,
          uploadedBy: d.uploadedBy, // ✅ ADD: for frontend "Remove" permission
        };

        io.to(roomCode).emit("file-uploaded", { roomCode, file: filePayload });
      }
    }

    // ✅ Response in the exact shape your frontend expects
    const files = docs.map((d) => ({
      id: d._id,
      name: d.originalName,
      size: d.size,
      url: d.url,
      by: d.uploadedByName || "Unknown",
      time: d.createdAt,
      uploadedBy: d.uploadedBy, // ✅ ADD: for frontend "Remove" permission
    }));

    return res.status(201).json({ files });
  } catch (err) {
    console.log("Upload file error:", err.message);
    return res.status(500).json({ message: "Upload failed" });
  }
});

// ===============================
// ✅ DELETE: delete file (MAIN)
// DELETE /api/collaboration/files/:roomCode/:fileId
// ONLY uploader can delete
// ===============================
router.delete("/files/:roomCode/:fileId", protect, async (req, res) => {
  try {
    const roomCode = safeRoom(req.params.roomCode);
    const fileId = req.params.fileId;

    const fileDoc = await RoomFile.findOne({ _id: fileId, roomCode });
    if (!fileDoc) return res.status(404).json({ message: "File not found" });

    // ✅ uploader only
    const uploaderId = String(fileDoc.uploadedBy);
    const meId = String(req.user._id);

    if (uploaderId !== meId) {
      return res.status(403).json({ message: "Only uploader can delete this file" });
    }

    // delete from disk
    const absPath = path.join(__dirname, "..", "uploads", "collaboration", roomCode, fileDoc.filename);
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);

    await fileDoc.deleteOne();

    // ✅ realtime notify
    const io = req.app.get("io");
    if (io) {
      io.to(roomCode).emit("file-deleted", { roomCode, fileId });
    }

    return res.json({ ok: true, fileId });
  } catch (err) {
    console.log("Delete file error:", err.message);
    return res.status(500).json({ message: "Delete failed" });
  }
});

// ======================================================
// ✅ ALIASES (old endpoints) - keep them so nothing breaks
// ======================================================

// OLD GET  /api/collaboration/:roomCode/files  -> alias
router.get("/:roomCode/files", protect, async (req, res) => {
  req.params.roomCode = safeRoom(req.params.roomCode);
  try {
    const roomCode = req.params.roomCode;
    const list = await RoomFile.find({ roomCode }).sort({ createdAt: -1 }).lean();
    const files = (list || []).map((f) => ({
      id: f._id,
      name: f.originalName,
      size: f.size,
      url: f.url,
      by: f.uploadedByName || "Unknown",
      time: f.createdAt,
      uploadedBy: f.uploadedBy, // ✅ keep for frontend permissions
    }));
    return res.json({ files });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load files" });
  }
});

// OLD POST /api/collaboration/:roomCode/files  -> alias
router.post("/:roomCode/files", protect, upload.array("files", 10), async (req, res) => {
  try {
    const roomCode = safeRoom(req.params.roomCode);
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: "No files uploaded" });

    const docs = [];
    for (const file of req.files) {
      const fileUrl = `/uploads/collaboration/${roomCode}/${file.filename}`;
      const doc = await RoomFile.create({
        roomCode,
        originalName: file.originalname,
        filename: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        url: fileUrl,
        uploadedBy: req.user._id,
        uploadedByName: req.user.name || req.user.email || "User",
      });
      docs.push(doc);
    }

    const io = req.app.get("io");
    if (io) {
      for (const d of docs) {
        io.to(roomCode).emit("file-uploaded", {
          roomCode,
          file: {
            id: d._id,
            name: d.originalName,
            size: d.size,
            url: d.url,
            by: d.uploadedByName || "Unknown",
            time: d.createdAt,
            uploadedBy: d.uploadedBy, // ✅ ADD: for frontend "Remove" permission
          },
        });
      }
    }

    return res.status(201).json({
      files: docs.map((d) => ({
        id: d._id,
        name: d.originalName,
        size: d.size,
        url: d.url,
        by: d.uploadedByName || "Unknown",
        time: d.createdAt,
        uploadedBy: d.uploadedBy, // ✅ ADD: for frontend "Remove" permission
      })),
    });
  } catch (err) {
    return res.status(500).json({ message: "Upload failed" });
  }
});

// OLD DELETE /api/collaboration/:roomCode/files/:fileId  -> alias
router.delete("/:roomCode/files/:fileId", protect, async (req, res) => {
  try {
    const roomCode = safeRoom(req.params.roomCode);
    const fileId = req.params.fileId;

    const fileDoc = await RoomFile.findOne({ _id: fileId, roomCode });
    if (!fileDoc) return res.status(404).json({ message: "File not found" });

    const uploaderId = String(fileDoc.uploadedBy);
    const meId = String(req.user._id);
    if (uploaderId !== meId) return res.status(403).json({ message: "Only uploader can delete this file" });

    const absPath = path.join(__dirname, "..", "uploads", "collaboration", roomCode, fileDoc.filename);
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);

    await fileDoc.deleteOne();

    const io = req.app.get("io");
    if (io) io.to(roomCode).emit("file-deleted", { roomCode, fileId });

    return res.json({ ok: true, fileId });
  } catch (err) {
    return res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;