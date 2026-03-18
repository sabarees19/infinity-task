import { Router } from "express";
import notificationsRouter from "./notifications";

const router: ReturnType<typeof Router> = Router();

router.use("/notifications", notificationsRouter);

export default router;
