/**
 * Response structure templates for TypeSaving API
 * Based on backend/src/controllers/TypeSaving/typeSaving.controller.js
 * Endpoints:
 * - POST /api/typesaving
 * - GET /api/typesaving
 * - GET /api/typesaving/:id
 * - PUT /api/typesaving/:id
 * - DELETE /api/typesaving/:id
 * 
 * Note: Use builder functions to create responses with actual data from data/
 */

/**
 * Builder functions - inject data here
 */
export const buildCreateTypeSavingResponse = (typeSaving) => ({
  message: "Created successfully",
  success: true,
  data: typeSaving
});

export const buildGetAllTypeSavingsResponse = (typeSavings) => ({
  message: "Get type savings successfully",
  success: true,
  data: typeSavings,
  total: typeSavings.length
});

export const buildGetTypeSavingByIdResponse = (typeSaving, statistics) => ({
  message: "Get type saving successfully",
  success: true,
  data: {
    ...typeSaving,
    // Optional statistics
    ...(statistics && {
      totalActiveSavingBooks: statistics.totalActiveSavingBooks,
      totalDeposits: statistics.totalDeposits
    })
  }
});

export const buildUpdateTypeSavingResponse = (typeSaving) => ({
  message: "Update type saving successfully",
  success: true,
  data: typeSaving
});

export const buildDeleteTypeSavingResponse = () => ({
  message: "Delete type saving successfully",
  success: true
});

/**
 * Error response templates (no data needed)
 */
export const typeSavingResponseTemplates = {
  createMissingFields: {
    message: "Missing required fields",
    success: false
  },

  createDuplicateName: {
    message: "Type saving with this name already exists",
    success: false
  },

  createInvalidInterestRate: {
    message: "Interest rate must be between 0 and 1",
    success: false
  },

  getByIdNotFound: {
    message: "Type saving not found",
    success: false
  },

  updateNotFound: {
    message: "Type saving not found",
    success: false
  },

  updateInvalidInterestRate: {
    message: "Interest rate must be between 0 and 1",
    success: false
  },

  deleteNotFound: {
    message: "Type saving not found",
    success: false
  },

  deleteHasActiveSavingBooks: {
    message: "Cannot delete type saving with active saving books",
    success: false
  },

  serverError: {
    error: "Internal server error"
  }
};

export default {
  buildCreateTypeSavingResponse,
  buildGetAllTypeSavingsResponse,
  buildGetTypeSavingByIdResponse,
  buildUpdateTypeSavingResponse,
  buildDeleteTypeSavingResponse,
  ...typeSavingResponseTemplates
};
