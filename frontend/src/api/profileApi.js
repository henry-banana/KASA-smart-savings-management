// Profile API for current user
import { apiClient } from './apiClient';

/**
 * Profile API
 * Manages the current user's profile information
 */
export const profileApi = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} Current user profile data
   */
  async getProfile() {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  },

  /**
   * Update current user profile
   * @param {Object} payload - Profile updates
   * @param {string} payload.fullName - Full name
   * @param {string} payload.phone - Phone number
   * @param {string} payload.address - Address
   * @param {string} payload.dateOfBirth - Date of birth (YYYY-MM-DD)
   * @param {string} payload.avatarUrl - Avatar URL
   * @returns {Promise<Object>} Updated profile data
   */
  async updateProfile(payload) {
    const response = await apiClient.put('/api/users/me', payload);
    return response.data;
  },

  /**
   * Change password for current user
   * @param {Object} payload - Password change data
   * @param {string} payload.oldPassword - Current password
   * @param {string} payload.newPassword - New password
   * @returns {Promise<Object>} Success response
   */
  async changePassword(payload) {
    const response = await apiClient.post('/api/auth/change-password', payload);
    return response.data;
  }
};
