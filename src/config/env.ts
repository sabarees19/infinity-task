import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  REDIS_URL: z.url().default("redis://localhost:6379"),
  SMTP_HOST: z.string().default("smtp.mailtrap.io"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM: z.email().default("noreply@example.com"),
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
  LOG_LEVEL: z.string().default("info"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid env: ", parsed.error.message);
  process.exit(1);
}

export const env = parsed.data;
