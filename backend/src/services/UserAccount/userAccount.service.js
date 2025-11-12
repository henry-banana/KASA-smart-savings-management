import { userAccountRepository } from "../../repositories/UserAccount/UserAccountRepository.js";
import { hashPassword, comparePassword } from "../../middleware/hashing.middleware.js";

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
  async createUserAccount({ username, email, password, roleID }) {
    if (!username || !email || !password || !roleID)
      throw new Error("Missing required information.");

    // Kiểm tra trùng username hoặc email
    const existingUser = await userAccountRepository.findByUsernameOrEmail(username, email);
    if (existingUser) throw new Error("Username or email already exists.");

    // Mã hóa mật khẩu
    const hashedPassword = await hashPassword(password);

    const newAccount = await userAccountRepository.create({
      username,
      email,
      password: hashedPassword,
      roleid: roleID,
      createdat: new Date(),
    });

    return {
      message: "User account created successfully.",
      account: newAccount,
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
