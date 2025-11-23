import express from "express";
import { getDailyReport } from "../controllers/Report/report.controller.js";

const router = express.Router();

// Báo cáo theo ngày
// Ví dụ: GET /api/report/daily?date=2025-01-20
router.get("/daily", getDailyReport);

export default router;
