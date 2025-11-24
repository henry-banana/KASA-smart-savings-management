import express from "express";
import {
  addSavingBook,
  updateSavingBook,
  deleteSavingBook,
  getSavingBookById,
  searchSavingBook
} from "../controllers/SavingBook/savingBook.controller.js";

const router = express.Router();

// Thêm sổ tiết kiệm mới
router.post("/add", addSavingBook);

// Cập nhật thông tin sổ tiết kiệm
router.put("/:id", updateSavingBook);

// Xóa sổ tiết kiệm
router.delete("/:id", deleteSavingBook);

// Search theo từ khóa là mã sổ, tên của khách hàng, số căn cước
router.get("/search", searchSavingBook);

// Lấy thông tin sổ tiết kiệm theo ID
router.get("/:id", getSavingBookById);


export default router;
