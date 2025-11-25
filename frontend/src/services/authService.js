import { USE_MOCK } from '@/config/app.config';
import { authApi } from '@/api/authApi';
import { mockAuthAdapter } from '@/mocks/adapters/authAdapter';

const authAdapter = USE_MOCK ? mockAuthAdapter : authApi;

export const authService = {
  async login(credentials) {
    if (!credentials.username?.trim()) {
      throw new Error('Vui lòng nhập tên đăng nhập');
    }
    if (!credentials.password?.trim()) {
      throw new Error('Vui lòng nhập mật khẩu');
    }

    const response = await authAdapter.login(credentials);
    
    // Extract user data from response with priority:
    // 1. response.data.data (backend format)
    // 2. response.data (axios format)
    // 3. response (mock fallback)
    const userData = response?.data?.data || response?.data || response;
    
    // Save token to localStorage if present
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    
    return this.transformUser(userData);
  },

  async logout() {
    await authAdapter.logout();
  },

  transformUser(userData) {
    const roleMap = {
      'Teller': 'teller',
      'Auditor': 'accountant',
      'Administrator': 'admin'
    };

    return {
      id: userData.userId || userData.id,
      username: userData.username,
      fullName: userData.fullName,
      role: roleMap[userData.roleName] || userData.roleName?.toLowerCase(),
      status: userData.status || 'active',
    };
  }
};

// Legacy exports for backward compatibility
export const loginUser = async (username, password) => {
  return authService.login({ username, password });
};

export const logoutUser = async () => {
  return authService.logout();
};

