/**
 * Response structure templates for Customer API
 * Based on backend/src/controllers/Customer/customer.controller.js
 * Endpoints:
 * - POST /api/customer/add
 * - GET /api/customer
 * - GET /api/customer/:id
 * - PUT /api/customer/:id
 * - DELETE /api/customer/:id
 * 
 * Note: Use builder functions to create responses with actual data from data/customers.js
 */

/**
 * Builder functions - inject actual data here
 */
export const buildAddCustomerResponse = (customer) => ({
  message: "Create customer successfully",
  success: true,
  data: customer
});

export const buildGetAllCustomersResponse = (customers) => ({
  message: "Get customers successfully",
  success: true,
  data: customers,
  total: customers.length
});

export const buildGetCustomerByIdResponse = (customer) => ({
  message: "Get customer successfully",
  success: true,
  data: customer
});

export const buildUpdateCustomerResponse = (customer) => ({
  message: "Update customer successfully",
  success: true,
  data: customer
});

export const buildDeleteCustomerResponse = () => ({
  message: "Delete customer successfully",
  success: true
});

/**
 * Error response templates (no data injection needed)
 */
export const customerResponseTemplates = {
  addMissingFields: {
    message: "Missing required fields",
    success: false
  },

  addDuplicateCitizenId: {
    message: "Customer with this citizen ID already exists",
    success: false
  },

  // Backward compatibility
  addDuplicateIdCard: {
    message: "Customer with this ID card already exists",
    success: false
  },

  getByIdNotFound: {
    message: "Customer not found",
    success: false
  },

  updateNotFound: {
    message: "Customer not found",
    success: false
  },

  deleteNotFound: {
    message: "Customer not found",
    success: false
  },

  deleteHasActiveSavingBooks: {
    message: "Cannot delete customer with active saving books",
    success: false
  },

  serverError: {
    message: "Internal server error",
    success: false
  }
};

export default {
  buildAddCustomerResponse,
  buildGetAllCustomersResponse,
  buildGetCustomerByIdResponse,
  buildUpdateCustomerResponse,
  buildDeleteCustomerResponse,
  ...customerResponseTemplates
};
