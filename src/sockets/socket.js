// src/sockets/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: true,
  transports: ["websocket", "polling"],
});

export default socket;