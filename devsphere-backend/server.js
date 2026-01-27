const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS FIX - Specific frontend port allow karo
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // ✅ dono ports
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// ✅ Mongoose connection (updated)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));