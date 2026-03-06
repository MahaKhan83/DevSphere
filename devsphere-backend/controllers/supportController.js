const SupportTicket = require("../models/SupportTicket");

// ✅ PUBLIC / USER: Create support ticket
exports.createSupportTicket = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "name, email, subject and message are required",
      });
    }

    const ticket = await SupportTicket.create({
      user: req.user?._id || null,
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
      status: "open",
    });

    const populated = await SupportTicket.findById(ticket._id)
      .populate("user", "name email role")
      .lean();

    return res.status(201).json({
      success: true,
      ticket: populated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Create support ticket failed",
      error: err.message,
    });
  }
};

// ✅ ADMIN / MODERATOR: Get all support tickets
exports.getAllSupportTickets = async (req, res) => {
  try {
    const status = String(req.query.status || "").toLowerCase().trim();
    const filter = {};

    if (["open", "in_progress", "resolved"].includes(status)) {
      filter.status = status;
    }

    const tickets = await SupportTicket.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email role")
      .lean();

    return res.json({
      success: true,
      tickets,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to load support tickets",
      error: err.message,
    });
  }
};

// ✅ ADMIN / MODERATOR: Update support ticket status
exports.updateSupportTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["open", "in_progress", "resolved"];
    const next = String(status || "").toLowerCase().trim();

    if (!allowed.includes(next)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowed.join(", ")}`,
      });
    }

    const updated = await SupportTicket.findByIdAndUpdate(
      id,
      { status: next },
      { new: true }
    )
      .populate("user", "name email role")
      .lean();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    return res.json({
      success: true,
      ticket: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Update support ticket status failed",
      error: err.message,
    });
  }
};