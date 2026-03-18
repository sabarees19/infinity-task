import "dotenv/config";
import http from "http";
import express from "express";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { redisClient } from "./config/redis";
import { emailQueue } from "./queues/emailQueue";
import { emailWorker } from "./workers/emailWorker";
import "./workers/workerEvents";
import { initSocketServer } from "./sockets/index";
import rootRouter from "./routes/index";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(express.json());

app.use("/api", rootRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

const httpServer = http.createServer(app);
initSocketServer(httpServer);

httpServer.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, "Server started");
});

async function shutdown(signal: string) {
  try {
    await emailWorker.close();
    await emailQueue.close();
    await redisClient.quit();
    logger.info("Cleanup completed");
    process.exit(0);
  } catch (err) {
    logger.error({ err }, "Error during shutdown");
    process.exit(1);
  }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
