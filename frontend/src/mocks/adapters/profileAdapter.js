import { 
  getCurrentProfile,
  updateCurrentProfile
} from '../data/profile.js';
import { 
  buildGetProfileResponse,
  buildUpdateProfileResponse,
  buildChangePasswordSuccessResponse,
  buildProfileErrorResponse
} from '../responses/profile.responses.js';
import { randomDelay } from '../utils.js';
import { logger } from '@/utils/logger';

// Mock password storage (in real app this would be in a secure backend)
const mockPasswords = {
  'teller1': '123456',
  'teller2': '123456',
  'accountant1': '123456',
  'admin1': 'admin123'
};

/**
 * Mock adapter for Profile endpoints
 * Intercepts /api/users/me and /api/auth/change-password requests
 */
export const mockProfileAdapter = {
  /**
   * GET /api/users/me - Get current user profile
   */
  async getProfile() {
    await randomDelay();
    logger.info('🎭 Mock Get Profile');
    
    const profile = getCurrentProfile();
    return buildGetProfileResponse(profile);
  },

  /**
   * PUT /api/users/me - Update current user profile
   */
  async updateProfile(payload) {
    await randomDelay();
    logger.info('🎭 Mock Update Profile', { payload });
    
    // Validation
    if (payload.phone && !/^[0-9+\s()-]+$/.test(payload.phone)) {
      logger.error('Invalid phone format');
      return buildProfileErrorResponse('Phone number format is invalid');
    }
    
    if (payload.dateOfBirth) {
      const date = new Date(payload.dateOfBirth);
      if (isNaN(date.getTime())) {
        logger.error('Invalid date format');
        return buildProfileErrorResponse('Date of birth format is invalid');
      }
    }
    
    const updatedProfile = updateCurrentProfile(payload);
    return buildUpdateProfileResponse(updatedProfile);
  },

  /**
   * POST /api/auth/change-password - Change password
   */
  async changePassword(payload) {
    await randomDelay();
    logger.info('🎭 Mock Change Password');
    
    const { oldPassword, newPassword } = payload;
    
    // Validation
    if (!oldPassword || !newPassword) {
      logger.error('Missing password fields');
      return buildProfileErrorResponse('Old password and new password are required');
    }
    
    if (newPassword.length < 6) {
      logger.error('Password too short');
      return buildProfileErrorResponse('New password must be at least 6 characters');
    }
    
    // Get current user
    const currentProfile = getCurrentProfile();
    const currentUsername = currentProfile.username;
    
    // Check if old password matches
    if (mockPasswords[currentUsername] !== oldPassword) {
      logger.error('Old password incorrect');
      return buildProfileErrorResponse('Old password is incorrect');
    }
    
    // Update password in mock storage
    mockPasswords[currentUsername] = newPassword;
    logger.info('Password changed successfully');
    
    return buildChangePasswordSuccessResponse();
  }
};
