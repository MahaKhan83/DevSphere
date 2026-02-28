// routes/taskRoutes.js
const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

// ✅ IMPORTANT: controller se sab functions import karo
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask, // ❗ yeh hona zaroori hai warna Route.patch error aayega
} = require("../controllers/taskController");


// ===================================================
// 📌 TASK ROUTES  (Mounted at /api/collaboration)
// ===================================================

// Get all tasks of a room
router.get("/tasks/:roomCode", protect, getTasks);

// Create task
router.post("/tasks/:roomCode", protect, createTask);

// Update task (status/title/assign etc)
router.put("/tasks/:roomCode/:taskId", protect, updateTask);

// Delete task (creator only)
router.delete("/tasks/:roomCode/:taskId", protect, deleteTask);

// Toggle done/open (optional but safe)
router.patch("/tasks/:roomCode/:taskId/toggle", protect, toggleTask);


module.exports = router;