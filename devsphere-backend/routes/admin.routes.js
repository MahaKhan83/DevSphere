// devsphere-backend/routes/admin.routes.js
const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");

const { 
  getOverview, 
  getAdminUsers, 
  createAdminUser, 
  updateUserStatus,
  updateUserRole   // ✅ NEW
} = require("../controllers/admin.controller");

// Admin dashboard overview
router.get("/overview", protect, adminOnly, getOverview);

// Admin users list
router.get("/users", protect, adminOnly, getAdminUsers);

// Invite / create user
router.post("/users", protect, adminOnly, createAdminUser);

// Update user status
router.patch("/users/:id/status", protect, adminOnly, updateUserStatus);

// ✅ NEW: Update user role
router.patch("/users/:id/role", protect, adminOnly, updateUserRole);

module.exports = router;