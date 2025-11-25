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
      withdrawalCount: dailyTransactions.filter(t => t.type === 'withdraw').length,
      netCashFlow: 0,
      newSavingBooks: 0,
      closedSavingBooks: 0,
      transactionCount: dailyTransactions.length
    };
    
    return buildDailyReportResponse({
      date: reportDate,
      summary,
      transactions: dailyTransactions,
      newSavingBooks: []
    });
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
    const totalDeposits = monthlyTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = monthlyTransactions
      .filter(t => t.type === 'withdraw')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const summary = {
      totalDeposits,
      totalWithdrawals,
      netCashFlow: totalDeposits - totalWithdrawals,
      newSavingBooks: 0,
      closedSavingBooks: 0,
      transactionCount: monthlyTransactions.length,
      averageTransactionValue: monthlyTransactions.length > 0 
        ? (totalDeposits + totalWithdrawals) / monthlyTransactions.length 
        : 0
    };
    
    return buildMonthlyReportResponse({
      month: reportMonth,
      year: reportYear,
      summary,
      byTypeSaving: [],
      dailyBreakdown: []
    });
  }
};
