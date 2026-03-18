import { Server } from "socket.io";
import type http from "http";
import { logger } from "../config/logger";

let io: Server;

export function initSocketServer(httpServer: http.Server): Server {
  io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "WS Connected");
    socket.on("disconnect", () => {
      logger.info({ socketId: socket.id }, "WS Disconnected");
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error("Socket not initialized");
  return io;
}
