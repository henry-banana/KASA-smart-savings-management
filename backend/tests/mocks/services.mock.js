import { jest } from "@jest/globals";

export const mockCustomerService = {
  addCustomer: jest.fn(),
  updateCustomer: jest.fn(),
  getAllCustomers: jest.fn(),
  getCustomerById: jest.fn(),
  deleteCustomer: jest.fn(),
  searchCustomers: jest.fn(),
}

export function resetAllServiceMocks() {
  Object.values(mockCustomerService).forEach((fn) => fn.mockReset());
}