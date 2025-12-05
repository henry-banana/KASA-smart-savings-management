import { USE_MOCK } from "@/config/app.config";
import { accountApi } from "@/api/accountApi";
import { mockTransactionAdapter } from "@/mocks/adapters/transactionAdapter";

/**
 * Lấy thông tin tài khoản
 * @param {string} accountCode - Mã sổ tiết kiệm
 * @returns {Promise<Object>} Account info
 */
export const getAccountInfo = async (accountCode) => {
  if (!accountCode) {
    throw new Error("Please enter account code");
  }

  if (USE_MOCK) {
    return mockTransactionAdapter.getAccountInfo(accountCode);
  } else {
    // Real API returns full savingbook object, need to convert to account info format
    const response = await accountApi.getAccount(accountCode);
    const savingBook = response.data || response;

    return {
      message: response.message || "Get account info successfully",
      success: response.success !== false,
      data: {
        bookId: savingBook.bookId,
        customerName: savingBook.customerName,
        accountTypeName: savingBook.typeSaving?.typeName || "Unknown",
        balance: savingBook.balance,
        openDate: savingBook.openDate,
        maturityDate: savingBook.maturityDate,
        interestRate: savingBook.typeSaving?.interestRate || 0,
        status: savingBook.status,
      },
    };
  }
};

/**
 * Gửi tiền (BM2)
 * @param {string} accountCode - Mã sổ tiết kiệm
 * @param {number} amount - Số tiền gửi
 * @returns {Promise<Object>} Transaction result
 */
export const depositMoney = async (accountCode, amount, employeeIdOverride) => {
  if (!accountCode || !amount || amount <= 0) {
    throw new Error("Invalid transaction information");
  }

  if (amount < 100000) {
    throw new Error("Minimum balance amount is 100,000 VND");
  }

  if (USE_MOCK) {
    return mockTransactionAdapter.depositMoney({ bookId: accountCode, amount });
  }
  // Real API requires employeeId; allow override
  const employeeId = employeeIdOverride || getCurrentUserId();
  return accountApi.deposit(accountCode, amount, employeeId);
};

/**
 * Rút tiền (BM3)
 * @param {string} accountCode - Mã sổ tiết kiệm
 * @param {number} amount - Số tiền rút
 * @param {boolean} shouldCloseAccount - Có đóng tài khoản không (cho sổ có kỳ hạn)
 * @returns {Promise<Object>} Transaction result
 */
export const withdrawMoney = async (
  accountCode,
  amount,
  shouldCloseAccount,
  employeeIdOverride
) => {
  if (!accountCode || !amount || amount <= 0) {
    throw new Error("Invalid transaction information");
  }

  if (USE_MOCK) {
    return mockTransactionAdapter.withdrawMoney({
      bookId: accountCode,
      amount,
      shouldCloseAccount,
    });
  }
  // Real API requires employeeId and optional shouldCloseAccount; allow override
  const employeeId = employeeIdOverride || getCurrentUserId();
  return accountApi.withdraw(
    accountCode,
    amount,
    shouldCloseAccount,
    employeeId
  );
};

/**
 * Tất toán sổ tiết kiệm (Close Savings Account)
 * @param {string} accountCode - Mã sổ tiết kiệm
 * @param {string} employeeIdOverride - Employee ID (optional)
 * @returns {Promise<Object>} Close account result with finalBalance, interest, status
 */
export const closeSavingAccount = async (accountCode, employeeIdOverride) => {
  if (!accountCode) {
    throw new Error("Account code is required");
  }

  if (USE_MOCK) {
    // Use withdraw with shouldCloseAccount for mock
    const accountInfo = await getAccountInfo(accountCode);
    return mockTransactionAdapter.withdrawMoney({
      bookId: accountCode,
      amount: accountInfo.data.balance,
      shouldCloseAccount: true,
    });
  }

  // Real API: Call POST /api/savingbook/{id}/close
  const employeeId = employeeIdOverride || getCurrentUserId();
  return accountApi.closeAccount(accountCode, employeeId);
};

/**
 * Get deposit transaction statistics by date for Transaction Statistics section
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Deposit statistics grouped by saving type
 */
export const getDepositTransactionStats = async (date) => {
  if (USE_MOCK) {
    return mockTransactionAdapter.getDepositTransactionStats(date);
  }
  // Fallback to mock until real API is wired
  console.warn(
    "Fallback to mock: deposit transaction stats API not implemented; using mock adapter"
  );
  return mockTransactionAdapter.getDepositTransactionStats(date);
};

/**
 * Get withdrawal transaction statistics by date for Transaction Statistics section
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Withdrawal statistics grouped by saving type
 */
export const getWithdrawalTransactionStats = async (date) => {
  if (USE_MOCK) {
    return mockTransactionAdapter.getWithdrawalTransactionStats(date);
  }
  // Fallback to mock until real API is wired
  console.warn(
    "Fallback to mock: withdrawal transaction stats API not implemented; using mock adapter"
  );
  return mockTransactionAdapter.getWithdrawalTransactionStats(date);
};

// Attempt to derive current user/employee ID from localStorage
function getCurrentUserId() {
  try {
    // Common storage keys that may hold the user object
    const candidates = ["user", "authUser", "currentUser"];
    for (const key of candidates) {
      const raw = localStorage.getItem(key);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj?.id || obj?.userId || obj?.employeeId) {
          return obj.id || obj.userId || obj.employeeId;
        }
      }
    }
    // Direct id keys
    return (
      localStorage.getItem("userId") ||
      localStorage.getItem("employeeId") ||
      undefined
    );
  } catch (_) {
    return undefined;
  }
}
