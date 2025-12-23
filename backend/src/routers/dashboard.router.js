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

// GET /api/dashboard/stats — Lấy thống kê tổng quan Dashboard
router.get("/stats", verifyToken, tellerOrAccountant, getDashboardStats);

//GET /api/dashboard/recent-transactions — Lấy 5 giao dịch gần đây
router.get("/recent-transactions", verifyToken, tellerOrAccountant, getRecentTransactions); 

export default router;