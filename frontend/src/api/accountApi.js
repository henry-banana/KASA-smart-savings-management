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

  async deposit(id, amount, employeeId) {
    const response = await apiClient.post('/api/transactions/deposit', {
      bookId: id,
      amount,
      employeeId
    });
    return response.data;
  },

  async withdraw(id, amount, shouldCloseAccount, employeeId) {
    const response = await apiClient.post('/api/transactions/withdraw', {
      bookId: id,
      amount,
      employeeId,
      shouldCloseAccount
    });
    return response.data;
  },

  async searchAccounts(params) {
    const response = await apiClient.get('/api/savingbook/search', { params });
    return response.data;
  },

  // Aliases for service compatibility
  async getSavingBookById(id) {
    return this.getAccount(id);
  },

  async searchSavingBooks(keyword = '', typeFilter = 'all', statusFilter = 'all') {
    const params = { keyword, type: typeFilter, status: statusFilter };
    return this.searchAccounts(params);
  }
};
