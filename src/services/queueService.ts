import { emailQueue } from "../queues/emailQueue";

export const queueService = {
  async getCounts() {
    return emailQueue.getJobCounts("waiting", "active", "completed", "failed");
  },
};
