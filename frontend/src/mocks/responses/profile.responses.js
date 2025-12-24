/**
 * Profile Response Builders
 * Build consistent API responses for profile endpoints
 */

import { getCurrentProfile } from "../data/profile.js";

/**
 * Build response for GET /api/users/me
 * @param {Object} profile - Profile data
 * @returns {Object} API response
 */
export const buildGetProfileResponse = (profile = getCurrentProfile()) => {
  // Map to canonical OpenAPI shape (5 core fields only), never expose password
  const canonicalProfile = {
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    roleName: profile.roleName,
    branchName: profile.branchName,
  };

  return {
    message: "Get profile successfully",
    success: true,
    data: canonicalProfile,
  };
};

/**
 * Build response for PUT /api/users/me
 * @param {Object} profile - Updated profile data
 * @returns {Object} API response
 */
export const buildUpdateProfileResponse = (profile) => {
  // Map to canonical OpenAPI shape (5 core fields only), never expose password
  const canonicalProfile = {
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    roleName: profile.roleName,
    branchName: profile.branchName,
  };

  return {
    message: "Update profile successfully",
    success: true,
    data: canonicalProfile,
  };
};

/**
 * Build response for POST /api/auth/change-password (success)
 * @param {string} userId - User ID (optional)
 * @returns {Object} API response
 */
export const buildChangePasswordSuccessResponse = (userId) => ({
  message: "Password changed successfully",
  success: true,
  data: userId ? { userId } : {},
});

/**
 * Build error response for profile operations
 * @param {string} message - Error message
 * @returns {Object} Error response
 */
export const buildProfileErrorResponse = (message) => ({
  message,
  success: false,
});

// Default export with all builders
const profileResponses = {
  buildGetProfileResponse,
  buildUpdateProfileResponse,
  buildChangePasswordSuccessResponse,
  buildProfileErrorResponse,
};

export default profileResponses;
