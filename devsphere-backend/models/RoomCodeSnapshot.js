// src/models/RoomCodeSnapshot.js
const mongoose = require("mongoose");

const RoomCodeSnapshotSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, unique: true, index: true },

    // store all code parts
    js: { type: String, default: "" },
    html: { type: String, default: "" },
    css: { type: String, default: "" },

    // optional metadata
    lastSavedBy: { type: String, default: "" },
    lastSavedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomCodeSnapshot", RoomCodeSnapshotSchema);