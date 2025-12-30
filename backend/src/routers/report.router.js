import express from "express";
import {
  getDailyReport,
  getMonthlyReport,
  getDailyTransactionStatistics,
} from "../controllers/Report/report.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

// Role definitions - only accountant and admin can view reports
const accountantRole = checkRole(["accountant"]);

router.get("/daily", verifyToken, accountantRole, getDailyReport);
router.get("/monthly", verifyToken, accountantRole, getMonthlyReport);
// 20.1 Thống kê giao dịch theo ngày
router.get(
  "/daily/transactions",
  verifyToken,
  accountantRole,
  getDailyTransactionStatistics
);
export default router;
