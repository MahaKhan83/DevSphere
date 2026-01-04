const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "moderator", "admin"],

      default: "user", // ✅ USER ROLE
    },

    resetToken: { type: String },

    resetTokenExpire: { type: Date },
  },
  { timestamps: true }
);

<<<<<<< Updated upstream
module.exports = mongoose.model("User", userSchema);
=======
// Model export karo
module.exports = mongoose.model("User", userSchema);
>>>>>>> Stashed changes
