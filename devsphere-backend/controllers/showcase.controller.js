const ShowcasePost = require("../models/ShowcasePost");

// ✅ imports for Invite/Request/Comments Notifications
const Notification = require("../models/Notification");
const User = require("../models/User");

const formatPostForUI = (post, userId = null) => {
  const uid = userId ? String(userId) : null;

  return {
    id: String(post._id),
    title: post.title,
    tech: post.tech || [],

    likes: post.likes?.length || 0,
    comments: post.comments?.length || 0,
    saves: post.saves?.length || 0,

    author: post.authorName,
    time: post.createdAt,
    desc: post.desc,
    github: post.github,
    thumb: post.thumb,

    // ✅ refresh ke baad bhi heart/bookmark filled rahe
    isLiked: uid ? (post.likes || []).some((x) => String(x) === uid) : false,
    isSaved: uid ? (post.saves || []).some((x) => String(x) === uid) : false,
  };
};

/* =========================
   1) GET FEED
   ========================= */
exports.getFeed = async (req, res) => {
  try {
    const userId = req.user?._id || null;
    const { q, tech, sort } = req.query;

    const filter = {};
    if (tech && tech !== "All") filter.tech = tech;

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { desc: { $regex: q, $options: "i" } },
        { authorName: { $regex: q, $options: "i" } },
        { tech: { $regex: q, $options: "i" } },
      ];
    }

    let query = ShowcasePost.find(filter);

    // simple: newest
    if (sort === "Newest") query = query.sort({ createdAt: -1 });
    else query = query.sort({ createdAt: -1 });

    const posts = await query.limit(60);

    res.json({ projects: posts.map((p) => formatPostForUI(p, userId)) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =========================
   2) CREATE POST
   ========================= */
exports.createPost = async (req, res) => {
  try {
    const { title, desc, github, thumb, tech } = req.body;

    if (!title || !desc || !github || !thumb) {
      return res.status(400).json({ message: "title, desc, github, thumb required" });
    }

    const newPost = await ShowcasePost.create({
      author: req.user._id,
      authorName: req.user.name || req.user.email,
      title,
      desc,
      github,
      thumb,
      tech: Array.isArray(tech) ? tech : [tech].filter(Boolean),
    });

    res.status(201).json({ project: formatPostForUI(newPost, req.user?._id || null) });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

/* =========================
   3) DELETE POST
   ========================= */
exports.deletePost = async (req, res) => {
  try {
    const post = await ShowcasePost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.author) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =========================
   4) TOGGLE LIKE (post)
   ========================= */
exports.toggleLike = async (req, res) => {
  try {
    const post = await ShowcasePost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const uid = String(req.user._id);
    const already = (post.likes || []).some((x) => String(x) === uid);

    if (already) post.likes = post.likes.filter((x) => String(x) !== uid);
    else post.likes.push(req.user._id);

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =========================
   5) TOGGLE SAVE (post)
   ========================= */
exports.toggleSave = async (req, res) => {
  try {
    const post = await ShowcasePost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const uid = String(req.user._id);
    const already = (post.saves || []).some((x) => String(x) === uid);

    if (already) post.saves = post.saves.filter((x) => String(x) !== uid);
    else post.saves.push(req.user._id);

    await post.save();
    res.json({ saves: post.saves.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =========================
   6) GET COMMENTS (✅ likes persist + likedByMe)
   ========================= */
exports.getComments = async (req, res) => {
  try {
    const post = await ShowcasePost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const uid = req.user?._id ? String(req.user._id) : null;

    const comments = (post.comments || []).map((c) => ({
      id: String(c._id),
      name: c.name,
      text: c.text,
      time: c.createdAt,

      // ✅ Real likes
      likes: (c.likes || []).length,

      // ✅ For filled heart after refresh
      likedByMe: uid ? (c.likes || []).some((x) => String(x) === uid) : false,
    }));

    res.json({ comments });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =========================
   7) ADD COMMENT (✅ with notification)
   ========================= */
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !String(text).trim()) {
      return res.status(400).json({ message: "text required" });
    }

    const post = await ShowcasePost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const commenterName = req.user.name || req.user.email;

    post.comments.unshift({
      user: req.user._id,
      name: commenterName,
      text: String(text).trim(),
    });

    // ✅ notify owner (owner khud comment na kar raha ho)
    if (String(post.author) !== String(req.user._id)) {
      await Notification.create({
        user: post.author,
        type: "comment",
        title: "New Comment",
        message: `${commenterName} commented on your project`,
        action: { label: "Open project", path: `/showcase/${post._id}` },
        read: false,
      });
    }

    await post.save();
    res.status(201).json({ commentsCount: post.comments.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =========================
   8) DELETE COMMENT
   ========================= */
exports.deleteComment = async (req, res) => {
  try {
    const post = await ShowcasePost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (String(comment.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    comment.deleteOne();
    await post.save();
    res.json({ message: "Comment deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* =========================================================
   ✅ COMMENT LIKE (persist after refresh)
   POST /api/showcase/:id/comments/:commentId/like
   ========================================================= */
exports.toggleCommentLike = async (req, res) => {
  try {
    const post = await ShowcasePost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const uid = String(req.user._id);
    const already = (comment.likes || []).some((x) => String(x) === uid);

    if (already) comment.likes = comment.likes.filter((x) => String(x) !== uid);
    else comment.likes.push(req.user._id);

    await post.save();

    return res.json({
      likes: (comment.likes || []).length,
      liked: !already,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

/* =========================================================
   ✅ INVITE + REQUEST
   ========================================================= */

// POST /api/showcase/:id/invite
exports.sendInvite = async (req, res) => {
  try {
    const { inviteTo, message } = req.body;
    if (!inviteTo) return res.status(400).json({ message: "inviteTo required" });

    const post = await ShowcasePost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const targetUser = await User.findOne({
      $or: [{ email: inviteTo }, { name: inviteTo }],
    });

    if (targetUser) {
      await Notification.create({
        user: targetUser._id,
        type: "invite",
        title: "Project Invite",
        message: message || "You are invited to collaborate",
        action: { label: "Open project", path: `/showcase/${post._id}` },
        read: false,
      });
    }

    return res.json({ ok: true, invited: !!targetUser });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// POST /api/showcase/:id/request
exports.sendRequest = async (req, res) => {
  try {
    const { message } = req.body;

    const post = await ShowcasePost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await Notification.create({
      user: post.author,
      type: "update", // ✅ FIX: your Notification enum does NOT include "request"
      title: "Collaboration Request",
      message: message || "Someone requested to work on your project",
      action: { label: "Open project", path: `/showcase/${post._id}` },
      read: false,
    });

    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};