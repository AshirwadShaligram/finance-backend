import express from "express";
import { sendDailyReports } from "../controller/emailController.js";

const router = express.Router();

router.post("/send-daily-reports", sendDailyReports);

export default router;
