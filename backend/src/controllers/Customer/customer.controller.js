import { customerService } from "../../services/Customer/customer.service.js";

// Thêm khách hàng mới
export async function addCustomer(req, res) {
  try {
    const result = await customerService.addCustomer(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error adding customer:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

// Lấy danh sách tất cả khách hàng
export async function getAllCustomers(req, res) {
  try {
    const result = await customerService.getAllCustomers();
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error getting customers:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

// Lấy thông tin khách hàng theo ID
export async function getCustomerById(req, res) {
  try {
    const { id } = req.params;
    const result = await customerService.getCustomerById(id);
    if (!result) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error getting customer by ID:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

// Cập nhật thông tin khách hàng
export async function updateCustomer(req, res) {
  try {
    const { id } = req.params;
    const result = await customerService.updateCustomer(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating customer:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

// Xóa khách hàng
export async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    const result = await customerService.deleteCustomer(id);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error deleting customer:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}
