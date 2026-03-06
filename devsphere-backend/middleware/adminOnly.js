// devsphere-backend/middleware/adminOnly.js
module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const role = String(req.user.role || "").toLowerCase();

  // ✅ allow admin + moderator
  if (role !== "admin" && role !== "moderator") {
    return res.status(403).json({ message: "Admin/Moderator access required" });
  }

  next();
};