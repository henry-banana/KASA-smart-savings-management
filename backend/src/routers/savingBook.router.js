import express from "express";
import {
  addSavingBook,
  updateSavingBook,
  deleteSavingBook,
  getSavingBookById,
  searchSavingBook,
  closeSavingBook
} from "../controllers/SavingBook/savingBook.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";

const router = express.Router();

// Role definitions
const teller = checkRole(['teller']);
const tellerOrAccountant = checkRole(['teller', 'accountant']);

/**
 * @swagger
 * /api/savingbook:
 *   post:
 *     summary: Thêm sổ tiết kiệm mới
 *     tags:
 *       - SavingBook
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: integer
 *               typeSavingId:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Tạo sổ tiết kiệm thành công
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *   get:
 *     summary: Tìm kiếm sổ tiết kiệm
 *     tags:
 *       - SavingBook
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: false
 *         description: Mã sổ, tên khách hàng hoặc số căn cước
 *     responses:
 *       200:
 *         description: Danh sách sổ tiết kiệm phù hợp
 */

/**
 * @swagger
 * /api/savingbook/{id}:
 *   get:
 *     summary: Lấy thông tin sổ tiết kiệm theo ID
 *     tags:
 *       - SavingBook
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sổ tiết kiệm
 *     responses:
 *       200:
 *         description: Thông tin sổ tiết kiệm
 *       404:
 *         description: Không tìm thấy
 *   put:
 *     summary: Cập nhật thông tin sổ tiết kiệm
 *     tags:
 *       - SavingBook
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sổ tiết kiệm
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
 *     summary: Xóa sổ tiết kiệm
 *     tags:
 *       - SavingBook
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sổ tiết kiệm
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy
 */

/**
 * @swagger
 * /api/savingbook/{id}/close:
 *   post:
 *     summary: Tất toán sổ tiết kiệm
 *     tags:
 *       - SavingBook
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sổ tiết kiệm
 *     responses:
 *       200:
 *         description: Tất toán thành công
 *       404:
 *         description: Không tìm thấy
 */

router.post("/", verifyToken, teller, addSavingBook);
router.put("/:id", verifyToken, teller, updateSavingBook);
router.delete("/:id", verifyToken, teller, deleteSavingBook);
router.get("/search", verifyToken, tellerOrAccountant, searchSavingBook);
router.get("/:id", verifyToken, tellerOrAccountant, getSavingBookById);
router.post("/:id/close", verifyToken, teller, closeSavingBook);

export default router;
