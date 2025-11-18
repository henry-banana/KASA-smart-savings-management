import { USE_MOCK } from '@/config/app.config';
import { accountApi } from '@/api/accountApi';
import { mockTransactionAdapter } from '@/mocks/adapters/transactionAdapter';

const transactionAdapter = USE_MOCK ? mockTransactionAdapter : accountApi;

/**
 * Lấy thông tin tài khoản
 * @param {string} accountCode - Mã sổ tiết kiệm
 * @returns {Promise<Object>} Account info
 */
export const getAccountInfo = async (accountCode) => {
  if (!accountCode) {
    throw new Error('Vui lòng nhập mã sổ');
  }

  return transactionAdapter.getAccountInfo(accountCode);
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

  return transactionAdapter.depositMoney(accountCode, amount);
};

/**
 * Rút tiền (BM3)
 * @param {string} accountCode - Mã sổ tiết kiệm
 * @param {number} amount - Số tiền rút
 * @returns {Promise<Object>} Transaction result
 */
export const withdrawMoney = async (accountCode, amount) => {
  if (!accountCode || !amount || amount <= 0) {
    throw new Error('Thông tin giao dịch không hợp lệ');
  }

  return transactionAdapter.withdrawMoney(accountCode, amount);
};
