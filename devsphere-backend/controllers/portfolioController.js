const Portfolio = require("../models/Portfolio");

// GET /api/portfolio/me
exports.getMyPortfolio = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const doc = await Portfolio.findOne({ userId });
    return res.json({ portfolio: doc || null });
  } catch (err) {
    console.error("getMyPortfolio error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/portfolio/me
exports.saveMyPortfolio = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const {
      sections,
      profile,
      theme,
      sidebarOpen,
      editMode,
      palettePosition,
      customizationPosition,
    } = req.body || {};

    // ✅ basic safe defaults
    const payload = {
      userId,
      sections: Array.isArray(sections) ? sections : [],
      profile: profile && typeof profile === "object" ? profile : {},
      theme: theme && typeof theme === "object" ? theme : {},
      sidebarOpen: typeof sidebarOpen === "boolean" ? sidebarOpen : true,
      editMode: typeof editMode === "boolean" ? editMode : true,
      palettePosition: palettePosition && typeof palettePosition === "object" ? palettePosition : { x: 110, y: 120 },
      customizationPosition:
        customizationPosition && typeof customizationPosition === "object" ? customizationPosition : { x: 450, y: 120 },
    };

    const doc = await Portfolio.findOneAndUpdate(
      { userId },
      { $set: payload },
      { new: true, upsert: true }
    );

    return res.json({ message: "Portfolio saved ✅", portfolio: doc });
  } catch (err) {
    console.error("saveMyPortfolio error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/portfolio/me
exports.resetMyPortfolio = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    await Portfolio.deleteOne({ userId });
    return res.json({ message: "Portfolio reset ✅" });
  } catch (err) {
    console.error("resetMyPortfolio error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};