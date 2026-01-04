const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// ✅ Notification routes
const notificationRoutes = require("./routes/notifications");
app.use("/api/notifications", notificationRoutes);

// ✅ Optional: root route for testing server
app.get("/", (req, res) => {
  res.send("DevSphere Backend is running!");
});

// ❌ WRONG: Purane options use ho rahe hain
// ✅ CORRECT: Naye mongoose mein options ki zaroorat nahi hai

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));