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
export const getMonthlyReport = async (month, year) => {
  return reportAdapter.getMonthlyReport(month, year);
};

/**
 * Lấy báo cáo mở/đóng sổ tiết kiệm theo tháng (BM5.2)
 * @param {number} month - Tháng (1-12)
 * @param {number} year - Năm
 * @param {string} savingsType - Loại tiết kiệm ('all', 'no-term', '3-months', '6-months', '12-months')
 * @returns {Promise<Object>} Monthly open/close report data
 */
export const getMonthlyOpenCloseReport = async (month, year, savingsType = 'all') => {
  return reportAdapter.getMonthlyOpenCloseReport(month, year, savingsType);
};
