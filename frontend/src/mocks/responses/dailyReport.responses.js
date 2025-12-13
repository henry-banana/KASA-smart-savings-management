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
 * @param {Array} transactions - List of transactions for the day (mock-extension)
 * @param {Array} newSavingBooks - List of new saving books opened (mock-extension)
 * @returns {Object} Daily report response matching OpenAPI contract
 */
export const buildDailyReportResponse = ({
  date,
  summary,
  byTypeSaving,
  transactions,
  newSavingBooks,
}) => ({
  message: "Get daily report successfully",
  success: true,
  data: {
    date,
    // Canonical fields per OpenAPI
    items: byTypeSaving || [],
    // Provide both keys for compatibility with existing UI fallbacks
    byTypeSaving: byTypeSaving || [],
    total: {
      totalDeposits: summary.totalDeposits || 0,
      totalWithdrawals: summary.totalWithdrawals || 0,
      difference: summary.netCashFlow || 0,
    },
    // mock-extension: extra fields for UI enhancements
    meta: {
      transactionCount: summary.transactionCount || 0,
      newSavingBooksCount: summary.newSavingBooks || 0,
      closedSavingBooksCount: summary.closedSavingBooks || 0,
      // Detailed lists for UI visualization
      transactions: transactions || [],
      newSavingBooks: newSavingBooks || [],
    },
  },
});

/**
 * Error response templates
 */
export const dailyReportTemplates = {
  invalidDate: {
    message: "Invalid date format",
    success: false,
  },

  noDataAvailable: {
    message: "No data available for the selected date",
    success: false,
  },

  missingParameters: {
    message: "Missing required parameter: date",
    success: false,
  },

  serverError: {
    message: "Failed to generate daily report",
    success: false,
  },
};

export default {
  buildDailyReportResponse,
  ...dailyReportTemplates,
};
