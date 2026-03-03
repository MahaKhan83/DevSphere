// server.js (CLEAN + Socket.IO + Collaboration Code Save/Load + Files Upload/Share + TASKS)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// ✅ Sockets
const collaborationSocket = require("./sockets/collaborationSocket");
const lobbySocket = require("./sockets/lobbySocket");

// ✅ Routes
const authRoutes = require("./routes/auth");
const notificationRoutes = require("./routes/notifications");
const collaborationCodeRoutes = require("./routes/collaborationCodeRoutes");
const collaborationFileRoutes = require("./routes/collaborationFileRoutes");

// ✅ Tasks routes
const taskRoutes = require("./routes/taskRoutes");

// ✅ Portfolio routes
const portfolioRoutes = require("./routes/portfolioRoutes");

// ✅ Showcase routes
const showcaseRoutes = require("./routes/showcase.routes");

// ✅ Dashboard + Announcements routes
const dashboardRoutes = require("./routes/dashboard.routes");
const announcementRoutes = require("./routes/announcement.routes");

const app = express();
const server = http.createServer(app);

// ✅ CORS (Frontend ports allowed)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ IMPORTANT: serve uploads publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Socket.IO attach
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ allow routes to emit socket events via: req.app.get("io")
app.set("io", io);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Collaboration code save/load endpoints
app.use("/api/collaboration", collaborationCodeRoutes);

// ✅ Collaboration files upload/list/delete endpoints
app.use("/api/collaboration", collaborationFileRoutes);

// ✅ Collaboration tasks endpoints
app.use("/api/collaboration", taskRoutes);

// ✅ Portfolio builder endpoints
app.use("/api/portfolio", portfolioRoutes);

// ✅ Showcase
app.use("/api/showcase", showcaseRoutes);

// ✅ Dashboard
app.use("/api/dashboard", dashboardRoutes);

// ✅ Announcements
app.use("/api/announcements", announcementRoutes);

// ✅ Optional: root route for testing server
app.get("/", (req, res) => {
  res.send("DevSphere Backend is running!");
});

// ✅ Mongo connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

// ✅ sockets init
collaborationSocket(io);
lobbySocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));