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
 * @param {string} typeSavingId - Optional type saving filter ID
 * @param {string} typeName - Optional type saving name
 * @param {Object} summary - Summary statistics
 * @param {Array} byTypeSaving - Breakdown by saving type (mock-extension)
 * @param {Array} dailyBreakdown - Daily statistics (canonical items)
 * @returns {Object} Monthly report response matching OpenAPI contract
 */
export const buildMonthlyReportResponse = ({ month, year, typeSavingId, typeName, summary, byTypeSaving, dailyBreakdown }) => ({
  message: "Get monthly report successfully",
  success: true,
  data: {
    month,
    year,
    // Include type filter if provided
    ...(typeSavingId && { typeSavingId }),
    ...(typeName && { typeName }),
    // Canonical fields per OpenAPI
    items: dailyBreakdown || [],
    total: {
      newSavingBooks: summary.newSavingBooks || 0,
      closedSavingBooks: summary.closedSavingBooks || 0,
      difference: (summary.newSavingBooks || 0) - (summary.closedSavingBooks || 0)
    },
    // mock-extension: extra aggregates for UI
    meta: {
      byTypeSaving: byTypeSaving || [],
      totalDeposits: summary.totalDeposits || 0,
      totalWithdrawals: summary.totalWithdrawals || 0,
      transactionCount: summary.transactionCount || 0,
      averageTransactionValue: summary.averageTransactionValue || 0
    }
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
    message: "Failed to generate monthly report",
    success: false
  }
};

export default {
  buildMonthlyReportResponse,
  ...monthlyReportTemplates
};
