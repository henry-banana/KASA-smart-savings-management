import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
  createMockNext,
} from "../../helpers/testHelpers.js";

// Mock jwt
const mockJwtVerify = jest.fn();
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: mockJwtVerify,
  },
}));

const { verifyToken } = await import("@src/middleware/auth.middleware.js");

describe("AuthMiddleware - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  describe("verifyToken()", () => {
    it("should call next() when token is valid", () => {
      const req = createMockRequest({
        headers: {
          authorization: "Bearer header.payload.signature",
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const decoded = {
        userId: "EMP001",
        userName: "EMP001",
        roleName: "Teller",
      };

      mockJwtVerify.mockImplementation((token, secret, callback) => {
        callback(null, decoded);
      });

      verifyToken(req, res, next);

      expect(req.user).toEqual({
        userId: "EMP001",
        userName: "EMP001",
        roleName: "Teller",
      });
      expect(next).toHaveBeenCalled();
    });

    it("should return 401 when Authorization header is missing", () => {
      const req = createMockRequest({
        headers: {},
      });
      const res = createMockResponse();
      const next = createMockNext();

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Missing Authorization header",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when token format is invalid", () => {
      const req = createMockRequest({
        headers: {
          authorization: "InvalidFormat token",
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid token format.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when token is malformed (not 3 parts)", () => {
      const req = createMockRequest({
        headers: {
          authorization: "Bearer invalid.token",
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Malformed token"),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("TC_UC02_08 - Session hết hạn - Token expired", () => {
      const req = createMockRequest({
        headers: {
          authorization: "Bearer expired.token.value",
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      mockJwtVerify.mockImplementation((token, secret, callback) => {
        const error = new Error("Token expired");
        error.name = "TokenExpiredError";
        callback(error, null);
      });

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Token is invalid or expired. Please login again.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 when token is invalid", () => {
      const req = createMockRequest({
        headers: {
          authorization: "Bearer invalid.token.value",
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      mockJwtVerify.mockImplementation((token, secret, callback) => {
        callback(new Error("Invalid token"), null);
      });

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it("TC_UC02_09 - Truy cập URL không đủ quyền - User ID mismatch in body", () => {
      const req = createMockRequest({
        headers: {
          authorization: "Bearer header.payload.signature",
        },
        body: {
          userId: "EMP002", // Different from token
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const decoded = {
        userId: "EMP001",
        userName: "EMP001",
        roleName: "Teller",
      };

      mockJwtVerify.mockImplementation((token, secret, callback) => {
        callback(null, decoded);
      });

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "User ID mismatch",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("TC_UC02_09 - Truy cập URL không đủ quyền - User ID mismatch in params", () => {
      const req = createMockRequest({
        headers: {
          authorization: "Bearer header.payload.signature",
        },
        params: {
          userId: "EMP002", // Different from token
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      const decoded = {
        userId: "EMP001",
        userName: "EMP001",
        roleName: "Teller",
      };

      mockJwtVerify.mockImplementation((token, secret, callback) => {
        callback(null, decoded);
      });

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "User ID mismatch",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});

