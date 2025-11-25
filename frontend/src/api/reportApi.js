import { apiClient } from './apiClient';

export const reportApi = {
  async getDailyReport(date) {
    const reportDate = date || new Date().toISOString().split('T')[0];
    const response = await apiClient.get(`/api/report/daily?date=${reportDate}`);
    return response.data;
  },

  async getMonthlyReport(month, year) {
    const reportMonth = month || new Date().getMonth() + 1;
    const reportYear = year || new Date().getFullYear();
    const response = await apiClient.get(`/api/report/monthly?month=${reportMonth}&year=${reportYear}`);
    return response.data;
  }
};
