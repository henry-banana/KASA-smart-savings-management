import { findUserByCredentials } from '../data/users';
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
  }
};
