// TODO: replace with real backend API for QĐ6 – Regulations
import { apiClient } from "./apiClient";

/**
 * Regulation API
 * Manages system-wide regulations (QĐ6)
 */
export const regulationApi = {
  /**
   * Get current regulations
   * @returns {Promise<Object>} Current regulations data
   */
  async getRegulations() {
    const response = await apiClient.get("/api/regulations");
    return response.data;
  },

  /**
   * Update regulations
   * @param {Object} payload - Regulation updates
   * @param {number} payload.minimumBalance - Minimum balance amount in VND
   * @param {number} payload.minimumTermDays - Minimum term days before withdrawal
   * @returns {Promise<Object>} Updated regulations data
   */
  async updateRegulations(payload) {
    const response = await apiClient.put("/api/regulations", payload);
    return response.data;
  },

  /**
   * Get interest rates for all saving types
   * @returns {Promise<Object>} Interest rates data
   */
  async getInterestRates() {
    const response = await apiClient.get("/api/regulations/interest-rates");
    return response.data;
  },

  /**
   * Update interest rates
   * @param {Array} rates - Array of { typeSavingId, term, rate }
   * @returns {Promise<Object>} Updated interest rates data
   */
  async updateInterestRates(rates) {
    // Send array directly as per OPENAPI specification
    const response = await apiClient.put(
      "/api/regulations/interest-rates",
      rates
    );
    return response.data;
  },

  /**
   * Get regulation change history
   * @returns {Promise<Object>} History data
   */
  async getChangeHistory() {
    const response = await apiClient.get("/api/regulations/history");
    return response.data;
  },
};
