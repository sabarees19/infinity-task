import { Queue } from "bullmq";
import { redisClient } from "../config/redis";
import { logger } from "../config/logger";
import type { EmailJobPayload } from "./jobTypes";
import { emitNotificationStatus } from "../sockets/emitter";

export const emailQueue = new Queue<EmailJobPayload, void, string>("email", {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: false,
    removeOnFail: false,
  },
});

export async function addEmailJob(payload: EmailJobPayload) {
  const job = await emailQueue.add("send-email", payload);
  emitNotificationStatus(payload.to, "queued");
  logger.info({ jobId: job.id, to: payload.to }, "Job added to queue");
  return job.id;
}
