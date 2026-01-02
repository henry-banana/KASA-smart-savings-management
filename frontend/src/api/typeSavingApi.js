import { apiClient } from './apiClient';

// Real TypeSaving API wrapper per OpenAPI: GET/POST/PUT/DELETE /api/typesaving
export const typeSavingApi = {
  async getAllTypeSavings() {
    const response = await apiClient.get('/api/typesaving');
    return response.data;
  },
  async createTypeSaving(payload) {
    const response = await apiClient.post('/api/typesaving', payload);
    return response.data;
  },
  async updateTypeSaving(typeSavingId, payload) {
    const response = await apiClient.put(`/api/typesaving/${typeSavingId}`, payload);
    return response.data;
  },
  async deleteTypeSaving(typeSavingId) {
    const response = await apiClient.delete(`/api/typesaving/${typeSavingId}`);
    return response.data;
  }
};
