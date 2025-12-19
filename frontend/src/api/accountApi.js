import { apiClient } from "./apiClient";

export const accountApi = {
  async getAccount(id) {
    const response = await apiClient.get(`/api/savingbook/${id}`);
    return response.data;
  },

  async createAccount(accountData) {
    const response = await apiClient.post("/api/savingbook", accountData);
    return response.data;
  },

  /**
   * Deposit transaction per OpenAPI: POST /api/transactions/deposit
   * Body: { bookId, amount, employeeId }
   */
  async deposit(id, amount, employeeId) {
    const response = await apiClient.post("/api/transactions/deposit", {
      bookId: id,
      amount,
      employeeId,
    });
    return response.data;
  },

  /**
   * Withdraw transaction per OpenAPI: POST /api/transactions/withdraw
   * Body: { bookId, amount, employeeId, shouldCloseAccount? }
   */
  async withdraw(id, amount, shouldCloseAccount, employeeId) {
    const response = await apiClient.post("/api/transactions/withdraw", {
      bookId: id,
      amount,
      employeeId,
      shouldCloseAccount,
    });
    return response.data;
  },

  /**
   * Close savings account per OpenAPI: POST /api/savingbook/{id}/close
   * Body: { employeeID, status: "Close" }
   */
  async closeAccount(id, employeeId) {
    const response = await apiClient.post(`/api/savingbook/${id}/close`, {
      employeeID: employeeId,
      status: "Close",
    });
    return response.data;
  },

  async searchAccounts(params) {
    const response = await apiClient.get("/api/savingbook/search", { params });
    return response.data;
  },

  // Aliases for service compatibility
  async getSavingBookById(id) {
    return this.getAccount(id);
  },

  async searchSavingBooks(
    keyword = "",
    typeFilter = "all",
    statusFilter = "all",
    page = 1,
    pageSize = 10
  ) {
    const params = {
      keyword,
      typeId: typeFilter,
      status: statusFilter,
      page,
      pageSize,
    };
    return this.searchAccounts(params);
  },
};
