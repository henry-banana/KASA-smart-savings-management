import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
} from "../../helpers/testHelpers.js";
import { mockCustomerService } from "../../mocks/services.mock.js";

// Mock Customer Service
jest.unstable_mockModule("@src/services/Customer/customer.service.js", () => ({
  customerService: mockCustomerService,
}));

const {
  addCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomer,
  getCustomerByCitizenId,
} = await import("../../../src/controllers/Customer/customer.controller.js");

describe("CustomerController - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addCustomer()", () => {
    it("should add customer successfully with status 201", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        body: {
          fullName: "Nguyen Van A",
          citizenId: "001234567890",
          street: "123 Street",
          district: "District 1",
          province: "HCM",
        },
      });
      const res = createMockResponse();

      const mockResult = {
        message: "Customer added successfully.",
        customer: {
          customerid: 1,
          fullname: "Nguyen Van A",
          citizenid: "001234567890",
          street: "123 Street",
          district: "District 1",
          province: "HCM",
        },
      };

      mockCustomerService.addCustomer.mockResolvedValue(mockResult);

      // === ACT ===
      await addCustomer(req, res);

      // === ASSERT ===
      expect(mockCustomerService.addCustomer).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer added successfully",
        success: true,
        total: 1,
        data: mockResult,
      });
    });

    it("should return 500 when service throws error", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        body: {
          fullName: "Test",
          citizenId: "123",
        },
      });
      const res = createMockResponse();

      const error = new Error("Missing required information.");
      mockCustomerService.addCustomer.mockRejectedValue(error);

      // Mock console.error to avoid noise in test output
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await addCustomer(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to add customer",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });

    it("should use error status if provided", async () => {
      // === ARRANGE ===
      const req = createMockRequest({ body: {} });
      const res = createMockResponse();

      const error = new Error("Validation failed");
      error.status = 400;
      mockCustomerService.addCustomer.mockRejectedValue(error);

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await addCustomer(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(400);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getAllCustomers()", () => {
    it("should return all customers with status 200", async () => {
      // === ARRANGE ===
      const req = createMockRequest();
      const res = createMockResponse();

      const mockCustomers = [
        { customerid: 1, fullname: "Customer 1" },
        { customerid: 2, fullname: "Customer 2" },
      ];

      mockCustomerService.getAllCustomers.mockResolvedValue(mockCustomers);

      // === ACT ===
      await getAllCustomers(req, res);

      // === ASSERT ===
      expect(mockCustomerService.getAllCustomers).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Get customers successfully",
        success: true,
        total: 2,
        data: mockCustomers,
      });
    });

    it("should return empty array when no customers", async () => {
      // === ARRANGE ===
      const req = createMockRequest();
      const res = createMockResponse();

      mockCustomerService.getAllCustomers.mockResolvedValue([]);

      // === ACT ===
      await getAllCustomers(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Get customers successfully",
        success: true,
        total: 0,
        data: [],
      });
    });

    it("should handle service error", async () => {
      // === ARRANGE ===
      const req = createMockRequest();
      const res = createMockResponse();

      mockCustomerService.getAllCustomers.mockRejectedValue(
        new Error("DB Error")
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await getAllCustomers(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to retrieve customers",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getCustomerById()", () => {
    it("should return customer when found", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "1" },
      });
      const res = createMockResponse();

      const mockCustomer = {
        customerid: 1,
        fullname: "Test Customer",
      };

      mockCustomerService.getCustomerById.mockResolvedValue(mockCustomer);

      // === ACT ===
      await getCustomerById(req, res);

      // === ASSERT ===
      expect(mockCustomerService.getCustomerById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Get customer successfully",
        success: true,
        total: 1,
        data: mockCustomer,
      });
    });

    it("should return 404 when customer not found", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "999" },
      });
      const res = createMockResponse();

      mockCustomerService.getCustomerById.mockResolvedValue(null);

      // === ACT ===
      await getCustomerById(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer not found",
        success: false,
      });
    });

    it("should handle service error", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "1" },
      });
      const res = createMockResponse();

      mockCustomerService.getCustomerById.mockRejectedValue(
        new Error("DB Error")
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await getCustomerById(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to retrieve customer",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("updateCustomer()", () => {
    it("should update customer successfully", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "1" },
        body: {
          fullName: "Updated Name",
          street: "New Street",
        },
      });
      const res = createMockResponse();

      const mockResult = {
        message: "Customer updated successfully.",
        customer: {
          customerid: 1,
          fullname: "Updated Name",
          street: "New Street",
        },
      };

      mockCustomerService.updateCustomer.mockResolvedValue(mockResult);

      // === ACT ===
      await updateCustomer(req, res);

      // === ASSERT ===
      expect(mockCustomerService.updateCustomer).toHaveBeenCalledWith(
        "1",
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer updated successfully",
        success: true,
        total: 1,
        data: mockResult,
      });
    });

    it("should return 404 when customer not found", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "999" },
        body: { fullName: "Test" },
      });
      const res = createMockResponse();

      mockCustomerService.updateCustomer.mockResolvedValue(null);

      // === ACT ===
      await updateCustomer(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer not found",
        success: false,
      });
    });

    it("should handle service error", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "1" },
        body: {},
      });
      const res = createMockResponse();

      mockCustomerService.updateCustomer.mockRejectedValue(
        new Error("Update failed")
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await updateCustomer(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("deleteCustomer()", () => {
    it("should delete customer successfully", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "1" },
      });
      const res = createMockResponse();

      const mockResult = {
        message: "Customer deleted successfully.",
      };

      mockCustomerService.deleteCustomer.mockResolvedValue(mockResult);

      // === ACT ===
      await deleteCustomer(req, res);

      // === ASSERT ===
      expect(mockCustomerService.deleteCustomer).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer deleted successfully",
        success: true,
        total: 1,
        data: mockResult,
      });
    });

    it("should return 404 when customer not found", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "999" },
      });
      const res = createMockResponse();

      mockCustomerService.deleteCustomer.mockResolvedValue(null);

      // === ACT ===
      await deleteCustomer(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer not found",
        success: false,
      });
    });

    it("should handle foreign key constraint error", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "1" },
      });
      const res = createMockResponse();

      const error = new Error("Foreign key constraint");
      error.status = 409;
      mockCustomerService.deleteCustomer.mockRejectedValue(error);

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await deleteCustomer(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(409);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("searchCustomer()", () => {
    it("should search customers by keyword", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        query: { keyword: "Nguyen" },
      });
      const res = createMockResponse();

      const mockResults = [
        { customerid: 1, fullname: "Nguyen Van A" },
        { customerid: 2, fullname: "Nguyen Thi B" },
      ];

      mockCustomerService.searchCustomers.mockResolvedValue(mockResults);

      // === ACT ===
      await searchCustomer(req, res);

      // === ASSERT ===
      expect(mockCustomerService.searchCustomers).toHaveBeenCalledWith(
        "Nguyen"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Search customers successfully",
        success: true,
        total: 2,
        data: mockResults,
      });
    });

    it("should return empty results when no match", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        query: { keyword: "NonExistent" },
      });
      const res = createMockResponse();

      mockCustomerService.searchCustomers.mockResolvedValue([]);

      // === ACT ===
      await searchCustomer(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Search customers successfully",
        success: true,
        total: 0,
        data: [],
      });
    });

    it("should handle undefined keyword", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        query: {},
      });
      const res = createMockResponse();

      mockCustomerService.searchCustomers.mockResolvedValue([]);

      // === ACT ===
      await searchCustomer(req, res);

      // === ASSERT ===
      expect(mockCustomerService.searchCustomers).toHaveBeenCalledWith(
        undefined
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle service error", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        query: { keyword: "Test" },
      });
      const res = createMockResponse();

      mockCustomerService.searchCustomers.mockRejectedValue(
        new Error("Search failed")
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await searchCustomer(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to search customers",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });

    it("should search by numeric ID", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        query: { keyword: "123" },
      });
      const res = createMockResponse();

      const mockResult = [{ customerid: 123, fullname: "Customer 123" }];

      mockCustomerService.searchCustomers.mockResolvedValue(mockResult);

      // === ACT ===
      await searchCustomer(req, res);

      // === ASSERT ===
      expect(mockCustomerService.searchCustomers).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 1,
          data: mockResult,
        })
      );
    });
  });

  describe("getCustomerByCitizenId()", () => {
    it("should return customer when found by citizenId", async () => {
      const req = createMockRequest({
        query: {
          citizenId: "123456789",
        },
      });
      const res = createMockResponse();

      const mockCustomer = {
        customerid: 1,
        fullname: "John Doe",
        citizenid: "123456789",
        street: "Main St",
        district: "Downtown",
        province: "Province A",
      };

      mockCustomerService.findCustomerByCitizenId = jest.fn().mockResolvedValue(mockCustomer);

      await getCustomerByCitizenId(req, res);

      expect(mockCustomerService.findCustomerByCitizenId).toHaveBeenCalledWith("123456789");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer retrieved successfully",
        success: true,
        data: {
          customer: {
            fullName: "John Doe",
            citizenId: "123456789",
            street: "Main St",
            district: "Downtown",
            province: "Province A",
          },
        },
      });
    });

    it("should return 400 when citizenId is missing", async () => {
      const req = createMockRequest({
        query: {},
      });
      const res = createMockResponse();

      await getCustomerByCitizenId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Citizen ID is required in query parameters",
      });
    });

    it("should return 404 when customer not found", async () => {
      const req = createMockRequest({
        query: {
          citizenId: "999999999",
        },
      });
      const res = createMockResponse();

      mockCustomerService.findCustomerByCitizenId = jest.fn().mockResolvedValue(null);

      await getCustomerByCitizenId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Customer not found",
      });
    });

    it("should return 500 on service error", async () => {
      const req = createMockRequest({
        query: {
          citizenId: "123456789",
        },
      });
      const res = createMockResponse();

      mockCustomerService.findCustomerByCitizenId = jest.fn().mockRejectedValue(
        new Error("Database error")
      );

      await getCustomerByCitizenId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
      });
    });

    it("should use error status if provided", async () => {
      const req = createMockRequest({
        query: {
          citizenId: "123456789",
        },
      });
      const res = createMockResponse();

      const error = new Error("Custom error");
      error.status = 400;
      mockCustomerService.findCustomerByCitizenId = jest.fn().mockRejectedValue(error);

      await getCustomerByCitizenId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Custom error",
      });
    });
  });
});
