export interface EmailJobPayload {
  to: string;
  subject: string;
  message: string;
}

export type EmailJobStatus = "queued" | "processing" | "sent" | "failed";
