import { apiClient } from "./apiClient";

export const dashboardApi = {
  async getDashboardStats() {
    const response = await apiClient.get("/api/dashboard/stats");
    return response.data;
  },

  async getRecentTransactions() {
    const response = await apiClient.get("/api/dashboard/recent-transactions");
    return response.data;
  },
};
