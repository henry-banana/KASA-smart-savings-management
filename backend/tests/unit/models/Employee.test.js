import { beforeEach, describe, expect, jest } from "@jest/globals";
import {
  createMockSupabaseClient,
  resetSupabaseMock,
  mockSuccessResponse,
  mockNotFoundResponse,
  mockErrorResponse,
} from "../../mocks/supabase.mock.js";
import { createMockEmployee } from "../../helpers/testHelpers.js";

const mockSupabase = createMockSupabaseClient();

jest.unstable_mockModule("@config/database.js", () => ({
  supabase: mockSupabase,
}));

// Import Employee AFTER mocking
const { Employee } = await import("../../../src/models/Employee.js");

describe("Employee Model - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetSupabaseMock(mockSupabase);
  });

  describe("Model Configuration", () => {
    it("should have correct table name", () => {
      expect(Employee.tableName).toBe("employee");
    });

    it("should have correct primary key", () => {
      expect(Employee.primaryKey).toBe("employeeid");
    });
  });

  describe("getById()", () => {
    it("should return employee when found", async () => {
      // === ARRANGE ===
      const mockEmployee = createMockEmployee({
        employeeid: "EMP001",
        fullname: "Nguyen Van A",
        email: "test@example.com",
      });

      mockSupabase.single.mockResolvedValue(mockSuccessResponse(mockEmployee));

      // === ACT ===
      const result = await Employee.getById("EMP001");

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("employee");
      expect(mockSupabase.select).toHaveBeenCalledWith("*");
      expect(mockSupabase.eq).toHaveBeenCalledWith("employeeid", "EMP001");
      expect(mockSupabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockEmployee);
    });

    it("should return null when employee not found", async () => {
      // === ARRANGE ===
      mockSupabase.single.mockResolvedValue(mockNotFoundResponse());

      // === ACT ===
      const result = await Employee.getById("NOTEXIST");

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("employee");
      expect(mockSupabase.eq).toHaveBeenCalledWith("employeeid", "NOTEXIST");
      expect(result).toBeNull();
    });

    it("should throw error for database errors", async () => {
      // === ARRANGE ===
      mockSupabase.single.mockResolvedValue(
        mockErrorResponse("Database connection failed", "DBFAIL")
      );

      // === ACT & ASSERT ===
      await expect(Employee.getById("EMP001")).rejects.toThrow("Get failed");
    });
  });

  describe("getAll()", () => {
    it("should return all employees with joined data", async () => {
      // === ARRANGE ===
      const mockEmployees = [
        {
          employeeid: "EMP001",
          fullname: "Employee 1",
          email: "emp1@example.com",
          role: { rolename: "Teller" },
          useraccount: { userid: "EMP001", accountstatus: "active" },
          branch: { branchname: "Branch 1" },
        },
        {
          employeeid: "EMP002",
          fullname: "Employee 2",
          email: "emp2@example.com",
          role: { rolename: "Accountant" },
          useraccount: { userid: "EMP002", accountstatus: "active" },
          branch: { branchname: "Branch 2" },
        },
      ];

      mockSupabase.select.mockResolvedValue(mockSuccessResponse(mockEmployees));

      // === ACT ===
      const result = await Employee.getAll();

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("employee");
      expect(mockSupabase.select).toHaveBeenCalledWith(
        expect.stringContaining("roleid")
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: "EMP001",
        username: "EMP001",
        fullName: "Employee 1",
        email: "emp1@example.com",
        roleName: "Teller",
        status: "active",
        branchName: "Branch 1",
      });
    });

    it("should return empty array when no employees exist", async () => {
      // === ARRANGE ===
      mockSupabase.select.mockResolvedValue(mockSuccessResponse([]));

      // === ACT ===
      const result = await Employee.getAll();

      // === ASSERT ===
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle null values in joined data gracefully", async () => {
      // === ARRANGE ===
      const mockEmployees = [
        {
          employeeid: "EMP001",
          fullname: "Employee 1",
          email: "emp1@example.com",
          role: null, // No role assigned
          useraccount: null, // No user account
          branch: null, // No branch
        },
      ];

      mockSupabase.select.mockResolvedValue(mockSuccessResponse(mockEmployees));

      // === ACT ===
      const result = await Employee.getAll();

      // === ASSERT ===
      expect(result[0]).toMatchObject({
        id: "EMP001",
        roleName: null,
        status: "inactive",
        branchName: null,
      });
    });

    // it("should throw error on database failure", async () => {
    //   // === ARRANGE ===
    //   // ✅ Clear mocks nhưng KHÔNG reset chain
    //   jest.clearAllMocks();

    //   const errorObj = mockErrorResponse("Query failed", "PGERROR");

    //   // ✅ Setup lại chain manually
    //   mockSupabase.from.mockReturnValue({
    //     select: jest.fn().mockResolvedValue(errorObj),
    //   });

    //   // === ACT & ASSERT ===
    //   await expect(Employee.getAll()).rejects.toThrow();
    // });
  });

  describe("create()", () => {
    it("should create employee successfully", async () => {
      // === ARRANGE ===
      const newEmployeeData = {
        employeeid: "EMP003",
        fullname: "New Employee",
        email: "new@example.com",
        roleid: 2,
        branchid: 1,
      };

      const createdEmployee = { ...newEmployeeData };

      mockSupabase.select.mockResolvedValue(
        mockSuccessResponse([createdEmployee])
      );

      // === ACT ===
      const result = await Employee.create(newEmployeeData);

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("employee");
      expect(mockSupabase.insert).toHaveBeenCalledWith([newEmployeeData]);
      expect(result).toEqual(createdEmployee);
    });

    it("should throw error when employeeid already exists", async () => {
      // === ARRANGE ===
      const duplicateData = {
        employeeid: "EMP001",
        fullname: "Duplicate",
        email: "dup@example.com",
      };

      mockSupabase.select.mockResolvedValue(
        mockErrorResponse("Duplicate key violation", "23505")
      );

      // === ACT & ASSERT ===
      await expect(Employee.create(duplicateData)).rejects.toThrow();
    });

    it("should throw error when email already exists", async () => {
      // === ARRANGE ===
      const duplicateEmailData = {
        employeeid: "EMP999",
        fullname: "Test",
        email: "existing@example.com",
      };

      mockSupabase.select.mockResolvedValue(
        mockErrorResponse("Duplicate email", "23505")
      );

      // === ACT & ASSERT ===
      await expect(Employee.create(duplicateEmailData)).rejects.toThrow();
    });

    it("should throw error when required fields are missing", async () => {
      // === ARRANGE ===
      const incompleteData = {
        employeeid: "EMP004",
        // missing fullname and email
      };

      mockSupabase.select.mockResolvedValue(
        mockErrorResponse("NULL value in column", "23502")
      );

      // === ACT & ASSERT ===
      await expect(Employee.create(incompleteData)).rejects.toThrow();
    });
  });

  describe("update()", () => {
    it("should update employee successfully", async () => {
      // === ARRANGE ===
      const employeeId = "EMP001";
      const updates = {
        fullname: "Updated Name",
        email: "updated@example.com",
      };

      const updatedEmployee = {
        employeeid: employeeId,
        ...updates,
      };

      mockSupabase.select.mockResolvedValue(
        mockSuccessResponse([updatedEmployee])
      );

      // === ACT ===
      const result = await Employee.update(employeeId, updates);

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("employee");
      expect(mockSupabase.update).toHaveBeenCalledWith(updates);
      expect(mockSupabase.eq).toHaveBeenCalledWith("employeeid", employeeId);
      expect(result).toEqual(updatedEmployee);
    });

    it("should return null when employee not found", async () => {
      // === ARRANGE ===
      mockSupabase.select.mockResolvedValue(mockSuccessResponse([]));

      // === ACT ===
      const result = await Employee.update("NOTEXIST", { fullname: "Test" });

      // === ASSERT ===
      expect(result).toBeNull();
    });

    it("should update role successfully", async () => {
      // === ARRANGE ===
      const employeeId = "EMP001";
      const updates = { roleid: 3 };

      mockSupabase.select.mockResolvedValue(
        mockSuccessResponse([{ employeeid: employeeId, roleid: 3 }])
      );

      // === ACT ===
      const result = await Employee.update(employeeId, updates);

      // === ASSERT ===
      expect(result.roleid).toBe(3);
    });

    it("should update branch successfully", async () => {
      // === ARRANGE ===
      const employeeId = "EMP001";
      const updates = { branchid: 2 };

      mockSupabase.select.mockResolvedValue(
        mockSuccessResponse([{ employeeid: employeeId, branchid: 2 }])
      );

      // === ACT ===
      const result = await Employee.update(employeeId, updates);

      // === ASSERT ===
      expect(result.branchid).toBe(2);
    });

    it("should throw error when updating to duplicate email", async () => {
      // === ARRANGE ===
      const updates = { email: "duplicate@example.com" };

      mockSupabase.select.mockResolvedValue(
        mockErrorResponse("Duplicate email", "23505")
      );

      // === ACT & ASSERT ===
      await expect(Employee.update("EMP001", updates)).rejects.toThrow();
    });
  });

  describe("delete()", () => {
    it("should delete employee successfully", async () => {
      // === ARRANGE ===
      const employeeId = "EMP001";
      const deletedEmployee = {
        employeeid: employeeId,
        fullname: "Deleted Employee",
      };

      mockSupabase.select.mockResolvedValue(
        mockSuccessResponse([deletedEmployee])
      );

      // === ACT ===
      const result = await Employee.delete(employeeId);

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("employee");
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith("employeeid", employeeId);
      expect(result).toEqual(deletedEmployee);
    });

    it("should return null when employee not found", async () => {
      // === ARRANGE ===
      mockSupabase.select.mockResolvedValue(mockSuccessResponse([]));

      // === ACT ===
      const result = await Employee.delete("NOTEXIST");

      // === ASSERT ===
      expect(result).toBeNull();
    });

    it("should throw error when foreign key constraint exists", async () => {
      // === ARRANGE ===
      mockSupabase.select.mockResolvedValue(
        mockErrorResponse("Foreign key constraint", "23503")
      );

      // === ACT & ASSERT ===
      await expect(Employee.delete("EMP001")).rejects.toThrow();
    });
  });

  describe("Data Integrity", () => {
    it("should maintain referential integrity with role", async () => {
      // === ARRANGE ===
      const mockEmployee = {
        employeeid: "EMP001",
        fullname: "Test",
        roleid: 999, // Non-existent role
      };

      mockSupabase.select.mockResolvedValue(
        mockErrorResponse("Foreign key constraint on roleid", "23503")
      );

      // === ACT & ASSERT ===
      await expect(Employee.create(mockEmployee)).rejects.toThrow();
    });

    it("should maintain referential integrity with branch", async () => {
      // === ARRANGE ===
      const mockEmployee = {
        employeeid: "EMP001",
        fullname: "Test",
        branchid: 999, // Non-existent branch
      };

      mockSupabase.select.mockResolvedValue(
        mockErrorResponse("Foreign key constraint on branchid", "23503")
      );

      // === ACT & ASSERT ===
      await expect(Employee.create(mockEmployee)).rejects.toThrow();
    });
  });
});
