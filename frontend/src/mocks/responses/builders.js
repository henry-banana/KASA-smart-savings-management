/**
 * Response Builders - Utils for constructing API responses
 * 
 * These functions help build consistent API responses from mock data entities.
 * Import data from data/ and use these builders to create responses.
 * 
 * Example:
 * ```js
 * import { mockCustomers } from '../data/customers.js';
 * import { buildGetAllCustomersResponse } from './builders/customer.builders.js';
 * 
 * const response = buildGetAllCustomersResponse(mockCustomers);
 * ```
 */

import { mockCustomers, findCustomerById } from '../data/customers.js';
import { mockEmployees, mockRoles, findEmployeeById } from '../data/employees.js';

/**
 * Customer Response Builders
 */
export const buildAddCustomerResponse = (customer) => ({
  message: "Customer added successfully",
  success: true,
  data: customer
});

export const buildGetAllCustomersResponse = (customers = mockCustomers) => ({
  message: "Customers retrieved successfully",
  success: true,
  data: customers,
  total: customers.length
});

export const buildGetCustomerByIdResponse = (customerId) => {
  const customer = findCustomerById(customerId);
  if (!customer) {
    return {
      message: "Customer not found",
      success: false
    };
  }
  return {
    message: "Customer retrieved successfully",
    success: true,
    data: customer
  };
};

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
 * Auth Response Builders
 */
export const buildLoginSuccessResponse = (userid) => {
  const user = mockEmployees.find(emp => {
    // Find employee by matching with userid
    return true; // Simplified for now
  });
  
  const employee = findEmployeeById(user?.employeeid || 'EMP001');
  const role = mockRoles.find(r => r.roleid === employee?.roleid);
  
  return {
    message: "Login successful",
    success: true,
    roleName: role?.rolename || "Unknown"
  };
};

export default {
  // Customer
  buildAddCustomerResponse,
  buildGetAllCustomersResponse,
  buildGetCustomerByIdResponse,
  buildUpdateCustomerResponse,
  buildDeleteCustomerResponse,
  
  // Auth
  buildLoginSuccessResponse
};
