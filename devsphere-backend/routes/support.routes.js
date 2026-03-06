const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");

const {
  createSupportTicket,
  getAllSupportTickets,
  updateSupportTicketStatus,
} = require("../controllers/supportController");

// ✅ PUBLIC: create support ticket
router.post("/", createSupportTicket);

// ✅ ADMIN / MODERATOR: list support tickets
router.get("/admin", protect, adminOnly, getAllSupportTickets);

// ✅ ADMIN / MODERATOR: update support ticket status
router.patch("/:id/status", protect, adminOnly, updateSupportTicketStatus);

module.exports = router;