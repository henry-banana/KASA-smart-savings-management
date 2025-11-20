/**
 * Response structure templates for Monthly Report API
 * ⚠️ BACKEND CHƯA CÓ - ĐỀ XUẤT CHO BACKEND
 * Proposed endpoint: GET /api/report/monthly?month=MM&year=YYYY
 * 
 * Note: Use builder function to create responses with actual data
 */

/**
 * Build monthly report response from aggregated data
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @param {Object} summary - Summary statistics
 * @param {Array} byTypeSaving - Breakdown by saving type
 * @param {Array} dailyBreakdown - Daily statistics (optional)
 * @returns {Object} Monthly report response
 */
export const buildMonthlyReportResponse = ({ month, year, summary, byTypeSaving, dailyBreakdown }) => ({
  message: "Monthly report retrieved successfully",
  success: true,
  data: {
    month,
    year,
    summary: {
      totalDeposits: summary.totalDeposits || 0,
      totalWithdrawals: summary.totalWithdrawals || 0,
      netCashFlow: summary.netCashFlow || 0,
      newSavingBooks: summary.newSavingBooks || 0,
      closedSavingBooks: summary.closedSavingBooks || 0,
      transactionCount: summary.transactionCount || 0,
      averageTransactionValue: summary.averageTransactionValue || 0
    },
    byTypeSaving: byTypeSaving || [],
    dailyBreakdown: dailyBreakdown || []
  }
});

/**
 * Error response templates
 */
export const monthlyReportTemplates = {
  invalidMonth: {
    message: "Invalid month (must be 1-12)",
    success: false
  },

  invalidYear: {
    message: "Invalid year format",
    success: false
  },

  noDataAvailable: {
    message: "No data available for the selected period",
    success: false
  },

  missingParameters: {
    message: "Missing required parameters: month and year",
    success: false
  },

  serverError: {
    message: "Internal server error",
    success: false
  }
};

export default {
  buildMonthlyReportResponse,
  ...monthlyReportTemplates
};
