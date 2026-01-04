import { USE_MOCK } from "@/config/app.config";
import { regulationApi } from "@/api/regulationApi";
import { mockRegulationAdapter } from "@/mocks/adapters/regulationAdapter";

const regulationAdapter = USE_MOCK ? mockRegulationAdapter : regulationApi;

/**
 * Get current system regulations (QĐ6)
 * @returns {Promise<Object>} Regulations data including minimumBalance and minimumTermDays
 */
export const getRegulations = async () => {
  return regulationAdapter.getRegulations();
};

/**
 * Update system regulations (QĐ6)
 * @param {Object} payload - Regulation updates
 * @param {number} payload.minimumBalance - Minimum balance amount in VND
 * @param {number} payload.minimumTermDays - Minimum term days before withdrawal
 * @returns {Promise<Object>} Updated regulations data
 */
export const updateRegulations = async (payload) => {
  return regulationAdapter.updateRegulations(payload);
};

/**
 * Get interest rates for all saving types
 * @returns {Promise<Object>} Interest rates data
 */
export const getInterestRates = async () => {
  return regulationAdapter.getInterestRates();
};

/**
 * Update interest rates
 * @param {Array} rates - Array of rate updates
 * @returns {Promise<Object>} Updated interest rates data
 */
export const updateInterestRates = async (rates) => {
  return regulationAdapter.updateInterestRates(rates);
};

/**
 * Get regulation change history
 * @returns {Promise<Object>} History data
 */
export const getChangeHistory = async () => {
  return regulationAdapter.getChangeHistory();
};
