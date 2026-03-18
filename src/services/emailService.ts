import { transporter } from "../config/mailer";
import { env } from "../config/env";
import type { EmailJobPayload } from "../queues/jobTypes";

export const emailService = {
  async send(payload: EmailJobPayload): Promise<void> {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: payload.to,
      subject: payload.subject,
      text: payload.message,
    });
  },
};
