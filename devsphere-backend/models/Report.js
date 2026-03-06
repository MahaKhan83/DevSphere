const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["showcase", "room", "user"], required: true },
    target: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["open", "in_review", "resolved"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);