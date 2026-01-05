import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock bcrypt (promise style)
const mockBcryptCompare = jest.fn();
jest.unstable_mockModule("bcrypt", () => ({
  default: {
    compare: mockBcryptCompare,
  },
}));

const { comparePassword } = await import(
  "@src/middleware/comparePass.middleware.js"
);

describe("ComparePassMiddleware - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("comparePassword()", () => {
    it("TC_UC02_03 - Đăng nhập thất bại (Sai Username hoặc Password) - Password matches", async () => {
      const plainPassword = "correctpassword";
      const hashedPassword = "$2b$12$hashedpassword";

      mockBcryptCompare.mockResolvedValue(true);

      const result = await comparePassword(plainPassword, hashedPassword);

      expect(mockBcryptCompare).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it("TC_UC02_03 - Đăng nhập thất bại (Sai Username hoặc Password) - Password does not match", async () => {
      const plainPassword = "wrongpassword";
      const hashedPassword = "$2b$12$hashedpassword";

      mockBcryptCompare.mockResolvedValue(false);

      const result = await comparePassword(plainPassword, hashedPassword);

      expect(result).toBe(false);
    });

    it("should handle comparison errors", async () => {
      const plainPassword = "password";
      const hashedPassword = "$2b$12$hashedpassword";
      const error = new Error("Comparison failed");

      mockBcryptCompare.mockRejectedValue(error);

      await expect(
        comparePassword(plainPassword, hashedPassword)
      ).rejects.toThrow("Comparison failed");
    });

    it("should throw TypeError when plainPassword is not a string", async () => {
      await expect(comparePassword(null, "$2b$12$hashedpassword")).rejects.toThrow(TypeError);
      await expect(comparePassword(123, "$2b$12$hashedpassword")).rejects.toThrow(TypeError);
      await expect(comparePassword(undefined, "$2b$12$hashedpassword")).rejects.toThrow(TypeError);
    });

    it("should throw TypeError when passwordHash is not a string", async () => {
      await expect(comparePassword("password", null)).rejects.toThrow(TypeError);
      await expect(comparePassword("password", 123)).rejects.toThrow(TypeError);
      await expect(comparePassword("password", undefined)).rejects.toThrow(TypeError);
    });
  });
});
