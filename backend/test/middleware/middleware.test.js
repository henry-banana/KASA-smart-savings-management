const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn()
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

const { verifyToken } = require("../../src/middleware/auth.middleware.js");
const { comparePassword } = require("../../src/middleware/comparePass.middleware.js");
const { hashPassword } = require("../../src/middleware/hashing.middleware.js");

describe("Middleware", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  describe("verifyToken", () => {
    it("rejects when header missing", () => {
      const req = { headers: {} };
      const res = mockRes();
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Missing Authorization header" });
      expect(next).not.toHaveBeenCalled();
    });

    it("rejects invalid format", () => {
      const req = { headers: { authorization: "Basic token" } };
      const res = mockRes();
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid token format" });
    });

    it("rejects invalid token", () => {
      jwt.verify.mockImplementation((token, secret, cb) => cb(new Error("bad token")));
      const req = { headers: { authorization: "Bearer fake" } };
      const res = mockRes();
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith("fake", "test-secret", expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Token is invalid or expired" });
      expect(next).not.toHaveBeenCalled();
    });

    it("rejects mismatched user ID", () => {
      jwt.verify.mockImplementation((token, secret, cb) =>
        cb(null, { userId: "123", username: "john" })
      );
      const req = { headers: { authorization: "Bearer good" }, params: { userId: "999" } };
      const res = mockRes();
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "User ID mismatch" });
      expect(next).not.toHaveBeenCalled();
    });

    it("assigns user and calls next on success", () => {
      const decoded = {
        userId: "123",
        username: "john",
        role: "admin",
        fullName: "John Doe"
      };
      jwt.verify.mockImplementation((token, secret, cb) => cb(null, decoded));
      const req = { headers: { authorization: "Bearer good" }, params: {} };
      const res = mockRes();
      const next = jest.fn();

      verifyToken(req, res, next);

      expect(req.user).toEqual(decoded);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("hashPassword", () => {
    it("hashes password with bcrypt", async () => {
      bcrypt.hash.mockResolvedValue("hashed-value");

      const result = await hashPassword("secret");

      expect(bcrypt.hash).toHaveBeenCalledWith("secret", 12);
      expect(result).toBe("hashed-value");
    });

    it("throws when password not string", async () => {
      await expect(hashPassword(null)).rejects.toThrow("Password must be a string");
    });
  });

  describe("comparePassword", () => {
    it("compares passwords via bcrypt", async () => {
      bcrypt.compare.mockResolvedValue(true);

      const result = await comparePassword("secret", "hash");

      expect(bcrypt.compare).toHaveBeenCalledWith("secret", "hash");
      expect(result).toBe(true);
    });

    it("throws when args invalid", async () => {
      await expect(comparePassword("secret", null)).rejects.toThrow(
        "Both Password and PasswordHash must be strings"
      );
    });
  });
});

