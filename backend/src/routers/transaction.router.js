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

const router = express.Router();

//Lấy danh sách tất cả giao dịch
router.get("/", verifyToken, getAllTransactions);

//Lấy thông tin 1 giao dịch theo ID
router.get("/:id", verifyToken, getTransactionById);

//Thêm giao dịch mới
router.post("/add", verifyToken, addTransaction);

//Cập nhật thông tin giao dịch
router.put("/:id", verifyToken, updateTransaction);

//Xóa giao dịch
router.delete("/:id", verifyToken, deleteTransaction);

//Gửi tiền
router.post("/deposit", verifyToken, depositTransaction);

//Rút tiền
router.post("/withdraw", verifyToken, withdrawTransaction);

export default router;
