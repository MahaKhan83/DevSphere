const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["follow", "invite", "comment", "update", "success", "info", "warning", "error"],
      default: "update",
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    action: {
      label: String,
      path: String,
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);