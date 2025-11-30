import { USE_MOCK } from "@/config/app.config";
import { authApi } from "@/api/authApi";
import { mockAuthAdapter } from "@/mocks/adapters/authAdapter";

const authAdapter = USE_MOCK ? mockAuthAdapter : authApi;

export const authService = {
  async login(credentials) {
    if (!credentials.username?.trim()) {
      throw new Error("Please enter username");
    }
    if (!credentials.password?.trim()) {
      throw new Error("Please enter password");
    }

    const response = await authAdapter.login(credentials);

    // Extract user data from response with priority:
    // 1. response.data.data (backend format)
    // 2. response.data (axios format)
    // 3. response (mock fallback)
    const userData = response?.data?.data || response?.data || response;

    // Save token to localStorage if present
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }

    return this.transformUser(userData);
  },

  async logout() {
    await authAdapter.logout();
  },

  transformUser(userData) {
    const roleMap = {
      Teller: "teller",
      Auditor: "accountant",
      Administrator: "admin",
    };

    return {
      id: userData.userId || userData.id,
      username: userData.username,
      fullName: userData.fullName,
      role: roleMap[userData.roleName] || userData.roleName?.toLowerCase(),
      status: userData.status || "active",
    };
  },

  /**
   * Request password reset - Step 1
   * @param {string} emailOrUsername
   * @returns {Promise<Object>}
   */
  async requestPasswordReset(emailOrUsername) {
    if (!emailOrUsername?.trim()) {
      throw new Error("Please enter email or username");
    }

    const response = await authAdapter.requestPasswordReset(emailOrUsername);
    return response;
  },

  /**
   * Verify OTP code - Step 2
   * @param {Object} data - { email, otp }
   * @returns {Promise<Object>}
   */
  async verifyOtp(data) {
    if (!data.email?.trim()) {
      throw new Error("Invalid email");
    }
    if (!data.otp?.trim()) {
      throw new Error("Please enter OTP code");
    }

    const response = await authAdapter.verifyOtp(data);
    return response;
  },

  /**
   * Reset password with verified OTP - Step 3
   * @param {Object} data - { email, otp, newPassword }
   * @returns {Promise<Object>}
   */
  async resetPassword(data) {
    if (!data.email?.trim()) {
      throw new Error("Invalid email");
    }
    if (!data.otp?.trim()) {
      throw new Error("Invalid OTP code");
    }
    if (!data.newPassword?.trim()) {
      throw new Error("Please enter new password");
    }
    if (data.newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    const response = await authAdapter.resetPassword(data);
    return response;
  },
};

// Legacy exports for backward compatibility
export const loginUser = async (username, password) => {
  return authService.login({ username, password });
};

export const logoutUser = async () => {
  return authService.logout();
};
