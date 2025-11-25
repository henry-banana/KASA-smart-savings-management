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
      const booksOfType = mockSavingBooks.filter(sb => sb.typeSavingId === type.typeSavingId);
      const bookIds = booksOfType.map(sb => sb.bookId);
      
      // Get transactions for these books on this date
      const typeTransactions = dailyTransactions.filter(t => bookIds.includes(t.bookId));
      
      const deposits = typeTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
      const withdrawals = typeTransactions
        .filter(t => t.type === 'withdraw')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        type: type.typeName,
        typeSavingId: type.typeSavingId,
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
      sb.openDate?.startsWith(monthStr)
    );
    const booksClosedThisMonth = mockSavingBooks.filter(sb =>
      sb.status === 'closed' && sb.openDate?.startsWith(monthStr)
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
      const opened = booksOpenedThisMonth.filter(sb => sb.typeSavingId === type.typeSavingId).length;
      const closed = booksClosedThisMonth.filter(sb => sb.typeSavingId === type.typeSavingId).length;
      
      return {
        type: type.typeName,
        typeSavingId: type.typeSavingId,
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
        const booksOfType = mockSavingBooks.filter(sb => sb.typeSavingId === type.typeSavingId);
        const bookIds = booksOfType.map(sb => sb.bookId);
        const typeTransactions = dayTransactions.filter(t => bookIds.includes(t.bookId));
        
        dayData[type.typeName] = typeTransactions
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
  },

  /**
   * BM5.2 - Get monthly opening/closing savings books report
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @param {string} savingsType - Savings type filter ('all', 'no-term', '3-months', etc.)
   * @returns {Promise<Object>} Monthly open/close report data
   */
  async getMonthlyOpenCloseReport(month, year, savingsType = 'all') {
    await randomDelay();
    const reportMonth = month || new Date().getMonth() + 1;
    const reportYear = year || new Date().getFullYear();
    logger.info('🎭 Mock Monthly Open/Close Report', { month: reportMonth, year: reportYear, savingsType });

    const daysInMonth = new Date(reportYear, reportMonth, 0).getDate();

    // Filter saving books based on savingsType
    let filteredTypeSavings = mockTypeSavings;
    if (savingsType !== 'all') {
      const typeMapping = {
        'no-term': 'Không kỳ hạn',
        '3-months': '3 Tháng',
        '6-months': '6 Tháng',
        '12-months': '12 Tháng'
      };
      const typeName = typeMapping[savingsType];
      if (typeName) {
        filteredTypeSavings = mockTypeSavings.filter(t => 
          t.typeName.toLowerCase().includes(typeName.toLowerCase()) ||
          t.typeName.toLowerCase().includes(savingsType.replace('-', ' '))
        );
      }
    }

    // Generate daily breakdown
    const dailyData = [];
    let totalOpened = 0;
    let totalClosed = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${reportYear}-${String(reportMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Count books opened on this day
      const openedOnDay = mockSavingBooks.filter(sb => {
        const matchesDate = sb.openDate === dateStr;
        if (savingsType === 'all') return matchesDate;
        const typeIds = filteredTypeSavings.map(t => t.typeSavingId);
        return matchesDate && typeIds.includes(sb.typeSavingId);
      }).length;

      // Count books closed on this day (simulate some closures)
      const closedOnDay = mockSavingBooks.filter(sb => {
        const matchesClosed = sb.status === 'closed' && sb.closeDate === dateStr;
        if (savingsType === 'all') return matchesClosed;
        const typeIds = filteredTypeSavings.map(t => t.typeSavingId);
        return matchesClosed && typeIds.includes(sb.typeSavingId);
      }).length;

      // If no real data, generate random mock data for demonstration
      const opened = openedOnDay || Math.floor(Math.random() * 10) + 1;
      const closed = closedOnDay || Math.floor(Math.random() * 5);

      dailyData.push({
        day,
        opened,
        closed,
        difference: opened - closed
      });

      totalOpened += opened;
      totalClosed += closed;
    }

    return {
      message: "Monthly open/close report retrieved successfully",
      success: true,
      data: {
        month: reportMonth,
        year: reportYear,
        savingsType,
        dailyData,
        totals: {
          opened: totalOpened,
          closed: totalClosed,
          difference: totalOpened - totalClosed
        }
      }
    };
  }
};
