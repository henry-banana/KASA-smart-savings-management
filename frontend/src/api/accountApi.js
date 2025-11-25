import { apiClient } from './apiClient';

export const accountApi = {
  async getAccount(id) {
    const response = await apiClient.get(`/api/savingbook/${id}`);
    return response.data;
  },

  async createAccount(accountData) {
    const response = await apiClient.post('/api/savingbook', accountData);
    return response.data;
  },

  async deposit(id, amount) {
    const response = await apiClient.post('/api/transactions/deposit', { 
      bookId: id, 
      amount 
    });
    return response.data;
  },

  async withdraw(id, amount) {
    const response = await apiClient.post('/api/transactions/withdraw', { 
      bookId: id, 
      amount 
    });
    return response.data;
  },

  async searchAccounts(params) {
    const response = await apiClient.get('/api/savingbook/search', { params });
    return response.data;
  }
};
