import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
} from "../../helpers/testHelpers.js";

// Cấu hình env giả
process.env.SUPABASE_URL = "http://localhost:8000";
process.env.SUPABASE_KEY = "test-key";

// Mock otpStore
const mockSaveOTP = jest.fn();
jest.unstable_mockModule("@src/utils/otpStore.js", () => ({
  saveOTP: mockSaveOTP,
}));

// Mock email service
const mockSendOTPEmail = jest.fn();
jest.unstable_mockModule("@src/services/UserAccount/email.service.js", () => ({
  sendOTPEmail: mockSendOTPEmail,
}));

// ✅ Mock Supabase client - chain đầy đủ
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
};

// ✅ Mock @config/database.js thay vì @supabase/supabase-js
jest.unstable_mockModule("@config/database.js", () => ({
  supabase: mockSupabase,
}));

const { forgotPassword } = await import(
  "@src/controllers/UserAccount/forgotPassword.controller.js"
);

describe("ForgotPasswordController - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSaveOTP.mockReturnValue("123456");
    mockSendOTPEmail.mockResolvedValue(undefined);
    
    // ✅ Reset mock chain
    mockSupabase.from.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
    mockSupabase.maybeSingle.mockResolvedValue({ data: null, error: null });
  });

  describe("UC03 - Forgot Password", () => {
    it("TC_UC03_01 - Quên mật khẩu thành công - Email found", async () => {
      const req = createMockRequest({
        body: {
          emailOrUsername: "test@example.com",
        },
      });
      const res = createMockResponse();

      const mockEmployee = {
        employeeid: "EMP001",
        email: "test@example.com",
        fullname: "Test User",
      };

      const mockUserAccount = {
        userid: "EMP001",
      };

      // ✅ Mock 2 lần gọi maybeSingle()
      mockSupabase.maybeSingle
        .mockResolvedValueOnce({
          data: mockEmployee,
          error: null,
        })
        .mockResolvedValueOnce({
          data: mockUserAccount,
          error: null,
        });

      await forgotPassword(req, res);

      // Verify Supabase chain
      expect(mockSupabase.from).toHaveBeenCalledWith("employee");
      expect(mockSupabase.eq).toHaveBeenCalledWith("email", "test@example.com");
      
      // Verify OTP và email
      expect(mockSaveOTP).toHaveBeenCalledWith("test@example.com", "EMP001", 5);
      expect(mockSendOTPEmail).toHaveBeenCalledWith(
        "test@example.com",
        "123456",
        "Test User"
      );
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "OTP sent to your email",
        success: true,
        data: {
          email: "test@example.com",
        },
      });
    });

    it("should send OTP when user found by username", async () => {
      const req = createMockRequest({
        body: {
          emailOrUsername: "EMP001",
        },
      });
      const res = createMockResponse();

      const mockUserData = {
        userid: "EMP001",
        employee: {
          email: "test@example.com",
          fullname: "Test User",
        },
      };

      // ✅ Mock maybeSingle() trả về user account với employee join
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: mockUserData,
        error: null,
      });

      await forgotPassword(req, res);

      expect(mockSupabase.from).toHaveBeenCalledWith("useraccount");
      expect(mockSupabase.eq).toHaveBeenCalledWith("userid", "EMP001");
      expect(mockSaveOTP).toHaveBeenCalledWith("test@example.com", "EMP001", 5);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 when emailOrUsername is missing", async () => {
      const req = createMockRequest({
        body: {},
      });
      const res = createMockResponse();

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email or username is required",
        success: false,
      });
    });

    it("TC_UC03_02 - Lỗi Email không tồn tại - Email not found", async () => {
      const req = createMockRequest({
        body: {
          emailOrUsername: "nonexistent@example.com",
        },
      });
      const res = createMockResponse();

      // ✅ Mock maybeSingle() trả về null (not found)
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null, // ← Không phải error object, chỉ là data: null
      });

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
        success: false,
      });
    });

    it("should return 404 when user not found by username", async () => {
      const req = createMockRequest({
        body: {
          emailOrUsername: "NONEXIST",
        },
      });
      const res = createMockResponse();

      // ✅ Mock maybeSingle() trả về null
      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
        success: false,
      });
    });

    it("should return 500 on server error", async () => {
      const req = createMockRequest({
        body: {
          emailOrUsername: "test@example.com",
        },
      });
      const res = createMockResponse();

      // ✅ Mock throw error
      mockSupabase.maybeSingle.mockRejectedValueOnce(new Error("Database error"));
      
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to process password reset request",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });
  });
});

