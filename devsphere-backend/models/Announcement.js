const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    time: { type: String }, // optional display text
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);