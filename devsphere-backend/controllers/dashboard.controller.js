// src/controllers/dashboard.controller.js

let Project;
let Announcement;
let ShowcasePost;
let Notification;
let User;

// Safe requires (agar model nahi milta to crash na ho)
try { Project = require("../models/Project"); } catch (e) {}
try { Announcement = require("../models/Announcement"); } catch (e) {}
try { ShowcasePost = require("../models/ShowcasePost"); } catch (e) {}
try { Notification = require("../models/Notification"); } catch (e) {}
try { User = require("../models/User"); } catch (e) {}

const getDashboardData = async (req, res) => {
  try {
    // ✅ auth middleware usually req.user me id deta hai
    const userId = req.user?.id || req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized (no user id)" });
    }

    // -----------------------
    // ✅ 1) Stats (Showcase-only counts)
    // -----------------------
    let totalProjects = 0;      // ALL showcase posts (feed)
    let totalRequests = 0;      // MY showcase posts (you show as Requests)
    let likesReceived = 0;      // total likes on MY posts
    let saved = 0;              // total saves/bookmarks on MY posts (or fallback)
    let unreadNotifications = 0;

    // ✅ "MY posts" query (different projects use different fields, so we try all)
    const myPostQuery = {
      $or: [
        { author: userId },
        { createdBy: userId },
        { user: userId },
        { owner: userId },
      ],
    };

    // ✅ 1) Total projects = ALL Showcase posts
    // ✅ 2) Requests = MY Showcase posts
    // ✅ 3) Likes received = sum likes[] on MY posts
    // ✅ 4) Saved = sum savedBy/bookmarks/saves arrays on MY posts (if exist)
    if (ShowcasePost) {
      // Total showcase posts in whole feed
      totalProjects = await ShowcasePost.countDocuments({}).catch(() => 0);

      // My showcase posts
      totalRequests = await ShowcasePost.countDocuments(myPostQuery).catch(() => 0);

      // Likes on my posts
      const myLikesPosts =
        (await ShowcasePost.find(myPostQuery).select("likes").lean().catch(() => [])) || [];

      likesReceived = myLikesPosts.reduce(
        (sum, p) => sum + (Array.isArray(p.likes) ? p.likes.length : 0),
        0
      );

      // Saves/bookmarks on my posts (try multiple field names)
      // ✅ Saves on my posts (ShowcasePost schema: saves: [userId])
const mySavePosts =
  (await ShowcasePost.find(myPostQuery)
    .select("saves")
    .lean()
    .catch(() => [])) || [];

saved = mySavePosts.reduce((sum, p) => {
  const arr = p.saves || [];
  return sum + (Array.isArray(arr) ? arr.length : 0);
}, 0);
    }

    // ✅ Fallback for saved: agar ShowcasePost me save fields hi nahi hain
    // to User model me saved list se count kar do
    if (saved === 0 && User) {
      const me = await User.findById(userId)
        .select("savedPosts bookmarks saved showcaseSaved")
        .lean()
        .catch(() => null);

      if (me) {
        const arr =
          me.savedPosts ||
          me.bookmarks ||
          me.saved ||
          me.showcaseSaved ||
          [];

        saved = Array.isArray(arr) ? arr.length : 0;
      }
    }

    // ✅ Unread notifications
    if (Notification) {
      unreadNotifications =
        (await Notification.countDocuments({ user: userId, read: false }).catch(() => null)) ??
        (await Notification.countDocuments({ recipient: userId, read: false }).catch(() => 0));
    }

    // -----------------------
    // ✅ 2) Recent Projects list (same as before)
    // -----------------------
    

    // ✅ Ab tum chah rahi ho “Recent projects” bhi showcase feed wali list ho?
    // Abhi main tumhara existing Project logic same rakhti hun (kyunke UI me progress hai).
    // Agar Project model tumhare pass nahi, frontend already fallback projects show karega.
    // ✅ Recent projects (REAL from ShowcasePost)

// ✅ Recent projects (REAL from ShowcasePost) with smart progress
let projects = [];

if (ShowcasePost) {
  const recentPosts = await ShowcasePost.find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .select("title likes saves createdAt")
    .lean()
    .catch(() => []);

  // score = likes + saves
  const scores = recentPosts.map((p) => {
    const likes = Array.isArray(p.likes) ? p.likes.length : 0;
    const saves = Array.isArray(p.saves) ? p.saves.length : 0;
    return likes + saves;
  });

  const maxScore = Math.max(...scores, 1); // avoid divide by 0

  projects = recentPosts.map((p, idx) => {
    const likes = Array.isArray(p.likes) ? p.likes.length : 0;
    const saves = Array.isArray(p.saves) ? p.saves.length : 0;
    const score = likes + saves;

    const progress = Math.round((score / maxScore) * 100); // 0-100
    return {
      name: p.title || "Untitled",
      progress,
    };
  });
}
// ✅ Latest 2 showcase posts for Dashboard widget
let showcaseItems = [];

if (ShowcasePost) {
  const latest = await ShowcasePost.find({})
    .sort({ createdAt: -1 })
    .limit(2)
    .select("title authorName likes")
    .lean()
    .catch(() => []);

  showcaseItems = (latest || []).map((p) => ({
    title: p.title,
    author: p.authorName,
    likes: Array.isArray(p.likes) ? p.likes.length : 0,
  }));
}


    // -----------------------
    // ✅ 3) Announcements + Room activity (fallback)
    // -----------------------
    // ✅ REAL announcements from DB
// ✅ REAL announcements from DB (with fallback)
let announcements = [
  {
    title: "DevSphere update shipped",
    desc: "Dashboard insights are now connected with backend.",
    time: "Today",
  },
];

if (Announcement) {
  const list = await Announcement.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()
    .catch(() => []);

  if (list.length > 0) {
    announcements = list.map((a) => ({
      title: a.title,
      desc: a.desc,
      time: a.time || "Recent",
    }));
  }
}

    const roomActivity = [
      { title: "Collab Room Discussion (Frontend Sprint)", time: "14:00 – 14:30" },
      { title: "Code Review Thread (Portfolio Builder)", time: "16:00 – 16:20" },
    ];

    // ✅ Final response shape (match frontend)
    return res.json({
      announcements,
      roomActivity,
      projects,
      showcaseItems,
      unreadNotifications,
      stats: {
        projects: totalProjects,        // ✅ NOW = total showcase posts (feed)
        showcasePosts: totalRequests,   // ✅ NOW = my showcase posts (Requests)
        likesReceived,                  // ✅ already working
        saved,                          // ✅ now should work (if fields exist)
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ message: "Dashboard fetch failed" });
  }
};

module.exports = { getDashboardData };