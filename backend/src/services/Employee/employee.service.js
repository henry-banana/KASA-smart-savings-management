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

  /**
   * Lấy thông tin profile người dùng hiện tại
   */
  async getMyProfile(userId) {
    try {
      const data = await employeeRepository.findProfileById(userId);
      if (!data) return null;

      // Format lại dữ liệu cho đẹp trước khi trả về Controller
      return {
        userId: data.useraccount.userid,
        fullName: data.fullname,
        email: data.email,
        role: data.role?.rolename,
        branchName: data.branch?.branchname || "",
        status: data.useraccount.accountstatus,
      };
    } catch (error) {
      // Có thể log error tại đây
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }
  }

  /**
   * Cập nhật thông tin cá nhân (Có bảo mật White-list)
   */
  async updateMyProfile(userId, updateData) {
    // 1. MAPPING: camelCase (from client) -> lowercase (database column)
    const fieldMapping = {
      fullName: "fullname",
      email: "email",
      phone: "phone",
    };

    const cleanData = {};

    // 2. Convert và validate fields
    Object.keys(updateData).forEach((key) => {
      const dbColumn = fieldMapping[key];
      
      if (dbColumn) {
        cleanData[dbColumn] = updateData[key];
      }
    });

    // Nếu không có trường nào hợp lệ để update
    if (Object.keys(cleanData).length === 0) {
      throw new Error("No valid fields to update. Allowed: fullName, email, phone.");
    }

    // 3. Gọi Repository để update
    // Lưu ý: userId của UserAccount chính là employeeid trong bảng Employee
    try {
      const updatedRecord = await employeeRepository.update(userId, cleanData);
      return updatedRecord;
    } catch (error) {
      if (error.code === '23505') { // Mã lỗi unique constraint (trùng email)
         throw new Error("Email already exists.");
      }
      throw error;
    }
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
