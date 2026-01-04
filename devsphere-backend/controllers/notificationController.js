// controllers/notificationController.js
const Notification = require("../models/Notification");

// Get all notifications for a user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ 
      success: true,
      notifications 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// Mark a notification as read
const markNotificationRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ 
      success: false,
      message: "Notification not found" 
    });

    res.json({ 
      success: true,
      message: "Notification marked as read", 
      notification 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// Clear all notifications for a user
const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    res.json({ 
      success: true,
      message: "All notifications cleared" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// ✅ CREATE NEW NOTIFICATION
const createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    
    // Validation
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required"
      });
    }
    
    const notification = new Notification({
      user: req.user.id,
      title,
      message,
      type: type || "update",
      read: false
    });

    await notification.save();
    
    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// ✅ UPDATE EXPORTS - ADD createNotification
module.exports = {
  getNotifications,
  markNotificationRead,
  clearAllNotifications,
  createNotification  // ✅ ADD THIS LINE
};