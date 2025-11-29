import { USE_MOCK } from '@/config/app.config';
import { accountApi } from '@/api/accountApi';
import { mockTransactionAdapter } from '@/mocks/adapters/transactionAdapter';

/**
 * Lấy thông tin tài khoản
 * @param {string} accountCode - Mã sổ tiết kiệm
 * @returns {Promise<Object>} Account info
 */
export const getAccountInfo = async (accountCode) => {
  if (!accountCode) {
    throw new Error('Vui lòng nhập mã sổ');
  }

  if (USE_MOCK) {
    return mockTransactionAdapter.getAccountInfo(accountCode);
  } else {
    // Real API uses getAccount method
    return accountApi.getAccount(accountCode);
  }
};

/**
 * Gửi tiền (BM2)
 * @param {string} accountCode - Mã sổ tiết kiệm
 * @param {number} amount - Số tiền gửi
 * @returns {Promise<Object>} Transaction result
 */
export const depositMoney = async (accountCode, amount) => {
  if (!accountCode || !amount || amount <= 0) {
    throw new Error('Thông tin giao dịch không hợp lệ');
  }

  if (amount < 100000) {
    throw new Error('Số tiền gửi tối thiểu là 100,000 VND');
  }

  if (USE_MOCK) {
    return mockTransactionAdapter.depositMoney({ bookId: accountCode, amount });
  } else {
    // Real API uses deposit method
    return accountApi.deposit(accountCode, amount);
  }
};

/**
 * Rút tiền (BM3)
 * @param {string} accountCode - Mã sổ tiết kiệm
 * @param {number} amount - Số tiền rút
 * @param {boolean} shouldCloseAccount - Có đóng tài khoản không (cho sổ có kỳ hạn)
 * @returns {Promise<Object>} Transaction result
 */
export const withdrawMoney = async (accountCode, amount, shouldCloseAccount) => {
  if (!accountCode || !amount || amount <= 0) {
    throw new Error('Thông tin giao dịch không hợp lệ');
  }

  if (USE_MOCK) {
    return mockTransactionAdapter.withdrawMoney({ bookId: accountCode, amount, shouldCloseAccount });
  } else {
    // Real API uses withdraw method
    return accountApi.withdraw(accountCode, amount, shouldCloseAccount);
  }
};
