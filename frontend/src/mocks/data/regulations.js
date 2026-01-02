/**
 * Mock data for System Regulations (QĐ6)
 * Global configuration parameters for the savings management system
 */

export let mockRegulations = {
  minimumBalance: 100000, // VND
  minimumTermDays: 15, // days
  updatedAt: "2025-11-01T10:00:00Z",
};

/**
 * Get current regulations
 * @returns {Object} Current regulations
 */
export const getRegulations = () => {
  return { ...mockRegulations };
};

/**
 * Update regulations
 * @param {Object} updates - Updates to apply
 * @param {number} updates.minimumBalance - Minimum balance amount
 * @param {number} updates.minimumTermDays - Minimum term days
 * @returns {Object} Updated regulations
 */
export const updateRegulations = (updates) => {
  mockRegulations = {
    ...mockRegulations,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return { ...mockRegulations };
};
