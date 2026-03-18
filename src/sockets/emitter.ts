import { getIO } from "./index";
import type { EmailJobStatus } from "../queues/jobTypes";

export function emitNotificationStatus(
  email: string,
  status: EmailJobStatus,
): void {
  getIO().emit("notification-status", {
    email,
    status,
    timestamp: new Date().toISOString(),
  });
}
