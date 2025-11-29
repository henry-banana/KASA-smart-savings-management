/**
 * Response structure templates for Transaction API
 * Based on backend/src/controllers/Transaction/transaction.controller.js
 * Endpoints:
 * - POST /api/transaction/add
 * - GET /api/transaction
 * - GET /api/transaction/:id
 * - PUT /api/transaction/:id
 * - DELETE /api/transaction/:id
 * 
 * Note: Use builder functions to create responses with actual data from data/
 */

/**
 * Builder functions - inject data here
 */

// Canonical builder for Deposit response (OpenAPI contract)
export const buildDepositTransactionResponse = (transaction, savingBook, employee) => ({
  message: "Deposit successfully",
  success: true,
  data: {
    transactionId: transaction.transactionId,
    bookId: transaction.bookId,
    type: "Deposit",
    amount: transaction.amount,
    balanceBefore: transaction.balanceBefore,
    balanceAfter: transaction.balanceAfter,
    transactionDate: transaction.transactionDate,
    savingBook: savingBook ? {
      bookId: savingBook.bookId,
      citizenId: savingBook.citizenId,
      customerName: savingBook.customerName,
      typeSavingId: savingBook.typeSavingId,
      openDate: savingBook.openDate,
      maturityDate: savingBook.maturityDate,
      balance: savingBook.balance,
      status: savingBook.status
    } : undefined,
    employee: employee ? {
      employeeId: employee.employeeId,
      fullName: employee.fullName,
      roleName: employee.roleName
    } : undefined
  }
});


// Canonical builder for Withdraw response (OpenAPI contract)
export const buildWithdrawTransactionResponse = (transaction, savingBook, employee) => ({
  message: "Withdraw successfully",
  success: true,
  data: {
    transactionId: transaction.transactionId,
    bookId: transaction.bookId,
    type: "Withdraw",
    amount: transaction.amount,
    balanceBefore: transaction.balanceBefore,
    balanceAfter: transaction.balanceAfter,
    transactionDate: transaction.transactionDate,
    savingBook: savingBook ? {
      bookId: savingBook.bookId,
      citizenId: savingBook.citizenId,
      customerName: savingBook.customerName,
      typeSavingId: savingBook.typeSavingId,
      openDate: savingBook.openDate,
      maturityDate: savingBook.maturityDate,
      balance: savingBook.balance,
      status: savingBook.status
    } : undefined,
    employee: employee ? {
      employeeId: employee.employeeId,
      fullName: employee.fullName,
      roleName: employee.roleName
    } : undefined
  }
});


// Canonical builder for GET all transactions
export const buildGetAllTransactionsResponse = (transactions) => ({
  message: "Get transaction successfully",
  success: true,
  data: transactions,
  total: transactions.length
});


// Canonical builder for GET transaction by ID
export const buildGetTransactionByIdResponse = (transaction, savingBook, employee) => ({
  message: "Get transaction successfully",
  success: true,
  data: {
    transactionId: transaction.transactionId,
    bookId: transaction.bookId,
    type: transaction.type,
    amount: transaction.amount,
    balanceBefore: transaction.balanceBefore,
    balanceAfter: transaction.balanceAfter,
    transactionDate: transaction.transactionDate,
    savingBook: savingBook ? {
      bookId: savingBook.bookId,
      citizenId: savingBook.citizenId,
      customerName: savingBook.customerName,
      typeSavingId: savingBook.typeSavingId,
      openDate: savingBook.openDate,
      maturityDate: savingBook.maturityDate,
      balance: savingBook.balance,
      status: savingBook.status
    } : undefined,
    employee: employee ? {
      employeeId: employee.employeeId,
      fullName: employee.fullName,
      roleName: employee.roleName
    } : undefined
  }
});


export const buildUpdateTransactionResponse = (transaction) => ({
  message: "Transaction updated successfully",
  success: true,
  data: transaction
});


export const buildDeleteTransactionResponse = () => ({
  message: "Transaction deleted successfully",
  success: true
});


export const buildGetTransactionsByBookIdResponse = (transactions) => ({
  message: "Get transaction successfully",
  success: true,
  data: transactions,
  total: transactions.length
});

/**
 * Error response templates (no data needed)
 */
export const transactionResponseTemplates = {
  addMissingFields: {
    message: "Missing required fields",
    success: false
  },

  addInvalidAmount: {
    message: "Amount must be greater than 0",
    success: false
  },

  addSavingBookNotFound: {
    message: "Saving book not found",
    success: false
  },

  addInsufficientBalance: {
    message: "Insufficient balance for withdrawal",
    success: false
  },

  addBookClosed: {
    message: "Cannot perform transaction on a closed saving book",
    success: false
  },

  getByIdNotFound: {
    message: "Transaction not found",
    success: false
  },

  updateNotFound: {
    message: "Transaction not found",
    success: false
  },

  updateCompleted: {
    message: "Cannot update a completed transaction",
    success: false
  },

  deleteNotFound: {
    message: "Transaction not found",
    success: false
  },

  deleteCompleted: {
    message: "Cannot delete a completed transaction",
    success: false
  },

  serverError: {
    message: "Internal server error",
    success: false
  }
};

export default {
  buildDepositTransactionResponse,
  buildWithdrawTransactionResponse,
  buildGetAllTransactionsResponse,
  buildGetTransactionByIdResponse,
  buildUpdateTransactionResponse,
  buildDeleteTransactionResponse,
  buildGetTransactionsByBookIdResponse,
  ...transactionResponseTemplates
};
