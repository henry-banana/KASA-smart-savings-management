import express from "express";
import { getAllBranchName } from "../controllers/Branch/branch.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

// Role definitions - all roles can view branches
const adminRole = checkRole(['administrator']);

/**
 * @swagger
 * /api/branch/name:
 *   get:
 *     summary: Lấy danh sách tên các chi nhánh
 *     tags:
 *       - Branch
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách tên chi nhánh
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   branchId:
 *                     type: integer
 *                     example: 1
 *                   branchName:
 *                     type: string
 *                     example: "Chi nhánh Quận 1"
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 */
router.get("/name", verifyToken, adminRole, getAllBranchName)

export default router;
