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
  message: "Customer added successfully",
  success: true,
  data: customer
});

export const buildGetAllCustomersResponse = (customers) => ({
  message: "Customers retrieved successfully",
  success: true,
  data: customers,
  total: customers.length
});

export const buildGetCustomerByIdResponse = (customer) => ({
  message: "Customer retrieved successfully",
  success: true,
  data: customer
});

export const buildUpdateCustomerResponse = (customer) => ({
  message: "Customer updated successfully",
  success: true,
  data: customer
});

export const buildDeleteCustomerResponse = () => ({
  message: "Customer deleted successfully",
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
