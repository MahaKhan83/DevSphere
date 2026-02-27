// sockets/collaborationSocket.js
module.exports = function collaborationSocket(io) {
  const roomMembers = new Map(); // roomCode -> Map(socketId -> { name, joinedAt, color })
  const roomLocks = new Map();   // roomCode -> lock object

  const COLORS = [
    "#3b82f6", "#22c55e", "#a855f7", "#f97316", "#ec4899",
    "#eab308", "#06b6d4", "#ef4444", "#8b5cf6", "#14b8a6",
    "#84cc16", "#f59e0b",
  ];

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

  const getRoomList = (roomCode) => {
    const map = roomMembers.get(roomCode);
    if (!map) return [];
    return Array.from(map.entries()).map(([socketId, info]) => ({
      socketId,
      name: info.name,
      color: info.color,
      joinedAt: info.joinedAt,
    }));
  };

  const emitMembers = (roomCode) => io.to(roomCode).emit("room-members", getRoomList(roomCode));
  const emitLockState = (roomCode) => io.to(roomCode).emit("lock-state", roomLocks.get(roomCode) || null);

  const clearLockIfHolderLeft = (roomCode, socketId) => {
    const lock = roomLocks.get(roomCode);
    if (lock && lock.holderSocketId === socketId) {
      roomLocks.delete(roomCode);
      emitLockState(roomCode);
      io.to(roomCode).emit("chat-message", {
        id: `sys_${Date.now()}`,
        roomCode,
        by: "System",
        text: `Editor unlocked (owner left).`,
        time: new Date().toLocaleTimeString(),
      });
    }
  };

  const removeMemberEverywhere = (socketId) => {
    for (const [roomCode, map] of roomMembers.entries()) {
      if (map.has(socketId)) {
        map.delete(socketId);
        if (map.size === 0) roomMembers.delete(roomCode);
        clearLockIfHolderLeft(roomCode, socketId);
        return roomCode;
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
    socket.on("join-room", ({ roomCode, user }) => {
      if (!roomCode) return;

      const safeName = (user || "Guest").toString().trim() || "Guest";

      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      socket.data.user = safeName;

      const map = getRoomMap(roomCode);
      const color = pickColor(roomCode);
      map.set(socket.id, { name: safeName, joinedAt: Date.now(), color });

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

    // ✅ EDITOR ACTION (SAVE / DOWNLOAD NOTICE)  ✅ FIXED: broadcast to ALL (including sender)
    socket.on("editor-action", (payload) => {
      const { roomCode, action, by, language, meta } = payload || {};
      if (!roomCode) return;

      io.to(roomCode).emit("editor-action", {
        roomCode,
        action: action || "save",           // "save" | "download"
        by: by || socket.data.user || "Someone",
        language: language || "javascript",
        meta: meta || null,                 // optional extra info
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

    // ✅ CURSOR CHANGE
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

    // LEAVE
    socket.on("leave-room", ({ roomCode, user }) => {
      if (!roomCode) return;

      socket.leave(roomCode);

      const map = roomMembers.get(roomCode);
      if (map) {
        map.delete(socket.id);
        if (map.size === 0) roomMembers.delete(roomCode);
      }

      clearLockIfHolderLeft(roomCode, socket.id);
      emitMembers(roomCode);

      socket.to(roomCode).emit("chat-message", {
        id: `sys_${Date.now()}`,
        roomCode,
        by: "System",
        text: `${user || "Guest"} left the room`,
        time: new Date().toLocaleTimeString(),
      });
    });

    socket.on("disconnect", () => {
      const roomCode = socket.data.roomCode;
      const user = socket.data.user;

      const removedFrom = removeMemberEverywhere(socket.id);
      const targetRoom = roomCode || removedFrom;

      if (targetRoom) {
        emitMembers(targetRoom);

        socket.to(targetRoom).emit("chat-message", {
          id: `sys_${Date.now()}`,
          roomCode: targetRoom,
          by: "System",
          text: `${user || "Guest"} disconnected`,
          time: new Date().toLocaleTimeString(),
        });
      }

      console.log("User disconnected:", socket.id);
    });
  });
};