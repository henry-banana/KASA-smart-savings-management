import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  mockBcryptHash,
  mockBcryptCompare,
  createMockEmployee,
} from "../../helpers/testHelpers.js";

// === MOCK REPOSITORIES ===
const mockUserAccountRepository = {
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockEmployeeRepository = {
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockBranchRepository = {
  getByName: jest.fn(),
};

const mockRoleModel = {
  getByName: jest.fn(),
};

// === MOCK MODULES ===
jest.unstable_mockModule(
  "@src/repositories/UserAccount/UserAccountRepository.js",
  () => ({
    userAccountRepository: mockUserAccountRepository,
  })
);

jest.unstable_mockModule(
  "@src/repositories/Employee/EmployeeRepository.js",
  () => ({
    employeeRepository: mockEmployeeRepository,
  })
);

jest.unstable_mockModule("@src/models/Branch.js", () => ({
  Branch: {
    getByName: mockBranchRepository.getByName,
  },
}));

jest.unstable_mockModule("@src/models/Role.js", () => ({
  Role: {
    getByName: mockRoleModel.getByName,
  },
}));

// Mock bcrypt
const mockHashPassword = mockBcryptHash();
const mockComparePassword = mockBcryptCompare(true);

jest.unstable_mockModule("@src/middleware/hashing.middleware.js", () => ({
  hashPassword: mockHashPassword,
}));

jest.unstable_mockModule("@src/middleware/comparePass.middleware.js", () => ({
  comparePassword: mockComparePassword,
}));

// === IMPORT SERVICE ===
const { userAccountService } = await import(
  "@src/services/UserAccount/userAccount.service.js"
);

describe("UserAccountService - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUserAccount()", () => {
    it("TC_UC01_08 - should hash password when creating account", async () => {
      // === ARRANGE ===
      const inputData = {
        fullName: "Nguyen Van A",
        roleName: "Teller",
        email: "test@gmail.com",
        branchName: "Branch 1",
      };

      const mockRole = { roleid: 2, rolename: "Teller" };
      const mockBranch = { branchid: 1, branchname: "Branch 1" };
      const mockEmployee = {
        employeeid: "EMP001",
        fullname: "Nguyen Van A",
        email: "test@gmail.com",
        roleid: 2,
        branchid: 1,
      };

      const mockUserAccount = {
        userid: "EMP001",
        username: "EMP001",
        password: "$2b$12$hashedpassword...",
        accountstatus: "active",
      };

      mockRoleModel.getByName.mockResolvedValueOnce(mockRole);
      mockBranchRepository.getByName.mockResolvedValueOnce(mockBranch);
      mockEmployeeRepository.create.mockResolvedValueOnce(mockEmployee);
      mockUserAccountRepository.findById.mockResolvedValueOnce(mockUserAccount);
      mockUserAccountRepository.update.mockResolvedValueOnce({
        ...mockUserAccount,
        password: "$2b$12$hashedpassword...",
      });
      mockHashPassword.mockResolvedValueOnce("$2b$12$hashedpassword...");

      // === ACT ===
      const result = await userAccountService.createUserAccount(inputData);

      // === ASSERT ===
      expect(mockHashPassword).toHaveBeenCalledWith("123456");
      expect(mockUserAccountRepository.update).toHaveBeenCalledWith(
        "EMP001",
        expect.objectContaining({
          password: expect.stringMatching(/^\$2b\$/),
        })
      );
      expect(result).toBeDefined();
      expect(result.username).toBe("EMP001");
    });

    it("should throw error when missing required fields", async () => {
      const invalidData = {
        fullName: "Test",
      };

      await expect(
        userAccountService.createUserAccount(invalidData)
      ).rejects.toThrow("Missing required fields");
    });

    it("should throw error when role not found", async () => {
      const inputData = {
        fullName: "Test User",
        roleName: "InvalidRole",
        email: "test@example.com",
        branchName: "Branch 1",
      };

      mockRoleModel.getByName.mockResolvedValueOnce(null);

      await expect(
        userAccountService.createUserAccount(inputData)
      ).rejects.toThrow("Role not found");
    });

    it("should throw error when branch not found", async () => {
      const inputData = {
        fullName: "Test User",
        roleName: "Teller",
        email: "test@example.com",
        branchName: "NonExistentBranch",
      };

      const mockRole = { roleid: 2, rolename: "Teller" };
      mockRoleModel.getByName.mockResolvedValueOnce(mockRole);
      mockBranchRepository.getByName.mockResolvedValueOnce(null);

      await expect(
        userAccountService.createUserAccount(inputData)
      ).rejects.toThrow("Branch not found");
    });

    it("should create both employee and user account", async () => {
      // === ARRANGE ===
      const inputData = {
        fullName: "New Employee",
        roleName: "Accountant",
        email: "new@example.com",
        branchName: "Branch 2",
      };

      const mockRole = { roleid: 3, rolename: "Accountant" };
      const mockBranch = { branchid: 2, branchname: "Branch 2" };
      const mockEmployee = {
        employeeid: "EMP002",
        fullname: "New Employee",
        email: "new@example.com",
        roleid: 3,
        branchid: 2,
      };

      mockRoleModel.getByName.mockResolvedValueOnce(mockRole);
      mockBranchRepository.getByName.mockResolvedValueOnce(mockBranch);
      mockEmployeeRepository.create.mockResolvedValueOnce(mockEmployee);
      mockUserAccountRepository.findById.mockResolvedValueOnce({
        userid: "EMP002",
        accountstatus: "active",
      });
      mockUserAccountRepository.update.mockResolvedValueOnce({
        userid: "EMP002",
        password: "$2b$12$hashed...",
      });
      mockHashPassword.mockResolvedValueOnce("$2b$12$hashed...");

      // === ACT ===
      const result = await userAccountService.createUserAccount(inputData);

      // === ASSERT ===
      expect(mockRoleModel.getByName).toHaveBeenCalledWith("Accountant");
      expect(mockEmployeeRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fullname: "New Employee",
          email: "new@example.com",
          roleid: 3,
          branchid: 2,
        })
      );
      expect(mockUserAccountRepository.update).toHaveBeenCalled();
      expect(result.roleName).toBe("Accountant");
    });
  });

  describe("getAllUserAccounts()", () => {
    it("should return all user accounts", async () => {
      // === ARRANGE ===
      const mockAccounts = [
        { userid: "EMP001", username: "EMP001" },
        { userid: "EMP002", username: "EMP002" },
      ];

      mockUserAccountRepository.findAll.mockResolvedValue(mockAccounts);

      // === ACT ===
      const result = await userAccountService.getAllUserAccounts();

      // === ASSERT ===
      expect(result).toEqual(mockAccounts);
      expect(mockUserAccountRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUserAccountById()", () => {
    it("TC_UC04_05 - should return user account when found", async () => {
      // === ARRANGE ===
      const userId = "EMP001";
      const mockAccount = {
        userid: "EMP001",
        username: "EMP001",
        email: "test@example.com",
      };

      mockUserAccountRepository.findById.mockResolvedValue(mockAccount);

      // === ACT ===
      const result = await userAccountService.getUserAccountById(userId);

      // === ASSERT ===
      expect(mockUserAccountRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockAccount);
    });

    it("TC_UC04_05 - should throw error when user not found", async () => {
      // === ARRANGE ===
      mockUserAccountRepository.findById.mockResolvedValue(null);

      // === ACT & ASSERT ===
      await expect(
        userAccountService.getUserAccountById("NOTEXIST")
      ).rejects.toThrow("User account not found");
    });
  });

  describe("updateUserAccount()", () => {
    it("should update user account without password", async () => {
      // === ARRANGE ===
      const userId = "EMP001";
      const updates = {
        username: "newusername",
        email: "newemail@example.com",
      };

      const existingAccount = { userid: userId, username: "oldusername" };
      const updatedAccount = { ...existingAccount, ...updates };

      mockUserAccountRepository.findById.mockResolvedValue(existingAccount);
      mockUserAccountRepository.update.mockResolvedValue(updatedAccount);

      // === ACT ===
      const result = await userAccountService.updateUserAccount(
        userId,
        updates
      );

      // === ASSERT ===
      expect(mockUserAccountRepository.update).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({
          username: "newusername",
          email: "newemail@example.com",
        })
      );
      expect(mockHashPassword).not.toHaveBeenCalled();
    });

    it("should hash password when updating password", async () => {
      // === ARRANGE ===
      const userId = "EMP001";
      const updates = {
        password: "newpassword123",
      };

      const existingAccount = { userid: userId };
      mockUserAccountRepository.findById.mockResolvedValue(existingAccount);
      mockHashPassword.mockResolvedValue("$2b$12$newhashedpassword...");
      mockUserAccountRepository.update.mockResolvedValue({
        ...existingAccount,
        password: "$2b$12$newhashedpassword...",
      });

      // === ACT ===
      await userAccountService.updateUserAccount(userId, updates);

      // === ASSERT ===
      expect(mockHashPassword).toHaveBeenCalledWith("newpassword123");
      expect(mockUserAccountRepository.update).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({
          password: expect.stringMatching(/^\$2b\$/),
        })
      );
    });

    it("should throw error when user not found", async () => {
      // === ARRANGE ===
      mockUserAccountRepository.findById.mockResolvedValue(null);

      // === ACT & ASSERT ===
      await expect(
        userAccountService.updateUserAccount("NOTEXIST", {})
      ).rejects.toThrow("User account not found");
    });
  });

  describe("deleteUserAccount()", () => {
    it("should delete user account successfully", async () => {
      // === ARRANGE ===
      const userId = "EMP001";
      mockUserAccountRepository.findById.mockResolvedValue({ userid: userId });
      mockUserAccountRepository.delete.mockResolvedValue({ userid: userId });

      // === ACT ===
      const result = await userAccountService.deleteUserAccount(userId);

      // === ASSERT ===
      expect(mockUserAccountRepository.delete).toHaveBeenCalledWith(userId);
      expect(result.message).toBe("User account deleted successfully.");
    });

    it("should throw error when user not found", async () => {
      // === ARRANGE ===
      mockUserAccountRepository.findById.mockResolvedValue(null);

      // === ACT & ASSERT ===
      await expect(
        userAccountService.deleteUserAccount("NOTEXIST")
      ).rejects.toThrow("User account not found");
    });
  });

  describe("login() - Password Verification", () => {
    it("TC_UC02_03 - should verify password correctly on login", async () => {
      // === ARRANGE ===
      const loginData = {
        email: "test@gmail.com",
        password: "correctpassword",
      };

      const mockUser = {
        userid: "EMP001",
        username: "EMP001",
        email: "test@gmail.com",
        password: "$2b$12$hashedpassword...",
        roleid: 2,
      };

      // Note: findByEmail doesn't exist in current repo,
      // this is just demonstration based on test case
      mockUserAccountRepository.findByEmail = jest.fn();
      mockUserAccountRepository.findByEmail.mockResolvedValue(mockUser);
      mockComparePassword.mockResolvedValue(true);

      // === ACT ===
      const result = await userAccountService.login(loginData);

      // === ASSERT ===
      expect(mockComparePassword).toHaveBeenCalledWith(
        "correctpassword",
        "$2b$12$hashedpassword..."
      );
      expect(result.message).toBe("Login successful.");
      expect(result.user.id).toBe("EMP001");
    });

    it("TC_UC02_03 - should throw error with wrong password", async () => {
      // === ARRANGE ===
      const loginData = {
        email: "test@gmail.com",
        password: "wrongpassword",
      };

      const mockUser = {
        userid: "EMP001",
        password: "$2b$12$hashedpassword...",
      };

      mockUserAccountRepository.findByEmail = jest.fn();
      mockUserAccountRepository.findByEmail.mockResolvedValue(mockUser);
      mockComparePassword.mockResolvedValue(false);

      // === ACT & ASSERT ===
      await expect(userAccountService.login(loginData)).rejects.toThrow(
        "Invalid email or password"
      );
    });

    it("should throw error when user not found", async () => {
      // === ARRANGE ===
      mockUserAccountRepository.findByEmail = jest.fn();
      mockUserAccountRepository.findByEmail.mockResolvedValue(null);

      // === ACT & ASSERT ===
      await expect(
        userAccountService.login({
          email: "notexist@example.com",
          password: "anypassword",
        })
      ).rejects.toThrow("Invalid email or password");
    });
  });
});
