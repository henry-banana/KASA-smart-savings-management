import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockEmployee,
  mockBcryptHash,
} from "../../helpers/testHelpers.js";

// === MOCK REPOSITORIES ===
const mockEmployeeRepository = {
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockUserAccountRepository = {
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockRoleRepository = {
  findByName: jest.fn(),
  findById: jest.fn(),
};

const mockBranchRepository = {
  findById: jest.fn(),
};

// === MOCK MODULES ===
jest.unstable_mockModule(
  "@src/repositories/Employee/EmployeeRepository.js",
  () => ({
    employeeRepository: mockEmployeeRepository,
  })
);

jest.unstable_mockModule(
  "@src/repositories/UserAccount/UserAccountRepository.js",
  () => ({
    userAccountRepository: mockUserAccountRepository,
  })
);

jest.unstable_mockModule("@src/repositories/Role/RoleRepository.js", () => ({
  roleRepository: mockRoleRepository,
}));

// Mock hashPassword
const mockHashPassword = mockBcryptHash();
jest.unstable_mockModule("@src/middleware/hashing.middleware.js", () => ({
  hashPassword: mockHashPassword,
}));

// === IMPORT SERVICE ===
const { employeeService } = await import(
  "@src/services/Employee/employee.service.js"
);

describe("EmployeeService - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addEmployee()", () => {
    it("should add employee successfully with all required fields", async () => {
      // === ARRANGE ===
      const inputData = {
        username: "EMP001",
        fullName: "Nguyen Van A",
        roleName: "Teller",
        email: "test@example.com",
      };

      const mockRole = { roleid: 2, rolename: "Teller" };
      const mockEmployee = {
        employeeid: "EMP001",
        fullname: "Nguyen Van A",
        email: "test@example.com",
        roleid: 2,
      };

      mockRoleRepository.findByName.mockResolvedValue(mockRole);
      mockEmployeeRepository.create.mockResolvedValue(mockEmployee);
      mockUserAccountRepository.create.mockResolvedValue({
        userid: "EMP001",
        username: "EMP001",
      });

      // === ACT ===
      const result = await employeeService.addEmployee(inputData);

      // === ASSERT ===
      expect(mockRoleRepository.findByName).toHaveBeenCalledWith("Teller");
      expect(mockEmployeeRepository.create).toHaveBeenCalledWith({
        employeeid: "EMP001",
        fullname: "Nguyen Van A",
        email: "test@example.com",
        roleid: 2,
      });
      expect(mockUserAccountRepository.create).toHaveBeenCalledWith({
        userid: "EMP001",
        username: "EMP001",
        password: null,
        status: "active",
      });
      expect(result.message).toBe(
        "Employee and user account created successfully."
      );
      expect(result.employee).toEqual(mockEmployee);
    });

    it("should throw error when username is missing", async () => {
      // === ARRANGE ===
      const invalidData = {
        // username missing
        fullName: "Test",
        roleName: "Teller",
        email: "test@example.com",
      };

      // === ACT & ASSERT ===
      await expect(employeeService.addEmployee(invalidData)).rejects.toThrow(
        "Missing required information."
      );
    });

    it("should throw error when fullName is missing", async () => {
      // === ARRANGE ===
      const invalidData = {
        username: "EMP001",
        // fullName missing
        roleName: "Teller",
        email: "test@example.com",
      };

      // === ACT & ASSERT ===
      await expect(employeeService.addEmployee(invalidData)).rejects.toThrow(
        "Missing required information."
      );
    });

    it("should throw error when email is missing", async () => {
      // === ARRANGE ===
      const invalidData = {
        username: "EMP001",
        fullName: "Test",
        roleName: "Teller",
        // email missing
      };

      // === ACT & ASSERT ===
      await expect(employeeService.addEmployee(invalidData)).rejects.toThrow(
        "Missing required information."
      );
    });

    it("should throw error when roleName is missing", async () => {
      // === ARRANGE ===
      const invalidData = {
        username: "EMP001",
        fullName: "Test",
        email: "test@example.com",
        // roleName missing
      };

      // === ACT & ASSERT ===
      await expect(employeeService.addEmployee(invalidData)).rejects.toThrow(
        "Missing required information."
      );
    });

    it("should throw error when role not found", async () => {
      // === ARRANGE ===
      const inputData = {
        username: "EMP001",
        fullName: "Test",
        roleName: "InvalidRole",
        email: "test@example.com",
      };

      mockRoleRepository.findByName.mockResolvedValue(null);

      // === ACT & ASSERT ===
      await expect(employeeService.addEmployee(inputData)).rejects.toThrow(
        "Invalid role name."
      );
    });

    it("should create employee with Accountant role", async () => {
      // === ARRANGE ===
      const inputData = {
        username: "EMP002",
        fullName: "Accountant User",
        roleName: "Accountant",
        email: "accountant@example.com",
      };

      const mockRole = { roleid: 3, rolename: "Accountant" };
      const mockEmployee = {
        employeeid: "EMP002",
        fullname: "Accountant User",
        email: "accountant@example.com",
        roleid: 3,
      };

      mockRoleRepository.findByName.mockResolvedValue(mockRole);
      mockEmployeeRepository.create.mockResolvedValue(mockEmployee);
      mockUserAccountRepository.create.mockResolvedValue({});

      // === ACT ===
      const result = await employeeService.addEmployee(inputData);

      // === ASSERT ===
      expect(mockEmployeeRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ roleid: 3 })
      );
      expect(result.employee.roleid).toBe(3);
    });

    it("should handle database error during employee creation", async () => {
      // === ARRANGE ===
      const inputData = {
        username: "EMP001",
        fullName: "Test",
        roleName: "Teller",
        email: "test@example.com",
      };

      mockRoleRepository.findByName.mockResolvedValue({ roleid: 2 });
      mockEmployeeRepository.create.mockRejectedValue(
        new Error("Database error")
      );

      // === ACT & ASSERT ===
      await expect(employeeService.addEmployee(inputData)).rejects.toThrow(
        "Database error"
      );
    });

    it("should handle error during user account creation", async () => {
      // === ARRANGE ===
      const inputData = {
        username: "EMP001",
        fullName: "Test",
        roleName: "Teller",
        email: "test@example.com",
      };

      mockRoleRepository.findByName.mockResolvedValue({ roleid: 2 });
      mockEmployeeRepository.create.mockResolvedValue({
        employeeid: "EMP001",
      });
      mockUserAccountRepository.create.mockRejectedValue(
        new Error("User account creation failed")
      );

      // === ACT & ASSERT ===
      await expect(employeeService.addEmployee(inputData)).rejects.toThrow(
        "User account creation failed"
      );
    });
  });

  describe("updateEmployee()", () => {
    it("should update employee successfully without password", async () => {
      // === ARRANGE ===
      const employeeId = "EMP001";
      const updates = {
        fullName: "Updated Name",
        email: "updated@example.com",
        roleID: 2,
        branchID: 1,
      };

      const existingEmployee = {
        employeeid: employeeId,
        fullname: "Old Name",
      };

      const updatedEmployee = {
        employeeid: employeeId,
        fullname: "Updated Name",
        email: "updated@example.com",
        roleid: 2,
        branchid: 1,
      };

      mockEmployeeRepository.findById.mockResolvedValue(existingEmployee);
      mockEmployeeRepository.update.mockResolvedValue(updatedEmployee);

      // === ACT ===
      const result = await employeeService.updateEmployee(employeeId, updates);

      // === ASSERT ===
      expect(mockEmployeeRepository.findById).toHaveBeenCalledWith(employeeId);
      expect(mockEmployeeRepository.update).toHaveBeenCalledWith(
        employeeId,
        expect.objectContaining({
          fullname: "Updated Name",
          email: "updated@example.com",
          roleid: 2,
          branchid: 1,
        })
      );
      expect(result.message).toBe("Employee updated successfully");
      expect(mockHashPassword).not.toHaveBeenCalled();
    });

    it("should update employee with password hash", async () => {
      // === ARRANGE ===
      const employeeId = "EMP001";
      const updates = {
        fullName: "Updated Name",
        password: "newpassword123",
      };

      mockEmployeeRepository.findById.mockResolvedValue({
        employeeid: employeeId,
      });
      mockEmployeeRepository.update.mockResolvedValue({
        employeeid: employeeId,
        fullname: "Updated Name",
      });
      mockHashPassword.mockResolvedValue("$2b$12$hashedpassword...");
      mockUserAccountRepository.update.mockResolvedValue({});

      // === ACT ===
      await employeeService.updateEmployee(employeeId, updates);

      // === ASSERT ===
      expect(mockHashPassword).toHaveBeenCalledWith("newpassword123");
      expect(mockUserAccountRepository.update).toHaveBeenCalledWith(
        employeeId,
        expect.objectContaining({
          password: expect.stringMatching(/^\$2b\$/),
        })
      );
    });

    it("should throw error when employee not found", async () => {
      // === ARRANGE ===
      mockEmployeeRepository.findById.mockResolvedValue(null);

      // === ACT & ASSERT ===
      await expect(
        employeeService.updateEmployee("NOTEXIST", {})
      ).rejects.toThrow("Employee not found");
    });

    it("should handle partial updates", async () => {
      // === ARRANGE ===
      const employeeId = "EMP001";
      const partialUpdates = {
        email: "newemail@example.com",
        // Only updating email
      };

      mockEmployeeRepository.findById.mockResolvedValue({
        employeeid: employeeId,
      });
      mockEmployeeRepository.update.mockResolvedValue({
        employeeid: employeeId,
        email: "newemail@example.com",
      });

      // === ACT ===
      const result = await employeeService.updateEmployee(
        employeeId,
        partialUpdates
      );

      // === ASSERT ===
      expect(mockEmployeeRepository.update).toHaveBeenCalledWith(
        employeeId,
        expect.objectContaining({
          email: "newemail@example.com",
        })
      );
    });

    it("should handle database error during update", async () => {
      // === ARRANGE ===
      const employeeId = "EMP001";
      const updates = { fullName: "Test" };

      mockEmployeeRepository.findById.mockResolvedValue({
        employeeid: employeeId,
      });
      mockEmployeeRepository.update.mockRejectedValue(
        new Error("Update failed")
      );

      // === ACT & ASSERT ===
      await expect(
        employeeService.updateEmployee(employeeId, updates)
      ).rejects.toThrow("Update failed");
    });
  });

  describe("getAllEmployees()", () => {
    it("should return all employees", async () => {
      // === ARRANGE ===
      const mockEmployees = [
        createMockEmployee({ employeeid: "EMP001", fullname: "Employee 1" }),
        createMockEmployee({ employeeid: "EMP002", fullname: "Employee 2" }),
      ];

      mockEmployeeRepository.findAll.mockResolvedValue(mockEmployees);

      // === ACT ===
      const result = await employeeService.getAllEmployees();

      // === ASSERT ===
      expect(mockEmployeeRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockEmployees);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no employees exist", async () => {
      // === ARRANGE ===
      mockEmployeeRepository.findAll.mockResolvedValue([]);

      // === ACT ===
      const result = await employeeService.getAllEmployees();

      // === ASSERT ===
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle database error", async () => {
      // === ARRANGE ===
      mockEmployeeRepository.findAll.mockRejectedValue(
        new Error("Database connection failed")
      );

      // === ACT & ASSERT ===
      await expect(employeeService.getAllEmployees()).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("getEmployeeById()", () => {
    it("should return employee when found", async () => {
      // === ARRANGE ===
      const employeeId = "EMP001";
      const mockEmployee = createMockEmployee({
        employeeid: employeeId,
        fullname: "Test Employee",
      });

      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);

      // === ACT ===
      const result = await employeeService.getEmployeeById(employeeId);

      // === ASSERT ===
      expect(mockEmployeeRepository.findById).toHaveBeenCalledWith(employeeId);
      expect(result).toEqual(mockEmployee);
    });

    it("should throw error when employee not found", async () => {
      // === ARRANGE ===
      mockEmployeeRepository.findById.mockResolvedValue(null);

      // === ACT & ASSERT ===
      await expect(employeeService.getEmployeeById("NOTEXIST")).rejects.toThrow(
        "Employee not found"
      );
    });

    it("should handle database error", async () => {
      // === ARRANGE ===
      mockEmployeeRepository.findById.mockRejectedValue(
        new Error("Query failed")
      );

      // === ACT & ASSERT ===
      await expect(employeeService.getEmployeeById("EMP001")).rejects.toThrow(
        "Query failed"
      );
    });
  });

  describe("deleteEmployee()", () => {
    it("should delete employee and user account successfully", async () => {
      // === ARRANGE ===
      const employeeId = "EMP001";
      const mockEmployee = { employeeid: employeeId };

      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
      mockEmployeeRepository.delete.mockResolvedValue(mockEmployee);
      mockUserAccountRepository.delete.mockResolvedValue({});

      // === ACT ===
      const result = await employeeService.deleteEmployee(employeeId);

      // === ASSERT ===
      expect(mockEmployeeRepository.findById).toHaveBeenCalledWith(employeeId);
      expect(mockEmployeeRepository.delete).toHaveBeenCalledWith(employeeId);
      expect(mockUserAccountRepository.delete).toHaveBeenCalledWith(employeeId);
      expect(result.message).toBe("Employee deleted successfully.");
    });

    it("should throw error when employee not found", async () => {
      // === ARRANGE ===
      mockEmployeeRepository.findById.mockResolvedValue(null);

      // === ACT & ASSERT ===
      await expect(employeeService.deleteEmployee("NOTEXIST")).rejects.toThrow(
        "Employee not found"
      );

      // Should not call delete
      expect(mockEmployeeRepository.delete).not.toHaveBeenCalled();
      expect(mockUserAccountRepository.delete).not.toHaveBeenCalled();
    });

    it("should handle error during employee deletion", async () => {
      // === ARRANGE ===
      const employeeId = "EMP001";

      mockEmployeeRepository.findById.mockResolvedValue({
        employeeid: employeeId,
      });
      mockEmployeeRepository.delete.mockRejectedValue(
        new Error("Foreign key constraint")
      );

      // === ACT & ASSERT ===
      await expect(employeeService.deleteEmployee(employeeId)).rejects.toThrow(
        "Foreign key constraint"
      );
    });

    it("should handle error during user account deletion", async () => {
      // === ARRANGE ===
      const employeeId = "EMP001";

      mockEmployeeRepository.findById.mockResolvedValue({
        employeeid: employeeId,
      });
      mockEmployeeRepository.delete.mockResolvedValue({});
      mockUserAccountRepository.delete.mockRejectedValue(
        new Error("User account deletion failed")
      );

      // === ACT & ASSERT ===
      await expect(employeeService.deleteEmployee(employeeId)).rejects.toThrow(
        "User account deletion failed"
      );
    });
  });

  describe("Business Logic Validation", () => {
    it("should ensure username matches employeeid", async () => {
      // === ARRANGE ===
      const inputData = {
        username: "EMP001",
        fullName: "Test",
        roleName: "Teller",
        email: "test@example.com",
      };

      mockRoleRepository.findByName.mockResolvedValue({ roleid: 2 });
      mockEmployeeRepository.create.mockResolvedValue({
        employeeid: "EMP001",
      });
      mockUserAccountRepository.create.mockResolvedValue({});

      // === ACT ===
      await employeeService.addEmployee(inputData);

      // === ASSERT ===
      expect(mockEmployeeRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeid: "EMP001",
        })
      );
      expect(mockUserAccountRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userid: "EMP001",
          username: "EMP001",
        })
      );
    });

    it("should set default status as active for new accounts", async () => {
      // === ARRANGE ===
      const inputData = {
        username: "EMP001",
        fullName: "Test",
        roleName: "Teller",
        email: "test@example.com",
      };

      mockRoleRepository.findByName.mockResolvedValue({ roleid: 2 });
      mockEmployeeRepository.create.mockResolvedValue({
        employeeid: "EMP001",
      });
      mockUserAccountRepository.create.mockResolvedValue({});

      // === ACT ===
      await employeeService.addEmployee(inputData);

      // === ASSERT ===
      expect(mockUserAccountRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "active",
        })
      );
    });
  });
});
