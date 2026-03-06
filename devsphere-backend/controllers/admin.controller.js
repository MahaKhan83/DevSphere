// devsphere-backend/controllers/admin.controller.js
const User = require("../models/User");
const Report = require("../models/Report");
const bcrypt = require("bcryptjs");

/* ======================= */
/* Admin Overview          */
/* ======================= */
exports.getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});

    const admins = await User.countDocuments({ role: "admin" });
    const moderators = await User.countDocuments({ role: "moderator" });

    // ✅ Since lastActiveAt field abhi model me nahi hai,
    // active users ko current active-status users se count kar rahe hain
    const activeUsers24h = await User.countDocuments({ status: "active" });

    // ✅ Pending reports = sirf open
    const pendingReports = await Report.countDocuments({ status: "open" });

    // ✅ Flagged items = unresolved reports
    const flaggedItems = await Report.countDocuments({
      status: { $in: ["open", "in_review"] },
    });

    return res.json({
      totalUsers,
      admins,
      moderators,
      activeUsers24h,
      pendingReports,
      flaggedItems,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Overview failed",
      error: err.message,
    });
  }
};

/* ======================= */
/* Admin Users List        */
/* ======================= */
exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("_id name email role status createdAt")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to load users",
      error: err.message,
    });
  }
};

/* ======================= */
/* Invite / Create User    */
/* ======================= */
exports.createAdminUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "user",
      status = "pending",
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email, password required",
      });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role,
      status,
    });

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Create user failed",
      error: err.message,
    });
  }
};

/* ======================= */
/* Update User Status      */
/* ======================= */
exports.updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    const allowed = ["active", "pending", "blocked"];
    const nextStatus = String(status || "").toLowerCase();

    if (!allowed.includes(nextStatus)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${allowed.join(", ")}`,
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status: nextStatus },
      { new: true }
    ).select("_id name email role status createdAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({
      message: "Update status failed",
      error: err.message,
    });
  }
};

/* ======================= */
/* Update User Role        */
/* ======================= */
exports.updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const allowed = ["user", "moderator", "admin"];
    const nextRole = String(role || "").toLowerCase();

    if (!allowed.includes(nextRole)) {
      return res.status(400).json({
        message: `Invalid role. Allowed: ${allowed.join(", ")}`,
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: nextRole },
      { new: true }
    ).select("_id name email role status createdAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({
      message: "Update role failed",
      error: err.message,
    });
  }
};