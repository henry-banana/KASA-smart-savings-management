import { apiClient } from './apiClient';

export const reportApi = {
  /**
   * Daily report per OpenAPI: GET /api/report/daily?date=YYYY-MM-DD
   */
  async getDailyReport(date) {
    const reportDate = date || new Date().toISOString().split('T')[0];
    const response = await apiClient.get(`/api/report/daily?date=${reportDate}`);
    return response.data;
  },

  /**
   * Monthly report per OpenAPI: GET /api/report/monthly?typeSavingId=TS01&month=MM&year=YYYY
   * typeSavingId is optional.
   */
  async getMonthlyReport(month, year, typeSavingId) {
    const reportMonth = month || new Date().getMonth() + 1;
    const reportYear = year || new Date().getFullYear();
    const params = new URLSearchParams({ month: String(reportMonth), year: String(reportYear) });
    if (typeSavingId) params.append('typeSavingId', typeSavingId);
    const response = await apiClient.get(`/api/report/monthly?${params.toString()}`);
    return response.data;
  }
};
