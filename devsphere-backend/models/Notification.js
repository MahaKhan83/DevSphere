const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ IMPORTANT: now we will use meaningful types
    type: {
      type: String,
      enum: [
        "follow",
        "invite",
        "comment",
        "request",
        "update",
        "success",
        "info",
        "warning",
        "error",

        // ✅ NEW (project/showcase)
        "PROJECT_INVITE",
        "PROJECT_WORK_REQUEST",
        "SHOWCASE_COMMENT",

        // ✅ OPTIONAL (room specific)
        "ROOM_JOIN_REQUEST",
        "ROOM_APPROVED",
        "ROOM_REJECTED",
        "ROOM_CREATED",
      ],
      default: "update",
    },

    // ✅ NEW: tell frontend where this notification belongs
    entityType: {
      type: String,
      enum: ["room", "project", "post", "other"],
      default: "other",
    },

    // ✅ OPTIONAL: for opening a specific post/project
    postId: { type: String },

    title: { type: String, required: true },
    message: { type: String, required: true },

    action: {
      label: String,
      path: String,
      state: Object, // ✅ allow state navigation
    },

    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);