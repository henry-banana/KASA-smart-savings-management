/**
 * Response structure templates for Interest Report API
 * ⚠️ BACKEND CHƯA CÓ - ĐỀ XUẤT CHO BACKEND
 * Proposed endpoint: GET /api/report/interest?month=MM&year=YYYY
 * 
 * Note: Use builder function to create responses with actual data
 */

/**
 * Build interest report response
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @param {Object} summary - Interest summary
 * @param {Array} byTypeSaving - Breakdown by saving type
 * @param {Array} maturedBooks - List of matured saving books
 * @returns {Object} Interest report response
 */
export const buildInterestReportResponse = ({ month, year, summary, byTypeSaving, maturedBooks }) => ({
  message: "Interest report retrieved successfully",
  success: true,
  data: {
    month,
    year,
    summary: {
      totalInterestPaid: summary.totalInterestPaid || 0,
      totalMaturedBooks: summary.totalMaturedBooks || 0,
      averageInterestPerBook: summary.averageInterestPerBook || 0
    },
    byTypeSaving: byTypeSaving || [],
    maturedBooks: maturedBooks || []
  }
});

/**
 * Error response templates
 */
export const interestReportTemplates = {
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
  buildInterestReportResponse,
  ...interestReportTemplates
};
