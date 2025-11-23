import { userAccountService } from "../../services/UserAccount/userAccount.service.js";

// Lấy danh sách tất cả tài khoản người dùng
export async function getAllUserAccounts(req, res) {
  try {
    const result = await userAccountService.getAllUserAccounts();

    return res.status(200).json({
      message: "User accounts retrieved successfully",
      success: true,
      total: result.length,
      data: result,
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
      return res.status(404).json({
        message: "User account not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User account retrieved successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error getting user account by ID:", err);

    return res.status(err.status || 500).json({
      message: "Failed to retrieve user account",
      success: false,
    });
  }
}

// Tạo tài khoản người dùng mới
export async function createUserAccount(req, res) {
  try {
    const result = await userAccountService.createUserAccount(req.body);

    return res.status(201).json({
      message: "User account created successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error creating user account:", err);

    return res.status(err.status || 500).json({
      message: "Failed to create user account",
      success: false,
    });
  }
}

// Cập nhật tài khoản người dùng
export async function updateUserAccount(req, res) {
  try {
    const { id } = req.params;
    const result = await userAccountService.updateUserAccount(id, req.body);

    if (!result) {
      return res.status(404).json({
        message: "User account not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User account updated successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error updating user account:", err);

    return res.status(err.status || 500).json({
      message: "Failed to update user account",
      success: false,
    });
  }
}

// Xóa tài khoản người dùng
export async function deleteUserAccount(req, res) {
  try {
    const { id } = req.params;
    const result = await userAccountService.deleteUserAccount(id);

    if (!result) {
      return res.status(404).json({
        message: "User account not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User account deleted successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error deleting user account:", err);

    return res.status(err.status || 500).json({
      message: "Failed to delete user account",
      success: false,
    });
  }
}
