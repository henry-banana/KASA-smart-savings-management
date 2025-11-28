const { mockCustomerRepository, resetAllMocks } = require("./__mocks__/serviceDependencies.js");

jest.mock("../../src/repositories/Customer/CustomerRepository.js", () => ({
  customerRepository: mockCustomerRepository
}));

const { customerService } = require("../../src/services/Customer/customer.service.js");

describe("CustomerService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it("adds customer", async () => {
    mockCustomerRepository.create.mockResolvedValue({ customerid: 1 });

    const payload = {
      fullName: "Jane",
      citizenId: "123456789",
      street: "1 Street",
      district: "D1",
      province: "HCM"
    };

    const result = await customerService.addCustomer(payload);

    expect(mockCustomerRepository.create).toHaveBeenCalledWith({
      fullname: "Jane",
      citizenid: "123456789",
      street: "1 Street",
      district: "D1",
      province: "HCM"
    });
    expect(result.customer.customerid).toBe(1);
  });

  it("updates customer and handles missing record", async () => {
    mockCustomerRepository.findById
      .mockResolvedValueOnce({ customerid: 1 })
      .mockResolvedValueOnce(null);

    mockCustomerRepository.update.mockResolvedValue({ fullname: "Updated" });

    const updates = {
      fullName: "Updated",
      citizenId: "99",
      street: "A",
      district: "B",
      province: "C"
    };

    const response = await customerService.updateCustomer(1, updates);
    expect(response.customer.fullname).toBe("Updated");
    await expect(customerService.updateCustomer(2, updates)).rejects.toThrow("Customer not found");
  });

  it("searches by ID and name", async () => {
    mockCustomerRepository.findById.mockResolvedValue({ id: 1 });
    const byId = await customerService.searchCustomers("12");
    expect(mockCustomerRepository.findById).toHaveBeenCalledWith("12");
    expect(byId).toEqual([{ id: 1 }]);

    mockCustomerRepository.findById.mockResolvedValue(null);
    expect(await customerService.searchCustomers("34")).toEqual([]);

    mockCustomerRepository.findByName.mockResolvedValue([{ fullname: "Alice" }]);
    const byName = await customerService.searchCustomers("Alice");
    expect(mockCustomerRepository.findByName).toHaveBeenCalledWith("Alice");
    expect(byName).toEqual([{ fullname: "Alice" }]);
  });

  it("throws when required data missing on add", async () => {
    await expect(
      customerService.addCustomer({ fullName: "OnlyName" })
    ).rejects.toThrow("Missing required information.");
  });

  it("returns all customers", async () => {
    mockCustomerRepository.findAll.mockResolvedValue([{ id: 1 }]);
    const customers = await customerService.getAllCustomers();
    expect(customers).toEqual([{ id: 1 }]);
  });

  it("gets customer by id and throws if not found", async () => {
    mockCustomerRepository.findById.mockResolvedValue({ id: 2 });
    expect(await customerService.getCustomerById(2)).toEqual({ id: 2 });

    mockCustomerRepository.findById.mockResolvedValue(null);
    await expect(customerService.getCustomerById(3)).rejects.toThrow("Customer not found");
  });

  it("deletes customer when exists", async () => {
    mockCustomerRepository.findById.mockResolvedValue({ id: 5 });
    await customerService.deleteCustomer(5);
    expect(mockCustomerRepository.delete).toHaveBeenCalledWith(5);
  });

  it("throws when deleting missing customer", async () => {
    mockCustomerRepository.findById.mockResolvedValue(null);
    await expect(customerService.deleteCustomer(6)).rejects.toThrow("Customer not found");
  });

  it("returns empty array when keyword blank", async () => {
    const result = await customerService.searchCustomers("");
    expect(result).toEqual([]);
    expect(mockCustomerRepository.findById).not.toHaveBeenCalled();
  });
});

