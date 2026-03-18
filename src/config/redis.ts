import Redis from "ioredis";
import { env } from "./env";
import { logger } from "./logger";

export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
});

redisClient.on("error", (err: Error) =>
  logger.error({ err }, "Redis connection error"),
);
redisClient.on("connect", () => logger.info("Redis connected"));
redisClient.on("reconnecting", () => logger.warn("Redis reconnecting..."));
