import { USE_MOCK } from "@/config/app.config";
import { userApi } from "@/api/userApi";
import { mockUserAdapter } from "@/mocks/adapters/userAdapter";

// Switch between mock and real API at service layer
const userAdapter = USE_MOCK ? mockUserAdapter : userApi;

export const userService = {
  /**
   * Get all users
   */
  async getAllUsers() {
    const response = await userAdapter.getAllUsers();
    const list = response?.data?.data || response?.data || response;
    return Array.isArray(list)
      ? list
      : Array.isArray(list?.data)
      ? list.data
      : [];
  },

  /**
   * Get user by ID
   */
  async getUserById(id) {
    if (!id) {
      throw new Error("User ID is required");
    }
    const response = await userAdapter.getUserById(id);
    return response?.data?.data || response?.data || response;
  },

  /**
   * Create new user
   */
  async createUser(userData) {
    // Validation
    if (!userData.fullName?.trim()) {
      throw new Error("Full name is required");
    }
    if (!userData.email?.trim()) {
      throw new Error("Email is required");
    }
    if (!userData.role && !userData.roleName) {
      throw new Error("Role is required");
    }
    if (!userData.branchName?.trim()) {
      throw new Error("Branch is required");
    }

    const response = await userAdapter.createUser(userData);
    return response?.data?.data || response?.data || response;
  },

  /**
   * Update user
   */
  async updateUser(id, updates) {
    if (!id?.trim()) {
      throw new Error("User ID is required");
    }
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("No update data provided");
    }

    const response = await userAdapter.updateUser(id, updates);
    return response?.data?.data || response?.data || response;
  },

  /**
   * Update user status (enable/disable)
   */
  async updateUserStatus(id, status) {
    if (!id?.trim()) {
      throw new Error("User ID is required");
    }
    if (!status || !["active", "disabled"].includes(status)) {
      throw new Error("Valid status is required (active or disabled)");
    }

    const response = await userAdapter.updateUserStatus(id, status);
    return response?.data?.data || response?.data || response;
  },

  /**
   * Delete user
   */
  async deleteUser(id) {
    if (!id?.trim()) {
      throw new Error("User ID is required");
    }

    const response = await userAdapter.deleteUser(id);
    return response;
  },
};

// Legacy exports for backward compatibility (if needed)
export const getAllUsers = () => userService.getAllUsers();
export const getUserById = (id) => userService.getUserById(id);
export const createUser = (userData) => userService.createUser(userData);
export const updateUser = (id, updates) => userService.updateUser(id, updates);
export const updateUserStatus = (id, status) =>
  userService.updateUserStatus(id, status);
export const toggleUserStatus = (id) => {
  // Legacy support: toggle between active/disabled
  // Note: Callers should migrate to updateUserStatus with explicit status
  return userService.updateUserStatus(id, "active"); // Default behavior, should be updated by caller
};
export const deleteUser = (id) => userService.deleteUser(id);
