import { employeeService } from "../../services/Employee/employee.service.js";

//  Thêm nhân viên mới
export async function addEmployee(req, res) {
  try {
    const result = await employeeService.addEmployee(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error adding employee:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

// Lấy danh sách tất cả nhân viên
export async function getAllEmployees(req, res) {
  try {
    const result = await employeeService.getAllEmployees();
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error getting employees:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

//  Lấy thông tin nhân viên theo ID
export async function getEmployeeById(req, res) {
  try {
    const { id } = req.params;
    const result = await employeeService.getEmployeeById(id);
    if (!result) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error getting employee by ID:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

//  Cập nhật thông tin nhân viên
export async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const result = await employeeService.updateEmployee(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating employee:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

//  Xóa nhân viên
export async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;
    const result = await employeeService.deleteEmployee(id);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error deleting employee:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}
