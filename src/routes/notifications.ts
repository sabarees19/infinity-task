import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { addEmailJob } from "../queues/emailQueue";
import { queueService } from "../services/queueService";
import { logger } from "../config/logger";

const router: ReturnType<typeof Router> = Router();

const emailBodySchema = z.object({
  to: z.email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

router.post(
  "/email",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = emailBodySchema.safeParse(req.body);
      if (!parsed.success) {
        res
          .status(400)
          .json({ error: "Validation failed", details: parsed.error.message });
        return;
      }

      const jobId = await addEmailJob(parsed.data);
      logger.info({ jobId, to: parsed.data.to }, "Email job queued via API");
      res.status(202).json({ jobId, status: "queued" });
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  "/queue-status",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const counts = await queueService.getCounts();
      res.json(counts);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
