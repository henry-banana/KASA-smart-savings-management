import { apiClient } from './apiClient';

export const authApi = {
  async login(credentials) {
    const response = await apiClient.post('/api/login', credentials);
    return response.data;
  },

  async logout() {
    const response = await apiClient.post('/api/logout');
    return response.data;
  }
};
