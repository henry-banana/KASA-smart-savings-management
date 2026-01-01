import {
  mapAuthErrorToMessage,
  isSessionExpiredError,
} from "../../src/utils/authErrorMapper";

describe("authErrorMapper", () => {
  describe("mapAuthErrorToMessage", () => {
    it("should return Unknown Error for null/undefined input", () => {
      const result1 = mapAuthErrorToMessage(null);
      expect(result1.title).toBe("Unknown Error");
      expect(result1.message).toBeTruthy();
      expect(result1.isSessionExpired).toBe(false);

      const result2 = mapAuthErrorToMessage(undefined);
      expect(result2.title).toBe("Unknown Error");
      expect(result2.isSessionExpired).toBe(false);
    });

    it("should detect network errors (ECONNREFUSED, timeout, etc.) - priority 1", () => {
      const result = mapAuthErrorToMessage({ message: "ECONNREFUSED" });
      expect(result.title).toBe("Service Unavailable");
      expect(result.message).toBeTruthy();
      expect(result.isWarning).toBe(true);
      expect(result.isSessionExpired).toBe(false);
    });

    it("should detect token expired errors - priority 2", () => {
      const result = mapAuthErrorToMessage({ message: "Token expired" });
      expect(result.title).toBe("Session Expired");
      expect(result.message).toBeTruthy();
      expect(result.isSessionExpired).toBe(true);
    });

    it("should detect 401 unauthorized/invalid credentials - priority 3", () => {
      const result = mapAuthErrorToMessage({ status: 401 });
      expect(result.title).toBe("Invalid Credentials");
      expect(result.message).toBeTruthy();
      expect(result.isSessionExpired).toBe(false);
    });

    it("should detect 403 account disabled errors - priority 4a", () => {
      const result = mapAuthErrorToMessage({
        status: 403,
        message: "Account disabled",
      });
      expect(result.title).toBe("Account Disabled");
      expect(result.message).toBeTruthy();
      expect(result.isSessionExpired).toBe(false);
    });

    it("should detect 403 access denied without disabled keyword - priority 4b", () => {
      const result = mapAuthErrorToMessage({ status: 403 });
      expect(result.title).toBe("Access Denied");
      expect(result.message).toBeTruthy();
      expect(result.isSessionExpired).toBe(false);
    });

    it("should detect 400/422 validation errors with custom message - priority 5", () => {
      const result = mapAuthErrorToMessage({
        status: 400,
        message: "Email is invalid",
      });
      expect(result.title).toBe("Validation Error");
      expect(result.message).toBe("Email is invalid");
      expect(result.isSessionExpired).toBe(false);
    });

    it("should return generic message for 400/422 without custom message", () => {
      const result = mapAuthErrorToMessage({ status: 400 });
      expect(result.title).toBe("Invalid Input");
      expect(result.message).toBeTruthy();
      expect(result.isSessionExpired).toBe(false);
    });

    it("should detect 5xx server errors - priority 7", () => {
      const result = mapAuthErrorToMessage({ status: 500 });
      expect(result.title).toBe("Server Error");
      expect(result.message).toBeTruthy();
      expect(result.isSessionExpired).toBe(false);
    });

    it("should respect priority: network error over token expired over 401", () => {
      const result = mapAuthErrorToMessage({
        message: "Network timeout, token expired",
        status: 401,
      });
      expect(result.title).toBe("Service Unavailable");
    });
  });

  describe("isSessionExpiredError", () => {
    it("should return true for session expired errors", () => {
      expect(isSessionExpiredError({ message: "Token expired" })).toBe(true);
      expect(isSessionExpiredError({ type: "TOKEN_EXPIRED" })).toBe(true);
    });

    it("should return false for non-expired errors", () => {
      expect(isSessionExpiredError({ status: 401 })).toBe(false);
      expect(isSessionExpiredError({ type: "NETWORK_ERROR" })).toBe(false);
      expect(isSessionExpiredError(null)).toBe(false);
    });
  });
});
