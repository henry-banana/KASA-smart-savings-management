import { USE_MOCK } from '@/config/app.config';
import { userApi } from '@/api/userApi';
import { mockUserAdapter } from '@/mocks/adapters/userAdapter';

// Switch between mock and real API at service layer
const userAdapter = USE_MOCK ? mockUserAdapter : userApi;

export const userService = {
  /**
   * Get all users
   */
  async getAllUsers() {
    const response = await userAdapter.getAllUsers();
    return response;
  },

  /**
   * Get user by ID
   */
  async getUserById(id) {
    if (!id) {
      throw new Error('User ID is required');
    }
    const response = await userAdapter.getUserById(id);
    return response;
  },

  /**
   * Create new user
   */
  async createUser(userData) {
    // Validation
    if (!userData.username?.trim()) {
      throw new Error('Username is required');
    }
    if (!userData.password?.trim()) {
      throw new Error('Password is required');
    }
    if (!userData.fullName?.trim()) {
      throw new Error('Full name is required');
    }
    if (!userData.role) {
      throw new Error('Role is required');
    }

    const response = await userAdapter.createUser(userData);
    return response;
  },

  /**
   * Update user
   */
  async updateUser(username, updates) {
    if (!username?.trim()) {
      throw new Error('Username is required');
    }
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('No update data provided');
    }

    const response = await userAdapter.updateUser(username, updates);
    return response;
  },

  /**
   * Toggle user status (enable/disable)
   */
  async toggleUserStatus(username) {
    if (!username?.trim()) {
      throw new Error('Username is required');
    }

    const response = await userAdapter.toggleUserStatus(username);
    return response;
  },

  /**
   * Delete user
   */
  async deleteUser(username) {
    if (!username?.trim()) {
      throw new Error('Username is required');
    }

    const response = await userAdapter.deleteUser(username);
    return response;
  }
};

// Legacy exports for backward compatibility (if needed)
export const getAllUsers = () => userService.getAllUsers();
export const getUserById = (id) => userService.getUserById(id);
export const createUser = (userData) => userService.createUser(userData);
export const updateUser = (username, updates) => userService.updateUser(username, updates);
export const toggleUserStatus = (username) => userService.toggleUserStatus(username);
export const deleteUser = (username) => userService.deleteUser(username);
