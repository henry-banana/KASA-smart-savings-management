import express from "express";
import {
  getAllTypeSavings,
  getTypeSavingById,
  createTypeSaving,
  updateTypeSaving,
  deleteTypeSaving,
} from "../controllers/TypeSaving/typeSaving.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

// Role definitions
const accountantOrAdmin = checkRole(['accountant', 'administrator']);
const allRoles = checkRole(['teller', 'accountant', 'administrator']);

/**
 * @swagger
 * /api/typesaving:
 *   post:
 *     summary: Thêm loại sổ tiết kiệm mới
 *     tags:
 *       - TypeSaving
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               interestRate:
 *                 type: number
 *     responses:
 *       201:
 *         description: Tạo loại sổ thành công
 *   get:
 *     summary: Lấy danh sách tất cả loại sổ tiết kiệm
 *     tags:
 *       - TypeSaving
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách loại sổ tiết kiệm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   typeSavingId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   interestRate:
 *                     type: number
 */

/**
 * @swagger
 * /api/typesaving/{id}:
 *   get:
 *     summary: Lấy thông tin loại sổ tiết kiệm theo ID
 *     tags:
 *       - TypeSaving
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID loại sổ tiết kiệm
 *     responses:
 *       200:
 *         description: Thông tin loại sổ tiết kiệm
 *   put:
 *     summary: Cập nhật loại sổ tiết kiệm
 *     tags:
 *       - TypeSaving
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID loại sổ tiết kiệm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               interestRate:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa loại sổ tiết kiệm
 *     tags:
 *       - TypeSaving
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID loại sổ tiết kiệm
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

router.post("/", verifyToken, accountantOrAdmin, createTypeSaving);
router.get("/", verifyToken, allRoles, getAllTypeSavings);
router.get("/:id", verifyToken, allRoles, getTypeSavingById);
router.put("/:id", verifyToken, accountantOrAdmin, updateTypeSaving);
router.delete("/:id", verifyToken, accountantOrAdmin, deleteTypeSaving);

export default router;
