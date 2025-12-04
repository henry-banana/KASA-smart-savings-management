import { apiClient } from "./apiClient";

export const authApi = {
  async login(credentials) {
    const response = await apiClient.post("/api/auth/login", credentials);
    return response.data;
  },

  async logout() {
    const response = await apiClient.post("/api/logout");
    return response.data;
  },

  /**
   * Request password reset - sends OTP to email/username
   * @param {string} emailOrUsername
   * @returns {Promise<Object>}
   */
  async requestPasswordReset(emailOrUsername) {
    const response = await apiClient.post("/api/auth/forgot-password", {
      emailOrUsername,
    });
    return response.data;
  },

  /**
   * Verify OTP code
   * @param {Object} data - { email, otp }
   * @returns {Promise<Object>}
   */
  async verifyOtp(data) {
    const response = await apiClient.post("/api/auth/verify-otp", data);
    return response.data;
  },

  /**
   * Reset password with OTP
   * @param {Object} data - { email, otp, newPassword }
   * @returns {Promise<Object>}
   */
  async resetPassword(data) {
    const response = await apiClient.post("/api/auth/reset-password", data);
    return response.data;
  },
};
