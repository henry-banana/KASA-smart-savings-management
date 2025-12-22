import express from "express";
import {
  getDailyReport,
  getMonthlyReport,
} from "../controllers/Report/report.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

// Role definitions - only accountant and admin can view reports
const accountantOrAdmin = checkRole(['accountant', 'admin']);


router.get("/daily", verifyToken, accountantOrAdmin, getDailyReport);
router.get("/monthly", verifyToken, accountantOrAdmin, getMonthlyReport);

export default router;
