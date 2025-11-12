import { employeeRepository } from "../../repositories/Employee/EmployeeRepository.js";
import { userAccountRepository } from "../../repositories/UserAccount/UserAccountRepository.js";
import { hashPassword } from "../../middleware/hashing.middleware.js";

class EmployeeService {
  // Thêm nhân viên mới
  async addEmployee({ fullName, roleID, branchID, email, password }) {
    if (!fullName || !email || !roleID || !branchID || !password)
      throw new Error("Missing required information.");

    // Mã hóa mật khẩu
    const hashedPassword = await hashPassword(password);

    // Tạo bản ghi nhân viên mới
    const newEmployee = await employeeRepository.create({
      fullname: fullName,
      email,
      roleid: roleID,
      branchid: branchID,
    });

    // Cập nhật tài khoản người dùng tương ứng
    await userAccountRepository.update(newEmployee.employeeid, { password: hashedPassword });

    return {
      message: "Employee added and account created successfully.",
      employee: newEmployee,
    };
  }

  // Cập nhật nhân viên
  async updateEmployee(id, updates) {
    const existingEmployee = await employeeRepository.findById(id);
    if (!existingEmployee) throw new Error("Employee not found");

    const updatedEmployee = await employeeRepository.update(id, {
      fullname: updates.fullName,
      email: updates.email,
      roleid: updates.roleID,
      branchid: updates.branchID,
    });

    if (updates.password) {
      const hashedPassword = await hashPassword(updates.password);
      await userAccountRepository.update(id, { password: hashedPassword });
    }

    return {
      message: "Employee updated successfully",
      employee: updatedEmployee,
    };
  }

  // Lấy danh sách tất cả nhân viên
  async getAllEmployees() {
    const employees = await employeeRepository.findAll();
    return employees;
  }

  // Lấy nhân viên theo ID
  async getEmployeeById(id) {
    const employee = await employeeRepository.findById(id);
    if (!employee) throw new Error("Employee not found");
    return employee;
  }

  // Xóa nhân viên
  async deleteEmployee(id) {
    const existingEmployee = await employeeRepository.findById(id);
    if (!existingEmployee) throw new Error("Employee not found");

    await employeeRepository.delete(id);
    await userAccountRepository.delete(id);

    return { message: "Employee deleted successfully." };
  }
}

export const employeeService = new EmployeeService();
