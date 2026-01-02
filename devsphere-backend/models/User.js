const mongoose = require("mongoose");

// User schema define karo
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    // 🔴 RESET PASSWORD FIELDS (VERY IMPORTANT)
    resetToken: { type: String },

    resetTokenExpire: { type: Date },
  },
  { timestamps: true }
);

// Model export karo
module.exports = mongoose.model("User", userSchema);
