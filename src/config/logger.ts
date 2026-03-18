import pino from "pino";
import { env } from "./env";

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "dd/mm/yyyy HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
});
