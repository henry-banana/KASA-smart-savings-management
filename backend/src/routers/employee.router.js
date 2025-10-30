import express from "express";
import {
  addEmployee,
  updateEmployee,
} from "../controllers/employee/employee.controller.js";

const router = express.Router();

// Thêm nhân viên mới
router.post("/add", addEmployee);

// Cập nhật thông tin nhân viên
router.put("/:id", updateEmployee);
// router.post("/update/{id}", updateEmployee);

export default router;
