import express from "express";
import {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/Employee/employee.controller.js";

const router = express.Router();

// Thêm nhân viên mới
// POST /api/employee
router.post("/add", addEmployee);

// Lấy danh sách tất cả nhân viên
// GET /api/employee
router.get("/", getAllEmployees);

// Lấy thông tin nhân viên theo ID
// GET /api/employee/:id
router.get("/:id", getEmployeeById);

// Cập nhật thông tin nhân viên
// PUT /api/employee/:id
router.put("/:id", updateEmployee);

// Xóa nhân viên
// DELETE /api/employee/:id
router.delete("/:id", deleteEmployee);

export default router;
