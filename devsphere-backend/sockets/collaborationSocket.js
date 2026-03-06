// sockets/collaborationSocket.js
module.exports = function collaborationSocket(io) {
  const roomMembers = new Map(); // roomCode -> Map(socketId -> { name, userId, joinedAt, color, isOwner })
  const roomLocks = new Map();   // roomCode -> lock object
  const roomMeta = new Map();    // roomCode -> { ownerName, ownerId }

  const COLORS = [
    "#3b82f6", "#22c55e", "#a855f7", "#f97316", "#ec4899",
    "#eab308", "#06b6d4", "#ef4444", "#8b5cf6", "#14b8a6",
    "#84cc16", "#f59e0b",
  ];

  const safe = (v) => (v || "").toString().trim();
  const lower = (v) => safe(v).toLowerCase();

  const getRoomMap = (roomCode) => {
    if (!roomMembers.has(roomCode)) roomMembers.set(roomCode, new Map());
    return roomMembers.get(roomCode);
  };

  const pickColor = (roomCode) => {
    const map = getRoomMap(roomCode);
    const used = new Set(Array.from(map.values()).map((m) => m.color));
    const free = COLORS.find((c) => !used.has(c));
    return free || COLORS[Math.floor(Math.random() * COLORS.length)];
  };

  const ensureRoomMeta = (roomCode, payload = {}, joiningUserName = "", joiningUserId = "") => {
    const current = roomMeta.get(roomCode);

    if (current) {
      // agar owner info baad me aa jaye to merge kar lo
      const next = {
        ownerName: safe(current.ownerName || payload.ownerName || payload.owner || joiningUserName),
        ownerId: safe(current.ownerId || payload.ownerId || ""),
      };
      roomMeta.set(roomCode, next);
      return next;
    }

    const meta = {
      ownerName: safe(payload.ownerName || payload.owner || joiningUserName),
      ownerId: safe(payload.ownerId || ""),
    };

    roomMeta.set(roomCode, meta);
    return meta;
  };

  const isOwnerUser = (roomCode, userName = "", userId = "") => {
    const meta = roomMeta.get(roomCode);
    if (!meta) return false;

    const uid = safe(userId);
    const ownerId = safe(meta.ownerId);

    if (uid && ownerId && uid === ownerId) return true;

    return lower(meta.ownerName) === lower(userName);
  };

  const getRoomList = (roomCode) => {
    const map = roomMembers.get(roomCode);
    if (!map) return [];

    return Array.from(map.entries()).map(([socketId, info]) => ({
      socketId,
      userId: info.userId || "",
      name: info.name,
      color: info.color,
      joinedAt: info.joinedAt,
      isOwner: !!info.isOwner,
      role: info.isOwner ? "Owner" : "Member",
    }));
  };

  const emitMembers = (roomCode) => {
    io.to(roomCode).emit("room-members", getRoomList(roomCode));
  };

  const emitLockState = (roomCode) => {
    io.to(roomCode).emit("lock-state", roomLocks.get(roomCode) || null);
  };

  const clearLockIfHolderLeft = (roomCode, socketId) => {
    const lock = roomLocks.get(roomCode);
    if (lock && lock.holderSocketId === socketId) {
      roomLocks.delete(roomCode);
      emitLockState(roomCode);
      io.to(roomCode).emit("chat-message", {
        id: `sys_${Date.now()}`,
        roomCode,
        by: "System",
        text: `Editor unlocked (member left).`,
        time: new Date().toLocaleTimeString(),
      });
    }
  };

  const cleanupRoomIfEmpty = (roomCode) => {
    const map = roomMembers.get(roomCode);
    if (map && map.size === 0) {
      roomMembers.delete(roomCode);
      roomLocks.delete(roomCode);
      roomMeta.delete(roomCode);
    }
  };

  const removeMemberFromRoom = (roomCode, targetSocketId) => {
    const map = roomMembers.get(roomCode);
    if (!map || !map.has(targetSocketId)) return null;

    const removed = map.get(targetSocketId);
    map.delete(targetSocketId);

    clearLockIfHolderLeft(roomCode, targetSocketId);
    cleanupRoomIfEmpty(roomCode);

    return removed || null;
  };

  const removeMemberEverywhere = (socketId) => {
    for (const [roomCode, map] of roomMembers.entries()) {
      if (map.has(socketId)) {
        const removed = map.get(socketId);
        map.delete(socketId);
        clearLockIfHolderLeft(roomCode, socketId);
        cleanupRoomIfEmpty(roomCode);
        return { roomCode, removed };
      }
    }
    return null;
  };

  const normalizePos = (payload) => {
    const pos = payload?.position || payload?.cursor;
    if (!pos) return null;

    const lineNumber = Number(pos.lineNumber || 0);
    const column = Number(pos.column || 0);

    if (!lineNumber || !column) return null;
    return { lineNumber, column };
  };

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // JOIN
    socket.on("join-room", (payload = {}) => {
      const roomCode = safe(payload.roomCode).toUpperCase();
      if (!roomCode) return;

      const safeName = safe(payload.user) || "Guest";
      const safeUserId = safe(payload.userId || "");

      const meta = ensureRoomMeta(roomCode, payload, safeName, safeUserId);
      const ownerNow = isOwnerUser(roomCode, safeName, safeUserId);

      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      socket.data.user = safeName;
      socket.data.userId = safeUserId;

      const map = getRoomMap(roomCode);
      const color = pickColor(roomCode);

      map.set(socket.id, {
        name: safeName,
        userId: safeUserId,
        joinedAt: Date.now(),
        color,
        isOwner: ownerNow,
      });

      // agar owner abhi tak roomMeta me sirf fallback tha aur current join owner hai to sync kar do
      if (ownerNow) {
        roomMeta.set(roomCode, {
          ownerName: meta.ownerName || safeName,
          ownerId: meta.ownerId || safeUserId || "",
        });
      }

      emitMembers(roomCode);
      emitLockState(roomCode);

      socket.to(roomCode).emit("chat-message", {
        id: `sys_${Date.now()}`,
        roomCode,
        by: "System",
        text: `${safeName} joined the room`,
        time: new Date().toLocaleTimeString(),
      });
    });

    // CHAT
    socket.on("chat-message", (payload) => {
      const { roomCode } = payload || {};
      if (!roomCode) return;
      socket.to(roomCode).emit("chat-message", payload);
    });

    // DELETE MESSAGE
    socket.on("delete-message", ({ roomCode, messageId }) => {
      if (!roomCode || !messageId) return;
      io.to(roomCode).emit("delete-message", { messageId });
    });

    // TYPING
    socket.on("typing", ({ roomCode, name }) => {
      if (!roomCode) return;
      socket.to(roomCode).emit("typing", name);
    });

    socket.on("stop-typing", (roomCode) => {
      if (!roomCode) return;
      socket.to(roomCode).emit("stop-typing");
    });

    // CODE CHANGE
    socket.on("code-change", ({ roomCode, code, language, by, ts }) => {
      if (!roomCode) return;
      socket.to(roomCode).emit("code-change", {
        roomCode,
        code: typeof code === "string" ? code : "",
        language: language || "javascript",
        by: by || "Someone",
        ts: ts || Date.now(),
      });
    });

    // EDITOR ACTION
    socket.on("editor-action", (payload) => {
      const { roomCode, action, by, language, meta } = payload || {};
      if (!roomCode) return;

      io.to(roomCode).emit("editor-action", {
        roomCode,
        action: action || "save",
        by: by || socket.data.user || "Someone",
        language: language || "javascript",
        meta: meta || null,
        ts: Date.now(),
      });
    });

    // LOCK
    const handleLockRequest = ({ roomCode, language }) => {
      if (!roomCode) return;

      const name = socket.data.user || "Guest";
      const map = roomMembers.get(roomCode);
      const myInfo = map?.get(socket.id);
      const myColor = myInfo?.color || "#3b82f6";

      const current = roomLocks.get(roomCode);

      if (!current || current.holderSocketId === socket.id) {
        roomLocks.set(roomCode, {
          holderSocketId: socket.id,
          holderName: name,
          holderColor: myColor,
          lastActive: Date.now(),
          language: language || "javascript",
        });
        emitLockState(roomCode);
        return;
      }

      socket.emit("lock-denied", current);
    };

    const handleLockRelease = ({ roomCode }) => {
      if (!roomCode) return;
      const current = roomLocks.get(roomCode);
      if (current && current.holderSocketId === socket.id) {
        roomLocks.delete(roomCode);
        emitLockState(roomCode);
      }
    };

    socket.on("lock-request", handleLockRequest);
    socket.on("request-lock", handleLockRequest);
    socket.on("lock-release", handleLockRelease);
    socket.on("release-lock", handleLockRelease);

    socket.on("lock-heartbeat", ({ roomCode }) => {
      if (!roomCode) return;
      const current = roomLocks.get(roomCode);
      if (current && current.holderSocketId === socket.id) {
        current.lastActive = Date.now();
        roomLocks.set(roomCode, current);
      }
    });

    // CURSOR CHANGE
    socket.on("cursor-change", (payload) => {
      const roomCode = payload?.roomCode;
      if (!roomCode) return;

      const pos = normalizePos(payload);
      if (!pos) return;

      const name = socket.data.user || "Guest";
      const map = roomMembers.get(roomCode);
      const myInfo = map?.get(socket.id);
      const myColor = myInfo?.color || "#3b82f6";

      socket.to(roomCode).emit("cursor-change", {
        socketId: socket.id,
        name,
        color: myColor,
        language: payload?.language || "javascript",
        position: pos,
        ts: Date.now(),
      });
    });

    // REMOVE MEMBER (OWNER ONLY)
    socket.on("remove-member", ({ roomCode, targetSocketId }) => {
      const code = safe(roomCode).toUpperCase();
      const targetId = safe(targetSocketId);

      if (!code || !targetId) return;

      const actorName = safe(socket.data.user);
      const actorUserId = safe(socket.data.userId);

      const actorIsOwner = isOwnerUser(code, actorName, actorUserId);
      if (!actorIsOwner) {
        return socket.emit("remove-member:error", {
          roomCode: code,
          message: "Only owner can remove members.",
        });
      }

      const map = roomMembers.get(code);
      if (!map) {
        return socket.emit("remove-member:error", {
          roomCode: code,
          message: "Room not found.",
        });
      }

      const target = map.get(targetId);
      if (!target) {
        return socket.emit("remove-member:error", {
          roomCode: code,
          message: "Member not found.",
        });
      }

      if (target.isOwner) {
        return socket.emit("remove-member:error", {
          roomCode: code,
          message: "Owner cannot remove themselves.",
        });
      }

      const targetSocket = io.sockets.sockets.get(targetId);

      removeMemberFromRoom(code, targetId);

      if (targetSocket) {
        targetSocket.leave(code);
        targetSocket.emit("removed-from-room", {
          roomCode: code,
          by: actorName || "Owner",
          message: `You were removed from room ${code}.`,
        });

        targetSocket.data.roomCode = null;
      }

      emitMembers(code);
      emitLockState(code);

      io.to(code).emit("chat-message", {
        id: `sys_${Date.now()}`,
        roomCode: code,
        by: "System",
        text: `${target.name || "A member"} was removed by the owner.`,
        time: new Date().toLocaleTimeString(),
      });

      socket.emit("remove-member:success", {
        roomCode: code,
        targetSocketId: targetId,
      });
    });

    // LEAVE
    socket.on("leave-room", ({ roomCode, user }) => {
      const code = safe(roomCode).toUpperCase();
      if (!code) return;

      socket.leave(code);

      const removed = removeMemberFromRoom(code, socket.id);
      emitMembers(code);

      socket.to(code).emit("chat-message", {
        id: `sys_${Date.now()}`,
        roomCode: code,
        by: "System",
        text: `${user || removed?.name || "Guest"} left the room`,
        time: new Date().toLocaleTimeString(),
      });

      socket.data.roomCode = null;
    });

    socket.on("disconnect", () => {
      const roomCode = socket.data.roomCode;
      const user = socket.data.user;

      const removedInfo = removeMemberEverywhere(socket.id);
      const targetRoom = safe(roomCode || removedInfo?.roomCode).toUpperCase();

      if (targetRoom) {
        emitMembers(targetRoom);

        socket.to(targetRoom).emit("chat-message", {
          id: `sys_${Date.now()}`,
          roomCode: targetRoom,
          by: "System",
          text: `${user || removedInfo?.removed?.name || "Guest"} disconnected`,
          time: new Date().toLocaleTimeString(),
        });
      }

      console.log("User disconnected:", socket.id);
    });
  });
};