import express from "express";
import {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  depositTransaction,
  withdrawTransaction,
} from "../controllers/Transaction/transaction.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();
const tellerOnly = checkRole(['teller']);

/**
 * @swagger
 * /api/transaction:
 *   get:
 *     summary: Lấy danh sách tất cả giao dịch
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách giao dịch
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
 */

/**
 * @swagger
 * /api/transaction/{id}:
 *   get:
 *     summary: Lấy thông tin giao dịch theo ID
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID giao dịch
 *     responses:
 *       200:
 *         description: Thông tin giao dịch
 *       404:
 *         description: Không tìm thấy
 *   put:
 *     summary: Cập nhật thông tin giao dịch
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID giao dịch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy
 *   delete:
 *     summary: Xóa giao dịch
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID giao dịch
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy
 */

/**
 * @swagger
 * /api/transaction/add:
 *   post:
 *     summary: Thêm giao dịch mới
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               savingBookId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thêm thành công
 */

/**
 * @swagger
 * /api/transaction/deposit:
 *   post:
 *     summary: Gửi tiền vào sổ tiết kiệm
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               savingBookId:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Gửi tiền thành công
 */

/**
 * @swagger
 * /api/transaction/withdraw:
 *   post:
 *     summary: Rút tiền từ sổ tiết kiệm
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               savingBookId:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Rút tiền thành công
 */

router.get("/", verifyToken, tellerOnly, getAllTransactions);
router.get("/:id", verifyToken, tellerOnly, getTransactionById);
router.post("/add", verifyToken, tellerOnly, addTransaction);
router.put("/:id", verifyToken, tellerOnly, updateTransaction);
router.delete("/:id", verifyToken, tellerOnly, deleteTransaction);
router.post("/deposit", verifyToken, tellerOnly, depositTransaction);
router.post("/withdraw", verifyToken, tellerOnly, withdrawTransaction);

export default router;
