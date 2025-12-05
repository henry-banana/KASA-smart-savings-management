import { userAccountRepository } from "../../repositories/UserAccount/UserAccountRepository.js";
import { hashPassword } from "../../middleware/hashing.middleware.js";
import { comparePassword } from "../../middleware/comparePass.middleware.js";
import { Role } from "../../models/Role.js";
import { employeeRepository } from "../../repositories/Employee/EmployeeRepository.js";
import { Branch } from "../../models/Branch.js";


class UserAccountService {
  // Lấy toàn bộ tài khoản
  async getAllUserAccounts() {
    const accounts = await userAccountRepository.findAll();
    return accounts;
  }

  // Lấy tài khoản theo ID
  async getUserAccountById(id) {
    const account = await userAccountRepository.findById(id);
    if (!account) throw new Error("User account not found.");
    return account;
  }

  // Tạo tài khoản mới
  async createUserAccount({ fullName, roleName, email , branchName}) {
    if (!fullName || !roleName || !email)
      throw new Error("Missing required fields: fullName, roleName, email.");

    // 1️⃣ Tìm roleID theo roleName
    const role = await Role.getByName(roleName);
    if (!role) throw new Error("Role not found.");
    const roleID = role.roleid;

    const branch = await Branch.getByName(branchName);
    if (!branch) throw new Error("Branch not found.");


    // 4️⃣ Mật khẩu mặc định
    const defaultPassword = "123456";

    
    // 6️⃣ Tạo employee và đồng bộ khóa chính employeeid = userid
    const newEmployee = await employeeRepository.create({
      fullname: fullName,
      email,
      roleid: roleID,
      branchid: branch.branchid,
    });

    const userAccount = await userAccountRepository.findById(newEmployee.employeeid)

    
    return {
        
        id: newEmployee.employeeid,
        username: newEmployee.employeeid,
        fullName: newEmployee.fullname,
        email: email,
        roleName: roleName,
        status: userAccount.accountstatus,
        branchName: branchName
        
    };
  }


  // Cập nhật tài khoản
  async updateUserAccount(id, updates) {
    const existingAccount = await userAccountRepository.findById(id);
    if (!existingAccount) throw new Error("User account not found.");

    let updatedFields = {
      username: updates.username,
      email: updates.email,
      roleid: updates.roleID,
    };

    // Nếu có mật khẩu mới, mã hóa lại
    if (updates.password) {
      const hashedPassword = await hashPassword(updates.password);
      updatedFields.password = hashedPassword;
    }

    const updatedAccount = await userAccountRepository.update(id, updatedFields);

    return {
      message: "User account updated successfully.",
      account: updatedAccount,
    };
  }

  // Xóa tài khoản
  async deleteUserAccount(id) {
    const existingAccount = await userAccountRepository.findById(id);
    if (!existingAccount) throw new Error("User account not found.");

    await userAccountRepository.delete(id);
    return { message: "User account deleted successfully." };
  }

  // Kiểm tra đăng nhập
  async login({ email, password }) {
    if (!email || !password) throw new Error("Email and password are required.");

    const user = await userAccountRepository.findByEmail(email);
    if (!user) throw new Error("Invalid email or password.");

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error("Invalid email or password.");

    // (Tùy chọn) Có thể tạo JWT token tại đây
    return {
      message: "Login successful.",
      user: {
        id: user.userid,
        username: user.username,
        email: user.email,
        roleid: user.roleid,
      },
    };
  }
}

export const userAccountService = new UserAccountService();
