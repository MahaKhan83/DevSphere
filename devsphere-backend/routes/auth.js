const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const checkRole = require("../middleware/rolemiddleware");

// ----------------- REGISTER -----------------
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Name too short" });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user", // ✅ default role
    });

    await user.save();

    // ✅ COMBINED: Role included + Better response
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      success: true, 
      message: "User registered successfully",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});
// ----------------- LOGIN -----------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ TOKEN me bhi role store
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,    // <--- YEH BOHOT IMPORTANT
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ RESPONSE me bhi role bhejo
    return res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,   // <--- YEH LINE ZAROORI
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// ----------------- USER DASHBOARD -----------------
router.get("/user-dashboard", protect, (req, res) => {
  res.json({
    message: "Welcome User 👤",
    user: req.user,
  });
});

// ----------------- MODERATOR DASHBOARD -----------------
router.get("/moderator-dashboard", protect, checkRole("moderator"), (req, res) => {
  res.json({
    message: "Welcome Moderator 🛡️",
    user: req.user,
  });
});

// ----------------- ADMIN DASHBOARD -----------------
router.get("/admin-dashboard", protect, checkRole("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin 👑",
    user: req.user,
  });
});

// ----------------- FORGOT PASSWORD -----------------
router.post("/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ message: "User not found" });

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpire = Date.now() + 3600000;
  await user.save();

  res.json({ message: "Reset link sent" });
});

// ----------------- RESET PASSWORD -----------------
router.post("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) return res.json({ message: "Invalid token" });

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.json({ message: "Password reset success" });
});

// ✅✅✅ MUST HAVE THIS LINE:
module.exports = router;