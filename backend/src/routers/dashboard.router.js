import express from "express";
import { 
    getDashboardStats, 
    getRecentTransactions 
} from "../controllers/Dashboard/dashboard.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

// Role definitions - all roles can view dashboard
const tellerOrAccountant = checkRole(['teller', 'accountant']);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Lấy thống kê tổng quan Dashboard
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê tổng quan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCustomers:
 *                   type: integer
 *                 totalSavings:
 *                   type: number
 *                 totalTransactions:
 *                   type: integer
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 */

/**
 * @swagger
 * /api/dashboard/recent-transactions:
 *   get:
 *     summary: Lấy 5 giao dịch gần đây nhất
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách 5 giao dịch gần nhất
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   transactionId:
 *                     type: integer
 *                   amount:
 *                     type: number
 *                   type:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 */

router.get("/stats", verifyToken, tellerOrAccountant, getDashboardStats);
router.get("/recent-transactions", verifyToken, tellerOrAccountant, getRecentTransactions); 

export default router;