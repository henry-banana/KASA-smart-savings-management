import { employeeService } from "../../services/Employee/employee.service.js";

// Thêm nhân viên mới
export async function addEmployee(req, res) {
  try {
    const result = await employeeService.addEmployee(req.body);

    return res.status(201).json({
      message: "Employee added successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error adding employee:", err);

    return res.status(err.status || 500).json({
      message: "Failed to add employee",
      success: false,
    });
  }
}

// Lấy danh sách tất cả nhân viên
export async function getAllEmployees(req, res) {
  try {
    const result = await employeeService.getAllEmployees();

    return res.status(200).json({
      message: "Get employees successfully",
      success: true,
      total: result.length,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error getting employees:", err);

    return res.status(err.status || 500).json({
      message: "Failed to retrieve employees",
      success: false,
    });
  }
}

// Lấy thông tin nhân viên theo ID
export async function getEmployeeById(req, res) {
  try {
    const { id } = req.params;
    const result = await employeeService.getEmployeeById(id);

    if (!result) {
      return res.status(404).json({
        message: "Employee not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Get employee successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error getting employee by ID:", err);

    return res.status(err.status || 500).json({
      message: "Failed to retrieve employee",
      success: false,
    });
  }
}

// Cập nhật thông tin nhân viên
export async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const result = await employeeService.updateEmployee(id, req.body);

    if (!result) {
      return res.status(404).json({
        message: "Employee not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Employee updated successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error updating employee:", err);

    return res.status(err.status || 500).json({
      message: "Failed to update employee",
      success: false,
    });
  }
}

// Xóa nhân viên
export async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;
    const result = await employeeService.deleteEmployee(id);

    if (!result) {
      return res.status(404).json({
        message: "Employee not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Employee deleted successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error deleting employee:", err);

    return res.status(err.status || 500).json({
      message: "Failed to delete employee",
      success: false,
    });
  }
}
