module.exports = function lobbySocket(io) {
  const rooms = new Map();
  const approvals = new Map(); // roomCode -> Set(lower(username))
  const pending = new Map();   // roomCode -> [{id, roomCode, user, status, ts}]

  const safe = (v) => (v || "").toString().trim();
  const lower = (v) => safe(v).toLowerCase();

  const genCode = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    const make = () =>
      Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    let code = make();
    while (rooms.has(code)) code = make();
    return code;
  };

  const roomList = () => Array.from(rooms.values());

  const emitRooms = () => {
    io.emit("lobby:rooms", roomList());
  };

  const emitPendingForRoom = (roomCode) => {
    const list = pending.get(roomCode) || [];
    io.emit("lobby:pending-updated", { roomCode, pending: list });
  };

  io.on("connection", (socket) => {
    socket.emit("lobby:rooms", roomList());

    // ✅ sync when user returns to lobby
    socket.on("lobby:sync", () => {
      socket.emit("lobby:rooms", roomList());
      for (const code of rooms.keys()) {
        socket.emit("lobby:pending-updated", { roomCode: code, pending: pending.get(code) || [] });
      }
    });

    // ✅ CREATE ROOM
    socket.on("lobby:create-room", ({ name, maxMembers, owner }) => {
      const room = {
        id: `r_${Date.now()}`,
        name: safe(name) || "Untitled Room",
        code: genCode(),
        members: 1, // owner
        maxMembers: Number(maxMembers) || 6,
        owner: safe(owner) || "Owner",
      };

      rooms.set(room.code, room);
      approvals.set(room.code, new Set([lower(room.owner)])); // owner approved by default
      pending.set(room.code, []);

      emitRooms();
      socket.emit("lobby:room-created", room);
      emitPendingForRoom(room.code);
    });

    // ✅ REQUEST JOIN (force allows re-request)
    socket.on("lobby:request-join", ({ code, user, force }) => {
      const roomCode = safe(code).toUpperCase();
      const room = rooms.get(roomCode);
      if (!room) return socket.emit("lobby:error", "Room not found.");
      if (room.members >= room.maxMembers) return socket.emit("lobby:error", "Room is full.");

      const userName = safe(user) || "Guest";
      const userL = lower(userName);

      const appr = approvals.get(roomCode) || new Set();
      if (appr.has(userL)) {
        return socket.emit("lobby:already-approved", { roomCode });
      }

      const list = pending.get(roomCode) || [];
      const hasPending = list.some((r) => lower(r.user) === userL && r.status === "pending");

      if (hasPending && !force) {
        return socket.emit("lobby:error", "Request already pending.");
      }

      // ✅ if force, close old pending so user can request again
      if (hasPending && force) {
        for (const r of list) {
          if (lower(r.user) === userL && r.status === "pending") r.status = "rejected";
        }
      }

      const req = { id: `p_${Date.now()}`, roomCode, user: userName, status: "pending", ts: Date.now() };
      list.unshift(req);
      pending.set(roomCode, list);

      emitPendingForRoom(roomCode);
      socket.emit("lobby:requested", req);
    });

    // ✅ APPROVE
    socket.on("lobby:approve", ({ roomCode, reqId, owner }) => {
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

      emitRooms();
      emitPendingForRoom(code);
      io.emit("lobby:approved", { roomCode: code, user: req.user });
    });

    // ✅ REJECT
    socket.on("lobby:reject", ({ roomCode, reqId, owner }) => {
      const code = safe(roomCode).toUpperCase();
      const room = rooms.get(code);
      if (!room) return;

      if (lower(room.owner) !== lower(owner)) return;

      const list = pending.get(code) || [];
      const req = list.find((r) => r.id === reqId);
      if (!req || req.status !== "pending") return;

      req.status = "rejected";
      pending.set(code, list);
      emitPendingForRoom(code);
    });

    // ✅ CAN ENTER (owner OR approved)
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

    // ✅ OWNER DELETE ROOM
    socket.on("lobby:delete-room", ({ code, owner }) => {
      const roomCode = safe(code).toUpperCase();
      const room = rooms.get(roomCode);
      if (!room) return;

      if (lower(room.owner) !== lower(owner)) {
        return socket.emit("lobby:error", "Only owner can delete this room.");
      }

      rooms.delete(roomCode);
      approvals.delete(roomCode);
      pending.delete(roomCode);

      emitRooms();
      io.emit("lobby:pending-updated", { roomCode, pending: [] });
    });

    // ✅ MEMBER LEAVE -> members down + remove approval so re-request works
    socket.on("lobby:leave-room", ({ roomCode, user }) => {
      const code = safe(roomCode).toUpperCase();
      const room = rooms.get(code);
      if (!room) return;

      const userL = lower(user);

      // owner leaving does not delete room
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