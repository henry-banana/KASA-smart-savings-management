/**
 * Profile Response Builders
 * Build consistent API responses for profile endpoints
 */

import { getCurrentProfile } from '../data/profile.js';

/**
 * Build response for GET /api/users/me
 * @param {Object} profile - Profile data
 * @returns {Object} API response
 */
export const buildGetProfileResponse = (profile = getCurrentProfile()) => ({
  message: "Get current user successfully",
  success: true,
  data: profile
});

/**
 * Build response for PUT /api/users/me
 * @param {Object} profile - Updated profile data
 * @returns {Object} API response
 */
export const buildUpdateProfileResponse = (profile) => ({
  message: "Update profile successfully",
  success: true,
  data: profile
});

/**
 * Build response for POST /api/auth/change-password (success)
 * @returns {Object} API response
 */
export const buildChangePasswordSuccessResponse = () => ({
  message: "Change password successfully",
  success: true
});

/**
 * Build error response for profile operations
 * @param {string} message - Error message
 * @returns {Object} Error response
 */
export const buildProfileErrorResponse = (message) => ({
  message,
  success: false
});

// Default export with all builders
const profileResponses = {
  buildGetProfileResponse,
  buildUpdateProfileResponse,
  buildChangePasswordSuccessResponse,
  buildProfileErrorResponse
};

export default profileResponses;
