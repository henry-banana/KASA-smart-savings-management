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
export const buildDepositTransactionResponse = (transaction, savingBook, customer, employee) => ({
  message: "Deposit transaction completed successfully",
  success: true,
  data: {
    ...transaction,
    savingbook: savingBook ? {
      bookid: savingBook.bookid,
      customer: customer ? {
        customerid: customer.customerid,
        fullname: customer.fullname
      } : undefined
    } : undefined,
    employee: employee ? {
      employeeid: employee.employeeid,
      fullname: employee.fullname
    } : undefined
  }
});

export const buildWithdrawTransactionResponse = (transaction, savingBook, customer, typeSaving, employee) => ({
  message: "Withdrawal transaction completed successfully",
  success: true,
  data: {
    ...transaction,
    savingbook: savingBook ? {
      bookid: savingBook.bookid,
      customer: customer ? {
        customerid: customer.customerid,
        fullname: customer.fullname
      } : undefined,
      typesaving: typeSaving ? {
        typeName: typeSaving.typeName,
        maturitydate: savingBook.maturitydate
      } : undefined
    } : undefined,
    employee: employee ? {
      employeeid: employee.employeeid,
      fullname: employee.fullname
    } : undefined
  }
});

export const buildGetAllTransactionsResponse = (transactions) => ({
  message: "Transactions retrieved successfully",
  success: true,
  data: transactions,
  total: transactions.length
});

export const buildGetTransactionByIdResponse = (transaction, savingBook, customer, typeSaving, employee, role) => ({
  message: "Transaction retrieved successfully",
  success: true,
  data: {
    ...transaction,
    savingbook: savingBook ? {
      bookid: savingBook.bookid,
      customer: customer ? {
        customerid: customer.customerid,
        fullname: customer.fullname,
        citizenid: customer.citizenid
      } : undefined,
      typesaving: typeSaving ? {
        typeName: typeSaving.typeName,
        interestRate: typeSaving.interestRate
      } : undefined
    } : undefined,
    employee: employee ? {
      employeeid: employee.employeeid,
      fullname: employee.fullname,
      role: role?.rolename
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
  message: "Transactions retrieved successfully",
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
