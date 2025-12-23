import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
  createMockNext,
} from "../../helpers/testHelpers.js";

const { validatePositiveNumbers } = await import(
  "@src/middleware/validation.middleware.js"
);

describe("ValidationMiddleware - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validatePositiveNumbers()", () => {
    it("should call next() when minimumBalance is valid", () => {
      const req = createMockRequest({
        body: {
          minimumBalance: 100000,
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      validatePositiveNumbers(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should call next() when minimumTermDays is valid", () => {
      const req = createMockRequest({
        body: {
          minimumTermDays: 15,
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      validatePositiveNumbers(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should call next() when both values are valid", () => {
      const req = createMockRequest({
        body: {
          minimumBalance: 200000,
          minimumTermDays: 30,
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      validatePositiveNumbers(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return 400 when minimumBalance is 0", () => {
      const req = createMockRequest({
        body: {
          minimumBalance: 0,
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      validatePositiveNumbers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "minimumBalance must be a positive number greater than 0",
        success: false,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 when minimumBalance is negative", () => {
      const req = createMockRequest({
        body: {
          minimumBalance: -1000,
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      validatePositiveNumbers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 when minimumBalance is not a number", () => {
      const req = createMockRequest({
        body: {
          minimumBalance: "not-a-number",
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      validatePositiveNumbers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 when minimumTermDays is 0", () => {
      const req = createMockRequest({
        body: {
          minimumTermDays: 0,
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      validatePositiveNumbers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "minimumTermDays must be a positive number greater than 0",
        success: false,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 when minimumTermDays is negative", () => {
      const req = createMockRequest({
        body: {
          minimumTermDays: -5,
        },
      });
      const res = createMockResponse();
      const next = createMockNext();

      validatePositiveNumbers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 on error", () => {
      const req = createMockRequest({
        body: null, // This will cause an error
      });
      const res = createMockResponse();
      const next = createMockNext();

      validatePositiveNumbers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid input data",
        success: false,
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});

