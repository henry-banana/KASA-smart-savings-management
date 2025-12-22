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

const router = express.Router();

// Thêm sổ tiết kiệm mới
router.post("/", verifyToken, addSavingBook);

// Cập nhật thông tin sổ tiết kiệm
router.put("/:id", verifyToken, updateSavingBook);

// Xóa sổ tiết kiệm
router.delete("/:id", verifyToken, deleteSavingBook);

// Search theo từ khóa là mã sổ, tên của khách hàng, số căn cước
router.get("/search", verifyToken, searchSavingBook);

// Lấy thông tin sổ tiết kiệm theo ID
router.get("/:id", verifyToken, getSavingBookById);

//Tất toán sổ
router.post("/:id/close", verifyToken, closeSavingBook);

export default router;
