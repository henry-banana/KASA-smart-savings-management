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

//Lấy danh sách tất cả giao dịch
router.get("/", verifyToken, tellerOnly, getAllTransactions);

//Lấy thông tin 1 giao dịch theo ID
router.get("/:id", verifyToken, tellerOnly, getTransactionById);

//Thêm giao dịch mới
router.post("/add", verifyToken, tellerOnly, addTransaction);

//Cập nhật thông tin giao dịch
router.put("/:id", verifyToken, tellerOnly, updateTransaction);

//Xóa giao dịch
router.delete("/:id", verifyToken, tellerOnly, deleteTransaction);

//Gửi tiền
router.post("/deposit", verifyToken, tellerOnly, depositTransaction);

//Rút tiền
router.post("/withdraw", verifyToken, tellerOnly, withdrawTransaction);

export default router;
