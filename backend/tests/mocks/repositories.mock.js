import { jest } from "@jest/globals";

export const mockCustomerRepository = {
  findById: jest.fn(),
  findByCitizenID: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByName: jest.fn(),
};

export function resetAllRepositoryMocks() {
  Object.values(mockCustomerRepository).forEach((fn) => fn.mockReset());
}

export function setupSuccessfulMocks() {
  // Customer
  mockCustomerRepository.findById.mockResolvedValue({
    customerid: 1,
    fullname: "Test Customer",
    citizenid: "123456789012",
    street: "Vo Van Ngan",
    district: "Thu Duc",
    province: "Ho Chi Minh",
  });

  mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
  mockCustomerRepository.findByCitizenID.mockResolvedValue(mockCustomer);
  mockCustomerRepository.findAll.mockResolvedValue([mockCustomer]);
  mockCustomerRepository.create.mockResolvedValue(mockCustomer);
  mockCustomerRepository.update.mockResolvedValue(mockCustomer);
  mockCustomerRepository.delete.mockResolvedValue(true);
  mockCustomerRepository.findByName.mockResolvedValue([mockCustomer]);
}

export function setupErrorMocks(errorMessage = "Database error") {
  Object.values(mockCustomerRepository).forEach((fn) => 
    fn.mockRejectedValue(new Error(errorMessage))
  );
}
