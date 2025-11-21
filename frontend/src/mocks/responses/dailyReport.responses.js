/**
 * Response structure templates for Daily Report API
 * ⚠️ BACKEND CHƯA CÓ - ĐỀ XUẤT CHO BACKEND
 * Proposed endpoint: GET /api/report/daily?date=YYYY-MM-DD
 * 
 * Note: Use builder function to create responses with actual data
 */

/**
 * Build daily report response from transaction data
 * @param {string} date - Report date (YYYY-MM-DD)
 * @param {Object} summary - Summary statistics
 * @param {Array} transactions - List of transactions for the day
 * @param {Array} newSavingBooks - List of new saving books opened
 * @returns {Object} Daily report response
 */
export const buildDailyReportResponse = ({ date, summary, transactions, newSavingBooks }) => ({
  message: "Daily report retrieved successfully",
  success: true,
  data: {
    date,
    summary: {
      totalDeposits: summary.totalDeposits || 0,
      totalWithdrawals: summary.totalWithdrawals || 0,
      netCashFlow: summary.netCashFlow || 0,
      newSavingBooks: summary.newSavingBooks || 0,
      closedSavingBooks: summary.closedSavingBooks || 0,
      transactionCount: summary.transactionCount || 0
    },
    transactions: transactions || [],
    newSavingBooks: newSavingBooks || []
  }
});

/**
 * Error response templates
 */
export const dailyReportTemplates = {
  invalidDate: {
    message: "Invalid date format",
    success: false
  },

  noDataAvailable: {
    message: "No data available for the selected date",
    success: false
  },

  missingParameters: {
    message: "Missing required parameter: date",
    success: false
  },

  serverError: {
    message: "Internal server error",
    success: false
  }
};

export default {
  buildDailyReportResponse,
  ...dailyReportTemplates
};
