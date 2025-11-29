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
 * @param {Array} byTypeSaving - Breakdown by saving type
 * @param {Array} transactions - List of transactions for the day
 * @param {Array} newSavingBooks - List of new saving books opened
 * @returns {Object} Daily report response
 */
export const buildDailyReportResponse = ({ date, summary, byTypeSaving, transactions, newSavingBooks }) => ({
  message: "Get daily report successfully",
  success: true,
  data: {
    date,
    summary: {
      totalDeposits: summary.totalDeposits || 0,
      totalWithdrawals: summary.totalWithdrawals || 0,
      netCashFlow: summary.netCashFlow || 0,
      // mock-extension: counts for UI display
      newSavingBooks: summary.newSavingBooks || 0,
      closedSavingBooks: summary.closedSavingBooks || 0,
      transactionCount: summary.transactionCount || 0
    },
    byTypeSaving: byTypeSaving || [],
    // mock-extension: detailed transaction list for UI visualization
    transactions: transactions || [],
    // mock-extension: new saving books opened today
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
