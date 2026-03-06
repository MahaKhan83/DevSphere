const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "pending", "blocked"],
      default: "active",
    },

    resetToken: { type: String },

    resetTokenExpire: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);