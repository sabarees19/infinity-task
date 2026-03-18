import { emailWorker } from "./emailWorker";
import { emitNotificationStatus } from "../sockets/emitter";
import { logger } from "../config/logger";

emailWorker.on("active", (job) => {
  emitNotificationStatus(job.data.to, "processing");
});

emailWorker.on("completed", (job) => {
  emitNotificationStatus(job.data.to, "sent");
});

emailWorker.on("failed", (job, err) => {
  logger.error(
    { jobId: job?.id, to: job?.data?.to, err },
    "Job permanently failed",
  );
  if (job) emitNotificationStatus(job.data.to, "failed");
});

emailWorker.on("error", (err) => {
  logger.error({ err }, "Worker error");
});

emailWorker.on("stalled", (jobId) => {
  logger.warn({ jobId }, "Job stalled — will be retried");
});
