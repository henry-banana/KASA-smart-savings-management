import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock bcrypt (promise style)
const mockBcryptHash = jest.fn();
jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: mockBcryptHash,
  },
}));

const { hashPassword } = await import("@src/middleware/hashing.middleware.js");

describe("HashingMiddleware - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("hashPassword()", () => {
    it("TC_UC01_08 - Kiểm tra mã hóa mật khẩu", async () => {
      const password = "123456";
      const hashedPassword = "$2b$12$hashedpassword";

      mockBcryptHash.mockResolvedValue(hashedPassword);

      const result = await hashPassword(password);

      expect(mockBcryptHash).toHaveBeenCalledWith(password, 12);
      expect(result).toBe(hashedPassword);
    });

    it("should handle hashing errors", async () => {
      const password = "123456";
      const error = new Error("Hashing failed");

      mockBcryptHash.mockRejectedValue(error);

      await expect(hashPassword(password)).rejects.toThrow("Hashing failed");
    });

    it("should throw TypeError when password is not a string", async () => {
      await expect(hashPassword(null)).rejects.toThrow(TypeError);
      await expect(hashPassword(123)).rejects.toThrow(TypeError);
      await expect(hashPassword(undefined)).rejects.toThrow(TypeError);
      await expect(hashPassword({})).rejects.toThrow(TypeError);
      await expect(hashPassword([])).rejects.toThrow(TypeError);
    });
  });
});

