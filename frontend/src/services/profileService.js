import { USE_MOCK } from '@/config/app.config';
import { profileApi } from '@/api/profileApi';
import { mockProfileAdapter } from '@/mocks/adapters/profileAdapter';

const profileAdapter = USE_MOCK ? mockProfileAdapter : profileApi;

/**
 * Get current user profile
 * @returns {Promise<Object>} Profile data including personal information
 */
export const getProfile = async () => {
  return profileAdapter.getProfile();
};

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
export const updateProfile = async (payload) => {
  return profileAdapter.updateProfile(payload);
};

/**
 * Change password for current user
 * @param {Object} payload - Password change data
 * @param {string} payload.oldPassword - Current password
 * @param {string} payload.newPassword - New password
 * @returns {Promise<Object>} Success response
 */
export const changePassword = async (payload) => {
  return profileAdapter.changePassword(payload);
};
