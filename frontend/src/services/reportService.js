import { USE_MOCK } from '@/config/app.config';
import { reportApi } from '@/api/reportApi';
import { mockReportAdapter } from '@/mocks/adapters/reportAdapter';

const reportAdapter = USE_MOCK ? mockReportAdapter : reportApi;

/**
 * Lấy báo cáo ngày (BM5)
 * @param {string} date - Ngày báo cáo (YYYY-MM-DD)
 * @returns {Promise<Object>} Daily report data
 */
export const getDailyReport = async (date) => {
  return reportAdapter.getDailyReport(date);
};

/**
 * Lấy báo cáo tháng (BM6)
 * @param {number} month - Tháng (1-12)
 * @param {number} year - Năm
 * @returns {Promise<Object>} Monthly report data
 */
// NOTE: `getMonthlyReport` removed — use `getMonthlyOpenCloseReport` or other specific report methods

/**
 * Lấy báo cáo tháng (BM6) theo hợp đồng OpenAPI
 * Endpoint: GET /api/report/monthly?typeSavingId=TS01&month=MM&year=YYYY
 * @param {number} month - Tháng (1-12)
 * @param {number} year - Năm
 * @param {string} savingsType - Có thể là 'all' hoặc mã loại (VD: TS01)
 * @returns {Promise<Object>} Monthly report data
 */
export const getMonthlyReport = async (month, year, savingsType = 'all') => {
  const normalized = (savingsType || '').toString().trim();
  const isTypeId = /^TS\d+/i.test(normalized);
  const typeSavingId = isTypeId ? normalized : undefined;
  return reportAdapter.getMonthlyReport(month, year, typeSavingId);
};
