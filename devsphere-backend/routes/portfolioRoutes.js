const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect"); 
// 👆 same middleware jo tum collaborationFileRoutes me use kar rahi ho

const c = require("../controllers/portfolioController");

// =============================
// Portfolio Routes
// =============================

// 👉 Get saved portfolio
router.get("/me", protect, c.getMyPortfolio);

// 👉 Save / Update portfolio
router.put("/me", protect, c.saveMyPortfolio);

// 👉 Reset portfolio
router.delete("/me", protect, c.resetMyPortfolio);

module.exports = router;