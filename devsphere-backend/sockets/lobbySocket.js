const Notification = require("../models/Notification");

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
    const make = () => Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
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
        ownerId: ownerId || null,
      };

      rooms.set(room.code, room);
      approvals.set(room.code, new Set([lower(room.owner)]));
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
      const userL = lower(userName);

      const appr = approvals.get(roomCode) || new Set();
      if (appr.has(userL)) return socket.emit("lobby:already-approved", { roomCode });

      const list = pending.get(roomCode) || [];
      const hasPending = list.some((r) => lower(r.user) === userL && r.status === "pending");

      if (hasPending && !force) return socket.emit("lobby:error", "Request already pending.");

      if (hasPending && force) {
        for (const r of list) {
          if (lower(r.user) === userL && r.status === "pending") r.status = "rejected";
        }
      }

      const req = {
        id: `p_${Date.now()}`,
        roomCode,
        user: userName,
        userId: userId || null,
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
    socket.on("lobby:approve", async ({ roomCode, reqId, owner }) => {
      const code = safe(roomCode).toUpperCase();
      const room = rooms.get(code);
      if (!room) return;
      if (lower(room.owner) !== lower(owner)) return;

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
      appr.add(lower(req.user));
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
      io.emit("lobby:approved", { roomCode: code, user: req.user });
    });

    // ✅ REJECT (ROOM)
    socket.on("lobby:reject", async ({ roomCode, reqId, owner }) => {
      const code = safe(roomCode).toUpperCase();
      const room = rooms.get(code);
      if (!room) return;
      if (lower(room.owner) !== lower(owner)) return;

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
    socket.on("lobby:can-enter", ({ code, user }) => {
      const roomCode = safe(code).toUpperCase();
      const room = rooms.get(roomCode);
      if (!room) return socket.emit("lobby:can-enter:result", { ok: false, reason: "Room not found" });

      const who = safe(user);
      const isOwner = lower(room.owner) === lower(who);
      const appr = approvals.get(roomCode) || new Set();
      const ok = isOwner || appr.has(lower(who));
      socket.emit("lobby:can-enter:result", { ok, room });
    });

    // ✅ DELETE ROOM
    socket.on("lobby:delete-room", ({ code, owner }) => {
      const roomCode = safe(code).toUpperCase();
      const room = rooms.get(roomCode);
      if (!room) return;

      if (lower(room.owner) !== lower(owner)) return socket.emit("lobby:error", "Only owner can delete this room.");

      rooms.delete(roomCode);
      approvals.delete(roomCode);
      pending.delete(roomCode);

      emitRooms();
      io.emit("lobby:pending-updated", { roomCode, pending: [] });
    });

    // ✅ LEAVE ROOM
    socket.on("lobby:leave-room", ({ roomCode, user }) => {
      const code = safe(roomCode).toUpperCase();
      const room = rooms.get(code);
      if (!room) return;

      const userL = lower(user);
      if (userL && lower(room.owner) !== userL) {
        const nextMembers = Math.max(1, Number(room.members || 1) - 1);
        rooms.set(code, { ...room, members: nextMembers });

        const appr = approvals.get(code) || new Set();
        appr.delete(userL);
        approvals.set(code, appr);

        emitRooms();
      }
    });
  });
};