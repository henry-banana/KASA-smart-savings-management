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
export const buildAddSavingBookResponse = (savingBook, typeSaving) => ({
  message: "Saving book created successfully",
  success: true,
  data: {
    ...savingBook,
    typesaving: typeSaving ? {
      typeSavingId: typeSaving.typeSavingId,
      typeName: typeSaving.typeName,
      term: typeSaving.term,
      interestRate: typeSaving.interestRate,
      minimumDeposit: typeSaving.minimumDeposit
    } : undefined
  }
});

export const buildGetSavingBookByIdResponse = (savingBook, typeSaving, transactions) => ({
  message: "Saving book retrieved successfully",
  success: true,
  data: {
    ...savingBook,
    typesaving: typeSaving ? {
      typeSavingId: typeSaving.typeSavingId,
      typeName: typeSaving.typeName,
      term: typeSaving.term,
      interestRate: typeSaving.interestRate
    } : undefined,
    transactions: transactions || []
  }
});

export const buildUpdateSavingBookResponse = (savingBook) => ({
  message: "Saving book updated successfully",
  success: true,
  data: savingBook
});

export const buildDeleteSavingBookResponse = () => ({
  message: "Saving book deleted successfully",
  success: true
});

export const buildCloseSavingBookResponse = (bookId, finalBalance, interest) => ({
  message: "Saving book closed successfully",
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
