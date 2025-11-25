import { findUserByCredentials, findUserByUsername, updateUserPassword } from '../data/users';
import { setCurrentUser } from '../data/profile';
import { randomDelay } from '../utils';
import { logger } from '@/utils/logger';

export const mockAuthAdapter = {
  async login(credentials) {
    await randomDelay();
    logger.info('🎭 Mock Login', { username: credentials.username });
    
    const { username, password } = credentials;
    const user = findUserByCredentials(username, password);
    
    if (!user) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }
    
    if (user.status !== 'active') {
      throw new Error('Tài khoản đã bị vô hiệu hoá');
    }

    // Ensure profile is synced with mockUserAccounts
    // Sync the profile data when user logs in
    setCurrentUser(user);

    return {
      userId: user.userid,
      username: user.userid, // username: user.username,
      roleName: user.role,
      fullName: user.fullName,
      status: user.status,
      token: `mock_token_${user.userid}_${Date.now()}`
    };
  },

  async logout() {
    await randomDelay();
    return { success: true };
  },

  /**
   * Mock: Request password reset
   */
  async requestPasswordReset(emailOrUsername) {
    await randomDelay();
    logger.info('🎭 Mock Request Password Reset', { emailOrUsername });
    
    // Simulate checking if user exists by username or email
    const user = findUserByUsername(emailOrUsername);
    if (!user) {
      throw new Error('Không tìm thấy tài khoản với email/username này');
    }

    return {
      success: true,
      message: 'OTP đã được gửi đến email của bạn',
      email: user.email || `${emailOrUsername}@example.com`
    };
  },

  /**
   * Mock: Verify OTP (accepts 123456 as valid)
   */
  async verifyOtp({ email, otp }) {
    await randomDelay();
    logger.info('🎭 Mock Verify OTP', { email, otp });
    
    if (otp !== '123456') {
      throw new Error('Mã OTP không chính xác');
    }

    return {
      success: true,
      message: 'OTP xác thực thành công',
      resetToken: `mock_reset_token_${Date.now()}`
    };
  },

  /**
   * Mock: Reset password
   */
  async resetPassword({ email, otp, newPassword }) {
    await randomDelay();
    logger.info('🎭 Mock Reset Password', { email, otp });
    
    if (!newPassword || newPassword.length < 8) {
      throw new Error('Mật khẩu phải có ít nhất 8 ký tự');
    }

    // Find user by email and update password
    const user = findUserByUsername(email.split('@')[0]); // Extract username from email
    if (user) {
      updateUserPassword(user.userid, newPassword);
      logger.info('🎭 Password updated for user:', user.userid);
    }

    return {
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công'
    };
  }
};
