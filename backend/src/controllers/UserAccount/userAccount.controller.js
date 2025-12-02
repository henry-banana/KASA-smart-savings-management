import { employeeRepository } from "../../repositories/Employee/EmployeeRepository.js";
import { userAccountService } from "../../services/UserAccount/userAccount.service.js";
import { Branch } from "../../models/Branch.js";
import { Role } from "../../models/Role.js";
import { userAccountRepository } from "../../repositories/UserAccount/UserAccountRepository.js";

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
      message: "Create user successfully",
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

    let updates = {};
    if (req.body.branchName){
      const branch = await Branch.getByName(req.body.branchName);
      if (!branch) throw new Error("Branch not found.");

      updates.branchid = branch.branchid;
    }

    if (req.body.roleName){
      const role = await Role.getByName(req.body.roleName);
      if (!role) throw new Error("Role not found.");

      updates.roleid = role.roleid;
    }

    if (req.body.fullName){
      updates.fullname = req.body.fullName;
    }

    if (req.body.email){
      updates.email = req.body.email;
    }

    let result;

    if (updates !== undefined){
        result = await employeeRepository.update(id, updates);
    }

    if (!result) {
      return res.status(404).json({
        message: "User account not found or update failed",
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


export async function updateStatusAccount(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;


    if (!status) {
      return res.status(400).json({
        message: "Missing required field: status",
        success: false
      });
    }

    // Gọi service cập nhật trạng thái
    const result = await userAccountRepository.update(id, { accountstatus: status })

    if (!result) {
      return res.status(404).json({
        message: "User account not found or update failed",
        success: false
      });
    }

    return res.status(200).json({
      message: "User account status updated successfully",
      success: true,
      total: 1,
      data: result
    });

  } catch (err) {
    console.error("❌ Error updating user account status:", err);

    return res.status(err.status || 500).json({
      message: "Failed to update user account status",
      success: false
    });
  }
}
