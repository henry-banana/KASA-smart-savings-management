import { USE_MOCK } from '@/config/app.config';
import { accountApi } from '@/api/accountApi';
import { mockAccountAdapter } from '@/mocks/adapters/accountAdapter';
import { mockSavingBookAdapter } from '@/mocks/adapters/savingBookAdapter';

const accountAdapter = USE_MOCK ? mockAccountAdapter : accountApi;
const savingBookAdapter = USE_MOCK ? mockSavingBookAdapter : accountApi;

/**
 * Tạo sổ tiết kiệm mới (BM1)
 * @param {Object} data - Thông tin sổ tiết kiệm
 * @returns {Promise<Object>} Created saving book data
 */
export const createSavingBook = async (data) => {
  // Validation
  if (!data.customerName || !data.initialDeposit) {
    throw new Error('Thiếu thông tin khách hàng hoặc số tiền');
  }

  if (Number(data.initialDeposit) < 100000) {
    throw new Error('Số tiền tối thiểu là 100,000 VND');
  }

  return accountAdapter.createAccount({
    customer_name: data.customerName,
    id_card: data.idCard,
    address: data.address,
    savings_type: data.savingsType,
    initial_deposit: parseFloat(data.initialDeposit),
    open_date: data.openDate || new Date().toISOString().split('T')[0]
  });
};

/**
 * Tra cứu sổ tiết kiệm (BM4)
 * @param {string} keyword - Từ khóa tìm kiếm
 * @param {string} typeFilter - Lọc theo loại sổ
 * @param {string} statusFilter - Lọc theo trạng thái
 * @returns {Promise<Object>} Search results
 */
export const searchSavingBooks = async (keyword = '', typeFilter = 'all', statusFilter = 'all') => {
  return savingBookAdapter.searchSavingBooks(keyword, typeFilter, statusFilter);
};

/**
 * Lấy thông tin sổ tiết kiệm theo ID
 * @param {string} id - Mã sổ tiết kiệm
 * @returns {Promise<Object>} Saving book data
 */
export const getSavingBookById = async (id) => {
  if (!id) {
    throw new Error('Vui lòng nhập mã sổ');
  }

  return savingBookAdapter.getSavingBookById(id);
};
