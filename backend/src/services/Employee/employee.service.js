import { employeeRepository } from "../../repositories/Employee/EmployeeRepository.js";
import { userAccountRepository } from "../../repositories/UserAccount/UserAccountRepository.js";
import { roleRepository } from "../../repositories/Role/RoleRepository.js";
import { hashPassword } from "../../middleware/hashing.middleware.js";

class EmployeeService {
  // Thêm nhân viên mới
  async addEmployee({ username, fullName, roleName, email }) {
    if (!username || !fullName || !email || !roleName)
        throw new Error("Missing required information.");

    // 1. Lấy roleID từ roleName
    const role = await roleRepository.findByName(roleName);
    if (!role) throw new Error("Invalid role name.");

    const roleID = role.roleid;

    // 2. Tạo employee mới
    const newEmployee = await employeeRepository.create({
        employeeid: username,      // ⚡ Dùng username làm employeeid
        fullname: fullName,
        email: email,
        roleid: roleID,
    });

    // 3. Tạo useraccount tương ứng
    await userAccountRepository.create({
        userid: username,          // ⚡ userid = employeeid
        username: username,
        password: null,            // hoặc để random password
        status: "active",
    });

    return {
        message: "Employee and user account created successfully.",
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
