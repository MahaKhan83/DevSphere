const router = require("express").Router();
const Announcement = require("../models/Announcement");

router.post("/", async (req, res) => {
  const a = await Announcement.create(req.body);
  res.json(a);
});

router.get("/", async (req, res) => {
  const list = await Announcement.find().sort({ createdAt: -1 });
  res.json(list);
});

module.exports = router;