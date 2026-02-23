const router = require("express").Router();
const auth = require("../middleware/authMiddleware"); // JWT auth middleware
const c = require("../controllers/showcase.controller");

// ================= FEED =================
// login ho to isLiked/isSaved set ho jayega
// NOTE: auth optional — login na ho to bhi feed open
router.get("/", auth, c.getFeed);

// ================= POSTS =================
router.post("/", auth, c.createPost);
router.delete("/:id", auth, c.deletePost);

// ================= LIKE / SAVE =================
router.post("/:id/like", auth, c.toggleLike);
router.post("/:id/save", auth, c.toggleSave);

// ================= INVITE / REQUEST =================
router.post("/:id/invite", auth, c.sendInvite);
router.post("/:id/request", auth, c.sendRequest);

// ================= COMMENTS =================

// GET comments (public)
router.get("/:id/comments", auth, c.getComments);

// ADD comment
router.post("/:id/comments", auth, c.addComment);

// DELETE comment
router.delete("/:id/comments/:commentId", auth, c.deleteComment);

// ⭐ NEW — LIKE COMMENT (persist after refresh)
router.post("/:id/comments/:commentId/like", auth, c.toggleCommentLike);

module.exports = router;