const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");

const {
  getAdminReports,
  updateReportStatus,
  createReport
} = require("../controllers/report.controller");

// ✅ USER: create report
router.post("/", protect, createReport);

// ✅ ADMIN: list reports (optional filter ?type=showcase|room|user)
router.get("/admin", protect, adminOnly, getAdminReports);

// ✅ ADMIN: update report status
router.patch("/:id/status", protect, adminOnly, updateReportStatus);

module.exports = router;