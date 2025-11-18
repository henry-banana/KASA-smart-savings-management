import { apiClient } from './apiClient';

export const accountApi = {
  async getAccount(id) {
    const response = await apiClient.get(`/api/accounts/${id}`);
    return response.data;
  },

  async createAccount(accountData) {
    const response = await apiClient.post('/api/saving-books', accountData);
    return response.data;
  },

  async deposit(id, amount) {
    const response = await apiClient.post('/api/transactions/deposit', { 
      accountId: id, 
      amount 
    });
    return response.data;
  },

  async withdraw(id, amount) {
    const response = await apiClient.post('/api/transactions/withdraw', { 
      accountId: id, 
      amount 
    });
    return response.data;
  },

  async searchAccounts(params) {
    const response = await apiClient.get('/api/saving-books/search', { params });
    return response.data;
  }
};
