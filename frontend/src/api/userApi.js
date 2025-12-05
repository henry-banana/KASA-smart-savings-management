import { apiClient } from './apiClient';

/**
 * User API - Real API calls only
 * Không chứa mock logic (mock được handle ở service layer)
 */
export const userApi = {
  /**
   * Get all users
   */
  async getAllUsers() {
    const response = await apiClient.get('/api/users');
    return response.data;
  },

  /**
   * Get user by ID
   */
  async getUserById(id) {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },

  /**
   * Create new user
   */
  async createUser(userData) {
    const response = await apiClient.post('/api/users', userData);
    return response.data;
  },

  /**
   * Update user
   */
  async updateUser(id, updates) {
    const response = await apiClient.put(`/api/users/${id}`, updates);
    return response.data;
  },

  /**
   * Update user status (approve/reject)
   */
  async updateUserStatus(id, status) {
    const response = await apiClient.patch(`/api/users/${id}/status`, { status });
    return response.data;
  },

  /**
   * Delete user
   */
  async deleteUser(id) {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  }
};
