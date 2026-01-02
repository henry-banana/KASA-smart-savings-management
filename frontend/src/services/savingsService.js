import { USE_MOCK } from "@/config/app.config";
import { accountApi } from "@/api/accountApi";
import { mockAccountAdapter } from "@/mocks/adapters/accountAdapter";
import { VALIDATION_MESSAGES } from "@/constants/messages";

// ✅ Bây giờ uncomment dòng này để dùng mock
const accountAdapter = USE_MOCK ? mockAccountAdapter : accountApi;

export const savingsService = {
  async openAccount(accountData) {
    this.validateOpenAccount(accountData);
    const payload = this.transformAccountData(accountData);
    const newAccount = await accountAdapter.createAccount(payload);
    return this.transformAccount(newAccount);
  },

  async deposit(accountId, amount) {
    if (!amount || amount < 10000) {
      throw new Error(VALIDATION_MESSAGES.MIN_AMOUNT(10000));
    }

    const result = await accountAdapter.deposit(accountId, amount);
    return {
      account: this.transformAccount(result.account || result),
      transaction: result.transaction,
    };
  },

  async withdraw(accountId, amount) {
    if (!amount || amount < 10000) {
      throw new Error(VALIDATION_MESSAGES.MIN_AMOUNT(10000));
    }

    const result = await accountAdapter.withdraw(accountId, amount);
    return {
      account: this.transformAccount(result.account || result),
      transaction: result.transaction,
    };
  },

  async getAccount(accountId) {
    const account = await accountAdapter.getAccount(accountId);
    return this.transformAccount(account);
  },

  async searchAccounts(filters) {
    const results = await accountAdapter.searchAccounts(filters);
    return {
      ...results,
      data: (results.data || results).map((acc) => this.transformAccount(acc)),
    };
  },

  // Validation
  validateOpenAccount(data) {
    if (!data.customerName?.trim()) {
      throw new Error("Customer name is required");
    }
    if (!data.idCard?.trim()) {
      throw new Error("ID card number is required");
    }
    if (!/^\d{9,12}$/.test(data.idCard)) {
      throw new Error(VALIDATION_MESSAGES.INVALID_ID_CARD);
    }
    if (!data.address?.trim()) {
      throw new Error("Address is required");
    }
    if (!data.savingsType) {
      throw new Error("Please select a savings type");
    }

    const amount = parseFloat(data.initialDeposit);
    if (isNaN(amount) || amount < 100000) {
      throw new Error(VALIDATION_MESSAGES.MIN_AMOUNT(100000));
    }
  },

  // Transformers
  transformAccountData(data) {
    return {
      customer_name: data.customerName,
      id_card: data.idCard,
      address: data.address,
      savings_type: data.savingsType,
      initial_deposit: parseFloat(data.initialDeposit),
      open_date: data.openDate || new Date().toISOString().split("T")[0],
    };
  },

  transformAccount(account) {
    return {
      id: account.id || account.account_id,
      customerName: account.customer_name || account.customerName,
      idCard: account.id_card || account.idCard,
      address: account.address,
      type: account.savings_type || account.type,
      balance: account.balance,
      balanceFormatted: this.formatCurrency(account.balance),
      openDate: account.open_date || account.openDate,
      status: account.status || "active",
    };
  },

  formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  },
};
