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
    // 1. INPUT MAPPING: camelCase -> lowercase (DB columns)
    // Chỉ map những field được phép update để tránh Mass Assignment
    const inputMapping = {
        fullName: "fullname",
        email: "email",
        phone: "phone",
    };

    const cleanData = {};
    Object.keys(updateData).forEach((key) => {
        if (inputMapping[key]) {
            cleanData[inputMapping[key]] = updateData[key];
        }
    });

    if (Object.keys(cleanData).length === 0) {
        throw new Error("No valid fields to update. Allowed: fullName, email, phone.");
    }

    try {
        // 2. Gọi Repository
        // Đảm bảo hàm này trả về Full Record sau khi update (Postgres: RETURNING *)
        const updatedRecord = await employeeRepository.update(userId, cleanData);
        
        if (!updatedRecord) throw new Error("Update failed or record not found.");

        // 3. OUTPUT MAPPING: lowercase -> camelCase
        // Tách biệt logic này ra (có thể dùng chung cho GetProfile)
        return this.mapToResponse(updatedRecord);

    } catch (error) {
        if (error.code === '23505') { 
            throw new Error("Email already exists.");
        }
        throw error;
    }
}

// Helper function: Single Responsibility Principle
// Chuyển đổi Database Model -> Response Model
mapToResponse(record) {
    // Xử lý null/undefined
    if (!record) return null;

    return {
        // Explicitly mapping: Kiểm soát hoàn toàn những gì trả về
        id: record.employeeid || record.id, // Map thêm ID nếu cần
        fullName: record.fullname,          // Map ngược lại
        email: record.email,
        phone: record.phone,
        // Có thể map thêm các trường read-only khác nếu DB trả về
        // role: record.role, 
        // joinedAt: record.created_at
  };
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
