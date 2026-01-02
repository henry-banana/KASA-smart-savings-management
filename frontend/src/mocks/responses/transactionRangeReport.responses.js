/**
 * Response structure templates for Transaction Range Report API
 * ⚠️ BACKEND CHƯA CÓ - ĐỀ XUẤT CHO BACKEND
 * Proposed endpoint: GET /api/report/transactions?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&page=1&limit=50
 * 
 * Note: Use builder function to create responses with actual data
 */

/**
 * Build transaction range report with pagination
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {Object} summary - Transaction summary
 * @param {Array} transactions - List of transactions
 * @param {Object} pagination - Pagination info
 * @returns {Object} Transaction range report response
 */
export const buildTransactionRangeReportResponse = ({ 
  startDate, 
  endDate, 
  summary, 
  transactions, 
  pagination 
}) => ({
  message: "Transaction report retrieved successfully",
  success: true,
  data: {
    startDate,
    endDate,
    summary: {
      totalTransactions: summary.totalTransactions || 0,
      totalDeposits: summary.totalDeposits || 0,
      totalWithdrawals: summary.totalWithdrawals || 0,
      averageDepositAmount: summary.averageDepositAmount || 0,
      averageWithdrawalAmount: summary.averageWithdrawalAmount || 0
    },
    transactions: transactions || [],
    pagination: {
      page: pagination?.page || 1,
      limit: pagination?.limit || 50,
      total: pagination?.total || 0,
      totalPages: pagination?.totalPages || 0
    }
  }
});

/**
 * Error response templates
 */
export const transactionRangeReportTemplates = {
  invalidDateRange: {
    message: "Invalid date range (start date must be before end date)",
    success: false
  },

  noDataAvailable: {
    message: "No transactions found for the selected period",
    success: false
  },

  missingParameters: {
    message: "Missing required parameters: startDate and endDate",
    success: false
  },

  serverError: {
    message: "Internal server error",
    success: false
  }
};

export default {
  buildTransactionRangeReportResponse,
  ...transactionRangeReportTemplates
};
