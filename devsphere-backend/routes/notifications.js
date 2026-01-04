const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markNotificationRead,
  clearAllNotifications,
  createNotification  // ✅ ADD THIS LINE
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

// ✅ PUBLIC TEST ROUTE (No auth needed - for testing)
router.get("/test", (req, res) => {
  console.log("📢 Notifications test route called");
  res.json({
    success: true,
    message: "✅ Notifications API is working!",
    timestamp: new Date().toISOString(),
    note: "This is a public test route - no authentication needed",
    endpoints: {
      publicTest: "GET /api/notifications/test",
      create: "POST /api/notifications (requires auth)",  // ✅ ADD THIS
      getAll: "GET /api/notifications (requires auth)",
      markRead: "PUT /api/notifications/read/:id (requires auth)",
      clearAll: "DELETE /api/notifications/clear (requires auth)"
    }
  });
});

// ✅ CREATE NOTIFICATION ROUTE - ADD THIS
router.post("/", authMiddleware, createNotification);

// ✅ PROTECTED ROUTES (Need valid JWT token)

// Get all notifications for logged-in user
router.get("/", authMiddleware, getNotifications);

// Mark a notification as read
router.put("/read/:id", authMiddleware, markNotificationRead);

// Clear all notifications
router.delete("/clear", authMiddleware, clearAllNotifications);

module.exports = router;