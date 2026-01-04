import {
  isServerUnavailable,
  isBusinessError,
  isServerError,
  classifyError,
} from "../../src/utils/serverStatusUtils";

describe("serverStatusUtils", () => {
  describe("isServerUnavailable()", () => {
    it.each([
      [{ message: "ECONNREFUSED" }, true, "ECONNREFUSED message"],
      [{ type: "network_error" }, true, "NETWORK_ERROR type"],
      [{ status: 503 }, true, "HTTP 503"],
      [{ code: "ERR_NETWORK" }, true, "ERR_NETWORK code"],
      [{ code: "ECONNREFUSED" }, true, "ECONNREFUSED code"],
      [{ message: "TIMEOUT" }, true, "timeout keyword (case-insensitive)"],
      [{ message: "cannot connect" }, true, "cannot connect keyword"],
      [null, false, "null input"],
      [undefined, false, "undefined input"],
      [{ status: 0 }, false, "status 0 (falsy, skipped in OR chain)"],
      [{ status: 500 }, false, "HTTP 500 (server error, not unavailable)"],
      [{ status: 400 }, false, "HTTP 400 (business error)"],
    ])("should return %p for %s", (error, expected, description) => {
      expect(isServerUnavailable(error)).toBe(expected);
    });
  });

  describe("isBusinessError()", () => {
    it.each([
      [{ status: 400 }, true, "HTTP 400"],
      [{ status: 401 }, true, "HTTP 401"],
      [{ status: 403 }, true, "HTTP 403"],
      [{ status: 404 }, true, "HTTP 404"],
      [{ status: 422 }, true, "HTTP 422"],
      [{ response: { status: 400 } }, true, "response.status property"],
      [null, false, "null input"],
      [undefined, false, "undefined input"],
      [{ status: 503 }, false, "HTTP 503 (unavailable)"],
      [{ status: 500 }, false, "HTTP 500 (server error)"],
    ])("should return %p for %s", (error, expected, description) => {
      expect(isBusinessError(error)).toBe(expected);
    });
  });

  describe("isServerError()", () => {
    it.each([
      [{ status: 500 }, true, "HTTP 500"],
      [{ status: 502 }, true, "HTTP 502"],
      [{ status: 501 }, true, "HTTP 501"],
      [{ status: 599 }, true, "HTTP 599"],
      [{ response: { status: 500 } }, true, "response.status property"],
      [null, false, "null input"],
      [undefined, false, "undefined input"],
      [{ status: 503 }, false, "HTTP 503 (unavailable, not server error)"],
      [{ status: 400 }, false, "HTTP 400 (business error)"],
      [{ status: 401 }, false, "HTTP 401 (business error)"],
    ])("should return %p for %s", (error, expected, description) => {
      expect(isServerError(error)).toBe(expected);
    });
  });

  describe("classifyError()", () => {
    it.each([
      [{ message: "ECONNREFUSED" }, "unavailable", "network error"],
      [{ status: 503 }, "unavailable", "service unavailable"],
      [{ code: "ERR_NETWORK" }, "unavailable", "network error code"],
      [{ status: 400 }, "business", "HTTP 400"],
      [{ status: 401 }, "business", "HTTP 401"],
      [{ status: 404 }, "business", "HTTP 404"],
      [{ status: 422 }, "business", "HTTP 422"],
      [{ status: 500 }, "server", "HTTP 500"],
      [{ status: 502 }, "server", "HTTP 502"],
      [{}, "unknown", "empty object"],
      [{ status: 418 }, "unknown", "unknown status code"],
      [null, "unknown", "null input"],
      [undefined, "unknown", "undefined input"],
    ])(
      "should classify as '%s' for %s",
      (error, expectedCategory, description) => {
        expect(classifyError(error)).toBe(expectedCategory);
      }
    );

    it("should respect priority: unavailable > business > server > unknown", () => {
      const error = { status: 503 };
      expect(classifyError(error)).toBe("unavailable");
    });
  });
});
