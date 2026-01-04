const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
<<<<<<< Updated upstream
const jwt = require("jsonwebtoken");

=======
const jwt = require("jsonwebtoken"); // ✅ ADDED
>>>>>>> Stashed changes
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
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user", // ✅ default role
    });

    await user.save();

<<<<<<< Updated upstream
    res.json({ message: "User registered successfully" });
=======
    // ✅ GENERATE JWT TOKEN
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ 
      success: true, 
      message: "User registered successfully",
      token: token, // ✅ ADD TOKEN
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
>>>>>>> Stashed changes
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- LOGIN -----------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

<<<<<<< Updated upstream
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
=======
    // ✅ GENERATE JWT TOKEN
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ SUCCESS RESPONSE
    res.json({
      success: true,
      message: "Login successful!",
      token: token, // ✅ JWT TOKEN
>>>>>>> Stashed changes
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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
router.get(
  "/moderator-dashboard",
  protect,
  checkRole("moderator"),
  (req, res) => {
    res.json({
      message: "Welcome Moderator 🛡️",
      user: req.user,
    });
  }
);

// ----------------- ADMIN DASHBOARD -----------------
router.get(
  "/admin-dashboard",
  protect,
  checkRole("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin 👑",
      user: req.user,
    });
  }
);

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

module.exports = router;
