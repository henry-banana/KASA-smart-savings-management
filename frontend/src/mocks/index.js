/**
 * Centralized Mock Data Export
 * 
 * IMPORTANT: Response structure vs Data
 * - responses/ = Response TEMPLATES + Builder functions (no hardcoded data)
 * - data/ = Actual mock data entities
 * 
 * Usage:
 * ```js
 * import { mockCustomers, buildGetAllCustomersResponse } from '@/mocks';
 * const response = buildGetAllCustomersResponse(mockCustomers);
 * ```
 */

// ==================== RESPONSE TEMPLATES & BUILDERS ====================
// These export BUILDER FUNCTIONS to create responses from data

// Auth
export { default as authResponses, buildLoginSuccessResponse } from './responses/auth.responses.js';

// Customer
export { 
  default as customerResponses,
  buildAddCustomerResponse,
  buildGetAllCustomersResponse,
  buildGetCustomerByIdResponse,
  buildUpdateCustomerResponse,
  buildDeleteCustomerResponse
} from './responses/customer.responses.js';

// SavingBook
export {
  default as savingBookResponses,
  buildAddSavingBookResponse,
  buildGetSavingBookByIdResponse,
  buildUpdateSavingBookResponse,
  buildDeleteSavingBookResponse,
  buildCloseSavingBookResponse
} from './responses/savingBook.responses.js';

// Transaction
export {
  default as transactionResponses,
  buildDepositTransactionResponse,
  buildWithdrawTransactionResponse,
  buildGetAllTransactionsResponse,
  buildGetTransactionByIdResponse,
  buildUpdateTransactionResponse,
  buildDeleteTransactionResponse,
  buildGetTransactionsByBookIdResponse
} from './responses/transaction.responses.js';

// TypeSaving
export {
  default as typeSavingResponses,
  buildCreateTypeSavingResponse,
  buildGetAllTypeSavingsResponse,
  buildGetTypeSavingByIdResponse,
  buildUpdateTypeSavingResponse,
  buildDeleteTypeSavingResponse
} from './responses/typeSaving.responses.js';

// Reports (đề xuất cho backend - backend chưa có)
export { default as dailyReportResponses, buildDailyReportResponse } from './responses/dailyReport.responses.js';
export { default as monthlyReportResponses, buildMonthlyReportResponse } from './responses/monthlyReport.responses.js';
export { default as customerReportResponses, buildCustomerSummaryResponse } from './responses/customerReport.responses.js';
export { default as interestReportResponses, buildInterestReportResponse } from './responses/interestReport.responses.js';
export { default as transactionRangeReportResponses, buildTransactionRangeReportResponse } from './responses/transactionRangeReport.responses.js';

// Regulations (QĐ6)
export {
  default as regulationResponses,
  buildGetRegulationsResponse,
  buildUpdateRegulationsResponse,
  buildRegulationErrorResponse
} from './responses/regulation.responses.js';

// Profile (Current User)
export {
  default as profileResponses,
  buildGetProfileResponse,
  buildUpdateProfileResponse,
  buildChangePasswordSuccessResponse,
  buildProfileErrorResponse
} from './responses/profile.responses.js';

// ==================== MOCK DATA ENTITIES ====================
// Base data entities matching database schema - USE THESE FOR ACTUAL DATA

export { 
  mockCustomers,
  findCustomerById,
  findCustomerByIdCard,
  addCustomer,
  updateCustomer,
  deleteCustomer
} from './data/customers.js';

export {
  mockTypeSavings,
  findTypeSavingById,
  findTypeSavingByName,
  addTypeSaving,
  updateTypeSaving,
  deleteTypeSaving
} from './data/typeSavings.js';

export {
  mockSavingBooks,
  findSavingBookById,
  findSavingBooksByCustomer,
  findSavingBooksByType,
  findActiveSavingBooks,
  addSavingBook,
  updateSavingBook,
  updateSavingBookBalance,
  closeSavingBook,
  deleteSavingBook
} from './data/savingBooks.js';

export {
  mockTransactions,
  findTransactionById,
  findTransactionsByBookId,
  findTransactionsByType,
  findTransactionsByDateRange,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  generateTransactionId
} from './data/transactions.js';

export {
  mockEmployees,
  mockRoles,
  findEmployeeById,
  findEmployeesByRole,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  findRoleById,
  findRoleByName
} from './data/employees.js';

export {
  mockUserAccounts,
  findUserByUsername,
  findUserByCredentials,
  updateLastLogin,
  addUserAccount,
  updateUserPassword,
  deleteUserAccount
} from './data/users.js';

export {
  getRegulations,
  updateRegulations
} from './data/regulations.js';

export {
  currentUserProfile,
  getCurrentProfile,
  updateCurrentProfile,
  setCurrentUser
} from './data/profile.js';

// ==================== ADAPTERS ====================
// API adapters for transforming between frontend and backend formats

export * from './adapters/authAdapter.js';
export * from './adapters/accountAdapter.js';
export * from './adapters/savingBookAdapter.js';
export * from './adapters/transactionAdapter.js';
export * from './adapters/reportAdapter.js';
export * from './adapters/userAdapter.js';
export * from './adapters/regulationAdapter.js';
export * from './adapters/profileAdapter.js';


