import { employeeRepository } from "../../repositories/Employee/EmployeeRepository.js";
import { userAccountRepository } from "../../repositories/UserAccount/UserAccountRepository.js";
import { hashPassword } from "../../middleware/hashing.middleware.js";

class EmployeeService {
  async addEmployee({ fullName, roleID, branchID, email, password }) {
    if (!fullName || !email || !roleID || !branchID || !password)
      throw new Error("Missing required information.");

    const hashedPassword = await hashPassword(password);

    const newEmployee = await employeeRepository.create({
      fullname: fullName,
      email,
      roleid: roleID,
      branchid: branchID,
    });

    await userAccountRepository.update(newEmployee.employeeid, { password: hashedPassword });

    return {
      message: "Employee added and account created successfully.",
      employee: newEmployee,
    };
  }

  async updateEmployee(id, updates) {
    // kiểm tra nhân viên tồn tại
    const existingEmployee = await employeeRepository.findById(id);
    if (!existingEmployee) throw new Error("Employee not found");

    // cập nhật thông tin nhân viên
    const updatedEmployee = await employeeRepository.update(id, {
      fullname: updates.fullName,
      email: updates.email,
      roleid: updates.roleID,
      branchid: updates.branchID,
    });

    // nếu có thay đổi password, cập nhật tài khoản
    if (updates.password) {
      const hashedPassword = await hashPassword(updates.password);
      await userAccountRepository.update(id, { password: hashedPassword });
    }

    return {
      message: "Employee updated successfully",
      employee: updatedEmployee,
    };
  }

}

export const employeeService = new EmployeeService();
