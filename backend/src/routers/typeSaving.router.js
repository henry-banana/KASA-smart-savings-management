import express from "express";
import {
  getAllTypeSavings,
  getTypeSavingById,
  createTypeSaving,
  updateTypeSaving,
  deleteTypeSaving,
} from "../controllers/TypeSaving/typeSaving.controller.js";

const router = express.Router();

// Thêm loại sổ tiết kiệm mới
// POST /api/typesaving
router.post("/", createTypeSaving);

// Lấy danh sách tất cả loại sổ tiết kiệm
// GET /api/typesaving
router.get("/", getAllTypeSavings);

// Lấy thông tin loại sổ tiết kiệm theo ID
// GET /api/typesaving/:id
router.get("/:id", getTypeSavingById);

// Cập nhật loại sổ tiết kiệm
// PUT /api/typesaving/:id
router.put("/:id", updateTypeSaving);

// Xóa loại sổ tiết kiệm
// DELETE /api/typesaving/:id
router.delete("/:id", deleteTypeSaving);

export default router;
