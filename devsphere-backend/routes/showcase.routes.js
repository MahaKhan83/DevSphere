const router = require("express").Router();

// ✅ Use the SAME middleware that sets req.user properly
let protect;
try {
  protect = require("../middleware/protect"); // ✅ your new one
} catch (e) {
  protect = require("../middleware/authMiddleware"); // fallback
}

const c = require("../controllers/showcase.controller");

// ================= FEED =================
// login ho to isLiked/isSaved set ho jayega
// NOTE: protect optional — login na ho to bhi feed open
router.get("/", protect, c.getFeed);

// ================= POSTS =================
router.post("/", protect, c.createPost);

// ✅ IMPORTANT: delete route must only use protect (NOT adminOnly here)
// Controller already allows: owner OR admin/moderator
router.delete("/:id", protect, c.deletePost);

// ================= LIKE / SAVE =================
router.post("/:id/like", protect, c.toggleLike);
router.post("/:id/save", protect, c.toggleSave);

// ================= INVITE / REQUEST =================
router.post("/:id/invite", protect, c.sendInvite);
router.post("/:id/request", protect, c.sendRequest);

// ================= COMMENTS =================

// GET comments (public-ish, but needs user if logged in)
router.get("/:id/comments", protect, c.getComments);

// ADD comment
router.post("/:id/comments", protect, c.addComment);

// DELETE comment (owner OR staff)
router.delete("/:id/comments/:commentId", protect, c.deleteComment);

// ⭐ NEW — LIKE COMMENT (persist after refresh)
router.post("/:id/comments/:commentId/like", protect, c.toggleCommentLike);

module.exports = router;