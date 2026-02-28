// models/RoomFile.js
const mongoose = require("mongoose");

const roomFileSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, index: true },
    originalName: { type: String, required: true },
    filename: { type: String, required: true }, // saved filename on disk
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true }, // /uploads/collaboration/<room>/<filename>
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // OWNER ✅
    uploadedByName: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomFile", roomFileSchema);