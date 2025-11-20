/**
 * Response structure templates for Customer Report API
 * ⚠️ BACKEND CHƯA CÓ - ĐỀ XUẤT CHO BACKEND
 * Proposed endpoint: GET /api/report/customer-summary
 * 
 * Note: Use builder function to create responses with actual data
 */

/**
 * Build customer summary report
 * @param {Object} stats - Customer statistics
 * @param {Array} topCustomers - Top customers by balance
 * @param {Array} byAge - Customer breakdown by age range
 * @returns {Object} Customer summary response
 */
export const buildCustomerSummaryResponse = ({ stats, topCustomers, byAge }) => ({
  message: "Customer summary report retrieved successfully",
  success: true,
  data: {
    totalCustomers: stats.totalCustomers || 0,
    activeCustomers: stats.activeCustomers || 0,
    inactiveCustomers: stats.inactiveCustomers || 0,
    topCustomers: topCustomers || [],
    byAge: byAge || []
  }
});

/**
 * Error response templates
 */
export const customerReportTemplates = {
  noDataAvailable: {
    message: "No customer data available",
    success: false
  },

  serverError: {
    message: "Internal server error",
    success: false
  }
};

export default {
  buildCustomerSummaryResponse,
  ...customerReportTemplates
};
