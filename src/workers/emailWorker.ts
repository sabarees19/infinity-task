import { Worker } from "bullmq";
import { logger } from "../config/logger";
import { redisClient } from "../config/redis";
import type { EmailJobPayload } from "../queues/jobTypes";
import { emailService } from "../services/emailService";

export const emailWorker = new Worker<EmailJobPayload, void, string>(
  "email",
  async (job) => {
    const { to, subject, message } = job.data;
    const start = Date.now();

    logger.info({ jobId: job.id, to }, "Worker picked up job");

    await emailService.send({ to, subject, message });

    const durationMs = Date.now() - start;
    logger.info({ jobId: job.id, to, durationMs }, "Email sent successfully");
  },
  { connection: redisClient, concurrency: 3 },
);
