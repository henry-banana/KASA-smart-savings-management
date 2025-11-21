import { buildDailyReportResponse } from '../responses/dailyReport.responses';
import { buildMonthlyReportResponse } from '../responses/monthlyReport.responses';
import { mockTransactions } from '../data/transactions';
import { mockSavingBooks } from '../data/savingBooks';
import { randomDelay } from '../utils';
import { logger } from '@/utils/logger';

export const mockReportAdapter = {
  async getDailyReport(date) {
    await randomDelay();
    const reportDate = date || new Date().toISOString().split('T')[0];
    logger.info('🎭 Mock Daily Report', { date: reportDate });
    
    // Filter transactions by date
    const dailyTransactions = mockTransactions.filter(t => 
      t.transactiondate?.startsWith(reportDate)
    );
    
    // Calculate summary
    const summary = {
      totalDeposits: dailyTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0),
      totalWithdrawals: dailyTransactions
        .filter(t => t.type === 'withdraw')
        .reduce((sum, t) => sum + t.amount, 0),
      depositCount: dailyTransactions.filter(t => t.type === 'deposit').length,
      withdrawalCount: dailyTransactions.filter(t => t.type === 'withdraw').length
    };
    
    return buildDailyReportResponse(reportDate, dailyTransactions, summary);
  },

  async getMonthlyReport(month, year) {
    await randomDelay();
    const reportMonth = month || new Date().getMonth() + 1;
    const reportYear = year || new Date().getFullYear();
    logger.info('🎭 Mock Monthly Report', { month: reportMonth, year: reportYear });
    
    // Filter transactions by month/year
    const monthStr = `${reportYear}-${String(reportMonth).padStart(2, '0')}`;
    const monthlyTransactions = mockTransactions.filter(t =>
      t.transactiondate?.startsWith(monthStr)
    );
    
    // Calculate summary
    const summary = {
      totalDeposits: monthlyTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0),
      totalWithdrawals: monthlyTransactions
        .filter(t => t.type === 'withdraw')
        .reduce((sum, t) => sum + t.amount, 0),
      totalInterest: 0, // TODO: Calculate from mockSavingBooks
      activeSavingBooks: mockSavingBooks.filter(sb => sb.status === 'active').length
    };
    
    return buildMonthlyReportResponse(reportMonth, reportYear, monthlyTransactions, summary);
  }
};
