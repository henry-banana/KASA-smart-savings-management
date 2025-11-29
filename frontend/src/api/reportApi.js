import { apiClient } from './apiClient';

export const reportApi = {
  async getDailyReport(date) {
    const reportDate = date || new Date().toISOString().split('T')[0];
    const response = await apiClient.get(`/api/report/daily?date=${reportDate}`);
    return response.data;
  },

  /**
   * BM5.2 - Get monthly opening/closing savings books report
   * Uses GET /api/report/monthly with query params.
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @param {string} typeSavingId - Optional type saving ID (e.g., TS01)
   * @returns {Promise<Object>} Monthly report data
   */
  async getMonthlyOpenCloseReport(month, year, typeSavingId) {
    const reportMonth = month || new Date().getMonth() + 1;
    const reportYear = year || new Date().getFullYear();
    const params = new URLSearchParams({ month: String(reportMonth), year: String(reportYear) });
    if (typeSavingId) params.append('typeSavingId', typeSavingId);
    const response = await apiClient.get(`/api/report/monthly?${params.toString()}`);
    return response.data;
  }
};
