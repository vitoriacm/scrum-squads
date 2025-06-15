import { Router } from "express";
import { sendReport } from "../controllers/daily.controller";

const router = Router();

router.post("/report", sendReport);

export default router;
