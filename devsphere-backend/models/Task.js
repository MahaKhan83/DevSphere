// src/models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, index: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    status: { type: String, enum: ["open", "done"], default: "open" },

    // optional assignment
    assignedTo: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      name: { type: String, default: "" },
    },

    createdBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, default: "" },
    },

    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);