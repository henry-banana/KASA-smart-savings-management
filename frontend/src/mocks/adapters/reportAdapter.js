import { reportMockData } from '../reportMockData';
import { randomDelay } from '../utils';
import { logger } from '@/utils/logger';

export const mockReportAdapter = {
  async getDailyReport(date) {
    await randomDelay();
    const reportDate = date || new Date().toISOString().split('T')[0];
    logger.info('🎭 Mock Daily Report', { date: reportDate });
    
    return {
      success: true,
      data: {
        ...reportMockData.daily.data,
        date: reportDate
      }
    };
  },

  async getMonthlyReport(month, year) {
    await randomDelay();
    const reportMonth = month || new Date().getMonth() + 1;
    const reportYear = year || new Date().getFullYear();
    logger.info('🎭 Mock Monthly Report', { month: reportMonth, year: reportYear });
    
    return {
      success: true,
      data: {
        ...reportMockData.monthly.data,
        month: reportMonth,
        year: reportYear
      }
    };
  }
};
