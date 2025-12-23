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
const accountantOrAdmin = checkRole(['accountant', 'admin']);
const allRoles = checkRole(['teller', 'accountant', 'admin']);

// Thêm loại sổ tiết kiệm mới - accountant và admin
// POST /api/typesaving
router.post("/", verifyToken, accountantOrAdmin, createTypeSaving);

// Lấy danh sách tất cả loại sổ tiết kiệm - tất cả role
// GET /api/typesaving
router.get("/", verifyToken, allRoles, getAllTypeSavings);
// Lấy thông tin loại sổ tiết kiệm theo ID - tất cả role
// GET /api/typesaving/:id
router.get("/:id", verifyToken, allRoles, getTypeSavingById);

// Cập nhật loại sổ tiết kiệm - accountant và admin
// PUT /api/typesaving/:id
router.put("/:id", verifyToken, accountantOrAdmin, updateTypeSaving);
// Xóa loại sổ tiết kiệm - accountant và admin
// DELETE /api/typesaving/:id
router.delete("/:id", verifyToken, accountantOrAdmin, deleteTypeSaving);

export default router;
