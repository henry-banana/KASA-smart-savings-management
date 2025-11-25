// TODO: replace with real backend API for QĐ6 – Regulations
import { apiClient } from './apiClient';

/**
 * Regulation API
 * Manages system-wide regulations (QĐ6)
 */
export const regulationApi = {
  /**
   * Get current regulations
   * @returns {Promise<Object>} Current regulations data
   */
  async getRegulations() {
    const response = await apiClient.get('/api/regulations');
    return response.data;
  },

  /**
   * Update regulations
   * @param {Object} payload - Regulation updates
   * @param {number} payload.minimumDepositAmount - Minimum deposit amount in VND
   * @param {number} payload.minimumTermDays - Minimum term days before withdrawal
   * @returns {Promise<Object>} Updated regulations data
   */
  async updateRegulations(payload) {
    const response = await apiClient.put('/api/regulations', payload);
    return response.data;
  }
};
