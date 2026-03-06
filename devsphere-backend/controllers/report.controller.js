const Report = require("../models/Report");

// ✅ ADMIN: Get all reports (optional filter by type)
exports.getAdminReports = async (req, res) => {
  try {
    const type = String(req.query.type || "").toLowerCase().trim(); // showcase|room|user
    const filter = {};

    if (["showcase", "room", "user"].includes(type)) {
      filter.type = type;
    }

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email role")
      .lean();

    return res.json({ success: true, reports });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to load reports",
      error: err.message,
    });
  }
};

// ✅ ADMIN: Update report status
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["open", "in_review", "resolved"];
    const next = String(status || "").toLowerCase().trim();

    if (!allowed.includes(next)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowed.join(", ")}`,
      });
    }

    const updated = await Report.findByIdAndUpdate(
      id,
      { status: next },
      { new: true }
    )
      .populate("createdBy", "name email role")
      .lean();

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    return res.json({ success: true, report: updated });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Update report status failed",
      error: err.message,
    });
  }
};

// ✅ USER: Create report (showcase / room / user)
exports.createReport = async (req, res) => {
  try {
    const { type, target, reason } = req.body;

    const t = String(type || "").toLowerCase().trim();
    const allowedTypes = ["showcase", "room", "user"];

    if (!allowedTypes.includes(t)) {
      return res.status(400).json({
        success: false,
        message: `Invalid type. Allowed: ${allowedTypes.join(", ")}`,
      });
    }

    if (!target || !reason) {
      return res.status(400).json({
        success: false,
        message: "target and reason are required",
      });
    }

    const report = await Report.create({
      type: t,
      target: String(target).trim(),
      reason: String(reason).trim(),
      status: "open",
      createdBy: req.user._id,
    });

    const populated = await Report.findById(report._id)
      .populate("createdBy", "name email role")
      .lean();

    return res.status(201).json({ success: true, report: populated });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Create report failed",
      error: err.message,
    });
  }
};