import { USE_MOCK } from "@/config/app.config";
import { accountApi } from "@/api/accountApi";
import { mockSavingBookAdapter } from "@/mocks/adapters/savingBookAdapter";

/**
 * Tạo sổ tiết kiệm mới (BM1)
 * @param {Object} data - Thông tin sổ tiết kiệm
 * @returns {Promise<Object>} Created saving book data
 */
export const createSavingBook = async (data) => {
  // Validation
  if (!data.customerName || !data.initialDeposit) {
    throw new Error("Missing customer information or amount");
  }

  if (Number(data.initialDeposit) < 100000) {
    throw new Error("Minimum amount is 100,000 VND");
  }

  if (USE_MOCK) {
    // Use canonical mock adapter directly and alias accountCode for UI compatibility
    const resp = await mockSavingBookAdapter.createSavingBook({
      citizenId: data.idCard,
      customerName: data.customerName,
      typeSavingId: data.savingsType,
      openDate: data.openDate,
      balance: parseFloat(data.initialDeposit),
    });
    return {
      ...resp,
      data: { ...resp.data, accountCode: resp.data.bookId },
    };
  }

  // Backend API expects backend payload; keep existing mapping here
  return accountApi.createAccount({
    customer_name: data.customerName,
    id_card: data.idCard,
    address: data.address,
    savings_type: data.savingsType,
    initial_deposit: parseFloat(data.initialDeposit),
    open_date: data.openDate || new Date().toISOString().split("T")[0],
  });
};

/**
 * Tra cứu sổ tiết kiệm (BM4)
 * @param {string} keyword - Từ khóa tìm kiếm
 * @param {string} typeFilter - Lọc theo loại sổ
 * @param {string} statusFilter - Lọc theo trạng thái
 * @returns {Promise<Object>} Search results
 */
export const searchSavingBooks = async (
  keyword = "",
  typeFilter = "all",
  statusFilter = "all"
) => {
  if (USE_MOCK) {
    return mockSavingBookAdapter.searchSavingBooks(
      keyword,
      typeFilter,
      statusFilter
    );
  }
  return accountApi.searchSavingBooks(keyword, typeFilter, statusFilter);
};

/**
 * Lấy thông tin sổ tiết kiệm theo ID
 * @param {string} id - Mã sổ tiết kiệm
 * @returns {Promise<Object>} Saving book data
 */
export const getSavingBookById = async (id) => {
  if (!id) {
    throw new Error("Please enter account code");
  }
  if (USE_MOCK) {
    return mockSavingBookAdapter.getSavingBookById(id);
  }
  return accountApi.getSavingBookById(id);
};
