import { beforeEach, describe, expect, jest } from "@jest/globals";
import {
  createMockSupabaseClient,
  resetSupabaseMock,
  mockSuccessResponse,
  mockNotFoundResponse,
  mockErrorResponse,
} from "../../mocks/supabase.mock.js";

const mockSupabase = createMockSupabaseClient();

jest.unstable_mockModule("@config/database.js", () => ({
  supabase: mockSupabase,
}));

// Import UserAccount AFTER mocking
const { UserAccountModel } = await import("../../../src/models/UserAccount.js");

describe("UserAccount Model - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetSupabaseMock(mockSupabase);
  });

  describe("Model Configuration", () => {
    it("should have correct table name", () => {
      expect(UserAccountModel.tableName).toBe("useraccount");
    });

    it("should have correct primary key", () => {
      expect(UserAccountModel.primaryKey).toBe("userid");
    });
  });

  describe("getById()", () => {
    it("should return user account when found", async () => {
      // === ARRANGE ===
      const mockUserAccount = {
        userid: "EMP001",
        username: "EMP001",
        password: "$2b$12$hashedpassword...",
        accountstatus: "active",
      };

      mockSupabase.single.mockResolvedValue(
        mockSuccessResponse(mockUserAccount)
      );

      // === ACT ===
      const result = await UserAccountModel.getById("EMP001");

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("useraccount");
      expect(mockSupabase.select).toHaveBeenCalledWith("*");
      expect(mockSupabase.eq).toHaveBeenCalledWith("userid", "EMP001");
      expect(mockSupabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockUserAccount);
    });

    it("should return null when user not found", async () => {
      // === ARRANGE ===
      mockSupabase.single.mockResolvedValue(mockNotFoundResponse());

      // === ACT ===
      const result = await UserAccountModel.getById("NOTEXIST");

      // === ASSERT ===
      expect(result).toBeNull();
    });
  });

  describe("create()", () => {
    it("should create user account successfully", async () => {
      // === ARRANGE ===
      const newUserData = {
        userid: "EMP002",
        username: "EMP002",
        password: "$2b$12$hashednewpassword...",
        accountstatus: "active",
      };

      mockSupabase.select.mockResolvedValue(mockSuccessResponse([newUserData]));

      // === ACT ===
      const result = await UserAccountModel.create(newUserData);

      // === ASSERT ===
      expect(mockSupabase.from).toHaveBeenCalledWith("useraccount");
      expect(mockSupabase.insert).toHaveBeenCalledWith([newUserData]);
      expect(result).toEqual(newUserData);
    });

    it("should throw error when creation fails", async () => {
      // === ARRANGE ===
      const newUserData = {
        userid: "EMP001",
        username: "EMP001",
        password: "$2b$12$...",
      };

      mockSupabase.select.mockResolvedValue(
        mockErrorResponse("Duplicate userid", "23505")
      );

      // === ACT & ASSERT ===
      await expect(UserAccountModel.create(newUserData)).rejects.toThrow();
    });
  });

  describe("update()", () => {
    it("should update user account successfully", async () => {
      // === ARRANGE ===
      const userId = "EMP001";
      const updates = { accountstatus: "Force Change Password" };
      const updatedAccount = {
        userid: userId,
        accountstatus: "Force Change Password",
      };

      mockSupabase.select.mockResolvedValue(
        mockSuccessResponse([updatedAccount])
      );

      // === ACT ===
      const result = await UserAccountModel.update(userId, updates);

      // === ASSERT ===
      expect(mockSupabase.update).toHaveBeenCalledWith(updates);
      expect(mockSupabase.eq).toHaveBeenCalledWith("userid", userId);
      expect(result).toEqual(updatedAccount);
    });

    it("should update password hash successfully", async () => {
      // === ARRANGE ===
      const userId = "EMP001";
      const newPasswordHash = "$2b$12$newhashedpassword...";
      const updates = { password: newPasswordHash };

      mockSupabase.select.mockResolvedValue(
        mockSuccessResponse([{ userid: userId, password: newPasswordHash }])
      );

      // === ACT ===
      const result = await UserAccountModel.update(userId, updates);

      // === ASSERT ===
      expect(result.password).toBe(newPasswordHash);
      expect(result.password).toMatch(/^\$2b\$/); // Bcrypt format
    });
  });

  describe("delete()", () => {
    it("should delete user account successfully", async () => {
      // === ARRANGE ===
      const userId = "EMP001";
      const deletedAccount = {
        userid: userId,
        username: "EMP001",
      };

      mockSupabase.select.mockResolvedValue(
        mockSuccessResponse([deletedAccount])
      );

      // === ACT ===
      const result = await UserAccountModel.delete(userId);

      // === ASSERT ===
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith("userid", userId);
      expect(result).toEqual(deletedAccount);
    });
  });

  describe("getAll()", () => {
    it("should return all user accounts", async () => {
      // === ARRANGE ===
      const mockAccounts = [
        { userid: "EMP001", accountstatus: "active" },
        { userid: "EMP002", accountstatus: "active" },
      ];

      mockSupabase.select.mockResolvedValue(mockSuccessResponse(mockAccounts));

      // === ACT ===
      const result = await UserAccountModel.getAll();

      // === ASSERT ===
      expect(result).toEqual(mockAccounts);
      expect(result).toHaveLength(2);
    });

    it("should filter by status when provided", async () => {
      // === ARRANGE ===
      const filters = { accountstatus: "Rejected" };
      const mockAccounts = [{ userid: "EMP003", accountstatus: "Rejected" }];

      const mockQueryChain = {
        eq: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => {
          resolve(mockSuccessResponse(mockAccounts));
          return Promise.resolve(mockSuccessResponse(mockAccounts));
        }),
      };

      mockSupabase.select.mockReturnValue(mockQueryChain);

      // === ACT ===
      const result = await UserAccountModel.getAll(filters);

      // === ASSERT ===
      expect(mockQueryChain.eq).toHaveBeenCalledWith(
        "accountstatus",
        "Rejected"
      );
      expect(result).toEqual(mockAccounts);
    });
  });
});
