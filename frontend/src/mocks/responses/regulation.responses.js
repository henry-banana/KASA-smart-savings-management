/**
 * Regulation Response Builders
 * Build consistent API responses for regulation endpoints
 */

import { getRegulations as getRegulationsData } from '../data/regulations.js';

/**
 * Build response for GET /api/regulations
 * @param {Object} regulations - Regulations data
 * @returns {Object} API response
 */
export const buildGetRegulationsResponse = (regulations = getRegulationsData()) => ({
  message: "Get regulations successfully",
  success: true,
  data: regulations
});

/**
 * Build response for PUT /api/regulations
 * @param {Object} regulations - Updated regulations data
 * @returns {Object} API response
 */
export const buildUpdateRegulationsResponse = (regulations) => ({
  message: "Update regulations successfully",
  success: true,
  data: regulations
});

/**
 * Build error response for regulations
 * @param {string} message - Error message
 * @returns {Object} Error response
 */
export const buildRegulationErrorResponse = (message) => ({
  message,
  success: false
});

// Default export with all builders
const regulationResponses = {
  buildGetRegulationsResponse,
  buildUpdateRegulationsResponse,
  buildRegulationErrorResponse
};

export default regulationResponses;
