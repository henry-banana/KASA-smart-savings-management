import { apiClient } from './apiClient';

/**
 * TypeSaving API - Real backend calls for /api/typesaving
 */
export const typeSavingApi = {
  /**
   * Get all type savings
   * @returns {Promise<Object>} { message, success, data: { items: [...] } }
   */
  async getAllTypeSavings() {
    const response = await apiClient.get('/api/typesaving');
    return response.data;
  },

  /**
   * Get type saving by ID
   * @param {string} typeSavingId
   */
  async getTypeSavingById(typeSavingId) {
    const response = await apiClient.get(`/api/typesaving/${typeSavingId}`);
    return response.data;
  },

  /**
   * Create new type saving
   * @param {Object} payload - { typeName, term, interestRate }
   */
  async createTypeSaving(payload) {
    const response = await apiClient.post('/api/typesaving', payload);
    return response.data;
  },

  /**
   * Update type saving
   * @param {string} typeSavingId
   * @param {Object} payload
   */
  async updateTypeSaving(typeSavingId, payload) {
    const response = await apiClient.put(`/api/typesaving/${typeSavingId}`, payload);
    return response.data;
  },

  /**
   * Delete type saving
   * @param {string} typeSavingId
   */
  async deleteTypeSaving(typeSavingId) {
    const response = await apiClient.delete(`/api/typesaving/${typeSavingId}`);
    return response.data;
  }
};
