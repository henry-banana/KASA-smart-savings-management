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

/**
 * @swagger
 * /api/report/daily:
 *   get:
 *     summary: Lấy báo cáo tổng hợp theo ngày
 *     tags:
 *       - Report
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Ngày cần báo cáo (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Báo cáo tổng hợp ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDeposit:
 *                   type: number
 *                 totalWithdraw:
 *                   type: number
 *                 totalInterest:
 *                   type: number
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 */

/**
 * @swagger
 * /api/report/monthly:
 *   get:
 *     summary: Lấy báo cáo tổng hợp theo tháng
 *     tags:
 *       - Report
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: false
 *         description: Tháng (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: false
 *         description: Năm (YYYY)
 *     responses:
 *       200:
 *         description: Báo cáo tổng hợp tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDeposit:
 *                   type: number
 *                 totalWithdraw:
 *                   type: number
 *                 totalInterest:
 *                   type: number
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 */

/**
 * @swagger
 * /api/report/daily/transactions:
 *   get:
 *     summary: Thống kê giao dịch theo ngày
 *     tags:
 *       - Report
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Ngày cần thống kê (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Thống kê giao dịch trong ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 depositCount:
 *                   type: integer
 *                 withdrawCount:
 *                   type: integer
 *                 totalAmount:
 *                   type: number
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 */

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
