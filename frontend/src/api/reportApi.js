import { apiClient } from './apiClient';

export const reportApi = {
  async getDailyReport(date) {
    const reportDate = date || new Date().toISOString().split('T')[0];
    const response = await apiClient.get(`/api/report/daily?date=${reportDate}`);
    return response.data;
  },


  /**
   * BM5.2 - Get monthly opening/closing savings books report
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @param {string} savingsType - Savings type filter ('all', 'no-term', '3-months', etc.)
   * @returns {Promise<Object>} Monthly open/close report data
   */
  async getMonthlyOpenCloseReport(month, year, savingsType = 'all') {
    const reportMonth = month || new Date().getMonth() + 1;
    const reportYear = year || new Date().getFullYear();
    const response = await apiClient.get(
      `/api/report/monthly-open-close?month=${reportMonth}&year=${reportYear}&savingsType=${savingsType}`
    );
    return response.data;
  }
};
