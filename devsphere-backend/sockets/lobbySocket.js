// devsphere-backend/sockets/lobbySocket.js
const Notification = require("../models/Notification");

// ✅ NEW: role check for moderator/admin (used only for moderation delete)
let User = null;
try {
  User = require("../models/User");
} catch (e) {
  User = null;
}

module.exports = function lobbySocket(io) {
  const rooms = new Map();
  const approvals = new Map();
  const pending = new Map();

  const safe = (v) => (v || "").toString().trim();
  const lower = (v) => safe(v).toLowerCase();

  const notify = async ({ userId, type = "update", title, message, action, entityType = "other" }) => {
    const uid = safe(userId);
    if (!uid) return;

    try {
      const n = await Notification.create({
        user: uid,
        type,
        title,
        message,
        action: action || undefined,
        entityType,
        read: false,
      });

      // realtime only for that user
      const room = `user:${uid}`;
      io.to(room).emit("notification:new", {
        _id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        action: n.action,
        entityType: n.entityType,
        postId: n.postId,
        read: n.read,
        createdAt: n.createdAt,
      });
    } catch (e) {
      console.log("Notification create failed:", e.message);
    }
  };

  const genCode = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    const make = () =>
      Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    let code = make();
    while (rooms.has(code)) code = make();
    return code;
  };

  const roomList = () => Array.from(rooms.values());
  const emitRooms = () => io.emit("lobby:rooms", roomList());
  const emitPendingForRoom = (roomCode) => {
    const list = pending.get(roomCode) || [];
    io.emit("lobby:pending-updated", { roomCode, pending: list });
  };

  io.on("connection", (socket) => {
    socket.emit("lobby:rooms", roomList());

    socket.on("auth:join", ({ userId }) => {
      const uid = safe(userId);
      if (!uid) return;
      socket.join(`user:${uid}`);
    });

    socket.on("lobby:sync", () => {
      socket.emit("lobby:rooms", roomList());
      for (const code of rooms.keys()) {
        socket.emit("lobby:pending-updated", { roomCode: code, pending: pending.get(code) || [] });
      }
    });

    // ✅ CREATE ROOM
    socket.on("lobby:create-room", async ({ name, maxMembers, owner, ownerId }) => {
      const room = {
        id: `r_${Date.now()}`,
        name: safe(name) || "Untitled Room",
        code: genCode(),
        members: 1,
        maxMembers: Number(maxMembers) || 6,
        owner: safe(owner) || "Owner",
        ownerId: safe(ownerId) || null,
      };

      rooms.set(room.code, room);

      const ownerApprovalKey = room.ownerId ? `id:${room.ownerId}` : `name:${lower(room.owner)}`;
      approvals.set(room.code, new Set([ownerApprovalKey]));

      pending.set(room.code, []);

      await notify({
        userId: room.ownerId,
        type: "ROOM_CREATED",
        title: "Room Created",
        message: `You created "${room.name}" (${room.code})`,
        action: { label: "Open room", path: "/collaboration" },
        entityType: "room",
      });

      emitRooms();
      socket.emit("lobby:room-created", room);
      emitPendingForRoom(room.code);
    });

    // ✅ REQUEST JOIN (ROOM)
    socket.on("lobby:request-join", async ({ code, user, userId, force }) => {
      const roomCode = safe(code).toUpperCase();
      const room = rooms.get(roomCode);
      if (!room) return socket.emit("lobby:error", "Room not found.");
      if (room.members >= room.maxMembers) return socket.emit("lobby:error", "Room is full.");

      const userName = safe(user) || "Guest";
      const uid = safe(userId);
      const approvalKey = uid ? `id:${uid}` : `name:${lower(userName)}`;

      const appr = approvals.get(roomCode) || new Set();
      if (appr.has(approvalKey)) {
        return socket.emit("lobby:already-approved", { roomCode });
      }

      const list = pending.get(roomCode) || [];
      const hasPending = list.some((r) => {
        const reqUid = safe(r.userId);
        if (uid && reqUid) return reqUid === uid && r.status === "pending";
        return lower(r.user) === lower(userName) && r.status === "pending";
      });

      if (hasPending && !force) return socket.emit("lobby:error", "Request already pending.");

      if (hasPending && force) {
        for (const r of list) {
          const reqUid = safe(r.userId);
          const sameUser = uid && reqUid ? reqUid === uid : lower(r.user) === lower(userName);
          if (sameUser && r.status === "pending") r.status = "rejected";
        }
      }

      const req = {
        id: `p_${Date.now()}`,
        roomCode,
        user: userName,
        userId: uid || null,
        status: "pending",
        ts: Date.now(),
      };

      list.unshift(req);
      pending.set(roomCode, list);

      await notify({
        userId: room.ownerId,
        type: "ROOM_JOIN_REQUEST",
        title: "Collaboration Request",
        message: `${userName} requested to join "${room.name}" (${roomCode})`,
        action: { label: "Review", path: "/collaboration" },
        entityType: "room",
      });

      emitPendingForRoom(roomCode);
      socket.emit("lobby:requested", req);
    });

    // ✅ APPROVE (ROOM)
    socket.on("lobby:approve", async ({ roomCode, reqId, owner, ownerId }) => {
      const code = safe(roomCode).toUpperCase();
      const room = rooms.get(code);
      if (!room) return;

      const ownerNameMatch = lower(room.owner) === lower(owner);
      const ownerIdMatch = safe(room.ownerId) && safe(ownerId) && safe(room.ownerId) === safe(ownerId);

      if (!ownerNameMatch && !ownerIdMatch) return;

      const list = pending.get(code) || [];
      const req = list.find((r) => r.id === reqId);
      if (!req || req.status !== "pending") return;

      if (room.members >= room.maxMembers) {
        req.status = "rejected";
        pending.set(code, list);
        emitPendingForRoom(code);
        return;
      }

      req.status = "approved";
      pending.set(code, list);

      const appr = approvals.get(code) || new Set();
      const approvalKey = req.userId ? `id:${safe(req.userId)}` : `name:${lower(req.user)}`;
      appr.add(approvalKey);
      approvals.set(code, appr);

      rooms.set(code, { ...room, members: Number(room.members || 1) + 1 });

      await notify({
        userId: req.userId,
        type: "ROOM_APPROVED",
        title: "Request Approved",
        message: `Your request to join "${room.name}" (${code}) was approved.`,
        action: { label: "Join", path: "/collaboration" },
        entityType: "room",
      });

      emitRooms();
      emitPendingForRoom(code);
      io.emit("lobby:approved", { roomCode: code, user: req.user, userId: req.userId || null });
    });

    // ✅ REJECT (ROOM)
    socket.on("lobby:reject", async ({ roomCode, reqId, owner, ownerId }) => {
      const code = safe(roomCode).toUpperCase();
      const room = rooms.get(code);
      if (!room) return;

      const ownerNameMatch = lower(room.owner) === lower(owner);
      const ownerIdMatch = safe(room.ownerId) && safe(ownerId) && safe(room.ownerId) === safe(ownerId);

      if (!ownerNameMatch && !ownerIdMatch) return;

      const list = pending.get(code) || [];
      const req = list.find((r) => r.id === reqId);
      if (!req || req.status !== "pending") return;

      req.status = "rejected";
      pending.set(code, list);

      await notify({
        userId: req.userId,
        type: "ROOM_REJECTED",
        title: "Request Rejected",
        message: `Your request to join "${room.name}" (${code}) was rejected.`,
        action: { label: "View rooms", path: "/collaboration" },
        entityType: "room",
      });

      emitPendingForRoom(code);
    });

    // ✅ CAN ENTER
    socket.on("lobby:can-enter", ({ code, user, userId }) => {
      const roomCode = safe(code).toUpperCase();
      const room = rooms.get(roomCode);
      if (!room) return socket.emit("lobby:can-enter:result", { ok: false, reason: "Room not found" });

      const who = safe(user);
      const uid = safe(userId);

      const isOwner =
        (safe(room.ownerId) && uid && safe(room.ownerId) === uid) ||
        lower(room.owner) === lower(who);

      const appr = approvals.get(roomCode) || new Set();
      const approvalKey = uid ? `id:${uid}` : `name:${lower(who)}`;
      const ok = isOwner || appr.has(approvalKey);

      socket.emit("lobby:can-enter:result", { ok, room });
    });

    // ✅ DELETE ROOM (OWNER ONLY)
    socket.on("lobby:delete-room", ({ code, owner, ownerId }) => {
      const roomCode = safe(code).toUpperCase();
      const room = rooms.get(roomCode);
      if (!room) return;

      const ownerNameMatch = lower(room.owner) === lower(owner);
      const ownerIdMatch = safe(room.ownerId) && safe(ownerId) && safe(room.ownerId) === safe(ownerId);

      if (!ownerNameMatch && !ownerIdMatch) {
        return socket.emit("lobby:error", "Only owner can delete this room.");
      }

      rooms.delete(roomCode);
      approvals.delete(roomCode);
      pending.delete(roomCode);

      emitRooms();
      io.emit("lobby:pending-updated", { roomCode, pending: [] });
    });

    // ✅ NEW: DELETE ROOM (MODERATOR / ADMIN) => "Remove content" for ROOM reports
    socket.on("lobby:moderator-delete-room", async ({ code, moderatorId }) => {
      const roomCode = safe(code).toUpperCase();
      const room = rooms.get(roomCode);

      const reply = (ok, message = "", extra = {}) => {
        socket.emit("lobby:moderator-delete-room:result", {
          ok: !!ok,
          roomCode,
          message: message || undefined,
          ...extra,
        });
      };

      if (!room) {
        try {
          socket.emit("lobby:error", "Room not found.");
        } catch {}
        return reply(false, "Room not found.");
      }

      if (User) {
        try {
          const mod = await User.findById(moderatorId).select("_id role");
          const role = String(mod?.role || "").toLowerCase();
          const okRole = role === "moderator" || role === "admin";
          if (!mod || !okRole) {
            try {
              socket.emit("lobby:error", "Not allowed.");
            } catch {}
            return reply(false, "Not allowed.");
          }
        } catch (e) {
          try {
            socket.emit("lobby:error", "Not allowed.");
          } catch {}
          return reply(false, "Not allowed.");
        }
      }

      rooms.delete(roomCode);
      approvals.delete(roomCode);
      pending.delete(roomCode);

      await notify({
        userId: room.ownerId,
        type: "ROOM_REMOVED",
        title: "Room Removed",
        message: `Your room "${room.name}" (${roomCode}) was removed by moderation.`,
        action: { label: "View rooms", path: "/collaboration" },
        entityType: "room",
      });

      emitRooms();
      io.emit("lobby:pending-updated", { roomCode, pending: [] });
      io.emit("lobby:room-removed", { roomCode });

      return reply(true, "Room deleted.");
    });

    // ✅ LEAVE ROOM
    socket.on("lobby:leave-room", ({ roomCode, user, userId }) => {
      const code = safe(roomCode).toUpperCase();
      const room = rooms.get(code);
      if (!room) return;

      const uid = safe(userId);
      const userL = lower(user);

      const isOwner =
        (safe(room.ownerId) && uid && safe(room.ownerId) === uid) ||
        (userL && lower(room.owner) === userL);

      if (!isOwner) {
        const nextMembers = Math.max(1, Number(room.members || 1) - 1);
        rooms.set(code, { ...room, members: nextMembers });

        const appr = approvals.get(code) || new Set();
        const approvalKey = uid ? `id:${uid}` : `name:${userL}`;
        appr.delete(approvalKey);
        approvals.set(code, appr);

        emitRooms();
      }
    });
  });
};