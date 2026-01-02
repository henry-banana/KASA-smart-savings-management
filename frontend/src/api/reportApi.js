import { apiClient } from "./apiClient";

export const reportApi = {
  /**
   * Daily report per OpenAPI: GET /api/report/daily?date=YYYY-MM-DD
   */
  async getDailyReport(date) {
    const reportDate = date || new Date().toISOString().split("T")[0];
    const response = await apiClient.get(
      `/api/report/daily?date=${reportDate}`
    );
    return response.data;
  },

  /**
   * Daily transaction statistics per OpenAPI: GET /api/report/daily/transactions?date=YYYY-MM-DD
   * Mục đích: Lấy số lượng giao dịch gửi tiền và rút tiền theo từng loại sổ tiết kiệm trong ngày
   */
  async getDailyTransactionStatistics(date) {
    const reportDate = date || new Date().toISOString().split("T")[0];
    const response = await apiClient.get(
      `/api/report/daily/transactions?date=${reportDate}`
    );
    return response.data;
  },

  /**
   * Monthly report per OpenAPI: GET /api/report/monthly?typeSavingId=TS01&month=MM&year=YYYY
   * typeSavingId is optional.
   */
  async getMonthlyReport(month, year, typeSavingId) {
    const reportMonth = month || new Date().getMonth() + 1;
    const reportYear = year || new Date().getFullYear();
    const params = new URLSearchParams({
      month: String(reportMonth),
      year: String(reportYear),
    });
    params.append("typeSavingId", typeSavingId || "all");
    const response = await apiClient.get(
      `/api/report/monthly?${params.toString()}`
    );
    return response.data;
  },
};
