import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
} from "../../helpers/testHelpers.js";

// Mock otpStore
const mockVerifyOTP = jest.fn();
jest.unstable_mockModule("@src/utils/otpStore.js", () => ({
  verifyOTP: mockVerifyOTP,
}));

const { verifyOTPController } = await import(
  "../../../src/controllers/UserAccount/verifyOTP.controller.js"
);

describe("VerifyOTPController - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("UC03 - Verify OTP", () => {
    it("TC_UC03_01 - Quên mật khẩu thành công - OTP verified", async () => {
      const req = createMockRequest({
        body: {
          email: "test@example.com",
          otp: "123456",
        },
      });
      const res = createMockResponse();

      mockVerifyOTP.mockReturnValue({
        valid: true,
        userId: "EMP001",
      });

      await verifyOTPController(req, res);

      expect(mockVerifyOTP).toHaveBeenCalledWith("test@example.com", "123456");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "OTP verified successfully",
        success: true,
      });
    });

    it("TC_UC03_04 - Lỗi mã OTP hết hạn - OTP expired", async () => {
      const req = createMockRequest({
        body: {
          email: "test@example.com",
          otp: "123456",
        },
      });
      const res = createMockResponse();

      mockVerifyOTP.mockReturnValue({
        valid: false,
        error: "OTP expired",
      });

      await verifyOTPController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "OTP expired",
        success: false,
      });
    });

    it("TC_UC03_03 - Lỗi mã OTP sai - Invalid OTP", async () => {
      const req = createMockRequest({
        body: {
          email: "test@example.com",
          otp: "wrongotp",
        },
      });
      const res = createMockResponse();

      mockVerifyOTP.mockReturnValue({
        valid: false,
        error: "Invalid OTP",
      });

      await verifyOTPController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid OTP",
        success: false,
      });
    });

    it("should return 400 when email is missing", async () => {
      const req = createMockRequest({
        body: {
          otp: "123456",
        },
      });
      const res = createMockResponse();

      await verifyOTPController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email and OTP are required",
        success: false,
      });
    });

    it("should return 400 when OTP is missing", async () => {
      const req = createMockRequest({
        body: {
          email: "test@example.com",
        },
      });
      const res = createMockResponse();

      await verifyOTPController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email and OTP are required",
        success: false,
      });
    });

    it("should return 500 on server error", async () => {
      const req = createMockRequest({
        body: {
          email: "test@example.com",
          otp: "123456",
        },
      });
      const res = createMockResponse();

      mockVerifyOTP.mockImplementation(() => {
        throw new Error("Server error");
      });
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await verifyOTPController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to verify OTP",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });
  });
});

