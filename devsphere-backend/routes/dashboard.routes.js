// src/routes/dashboard.routes.js
const express = require("express");
const router = express.Router();

const { getDashboardData } = require("../controllers/dashboard.controller");
const protect = require("../middleware/authMiddleware");// ✅ apne project ka auth middleware path yahan set karo

router.get("/", protect, getDashboardData);

module.exports = router;