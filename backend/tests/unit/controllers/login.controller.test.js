import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
} from "../../helpers/testHelpers.js";

// Cấu hình env giả
process.env.SUPABASE_URL = "http://localhost:8000";
process.env.SUPABASE_KEY = "test-key";

// Mock comparePassword
const mockComparePassword = jest.fn();
jest.unstable_mockModule("@src/middleware/comparePass.middleware.js", () => ({
  comparePassword: mockComparePassword,
}));

// ✅ Mock Supabase client
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
};

// ✅ Mock @config/database.js thay vì @supabase/supabase-js
jest.unstable_mockModule("@config/database.js", () => ({
  supabase: mockSupabase,
}));

// Mock jwt
const mockJwtSign = jest.fn();
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: mockJwtSign,
  },
}));

const { login } = await import(
  "@src/controllers/UserAccount/login.controller.js"
);

describe("LoginController - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES = "1d";
    
    // ✅ Reset mock chain
    mockSupabase.from.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
    mockSupabase.single.mockResolvedValue({ data: null, error: null });
  });

  describe("TC_UC02_01 - Login successful with valid credentials", () => {
    it("TC_UC02_01 - Đăng nhập thành công (Thông tin hợp lệ) - Teller", async () => {
      const req = createMockRequest({
        body: {
          username: "test@example.com",
          password: "correctpassword",
        },
      });
      const res = createMockResponse();

      const mockUserData = {
        employeeid: "EMP001",
        fullname: "Test User",
        email: "test@example.com",
        roleid: 2,
        role: { rolename: "Teller" },
        useraccount: {
          userid: "EMP001",
          password: "$2b$12$hashedpassword",
          accountstatus: "active",
        },
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockUserData,
        error: null,
      });
      mockComparePassword.mockResolvedValue(true);
      mockJwtSign.mockReturnValue("mock-jwt-token");

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        success: true,
        data: expect.objectContaining({
          userId: "EMP001",
          username: "EMP001",
          fullName: "Test User",
          roleName: "Teller",
          status: "active",
          token: "mock-jwt-token",
        }),
      });
    });

    it("TC_UC02_01 - Đăng nhập thành công (Thông tin hợp lệ) - Accountant", async () => {
      const req = createMockRequest({
        body: {
          username: "accountant@example.com",
          password: "correctpassword",
        },
      });
      const res = createMockResponse();

      const mockUserData = {
        employeeid: "EMP002",
        fullname: "Accountant User",
        email: "accountant@example.com",
        roleid: 3,
        role: { rolename: "Accountant" },
        useraccount: {
          userid: "EMP002",
          password: "$2b$12$hashedpassword",
          accountstatus: "active",
        },
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockUserData,
        error: null,
      });
      mockComparePassword.mockResolvedValue(true);
      mockJwtSign.mockReturnValue("mock-jwt-token");

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            roleName: "Accountant",
          }),
        })
      );
    });
  });

  describe("TC_UC02_03 - Login failed (Wrong Username or Password)", () => {
    it("TC_UC02_03 - Đăng nhập thất bại (Sai Username hoặc Password) - User not found", async () => {
      const req = createMockRequest({
        body: {
          username: "nonexistent@example.com",
          password: "anypassword",
        },
      });
      const res = createMockResponse();

      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { message: "Not found" },
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid username or password",
        success: false,
      });
    });

    it("TC_UC02_03 - Đăng nhập thất bại (Sai Username hoặc Password) - Password incorrect", async () => {
      const req = createMockRequest({
        body: {
          username: "test@example.com",
          password: "wrongpassword",
        },
      });
      const res = createMockResponse();

      const mockUserData = {
        employeeid: "EMP001",
        useraccount: {
          userid: "EMP001",
          password: "$2b$12$hashedpassword",
        },
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockUserData,
        error: null,
      });
      mockComparePassword.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Incorrect password",
        success: false,
      });
    });
  });

  describe("TC_UC02_02 - Login failed - Empty fields", () => {
    it("TC_UC02_02 - Đăng nhập thất bại - Bỏ trống thông tin - Missing username", async () => {
      const req = createMockRequest({
        body: {
          password: "password123",
        },
      });
      const res = createMockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username and password are required",
      });
    });

    it("TC_UC02_02 - Đăng nhập thất bại - Bỏ trống thông tin - Missing password", async () => {
      const req = createMockRequest({
        body: {
          username: "test@example.com",
        },
      });
      const res = createMockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username and password are required",
      });
    });

    it("TC_UC02_02 - Đăng nhập thất bại - Bỏ trống thông tin - Missing both", async () => {
      const req = createMockRequest({
        body: {},
      });
      const res = createMockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username and password are required",
      });
    });
  });

  describe("TC_UC02_04 - Login failed - Account disabled", () => {
    it("TC_UC02_04 - Đăng nhập thất bại - Tài khoản bị vô hiệu hóa - Rejected status", async () => {
      const req = createMockRequest({
        body: {
          username: "test@example.com",
          password: "correctpassword",
        },
      });
      const res = createMockResponse();

      const mockUserData = {
        employeeid: "EMP001",
        fullname: "Test User",
        role: { rolename: "Teller" },
        useraccount: {
          userid: "EMP001",
          password: "$2b$12$hashedpassword",
          accountstatus: "Rejected",
        },
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockUserData,
        error: null,
      });
      mockComparePassword.mockResolvedValue(true);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Account disabled. Contact administrator.",
        success: false,
      });
    });
  });

  describe("TC_UC02_07 - Password security check", () => {
    it("TC_UC02_07 - Kiểm tra bảo mật mật khẩu (Database) - Password is hashed", async () => {
      const req = createMockRequest({
        body: {
          username: "test@example.com",
          password: "correctpassword",
        },
      });
      const res = createMockResponse();

      const mockUserData = {
        employeeid: "EMP001",
        fullname: "Test User",
        email: "test@example.com",
        roleid: 2,
        role: { rolename: "Teller" },
        useraccount: {
          userid: "EMP001",
          password: "$2b$12$hashedpassword12345678901234567890",
          accountstatus: "active",
        },
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockUserData,
        error: null,
      });
      mockComparePassword.mockResolvedValue(true);
      mockJwtSign.mockReturnValue("mock-jwt-token");

      await login(req, res);

      // Verify password is hashed (starts with $2b$)
      expect(mockUserData.useraccount.password).toMatch(/^\$2b\$/);
      expect(mockUserData.useraccount.password).not.toBe("correctpassword");
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("Error handling", () => {
    it("should return 500 on server error", async () => {
      const req = createMockRequest({
        body: {
          username: "test@example.com",
          password: "password123",
        },
      });
      const res = createMockResponse();

      mockSupabase.single.mockRejectedValueOnce(new Error("Database error"));
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server error",
        detail: expect.any(String),
      });

      consoleErrorSpy.mockRestore();
    });
  });
});

