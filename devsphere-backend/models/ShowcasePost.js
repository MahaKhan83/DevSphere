const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // displayName save for easy UI
    text: { type: String, required: true, trim: true, maxlength: 500 },

    // ✅ STEP 1: comment likes persist in DB
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const showcasePostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true }, // UI me direct show

    title: { type: String, required: true, trim: true, maxlength: 120 },
    desc: { type: String, required: true, trim: true, maxlength: 2000 },

    github: { type: String, required: true, trim: true },
    thumb: { type: String, required: true, trim: true },

    tech: [{ type: String, trim: true }], // ["React", "Node"]

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShowcasePost", showcasePostSchema);