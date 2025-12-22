import express from "express";
import { 
    getDashboardStats, 
    getRecentTransactions 
} from "../controllers/Dashboard/dashboard.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();

// GET /api/dashboard/stats — Lấy thống kê tổng quan Dashboard
router.get("/stats", verifyToken, getDashboardStats);

//GET /api/dashboard/recent-transactions — Lấy 5 giao dịch gần đây
router.get("/recent-transactions", verifyToken, getRecentTransactions); 

export default router;