import express from "express";
import {
  addCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomer,
} from "../controllers/Customer/customer.controller.js";

const router = express.Router();

// Search customer (by keyword: id or name)
// GET /api/customer/search?keyword=...
router.get("/search", searchCustomer);

// Thêm khách hàng mới
// POST /api/customer/add
router.post("/add", addCustomer);

// Lấy danh sách tất cả khách hàng
// GET /api/customer
router.get("/", getAllCustomers);

// Lấy thông tin khách hàng theo ID
// GET /api/customer/:id
router.get("/:id", getCustomerById);

// Cập nhật thông tin khách hàng
// PUT /api/customer/:id
router.put("/:id", updateCustomer);

// Xóa khách hàng
// DELETE /api/customer/:id
router.delete("/:id", deleteCustomer);

export default router;
