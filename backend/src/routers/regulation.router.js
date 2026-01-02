import express from "express";
import { getAllRegulations, updateRegulations, getRegulationRates, updateSomeRegulation, getHistoryRegulations } from "../controllers/Regulation/regulation.controller.js";
import { validatePositiveNumbers } from "../middleware/validation.middleware.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

// Role definitions
const allRoles = checkRole(['accountant', 'administrator', 'teller']);

/**
 * @swagger
 * /api/regulation:
 *   get:
 *     summary: Lấy tất cả quy định hiện tại
 *     tags:
 *       - Regulation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách quy định
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   regulationId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   value:
 *                     type: number
 *   put:
 *     summary: Cập nhật tất cả quy định
 *     tags:
 *       - Regulation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 regulationId:
 *                   type: integer
 *                 value:
 *                   type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /api/regulation/interest-rates:
 *   get:
 *     summary: Lấy danh sách lãi suất các loại sổ
 *     tags:
 *       - Regulation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách lãi suất
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   typeSavingId:
 *                     type: integer
 *                   interestRate:
 *                     type: number
 *   put:
 *     summary: Cập nhật một số quy định về lãi suất
 *     tags:
 *       - Regulation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 typeSavingId:
 *                   type: integer
 *                 interestRate:
 *                   type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /api/regulation/history:
 *   get:
 *     summary: Lấy lịch sử thay đổi quy định
 *     tags:
 *       - Regulation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lịch sử thay đổi quy định
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   regulationId:
 *                     type: integer
 *                   oldValue:
 *                     type: number
 *                   newValue:
 *                     type: number
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */

router.get("/", verifyToken, allRoles, getAllRegulations); 
router.put("/", verifyToken, allRoles, validatePositiveNumbers, updateRegulations);
router.get("/interest-rates", verifyToken, allRoles, getRegulationRates);
router.put("/interest-rates", verifyToken, allRoles, updateSomeRegulation);
router.get("/history", verifyToken, allRoles, getHistoryRegulations);
export default router;
