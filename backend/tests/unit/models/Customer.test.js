import { beforeEach, describe, expect, jest } from "@jest/globals";
import {
  createMockSupabaseClient,
  resetSupabaseMock,
  mockSuccessResponse,
  mockNotFoundResponse,
  mockErrorResponse,
} from "../../mocks/supabase.mock.js";
import { createMockCustomer } from "../../helpers/testHelpers.js";

const mockSupabase = createMockSupabaseClient();

jest.unstable_mockModule("@config/database.js", () => ({
  supabase: mockSupabase,
}));

// Import Customer AFTER mocking
const { Customer } = await import("../../../src/models/Customer.js");

describe("Customer Model - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetSupabaseMock(mockSupabase);
  });

  describe("Model Configuration", () => {
    it("should have correct table name", () => {
      expect(Customer.tableName).toBe("customer");
    });

    it("should have correct primary key", () => {
      expect(Customer.primaryKey).toBe("customerid");
    });

    it("should have correct citizen column name", () => {
      expect(Customer.citizenColumn).toBe("citizenid");
    });
  });

  describe("getById()", () => {
    it("should call supabase with correct parameters and return customer", async () => {
      // === ARRANGE ===
      const mockCustomer = createMockCustomer({ customerid: 1 });
      mockSupabase.single.mockResolvedValue(mockSuccessResponse(mockCustomer));

      // === ACT ===
      const result = await Customer.getById(1);

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("customer");
      expect(mockSupabase.select).toHaveBeenCalledWith("*");
      expect(mockSupabase.eq).toHaveBeenCalledWith("customerid", 1);
      expect(mockSupabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockCustomer);
    });

    it("should return null when customer not found", async () => {
      // === ARRANGE ===
      mockSupabase.single.mockResolvedValue(mockNotFoundResponse());

      // === ACT ===
      const result = await Customer.getById(999);

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("customer");
      expect(mockSupabase.eq).toHaveBeenCalledWith("customerid", 999);
      expect(result).toBeNull();
    });

    it("should throw error for database errors", async () => {
      // === ARRANGE ===
      mockSupabase.single.mockResolvedValue(
        mockErrorResponse("Database connection failed", "DBFAIL")
      );

      // === ACT & ASSERT ===
      await expect(Customer.getById(1)).rejects.toThrow("Get failed");
      expect(mockSupabase.from).toHaveBeenCalledWith("customer");
    });
  });

  describe("create()", () => {
    it("should create new customer successfully", async () => {
      // === ARRANGE ===
      const newCustomerData = createMockCustomer();
      const createdCustomer = { ...newCustomerData, customerid: 1 };

      mockSupabase.select.mockResolvedValue(
        mockSuccessResponse([createdCustomer])
      );

      // === ACT ===
      const result = await Customer.create(newCustomerData);

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("customer");
      expect(mockSupabase.insert).toHaveBeenCalledWith([newCustomerData]);
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result).toEqual(createdCustomer);
    });

    it("should throw error when creation fails", async () => {
      // === ARRANGE ===
      const newCustomerData = createMockCustomer();
      mockSupabase.select.mockResolvedValue(
        mockErrorResponse("Duplicate citizen ID", "23505")
      );

      // === ACT & ASSERT ===
      await expect(Customer.create(newCustomerData)).rejects.toThrow();
    });
  });

  describe("update()", () => {
    it("should update customer successfully", async () => {
      // === ARRANGE ===
      const customerId = 1;
      const updates = { fullname: "Updated Name" };
      const updatedCustomer = createMockCustomer({
        customerid: customerId,
        ...updates,
      });

      mockSupabase.select.mockResolvedValue(
        mockSuccessResponse([updatedCustomer])
      );

      // === ACT ===
      const result = await Customer.update(customerId, updates);

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("customer");
      expect(mockSupabase.update).toHaveBeenCalledWith(updates);
      expect(mockSupabase.eq).toHaveBeenCalledWith("customerid", customerId);
      expect(result).toEqual(updatedCustomer);
    });

    it("should return null when customer not found", async () => {
      // === ARRANGE ===
      mockSupabase.select.mockResolvedValue(mockSuccessResponse([]));

      // === ACT ===
      const result = await Customer.update(999, { fullname: "Test" });

      // === ASSERT ===
      expect(result).toBeNull();
    });
  });

  describe("delete()", () => {
    it("should delete customer successfully", async () => {
      // === ARRANGE ===
      const customerId = 1;
      const deletedCustomer = createMockCustomer({ customerid: customerId });

      mockSupabase.select.mockResolvedValue(
        mockSuccessResponse([deletedCustomer])
      );

      // === ACT ===
      const result = await Customer.delete(customerId);

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("customer");
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith("customerid", customerId);
      expect(result).toEqual(deletedCustomer);
    });

    it("should return null when customer not found", async () => {
      // === ARRANGE ===
      mockSupabase.select.mockResolvedValue(mockSuccessResponse([]));

      // === ACT ===
      const result = await Customer.delete(999);

      // === ASSERT ===
      expect(result).toBeNull();
    });
  });

  describe("getAll()", () => {
    it("should return all customers", async () => {
      // === ARRANGE ===
      const mockCustomers = [
        createMockCustomer({ customerid: 1 }),
        createMockCustomer({ customerid: 2 }),
        createMockCustomer({ customerid: 3 }),
      ];

      mockSupabase.select.mockResolvedValue(mockSuccessResponse(mockCustomers));

      // === ACT ===
      const result = await Customer.getAll();

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("customer");
      expect(mockSupabase.select).toHaveBeenCalledWith("*");
      expect(result).toEqual(mockCustomers);
      expect(result).toHaveLength(3);
    });

    it("should return empty array when no customers exist", async () => {
      // === ARRANGE ===
      mockSupabase.select.mockResolvedValue(mockSuccessResponse([]));

      // === ACT ===
      const result = await Customer.getAll();

      // === ASSERT ===
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should apply filters when provided", async () => {
      // === ARRANGE ===
      const filters = { province: "HCM" };
      const mockCustomers = [createMockCustomer({ province: "HCM" })];
      const response = mockSuccessResponse(mockCustomers);

      // Tạo một mock query object có thể chain và trả về promise
      const mockQueryChain = {
        eq: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => {
          // Khi await, trả về response đúng định dạng
          resolve(response);
          return Promise.resolve(response);
        }),
      };

      // Mock select trả về mockQueryChain thay vì mockSupabase
      mockSupabase.select.mockReturnValue(mockQueryChain);

      // === ACT ===
      const result = await Customer.getAll(filters);

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("customer");
      expect(mockSupabase.select).toHaveBeenCalledWith("*");
      expect(mockQueryChain.eq).toHaveBeenCalledWith("province", "HCM");
      expect(result).toEqual(mockCustomers);
    });
  });
});