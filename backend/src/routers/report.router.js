import express from "express";
import {
  getDailyReport,
  getMonthlyReport,
} from "../controllers/Report/report.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();


router.get("/daily", verifyToken, getDailyReport);
router.get("/monthly", verifyToken, getMonthlyReport);

export default router;
