import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  mockCustomerRepository,
  resetAllRepositoryMocks,
} from "../../mocks/repositories.mock.js";
import { createMockCustomer } from "../../helpers/testHelpers.js";

// Mock repository
jest.unstable_mockModule(
  "@src/repositories/Customer/CustomerRepository.js",
  () => ({
    customerRepository: mockCustomerRepository,
  })
);

const { customerService } = await import(
  "@src/services/Customer/customer.service.js"
);

describe("CustomerService - Unit Tests", () => {
  beforeEach(() => {
    resetAllRepositoryMocks();
  });

  describe("addCustomer()", () => {
    it("should add customer successfully with valid data", async () => {
      // === ARRANGE: Chuẩn bị data ===
      const validData = {
        fullName: "Nguyen Van A",
        citizenId: "001234567890",
        street: "123 Street",
        district: "District 1",
        province: "HCM",
      };

      const mockCustomer = {
        customerid: 1,
        fullname: "Nguyen Van A",
        citizenid: "001234567890",
        street: "123 Street",
        district: "District 1",
        province: "HCM",
      };

      // mock giá trị trả về cho create() của mock customer repo
      mockCustomerRepository.create.mockResolvedValue(mockCustomer);

      // === ACT: gọi hàm để test ===
      const result = await customerService.addCustomer(validData);

      // === ASSERT: kiểm tra giá trị trả về ===
      expect(result).toBeDefined();
      expect(result.message).toBe("Customer added successfully.");
      expect(result.customer).toEqual(mockCustomer);

      expect(mockCustomerRepository.create).toHaveBeenCalledTimes(1);

      expect(mockCustomerRepository.create).toHaveBeenCalledWith({
        fullname: "Nguyen Van A",
        citizenid: "001234567890",
        street: "123 Street",
        district: "District 1",
        province: "HCM",
      });
    });

      it("should throw error when fullName is missing", async () => {
        // === ARRANGE ===
        const invalidData = {
          // fullName missing
          citizenId: "001234567890",
          street: "123 Street",
          district: "District 1",
          province: "HCM",
        };

        // === ACT & ASSERT ===
        await expect(customerService.addCustomer(invalidData)).rejects.toThrow(
          "Missing required information."
        );

        // Verify repository was NOT called
        expect(mockCustomerRepository.create).not.toHaveBeenCalled();
      });

      it("should throw error when citizenId is missing", async () => {
        // === ARRANGE ===
        const invalidData = {
          fullName: "Nguyen Van A",
          // citizenId missing
          street: "123 Street",
          district: "District 1",
          province: "HCM",
        };

        // === ACT & ASSERT ===
        await expect(customerService.addCustomer(invalidData)).rejects.toThrow(
          "Missing required information."
        );
      });

      it("should throw error when street is missing", async () => {
        // === ARRANGE ===
        const invalidData = {
          fullName: "Nguyen Van A",
          citizenId: "001234567890",
          // street missing
          district: "District 1",
          province: "HCM",
        };

        // === ACT & ASSERT ===
        await expect(customerService.addCustomer(invalidData)).rejects.toThrow(
          "Missing required information."
        );
      });

      it("should throw error when district is missing", async () => {
        // === ARRANGE ===
        const invalidData = {
          fullName: "Nguyen Van A",
          citizenId: "001234567890",
          street: "123 Street",
          // district missing
          province: "HCM",
        };

        // === ACT & ASSERT ===
        await expect(customerService.addCustomer(invalidData)).rejects.toThrow(
          "Missing required information."
        );
      });

      it("should throw error when province is missing", async () => {
        // === ARRANGE ===
        const invalidData = {
          fullName: "Nguyen Van A",
          citizenId: "001234567890",
          street: "123 Street",
          district: "District 1",
          // province missing
        };

        // === ACT & ASSERT ===
        await expect(customerService.addCustomer(invalidData)).rejects.toThrow(
          "Missing required information."
        );
      });

      it("should handle database error gracefully", async () => {
        // === ARRANGE ===
        const validData = {
          fullName: "Nguyen Van A",
          citizenId: "001234567890",
          street: "123 Street",
          district: "District 1",
          province: "HCM",
        };

        mockCustomerRepository.create.mockRejectedValue(
          new Error("Database connection failed")
        );

        // === ACT & ASSERT ===
        await expect(customerService.addCustomer(validData)).rejects.toThrow(
          "Database connection failed"
        );
      });
    });

    describe("updateCustomer()", () => {
      it("should update customer successfully", async () => {
        // === ARRANGE ===
        const customerId = 1;
        const existingCustomer = createMockCustomer({ customerid: 1 });
        const updates = {
          fullName: "Nguyen Van B Updated",
          citizenId: "999888777666",
          street: "456 New Street",
          district: "District 2",
          province: "HCM",
        };

        mockCustomerRepository.findById.mockResolvedValue(existingCustomer);
        mockCustomerRepository.update.mockResolvedValue({
          ...existingCustomer,
          fullname: updates.fullName,
          citizenid: updates.citizenId,
          street: updates.street,
          district: updates.district,
          province: updates.province,
        });

        // === ACT ===
        const result = await customerService.updateCustomer(customerId, updates);

        // === ASSERT ===
        expect(result).toBeDefined();
        expect(result.message).toBe("Customer updated successfully.");
        expect(result.customer.fullname).toBe("Nguyen Van B Updated");

        expect(mockCustomerRepository.findById).toHaveBeenCalledWith(1);
        expect(mockCustomerRepository.update).toHaveBeenCalledWith(1, {
          fullname: "Nguyen Van B Updated",
          citizenid: "999888777666",
          street: "456 New Street",
          district: "District 2",
          province: "HCM",
        });
      });

      it("should throw error when customer not found", async () => {
        // === ARRANGE ===
        const customerId = 999;
        const updates = { fullName: "Updated Name" };

        mockCustomerRepository.findById.mockResolvedValue(null);

        // === ACT & ASSERT ===
        await expect(
          customerService.updateCustomer(customerId, updates)
        ).rejects.toThrow("Customer not found");

        // Verify update was NOT called
        expect(mockCustomerRepository.update).not.toHaveBeenCalled();
      });

      it("should handle partial updates", async () => {
        // === ARRANGE ===
        const customerId = 1;
        const existingCustomer = createMockCustomer({ customerid: 1 });
        const partialUpdates = {
          fullName: "New Name Only",
          // Other fields not provided
        };

        mockCustomerRepository.findById.mockResolvedValue(existingCustomer);
        mockCustomerRepository.update.mockResolvedValue({
          ...existingCustomer,
          fullname: "New Name Only",
        });

        // === ACT ===
        const result = await customerService.updateCustomer(
          customerId,
          partialUpdates
        );

        // === ASSERT ===
        expect(result.customer.fullname).toBe("New Name Only");
        expect(mockCustomerRepository.update).toHaveBeenCalledWith(1, {
          fullname: "New Name Only",
          citizenid: undefined,
          street: undefined,
          district: undefined,
          province: undefined,
        });
      });
    });

    describe("getAllCustomers()", () => {
      it("should return all customers", async () => {
        // === ARRANGE ===
        const mockCustomers = [
          createMockCustomer({ customerid: 1, fullname: "Customer 1" }),
          createMockCustomer({ customerid: 2, fullname: "Customer 2" }),
          createMockCustomer({ customerid: 3, fullname: "Customer 3" }),
        ];

        mockCustomerRepository.findAll.mockResolvedValue(mockCustomers);

        // === ACT ===
        const result = await customerService.getAllCustomers();

        // === ASSERT ===
        expect(result).toEqual(mockCustomers);
        expect(result).toHaveLength(3);
        expect(mockCustomerRepository.findAll).toHaveBeenCalledTimes(1);
      });

      it("should return empty array when no customers exist", async () => {
        // === ARRANGE ===
        mockCustomerRepository.findAll.mockResolvedValue([]);

        // === ACT ===
        const result = await customerService.getAllCustomers();

        // === ASSERT ===
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });

      it("should handle database error", async () => {
        // === ARRANGE ===
        mockCustomerRepository.findAll.mockRejectedValue(
          new Error("Database error")
        );

        // === ACT & ASSERT ===
        await expect(customerService.getAllCustomers()).rejects.toThrow(
          "Database error"
        );
      });
    });

    describe("getCustomerById()", () => {
      it("should return customer when id exists", async () => {
        // === ARRANGE ===
        const mockCustomer = createMockCustomer({
          customerid: 1,
          fullname: "Test Customer",
        });

        mockCustomerRepository.findById.mockResolvedValue(mockCustomer);

        // === ACT ===
        const result = await customerService.getCustomerById(1);

        // === ASSERT ===
        expect(result).toEqual(mockCustomer);
        expect(result.fullname).toBe("Test Customer");
        expect(mockCustomerRepository.findById).toHaveBeenCalledWith(1);
      });

      it("should throw error when customer not found", async () => {
        // === ARRANGE ===
        mockCustomerRepository.findById.mockResolvedValue(null);

        // === ACT & ASSERT ===
        await expect(customerService.getCustomerById(999)).rejects.toThrow(
          "Customer not found"
        );
      });

      it("should handle database error", async () => {
        // === ARRANGE ===
        mockCustomerRepository.findById.mockRejectedValue(
          new Error("Connection timeout")
        );

        // === ACT & ASSERT ===
        await expect(customerService.getCustomerById(1)).rejects.toThrow(
          "Connection timeout"
        );
      });
    });

    describe("deleteCustomer()", () => {
      it("should delete customer successfully", async () => {
        // === ARRANGE ===
        const customerId = 1;
        const mockCustomer = createMockCustomer({ customerid: 1 });

        mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
        mockCustomerRepository.delete.mockResolvedValue(mockCustomer);

        // === ACT ===
        const result = await customerService.deleteCustomer(customerId);

        // === ASSERT ===
        expect(result).toBeDefined();
        expect(result.message).toBe("Customer deleted successfully.");
        expect(mockCustomerRepository.findById).toHaveBeenCalledWith(1);
        expect(mockCustomerRepository.delete).toHaveBeenCalledWith(1);
      });

      it("should throw error when customer not found", async () => {
        // === ARRANGE ===
        mockCustomerRepository.findById.mockResolvedValue(null);

        // === ACT & ASSERT ===
        await expect(customerService.deleteCustomer(999)).rejects.toThrow(
          "Customer not found"
        );

        // Verify delete was NOT called
        expect(mockCustomerRepository.delete).not.toHaveBeenCalled();
      });

      it("should handle database error during deletion", async () => {
        // === ARRANGE ===
        const mockCustomer = createMockCustomer({ customerid: 1 });

        mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
        mockCustomerRepository.delete.mockRejectedValue(
          new Error("Foreign key constraint violation")
        );

        // === ACT & ASSERT ===
        await expect(customerService.deleteCustomer(1)).rejects.toThrow(
          "Foreign key constraint violation"
        );
      });
    });

    describe("searchCustomers()", () => {
      it("should search by customer ID (numeric keyword)", async () => {
        // === ARRANGE ===
        const keyword = "123";
        const mockCustomer = createMockCustomer({
          customerid: 123,
          fullname: "Customer 123",
        });

        mockCustomerRepository.findById.mockResolvedValue(mockCustomer);

        // === ACT ===
        const result = await customerService.searchCustomers(keyword);

        // === ASSERT ===
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(mockCustomer);
        expect(mockCustomerRepository.findById).toHaveBeenCalledWith("123");
      });

      it("should return empty array when ID not found", async () => {
        // === ARRANGE ===
        const keyword = "999";

        mockCustomerRepository.findById.mockResolvedValue(null);

        // === ACT ===
        const result = await customerService.searchCustomers(keyword);

        // === ASSERT ===
        expect(result).toEqual([]);
      });

      it("should search by name (text keyword)", async () => {
        // === ARRANGE ===
        const keyword = "Nguyen";
        const mockCustomers = [
          createMockCustomer({ fullname: "Nguyen Van A" }),
          createMockCustomer({ fullname: "Nguyen Thi B" }),
        ];

        mockCustomerRepository.findByName.mockResolvedValue(mockCustomers);

        // === ACT ===
        const result = await customerService.searchCustomers(keyword);

        // === ASSERT ===
        expect(result).toHaveLength(2);
        expect(result).toEqual(mockCustomers);
        expect(mockCustomerRepository.findByName).toHaveBeenCalledWith(keyword);
      });

      it("should return empty array when name not found", async () => {
        // === ARRANGE ===
        const keyword = "NonExistent";

        mockCustomerRepository.findByName.mockResolvedValue([]);

        // === ACT ===
        const result = await customerService.searchCustomers(keyword);

        // === ASSERT ===
        expect(result).toEqual([]);
      });

      it("should return empty array for empty keyword", async () => {
        // === ACT ===
        const result = await customerService.searchCustomers("");

        // === ASSERT ===
        expect(result).toEqual([]);
        expect(mockCustomerRepository.findById).not.toHaveBeenCalled();
        expect(mockCustomerRepository.findByName).not.toHaveBeenCalled();
      });

      it("should return empty array for null keyword", async () => {
        // === ACT ===
        const result = await customerService.searchCustomers(null);

        // === ASSERT ===
        expect(result).toEqual([]);
      });

      it("should distinguish between numeric and text keywords", async () => {
        // === ARRANGE - Numeric ===
        const numericKeyword = "456";
        mockCustomerRepository.findById.mockResolvedValue(
          createMockCustomer({ customerid: 456 })
        );

        // === ACT - Numeric ===
        const numericResult = await customerService.searchCustomers(
          numericKeyword
        );

        // === ASSERT - Numeric ===
        expect(mockCustomerRepository.findById).toHaveBeenCalledWith("456");
        expect(mockCustomerRepository.findByName).not.toHaveBeenCalled();

        // Reset mocks
        jest.clearAllMocks();

        // === ARRANGE - Text ===
        const textKeyword = "abc456"; // Contains non-numeric
        mockCustomerRepository.findByName.mockResolvedValue([]);

        // === ACT - Text ===
        const textResult = await customerService.searchCustomers(textKeyword);

        // === ASSERT - Text ===
        expect(mockCustomerRepository.findByName).toHaveBeenCalledWith("abc456");
        expect(mockCustomerRepository.findById).not.toHaveBeenCalled();
      });

      it("should handle database error during search", async () => {
        // === ARRANGE ===
        const keyword = "Test";

        mockCustomerRepository.findByName.mockRejectedValue(
          new Error("Database error")
        );

        // === ACT & ASSERT ===
        await expect(customerService.searchCustomers(keyword)).rejects.toThrow(
          "Database error"
        );
      });
  });
});
