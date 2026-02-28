// controllers/taskController.js
const Task = require("../models/Task");
const User = require("../models/User");

// ---------- helpers ----------
const norm = (v) => String(v || "").trim().toLowerCase();

// ✅ SAFE loose compare (Falak == Falak Khan) but NOT substring anywhere
const samePerson = (a, b) => {
  const A = norm(a);
  const B = norm(b);
  if (!A || !B) return false;

  if (A === B) return true;

  // allow prefix match only at word boundary: "falak" == "falak khan"
  if (A.startsWith(B + " ")) return true;
  if (B.startsWith(A + " ")) return true;

  return false;
};

const getMyIdentity = (reqUser) => {
  return {
    id: reqUser?._id ? String(reqUser._id) : "",
    name: reqUser?.name || "",
    email: reqUser?.email || "",
  };
};

const isCreator = (task, reqUser) => {
  const me = getMyIdentity(reqUser);

  const creatorId = task?.createdBy?.userId ? String(task.createdBy.userId) : "";
  if (me.id && creatorId && me.id === creatorId) return true;

  const creatorName = task?.createdBy?.name || "";
  return samePerson(creatorName, me.name) || samePerson(creatorName, me.email);
};

const isAssignee = (task, reqUser) => {
  const me = getMyIdentity(reqUser);

  const assigneeId = task?.assignedTo?.userId ? String(task.assignedTo.userId) : "";
  if (me.id && assigneeId && me.id === assigneeId) return true;

  const assigneeName = task?.assignedTo?.name || "";
  return samePerson(assigneeName, me.name) || samePerson(assigneeName, me.email);
};

const canToggleStatus = (task, reqUser) => {
  return isCreator(task, reqUser) || isAssignee(task, reqUser);
};

const emitRoom = (req, roomCode, event, payload) => {
  try {
    const io = req.app.get("io");
    if (io && roomCode) io.to(roomCode).emit(event, payload);
  } catch (e) {}
};

// ---------- controllers ----------

// GET /api/collaboration/tasks/:roomCode
exports.getTasks = async (req, res) => {
  try {
    const { roomCode } = req.params;
    const list = await Task.find({ roomCode }).sort({ createdAt: -1 }).lean();
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Failed to load tasks" });
  }
};

// POST /api/collaboration/tasks/:roomCode
exports.createTask = async (req, res) => {
  try {
    const { roomCode } = req.params;

    const title = String(req.body?.title || "").trim();
    if (!title) return res.status(400).json({ message: "Task title is required" });

    const dueDate = req.body?.dueDate ? new Date(req.body.dueDate) : null;
    const safeDue = dueDate && !Number.isNaN(dueDate.getTime()) ? dueDate : null;

    const assignedToInput = req.body?.assignedTo || {};
    const assignedToName = String(assignedToInput?.name || "").trim();

    // ✅ Optional improvement (no breaking):
    // Try to resolve assigned user's ObjectId if name/email matches a user
    let assignedUserId = assignedToInput?.userId || null;
    if (!assignedUserId && assignedToName) {
      const maybe = await User.findOne({
        $or: [
          { email: new RegExp("^" + assignedToName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i") },
          { name: new RegExp("^" + assignedToName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i") },
        ],
      }).select("_id");
      if (maybe?._id) assignedUserId = maybe._id;
    }

    const task = await Task.create({
      roomCode,
      title,
      description: String(req.body?.description || ""),
      status: "open",
      assignedTo: {
        userId: assignedUserId,
        name: assignedToName,
      },
      createdBy: {
        userId: req.user._id,
        name: req.user.name || req.user.email || "",
      },
      dueDate: safeDue,
    });

    const populated = await Task.findById(task._id).lean();

    emitRoom(req, roomCode, "task:created", populated);

    return res.status(201).json(populated);
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Task create failed" });
  }
};

// PUT /api/collaboration/tasks/:roomCode/:taskId
exports.updateTask = async (req, res) => {
  try {
    const { roomCode, taskId } = req.params;

    const task = await Task.findOne({ _id: taskId, roomCode });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const creator = isCreator(task, req.user);
    const assignee = isAssignee(task, req.user);

    // ✅ Only creator OR assignee can touch status
    // But assignee cannot edit title/assign/due/dscription (only creator can)
    if (!creator && !assignee) {
      return res.status(403).json({ message: "Only creator or assignee can update this task" });
    }

    // ✅ status can be changed by creator OR assignee
    if (typeof req.body?.status === "string") {
      const next = req.body.status;
      if (next === "open" || next === "done") task.status = next;
    }

    // ✅ Only creator can edit other fields
    if (creator) {
      if (typeof req.body?.title === "string") {
        const t = req.body.title.trim();
        if (t) task.title = t;
      }

      if (typeof req.body?.description === "string") {
        task.description = req.body.description;
      }

      if (req.body?.assignedTo) {
        const at = req.body.assignedTo;
        task.assignedTo = {
          userId: at.userId || task.assignedTo.userId || null,
          name: String(at.name || "").trim(),
        };
      }

      if ("dueDate" in req.body) {
        const d = req.body.dueDate ? new Date(req.body.dueDate) : null;
        task.dueDate = d && !Number.isNaN(d.getTime()) ? d : null;
      }
    }

    await task.save();

    const updated = await Task.findById(task._id).lean();

    emitRoom(req, roomCode, "task:updated", updated);

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Task update failed" });
  }
};

// DELETE /api/collaboration/tasks/:roomCode/:taskId (creator only)
exports.deleteTask = async (req, res) => {
  try {
    const { roomCode, taskId } = req.params;

    const task = await Task.findOne({ _id: taskId, roomCode });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const meId = String(req.user?._id || "");
    const creatorId = String(task?.createdBy?.userId || "");

    if (!meId || !creatorId || meId !== creatorId) {
      return res.status(403).json({ message: "Only creator can delete this task" });
    }

    await Task.deleteOne({ _id: taskId });

    emitRoom(req, roomCode, "task:deleted", { taskId });

    return res.json({ message: "Task deleted", taskId });
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Task delete failed" });
  }
};

// PATCH /api/collaboration/tasks/:roomCode/:taskId/toggle
exports.toggleTask = async (req, res) => {
  try {
    const { roomCode, taskId } = req.params;

    const task = await Task.findOne({ _id: taskId, roomCode });
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!canToggleStatus(task, req.user)) {
      return res.status(403).json({ message: "Only creator or assignee can toggle this task" });
    }

    task.status = task.status === "done" ? "open" : "done";
    await task.save();

    const updated = await Task.findById(task._id).lean();

    emitRoom(req, roomCode, "task:updated", updated);

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Task toggle failed" });
  }
};