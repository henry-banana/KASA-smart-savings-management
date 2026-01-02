import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
} from "../../helpers/testHelpers.js";

// Cấu hình env giả để database.js không throw
process.env.SUPABASE_URL = "http://localhost:8000";
process.env.SUPABASE_KEY = "test-key";

// Mock otpStore
const mockVerifyOTP = jest.fn();
const mockDeleteOTP = jest.fn();
const otpStorePath = new URL("../../../src/utils/otpStore.js", import.meta.url)
  .pathname;
jest.unstable_mockModule(otpStorePath, () => ({
  verifyOTP: mockVerifyOTP,
  deleteOTP: mockDeleteOTP,
}));

// Mock hashing middleware
const mockHashPassword = jest.fn();
const hashingPath = new URL(
  "../../../src/middleware/hashing.middleware.js",
  import.meta.url
).pathname;
jest.unstable_mockModule(hashingPath, () => ({
  hashPassword: mockHashPassword,
}));

// Mock Supabase client thông qua @supabase/supabase-js
const mockSupabase = {
  from: jest.fn(() => mockSupabase),
  update: jest.fn(() => mockSupabase),
  eq: jest.fn(() => mockSupabase),
  select: jest.fn(() => mockSupabase),
  single: jest.fn(),
};

jest.unstable_mockModule("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => mockSupabase),
}));

const { resetPassword } = await import(
  "../../../src/controllers/UserAccount/resetPassword.controller.js"
);

describe("ResetPasswordController - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHashPassword.mockResolvedValue("$2b$12$hashedpassword");
    
    // ✅ Reset mock chain behavior
    mockSupabase.from.mockReturnValue(mockSupabase);
    mockSupabase.update.mockReturnValue(mockSupabase);
    mockSupabase.eq.mockReturnValue(mockSupabase);
    mockSupabase.select.mockReturnValue(mockSupabase);
    mockSupabase.single.mockResolvedValue({ data: null, error: null });
  });

  describe("UC03 - Reset Password", () => {
    it("TC_UC03_01 - Quên mật khẩu thành công - Password reset", async () => {
      const req = createMockRequest({
        body: {
          email: "test@example.com",
          otp: "123456",
          newPassword: "newpassword123",
        },
      });
      const res = createMockResponse();

      mockVerifyOTP.mockReturnValue({
        valid: true,
        userId: "EMP001",
      });

      // ✅ Mock toàn bộ chain - single() phải trả về data và error
      mockSupabase.single.mockResolvedValueOnce({
        data: { 
          userid: "EMP001",
          password: "$2b$12$hashedpassword"
        },
        error: null,
      });

      await resetPassword(req, res);

      // ✅ Verify chain được gọi đúng thứ tự
      expect(mockSupabase.from).toHaveBeenCalledWith("useraccount");
      expect(mockSupabase.update).toHaveBeenCalledWith({
        password: "$2b$12$hashedpassword"
      });
      expect(mockSupabase.eq).toHaveBeenCalledWith("userid", "EMP001");
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.single).toHaveBeenCalled();
      
      // ✅ Verify OTP và password
      expect(mockVerifyOTP).toHaveBeenCalledWith("test@example.com", "123456");
      expect(mockHashPassword).toHaveBeenCalledWith("newpassword123");
      
      // ✅ Verify deleteOTP được gọi
      expect(mockDeleteOTP).toHaveBeenCalledWith("test@example.com");
      
      // ✅ Verify response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Password reset successfully",
        success: true,
      });
    });

    it("TC_UC03_06 - Lỗi mật khẩu yếu - Password too short", async () => {
      const req = createMockRequest({
        body: {
          email: "test@example.com",
          otp: "123456",
          newPassword: "12345", // Less than 6 characters
        },
      });
      const res = createMockResponse();

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Password must be at least 6 characters",
        success: false,
      });
    });

    it("should return 400 when OTP is invalid", async () => {
      const req = createMockRequest({
        body: {
          email: "test@example.com",
          otp: "wrongotp",
          newPassword: "newpassword123",
        },
      });
      const res = createMockResponse();

      mockVerifyOTP.mockReturnValue({
        valid: false,
      });

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or expired OTP",
        success: false,
      });
    });

    it("should return 400 when email is missing", async () => {
      const req = createMockRequest({
        body: {
          otp: "123456",
          newPassword: "newpassword123",
        },
      });
      const res = createMockResponse();

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email, OTP and new password are required",
        success: false,
      });
    });

    it("TC_UC03_12 - Lỗi DB khi lưu mật khẩu mới - Database error", async () => {
      const req = createMockRequest({
        body: {
          email: "test@example.com",
          otp: "123456",
          newPassword: "newpassword123",
        },
      });
      const res = createMockResponse();

      mockVerifyOTP.mockReturnValue({
        valid: true,
        userId: "EMP001",
      });

      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: "Update failed" },
      });
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to reset password",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });

    it("should return 500 on server error", async () => {
      const req = createMockRequest({
        body: {
          email: "test@example.com",
          otp: "123456",
          newPassword: "newpassword123",
        },
      });
      const res = createMockResponse();

      mockVerifyOTP.mockImplementation(() => {
        throw new Error("Server error");
      });
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to reset password",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });
  });
});

