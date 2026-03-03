const ShowcasePost = require("../models/ShowcasePost");
const Notification = require("../models/Notification");
const User = require("../models/User");

/* ================= FORMAT FOR UI ================= */
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
    isLiked: uid ? (post.likes || []).some((x) => String(x) === uid) : false,
    isSaved: uid ? (post.saves || []).some((x) => String(x) === uid) : false,
  };
};

/* ================= SOCKET EMIT HELPER ================= */
const emitToUser = (req, userId, payload) => {
  try {
    const io = req.app.get("io");
    if (!io) return;
    const uid = String(userId || "").trim();
    if (!uid) return;

    io.to(`user:${uid}`).emit("notification:new", payload);
  } catch (e) {
    // silent
  }
};

/* ================= GET FEED ================= */
exports.getFeed = async (req, res) => {
  try {
    const userId = req.user?._id || null;
    const posts = await ShowcasePost.find().sort({ createdAt: -1 }).limit(60);
    res.json({ projects: posts.map((p) => formatPostForUI(p, userId)) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* ================= CREATE POST ================= */
exports.createPost = async (req, res) => {
  try {
    const { title, desc, github, thumb, tech } = req.body;

    const newPost = await ShowcasePost.create({
      author: req.user._id,
      authorName: req.user.name || req.user.email,
      title,
      desc,
      github,
      thumb,
      tech: Array.isArray(tech) ? tech : [tech],
    });

    res.status(201).json({
      project: formatPostForUI(newPost, req.user._id),
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

/* ================= DELETE POST ================= */
exports.deletePost = async (req, res) => {
  try {
    const post = await ShowcasePost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.author) !== String(req.user._id))
      return res.status(403).json({ message: "Not allowed" });

    await post.deleteOne();
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* ================= LIKE ================= */
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

/* ================= SAVE ================= */
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

/* ================= ADD COMMENT ================= */
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !String(text).trim())
      return res.status(400).json({ message: "text required" });

    const post = await ShowcasePost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const commenterName = req.user.name || req.user.email || "Someone";

    post.comments.unshift({
      user: req.user._id,
      name: commenterName,
      text: String(text).trim(),
    });

    await post.save();

    // ✅ notify owner (owner khud comment na kar raha ho)
    if (String(post.author) !== String(req.user._id)) {
      const n = await Notification.create({
        user: post.author,
        type: "SHOWCASE_COMMENT",
        entityType: "post",
        postId: String(post._id),
        title: "New Comment",
        message: `${commenterName} commented on your project`,
        action: {
          label: "Open post",
          path: "/showcase",
          state: { postId: String(post._id) },
        },
        read: false,
      });

      // ✅ REALTIME PUSH (instant badge update)
      emitToUser(req, post.author, {
        _id: String(n._id),
        type: n.type,
        entityType: n.entityType,
        postId: n.postId,
        title: n.title,
        message: n.message,
        action: n.action,
        read: n.read,
        createdAt: n.createdAt,
      });
    }

    res.json({ commentsCount: post.comments.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* ================= PROJECT INVITE ================= */
exports.sendInvite = async (req, res) => {
  try {
    const { inviteTo, message } = req.body;

    const post = await ShowcasePost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const targetUser = await User.findOne({
      $or: [{ email: inviteTo }, { name: inviteTo }],
    });

    if (targetUser) {
      const n = await Notification.create({
        user: targetUser._id,
        type: "PROJECT_INVITE",
        entityType: "project",
        postId: String(post._id),
        title: "Project Invite",
        message: message || "You are invited to collaborate",
        action: {
          label: "Open project",
          path: "/showcase",
          state: { postId: String(post._id) },
        },
        read: false,
      });

      // ✅ realtime
      emitToUser(req, targetUser._id, {
        _id: String(n._id),
        type: n.type,
        entityType: n.entityType,
        postId: n.postId,
        title: n.title,
        message: n.message,
        action: n.action,
        read: n.read,
        createdAt: n.createdAt,
      });
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* ================= PROJECT WORK REQUEST ================= */
exports.sendRequest = async (req, res) => {
  try {
    const { message } = req.body;

    const post = await ShowcasePost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.author) === String(req.user._id))
      return res.status(400).json({ message: "Cannot request your own project" });

    const requesterName = req.user?.name || req.user?.email || "Someone";

    const n = await Notification.create({
      user: post.author,
      type: "PROJECT_WORK_REQUEST",
      entityType: "project",
      postId: String(post._id),
      title: "Request to work",
      message: message || `${requesterName} wants to work on your project`,
      action: {
        label: "Open project",
        path: "/showcase",
        state: { postId: String(post._id) },
      },
      read: false,
    });

    // ✅ realtime
    emitToUser(req, post.author, {
      _id: String(n._id),
      type: n.type,
      entityType: n.entityType,
      postId: n.postId,
      title: n.title,
      message: n.message,
      action: n.action,
      read: n.read,
      createdAt: n.createdAt,
    });

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};