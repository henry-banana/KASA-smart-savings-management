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

// Thêm sổ tiết kiệm mới - chỉ teller và admin
router.post("/", verifyToken, teller, addSavingBook);
// Cập nhật thông tin sổ tiết kiệm - chỉ teller và admin
router.put("/:id", verifyToken, teller, updateSavingBook);

// Xóa sổ tiết kiệm - chỉ teller và admin
router.delete("/:id", verifyToken, teller, deleteSavingBook);

// Search theo từ khóa là mã sổ, tên của khách hàng, số căn cước - tất cả role
router.get("/search", verifyToken, tellerOrAccountant, searchSavingBook);

// Lấy thông tin sổ tiết kiệm theo ID - tất cả role
router.get("/:id", verifyToken, tellerOrAccountant, getSavingBookById);

// Tất toán sổ - chỉ teller 
router.post("/:id/close", verifyToken, teller, closeSavingBook);

export default router;
