import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
  createMockEmployee,
} from "../../helpers/testHelpers.js";

// === MOCK SERVICE ===
const mockEmployeeService = {
  addEmployee: jest.fn(),
  getAllEmployees: jest.fn(),
  getEmployeeById: jest.fn(),
  updateEmployee: jest.fn(),
  deleteEmployee: jest.fn(),
};

jest.unstable_mockModule("@src/services/Employee/employee.service.js", () => ({
  employeeService: mockEmployeeService,
}));

// === IMPORT CONTROLLER ===
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = await import("../../../src/controllers/Employee/employee.controller.js");

describe("EmployeeController - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addEmployee()", () => {
    it("should add employee successfully with status 201", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        body: {
          username: "EMP001",
          fullName: "Nguyen Van A",
          roleName: "Teller",
          email: "test@example.com",
        },
      });
      const res = createMockResponse();

      const mockResult = {
        message: "Employee and user account created successfully.",
        employee: {
          employeeid: "EMP001",
          fullname: "Nguyen Van A",
          email: "test@example.com",
          roleid: 2,
        },
      };

      mockEmployeeService.addEmployee.mockResolvedValue(mockResult);

      // === ACT ===
      await addEmployee(req, res);

      // === ASSERT ===
      expect(mockEmployeeService.addEmployee).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Employee added successfully",
        success: true,
        total: 1,
        data: mockResult,
      });
    });

    it("should return 500 when missing required fields", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        body: {
          username: "EMP001",
          // missing fullName, roleName, email
        },
      });
      const res = createMockResponse();

      mockEmployeeService.addEmployee.mockRejectedValue(
        new Error("Missing required information.")
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await addEmployee(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to add employee",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });

    it("should handle invalid role error", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        body: {
          username: "EMP001",
          fullName: "Test",
          roleName: "InvalidRole",
          email: "test@example.com",
        },
      });
      const res = createMockResponse();

      const error = new Error("Invalid role name.");
      error.status = 400;
      mockEmployeeService.addEmployee.mockRejectedValue(error);

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await addEmployee(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to add employee",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });

    it("should handle duplicate employee error", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        body: {
          username: "EMP001",
          fullName: "Duplicate",
          roleName: "Teller",
          email: "duplicate@example.com",
        },
      });
      const res = createMockResponse();

      const error = new Error("Employee already exists");
      error.status = 409;
      mockEmployeeService.addEmployee.mockRejectedValue(error);

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await addEmployee(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(409);

      consoleErrorSpy.mockRestore();
    });

    it("should handle database connection error", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        body: {
          username: "EMP001",
          fullName: "Test",
          roleName: "Teller",
          email: "test@example.com",
        },
      });
      const res = createMockResponse();

      mockEmployeeService.addEmployee.mockRejectedValue(
        new Error("Database connection failed")
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await addEmployee(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getAllEmployees()", () => {
    it("should return all employees with status 200", async () => {
      // === ARRANGE ===
      const req = createMockRequest();
      const res = createMockResponse();

      const mockEmployees = [
        createMockEmployee({ employeeid: "EMP001", fullname: "Employee 1" }),
        createMockEmployee({ employeeid: "EMP002", fullname: "Employee 2" }),
        createMockEmployee({ employeeid: "EMP003", fullname: "Employee 3" }),
      ];

      mockEmployeeService.getAllEmployees.mockResolvedValue(mockEmployees);

      // === ACT ===
      await getAllEmployees(req, res);

      // === ASSERT ===
      expect(mockEmployeeService.getAllEmployees).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Get employees successfully",
        success: true,
        total: 3,
        data: mockEmployees,
      });
    });

    it("should return empty array when no employees exist", async () => {
      // === ARRANGE ===
      const req = createMockRequest();
      const res = createMockResponse();

      mockEmployeeService.getAllEmployees.mockResolvedValue([]);

      // === ACT ===
      await getAllEmployees(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Get employees successfully",
        success: true,
        total: 0,
        data: [],
      });
    });

    it("should handle service error", async () => {
      // === ARRANGE ===
      const req = createMockRequest();
      const res = createMockResponse();

      mockEmployeeService.getAllEmployees.mockRejectedValue(
        new Error("Database error")
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await getAllEmployees(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to retrieve employees",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getEmployeeById()", () => {
    it("should return employee when found", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "EMP001" },
      });
      const res = createMockResponse();

      const mockEmployee = createMockEmployee({
        employeeid: "EMP001",
        fullname: "Test Employee",
      });

      mockEmployeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      // === ACT ===
      await getEmployeeById(req, res);

      // === ASSERT ===
      expect(mockEmployeeService.getEmployeeById).toHaveBeenCalledWith(
        "EMP001"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Get employee successfully",
        success: true,
        total: 1,
        data: mockEmployee,
      });
    });

    it("should return 404 when employee not found", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "NOTEXIST" },
      });
      const res = createMockResponse();

      mockEmployeeService.getEmployeeById.mockResolvedValue(null);

      // === ACT ===
      await getEmployeeById(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Employee not found",
        success: false,
      });
    });

    it("should handle service error", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "EMP001" },
      });
      const res = createMockResponse();

      mockEmployeeService.getEmployeeById.mockRejectedValue(
        new Error("Query failed")
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await getEmployeeById(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);

      consoleErrorSpy.mockRestore();
    });

    it("should handle invalid employee ID format", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "INVALID@#$" },
      });
      const res = createMockResponse();

      mockEmployeeService.getEmployeeById.mockRejectedValue(
        new Error("Invalid ID format")
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await getEmployeeById(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("updateEmployee()", () => {
    it("should update employee successfully", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "EMP001" },
        body: {
          fullName: "Updated Name",
          email: "updated@example.com",
          roleID: 2,
          branchID: 1,
        },
      });
      const res = createMockResponse();

      const mockResult = {
        message: "Employee updated successfully",
        employee: {
          employeeid: "EMP001",
          fullname: "Updated Name",
          email: "updated@example.com",
        },
      };

      mockEmployeeService.updateEmployee.mockResolvedValue(mockResult);

      // === ACT ===
      await updateEmployee(req, res);

      // === ASSERT ===
      expect(mockEmployeeService.updateEmployee).toHaveBeenCalledWith(
        "EMP001",
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Employee updated successfully",
        success: true,
        total: 1,
        data: mockResult,
      });
    });

    it("should return 404 when employee not found", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "NOTEXIST" },
        body: { fullName: "Test" },
      });
      const res = createMockResponse();

      mockEmployeeService.updateEmployee.mockResolvedValue(null);

      // === ACT ===
      await updateEmployee(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Employee not found",
        success: false,
      });
    });

    it("should handle partial updates", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "EMP001" },
        body: {
          email: "newemail@example.com",
          // Only updating email
        },
      });
      const res = createMockResponse();

      const mockResult = {
        message: "Employee updated successfully",
        employee: {
          employeeid: "EMP001",
          email: "newemail@example.com",
        },
      };

      mockEmployeeService.updateEmployee.mockResolvedValue(mockResult);

      // === ACT ===
      await updateEmployee(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockEmployeeService.updateEmployee).toHaveBeenCalledWith(
        "EMP001",
        expect.objectContaining({
          email: "newemail@example.com",
        })
      );
    });

    it("should handle service error", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "EMP001" },
        body: {},
      });
      const res = createMockResponse();

      mockEmployeeService.updateEmployee.mockRejectedValue(
        new Error("Update failed")
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await updateEmployee(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);

      consoleErrorSpy.mockRestore();
    });

    it("should handle duplicate email error", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "EMP001" },
        body: { email: "duplicate@example.com" },
      });
      const res = createMockResponse();

      const error = new Error("Duplicate email");
      error.status = 409;
      mockEmployeeService.updateEmployee.mockRejectedValue(error);

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await updateEmployee(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(409);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("deleteEmployee()", () => {
    it("should delete employee successfully", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "EMP001" },
      });
      const res = createMockResponse();

      const mockResult = {
        message: "Employee deleted successfully.",
      };

      mockEmployeeService.deleteEmployee.mockResolvedValue(mockResult);

      // === ACT ===
      await deleteEmployee(req, res);

      // === ASSERT ===
      expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith("EMP001");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Employee deleted successfully",
        success: true,
        total: 1,
        data: mockResult,
      });
    });

    it("should return 404 when employee not found", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "NOTEXIST" },
      });
      const res = createMockResponse();

      mockEmployeeService.deleteEmployee.mockResolvedValue(null);

      // === ACT ===
      await deleteEmployee(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Employee not found",
        success: false,
      });
    });

    it("should handle foreign key constraint error", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "EMP001" },
      });
      const res = createMockResponse();

      const error = new Error("Foreign key constraint violation");
      error.status = 409;
      mockEmployeeService.deleteEmployee.mockRejectedValue(error);

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await deleteEmployee(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(409);

      consoleErrorSpy.mockRestore();
    });

    it("should handle service error", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "EMP001" },
      });
      const res = createMockResponse();

      mockEmployeeService.deleteEmployee.mockRejectedValue(
        new Error("Delete failed")
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await deleteEmployee(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Request Validation", () => {
    it("should handle empty request body for add", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        body: {},
      });
      const res = createMockResponse();

      mockEmployeeService.addEmployee.mockRejectedValue(
        new Error("Missing required information.")
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await addEmployee(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);

      consoleErrorSpy.mockRestore();
    });

    it("should handle empty request body for update", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: { id: "EMP001" },
        body: {},
      });
      const res = createMockResponse();

      mockEmployeeService.updateEmployee.mockResolvedValue({
        message: "Employee updated successfully",
        employee: { employeeid: "EMP001" },
      });

      // === ACT ===
      await updateEmployee(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle missing ID parameter", async () => {
      // === ARRANGE ===
      const req = createMockRequest({
        params: {},
      });
      const res = createMockResponse();

      mockEmployeeService.getEmployeeById.mockRejectedValue(
        new Error("Invalid ID")
      );

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // === ACT ===
      await getEmployeeById(req, res);

      // === ASSERT ===
      expect(res.status).toHaveBeenCalledWith(500);

      consoleErrorSpy.mockRestore();
    });
  });
});
