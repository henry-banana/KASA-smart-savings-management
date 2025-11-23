import { userAccountService } from "../../services/UserAccount/userAccount.service.js";

// Lấy danh sách tất cả tài khoản người dùng
export async function getAllUserAccounts(req, res) {
  try {
    const result = await userAccountService.getAllUserAccounts();

    return res.status(200).json({
      message: "User accounts retrieved successfully",
      success: true,
      data: result, // danh sách user accounts
      total: result.length,
    });

  } catch (err) {
    console.error("❌ Error getting user accounts:", err);

    return res.status(err.status || 500).json({
      message: "Failed to retrieve user accounts",
      success: false,
    });
  }
}


// Lấy thông tin tài khoản theo ID
export async function getUserAccountById(req, res) {
  try {
    const { id } = req.params;
    const result = await userAccountService.getUserAccountById(id);
    if (!result) {
      return res.status(404).json({ message: "User account not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error getting user account by ID:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

// Tạo tài khoản người dùng mới
export async function createUserAccount(req, res) {
  try {
    const result = await userAccountService.createUserAccount(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error creating user account:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

// Cập nhật tài khoản người dùng
export async function updateUserAccount(req, res) {
  try {
    const { id } = req.params;
    const result = await userAccountService.updateUserAccount(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating user account:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

// Xóa tài khoản người dùng
export async function deleteUserAccount(req, res) {
  try {
    const { id } = req.params;
    const result = await userAccountService.deleteUserAccount(id);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error deleting user account:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}
