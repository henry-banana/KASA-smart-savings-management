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
const tellerOrAdmin = checkRole(['teller', 'admin']);
const allRoles = checkRole(['teller', 'accountant', 'admin']);

// Thêm sổ tiết kiệm mới - chỉ teller và admin
router.post("/", verifyToken, tellerOrAdmin, addSavingBook);

// Cập nhật thông tin sổ tiết kiệm - chỉ teller và admin
router.put("/:id", verifyToken, tellerOrAdmin, updateSavingBook);

// Xóa sổ tiết kiệm - chỉ teller và admin
router.delete("/:id", verifyToken, tellerOrAdmin, deleteSavingBook);

// Search theo từ khóa là mã sổ, tên của khách hàng, số căn cước - tất cả role
router.get("/search", verifyToken, allRoles, searchSavingBook);

// Lấy thông tin sổ tiết kiệm theo ID - tất cả role
router.get("/:id", verifyToken, allRoles, getSavingBookById);

// Tất toán sổ - chỉ teller và admin
router.post("/:id/close", verifyToken, tellerOrAdmin, closeSavingBook);

export default router;
