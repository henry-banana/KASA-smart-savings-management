/**
 * Response structure templates for SavingBook API
 * Based on backend/src/controllers/SavingBook/savingBook.controller.js
 * Endpoints:
 * - POST /api/savingbook/add
 * - GET /api/savingbook/:id
 * - PUT /api/savingbook/:id
 * - DELETE /api/savingbook/:id
 * 
 * Note: Use builder functions to create responses with actual data from data/
 */

/**
 * Builder functions - inject data here
 */

// Canonical builder for Add SavingBook response
export const buildAddSavingBookResponse = (savingBook, typeSaving) => ({
  message: "Create saving book successfully",
  success: true,
  data: {
    bookId: savingBook.bookId,
    citizenId: savingBook.citizenId,
    customerName: savingBook.customerName,
    typeSavingId: savingBook.typeSavingId,
    openDate: savingBook.openDate,
    maturityDate: savingBook.maturityDate,
    balance: savingBook.balance,
    status: savingBook.status,
    typeSaving: typeSaving ? {
      typeSavingId: typeSaving.typeSavingId,
      typeName: typeSaving.typeName,
      term: typeSaving.term,
      interestRate: typeSaving.interestRate
    } : undefined,
    transactions: [] // mock-extension: empty on create
  }
});


// Canonical builder for Get SavingBook by ID response
export const buildGetSavingBookByIdResponse = (savingBook, typeSaving, transactions) => ({
  message: "Get saving book successfully",
  success: true,
  data: {
    bookId: savingBook.bookId,
    citizenId: savingBook.citizenId,
    customerName: savingBook.customerName,
    typeSavingId: savingBook.typeSavingId,
    openDate: savingBook.openDate,
    maturityDate: savingBook.maturityDate,
    balance: savingBook.balance,
    status: savingBook.status,
    typeSaving: typeSaving ? {
      typeSavingId: typeSaving.typeSavingId,
      typeName: typeSaving.typeName,
      term: typeSaving.term,
      interestRate: typeSaving.interestRate
    } : undefined,
    transactions: transactions || []
  }
});


export const buildUpdateSavingBookResponse = (savingBook, typeSaving) => ({
  message: "Update saving book successfully",
  success: true,
  data: {
    bookId: savingBook.bookId,
    citizenId: savingBook.citizenId,
    customerName: savingBook.customerName,
    typeSavingId: savingBook.typeSavingId,
    openDate: savingBook.openDate,
    maturityDate: savingBook.maturityDate,
    balance: savingBook.balance,
    status: savingBook.status,
    typeSaving: typeSaving ? {
      typeSavingId: typeSaving.typeSavingId,
      typeName: typeSaving.typeName,
      term: typeSaving.term,
      interestRate: typeSaving.interestRate
    } : undefined
  }
});


export const buildDeleteSavingBookResponse = () => ({
  message: "Delete saving book successfully",
  success: true
});


export const buildCloseSavingBookResponse = (bookId, finalBalance, interest) => ({
  message: "Close saving book successfully",
  success: true,
  data: {
    bookId,
    finalBalance,
    interest,
    status: "closed"
  }
});

/**
 * Error response templates (no data needed)
 */
export const savingBookResponseTemplates = {
  addMissingFields: {
    message: "Missing required fields",
    success: false
  },

  addCustomerNotFound: {
    message: "Customer not found",
    success: false
  },

  addTypeSavingNotFound: {
    message: "Type saving not found",
    success: false
  },

  addInsufficientDeposit: {
    message: "Initial deposit is below minimum required amount",
    success: false
  },

  getByIdNotFound: {
    message: "Saving book not found",
    success: false
  },

  updateNotFound: {
    message: "Saving book not found",
    success: false
  },

  updateClosedBook: {
    message: "Cannot update a closed saving book",
    success: false
  },

  deleteNotFound: {
    message: "Saving book not found",
    success: false
  },

  deleteHasBalance: {
    message: "Cannot delete saving book with remaining balance",
    success: false
  },

  closeNotMatured: {
    message: "Saving book has not reached maturity date",
    success: false
  },

  serverError: {
    message: "Internal server error",
    success: false
  }
};

export default {
  buildAddSavingBookResponse,
  buildGetSavingBookByIdResponse,
  buildUpdateSavingBookResponse,
  buildDeleteSavingBookResponse,
  buildCloseSavingBookResponse,
  ...savingBookResponseTemplates
};
