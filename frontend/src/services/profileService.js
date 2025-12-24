import { USE_MOCK } from "@/config/app.config";
import { profileApi } from "@/api/profileApi";
import { mockProfileAdapter } from "@/mocks/adapters/profileAdapter";

const profileAdapter = USE_MOCK ? mockProfileAdapter : profileApi;

/**
 * Get current user profile
 * @returns {Promise<Object>} Profile data with fields: id, fullName, email, roleName, branchName
 */
export const getProfile = async () => {
  return profileAdapter.getProfile();
};

/**
 * Update current user profile
 * @param {Object} payload - Profile updates
 * @param {string} payload.fullName - Full name (only editable field)
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
