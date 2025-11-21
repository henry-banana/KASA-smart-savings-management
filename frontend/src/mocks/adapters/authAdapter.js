import { findUserByCredentials } from '../data/users';
import { randomDelay } from '../utils';
import { logger } from '@/utils/logger';

export const mockAuthAdapter = {
  async login(credentials) {
    await randomDelay();
    logger.info('🎭 Mock Login', { username: credentials.username });
    
    const { username, password } = credentials;
    const user = findUserByCredentials(username, password);
    console.log(user.userid, user.userid, user.role, user.fullName);
    if (!user) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }
    
    return {
      userId: user.userid,
      username: user.userid, // username: user.username,
      roleName: user.role,
      fullName: user.fullName,
      token: `mock_token_${user.userid}_${Date.now()}`
    };
  },

  async logout() {
    await randomDelay();
    return { success: true };
  }
};
