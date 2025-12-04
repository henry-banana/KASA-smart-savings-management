import { USE_MOCK } from "@/config/app.config";
import { typeSavingApi } from "@/api/typeSavingApi";
import { mockTypeSavingAdapter } from "@/mocks/adapters/typeSavingAdapter";
import { resetTypeSavings } from "@/mocks/data/typeSavings";

const typeSavingAdapter = USE_MOCK ? mockTypeSavingAdapter : typeSavingApi;

/**
 * Get all type savings
 * @returns {Promise<Object>} List of type savings
 */
export const getAllTypeSavings = async () => {
  return typeSavingAdapter.getAllTypeSavings();
};

/**
 * Get type saving by ID
 * @param {string} typeSavingId - Type saving ID
 * @returns {Promise<Object>} Type saving data
 */
export const getTypeSavingById = async (typeSavingId) => {
  if (!typeSavingId?.trim()) {
    throw new Error("Type saving ID is required");
  }
  return typeSavingAdapter.getTypeSavingById(typeSavingId);
};

/**
 * Create new type saving
 * @param {Object} data - Type saving data
 * @param {string} data.typename - Name of the type (e.g., "3 Months")
 * @param {number} data.term - Term in months (0 for no term)
 * @param {number} data.interestRate - Interest rate per month
 * @returns {Promise<Object>} Created type saving
 */
export const createTypeSaving = async (data) => {
  // Validation
  if (!data.typename?.trim()) {
    throw new Error("Type name is required");
  }
  if (data.term === undefined || data.term === null || data.term === "") {
    throw new Error("Term is required");
  }
  if (!data.interestRate || Number(data.interestRate) <= 0) {
    throw new Error("Interest rate must be greater than 0");
  }

  if (USE_MOCK) {
    return typeSavingAdapter.createTypeSaving(data);
  }
  // Send payload as-is per OPENAPI specification (typename, term, interestRate)
  const payload = {
    typename: data.typename.trim(),
    term: Number(data.term),
    interestRate: Number(data.interestRate),
  };
  return typeSavingAdapter.createTypeSaving(payload);
};

/**
 * Update type saving
 * @param {string} typeSavingId - Type saving ID
 * @param {Object} data - Updated data
 * @returns {Promise<Object>} Updated type saving
 */
export const updateTypeSaving = async (typeSavingId, data) => {
  if (!typeSavingId?.trim()) {
    throw new Error("Type saving ID is required");
  }
  if (!data || Object.keys(data).length === 0) {
    throw new Error("No update data provided");
  }

  if (USE_MOCK) {
    return typeSavingAdapter.updateTypeSaving(typeSavingId, data);
  }
  // Send payload as-is per OPENAPI specification (typename, term, interestRate)
  const payload = {};
  if (data.typename) payload.typename = data.typename.trim();
  if (data.term !== undefined) payload.term = Number(data.term);
  if (data.interestRate !== undefined)
    payload.interestRate = Number(data.interestRate);
  return typeSavingAdapter.updateTypeSaving(typeSavingId, payload);
};

/**
 * Delete type saving
 * @param {string} typeSavingId - Type saving ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteTypeSaving = async (typeSavingId) => {
  if (!typeSavingId?.trim()) {
    throw new Error("Type saving ID is required");
  }

  return typeSavingAdapter.deleteTypeSaving(typeSavingId);
};

/**
 * Reset all type savings to initial seed (mock only)
 * @returns {Array} Seeded type savings after reset
 */
export const resetTypeSavingDefaults = async () => {
  // Only available in mock mode
  const data = resetTypeSavings();
  return data;
};
