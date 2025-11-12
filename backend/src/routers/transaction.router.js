import express from "express";
import {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/Transaction/transaction.controller.js";

const router = express.Router();

//Lấy danh sách tất cả giao dịch
router.get("/", getAllTransactions);

//Lấy thông tin 1 giao dịch theo ID
router.get("/:id", getTransactionById);

//Thêm giao dịch mới
router.post("/add", addTransaction);

//Cập nhật thông tin giao dịch
router.put("/:id", updateTransaction);

//Xóa giao dịch
router.delete("/:id", deleteTransaction);

export default router;
