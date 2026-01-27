const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ========== ENVIRONMENT CHECK ==========
console.log("\n" + "=".repeat(60));
console.log("🔧 ENVIRONMENT CHECK STARTED");
console.log("=".repeat(60));

// ✅ FORCE RELOAD ENV
require('dotenv').config({ path: '.env' });

console.log("📧 EMAIL_USER:", process.env.EMAIL_USER || "NOT FOUND");
console.log("📧 EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("📧 EMAIL_PASS raw:", process.env.EMAIL_PASS ? "***" + process.env.EMAIL_PASS.slice(-4) : "NOT FOUND");
console.log("📧 EMAIL_PASS length:", process.env.EMAIL_PASS?.length || 0);

// ✅ ALTERNATIVE EMAIL CONFIG (Gmail aur Zoho dono ke liye)
let transporter;

// Try Gmail first
const gmailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.replace(/\s/g, '') // Remove all spaces
  },
  tls: {
    rejectUnauthorized: false
  }
};

// Try Zoho as backup
const zohoConfig = {
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

// Create transporter
transporter = nodemailer.createTransport(gmailConfig);

// Test connection
transporter.verify((error, success) => {
  if (error) {
    console.log("\n❌ GMAIL FAILED. Trying alternative...");
    
    // Try alternative config
    const altTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    altTransporter.verify((altError, altSuccess) => {
      if (altError) {
        console.log("❌ ALL GMAIL CONFIGS FAILED");
        console.log("⚠️  Using SIMPLE MODE - Links in console only");
      } else {
        console.log("✅ ALTERNATIVE GMAIL CONFIG WORKING!");
        transporter = altTransporter;
      }
    });
  } else {
    console.log("\n✅ GMAIL SMTP CONNECTION SUCCESSFUL!");
  }
});

// ----------------- REGISTER -----------------
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ 
        success: false,
        message: "Name must be at least 2 characters" 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 8 characters" 
      });
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain uppercase, lowercase letters and numbers"
      });
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
      role: "user",
    });

    await user.save();

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
    console.error("Register error:", err);
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

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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

// ----------------- FORGOT PASSWORD (GUARANTEED WORKING) -----------------
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log("\n" + "=".repeat(50));
    console.log("📧 FORGOT PASSWORD REQUEST");
    console.log("=".repeat(50));
    console.log("User Email:", email);
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log("❌ User not found");
      // Still return success for security
      return res.json({ 
        success: true, 
        message: "If email exists, reset link will be sent" 
      });
    }

    console.log("✅ User found:", user.email);

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log("🔐 Token generated (first 10 chars):", resetToken.substring(0, 10) + "...");
    
    // Save to database
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 7200000; // 2 hours
    
    await user.save({ validateBeforeSave: false });
    console.log("💾 Token saved to database");

    // Create reset link
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    console.log("🔗 Reset Link:", resetLink);
    
    // ✅ ALWAYS WORKING EMAIL OR CONSOLE
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@devsphere.com',
      to: user.email,
      subject: 'Password Reset - DevSphere',
      text: `Click to reset password: ${resetLink}\nLink valid for 2 hours.`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetLink}" style="color: blue;">${resetLink}</a></p>
          <p><small>This link expires in 2 hours.</small></p>
        </div>
      `
    };

    console.log("📤 Attempting to send email...");
    
    try {
      // Try to send email
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ EMAIL SENT SUCCESSFULLY!");
      console.log("Message ID:", info.messageId);
      
      return res.json({ 
        success: true, 
        message: "Password reset link sent to your email"
      });
      
    } catch (emailError) {
      console.log("⚠️  Email failed, returning link in response");
      console.log("Error:", emailError.message);
      
      // Return link in response if email fails
      return res.json({ 
        success: true, 
        message: "Check below for reset link",
        resetLink: resetLink,
        token: resetToken,
        note: "Copy this link and open in browser"
      });
    }
    
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

// ----------------- TEST ROUTE -----------------
router.get("/test-email-final", async (req, res) => {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 FINAL EMAIL TEST");
  console.log("=".repeat(50));
  
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: '✅ FINAL TEST - DevSphere',
      text: 'If you get this, email system is working!',
      html: '<h3>✅ Success!</h3><p>Email system is operational.</p>'
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email sent to yourself!");
    console.log("Message ID:", info.messageId);
    
    return res.json({ 
      success: true, 
      message: "Test email sent. Check your inbox.",
      to: process.env.EMAIL_USER
    });
    
  } catch (error) {
    console.log("❌ Email test failed");
    console.log("Error:", error.message);
    
    return res.json({
      success: false,
      message: "Email setup needed",
      solution: "1. Generate new app password 2. Update .env file"
    });
  }
});

// ----------------- RESET PASSWORD -----------------
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    
    await user.save();

    return res.json({ 
      success: true, 
      message: "Password reset successfully" 
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(400).json({ 
      success: false, 
      message: "Invalid or expired reset token" 
    });
  }
});

module.exports = router;