import { buildDailyReportResponse } from '../responses/dailyReport.responses';
import { buildMonthlyReportResponse } from '../responses/monthlyReport.responses';
import { mockTransactions } from '../data/transactions';
import { mockSavingBooks } from '../data/savingBooks';
import { mockTypeSavings } from '../data/typeSavings';
import { randomDelay } from '../utils';
import { logger } from '@/utils/logger';

export const mockReportAdapter = {
  async getDailyReport(date) {
    await randomDelay();
    const reportDate = date || new Date().toISOString().split('T')[0];
    logger.info('🎭 Mock Daily Report', { date: reportDate });
    
    // Filter transactions by date
    const dailyTransactions = mockTransactions.filter(t => 
      t.transactionDate?.startsWith(reportDate)
    );
    
    // Calculate deposits and withdrawals with correct field name
    const totalDeposits = dailyTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = dailyTransactions
      .filter(t => t.type === 'withdraw')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate summary
    const summary = {
      totalDeposits,
      totalWithdrawals,
      depositCount: dailyTransactions.filter(t => t.type === 'deposit').length,
      withdrawalCount: dailyTransactions.filter(t => t.type === 'withdraw').length,
      netCashFlow: totalDeposits - totalWithdrawals,
      newSavingBooks: 0,
      closedSavingBooks: 0,
      transactionCount: dailyTransactions.length
    };
    
    // Calculate breakdown by type saving
    const byTypeSaving = mockTypeSavings.slice(0, 3).map(type => {
      // Get all saving books of this type
      const booksOfType = mockSavingBooks.filter(sb => sb.typeid === type.typesavingid);
      const bookIds = booksOfType.map(sb => sb.bookid);
      
      // Get transactions for these books on this date
      const typeTransactions = dailyTransactions.filter(t => bookIds.includes(t.bookId));
      
      const deposits = typeTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
      const withdrawals = typeTransactions
        .filter(t => t.type === 'withdraw')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        type: type.typename === 'no-term' ? 'No Term' : 
              type.typename === '3-months' ? '3 Months' : '6 Months',
        typeSavingId: type.typesavingid,
        deposits,
        withdrawals,
        difference: deposits - withdrawals
      };
    });
    
    return buildDailyReportResponse({
      date: reportDate,
      summary,
      byTypeSaving,
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
      t.transactionDate?.startsWith(monthStr)
    );
    
    // Filter saving books opened/closed in this month
    const booksOpenedThisMonth = mockSavingBooks.filter(sb =>
      sb.registertime?.startsWith(monthStr)
    );
    const booksClosedThisMonth = mockSavingBooks.filter(sb =>
      sb.status === 'closed' && sb.registertime?.startsWith(monthStr)
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
      newSavingBooks: booksOpenedThisMonth.length,
      closedSavingBooks: booksClosedThisMonth.length,
      transactionCount: monthlyTransactions.length,
      averageTransactionValue: monthlyTransactions.length > 0 
        ? (totalDeposits + totalWithdrawals) / monthlyTransactions.length 
        : 0
    };
    
    // Calculate breakdown by type saving
    const byTypeSaving = mockTypeSavings.slice(0, 3).map(type => {
      const opened = booksOpenedThisMonth.filter(sb => sb.typeid === type.typesavingid).length;
      const closed = booksClosedThisMonth.filter(sb => sb.typeid === type.typesavingid).length;
      
      return {
        type: type.typename === 'no-term' ? 'No Term' : 
              type.typename === '3-months' ? '3 Months' : '6 Months',
        typeSavingId: type.typesavingid,
        opened,
        closed,
        difference: opened - closed
      };
    });
    
    // Generate daily breakdown for the month
    const daysInMonth = new Date(reportYear, reportMonth, 0).getDate();
    const dailyBreakdown = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${reportYear}-${String(reportMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTransactions = mockTransactions.filter(t =>
        t.transactionDate?.startsWith(dateStr)
      );
      
      const dayData = {
        date: day,
        'No Term': 0,
        '3 Months': 0,
        '6 Months': 0
      };
      
      mockTypeSavings.slice(0, 3).forEach(type => {
        const booksOfType = mockSavingBooks.filter(sb => sb.typeid === type.typesavingid);
        const bookIds = booksOfType.map(sb => sb.bookid);
        const typeTransactions = dayTransactions.filter(t => bookIds.includes(t.bookId));
        
        const typeName = type.typename === 'no-term' ? 'No Term' : 
                        type.typename === '3-months' ? '3 Months' : '6 Months';
        
        dayData[typeName] = typeTransactions
          .filter(t => t.type === 'deposit')
          .reduce((sum, t) => sum + t.amount, 0);
      });
      
      dailyBreakdown.push(dayData);
    }
    
    return buildMonthlyReportResponse({
      month: reportMonth,
      year: reportYear,
      summary,
      byTypeSaving,
      dailyBreakdown
    });
  }
};
