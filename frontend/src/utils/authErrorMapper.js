/**
 * Maps authentication errors to user-friendly messages
 * Distinguishes between wrong credentials, expired tokens, and system errors
 * @param {Error|Object} error - The error object from login attempt
 * @param {string} error.message - The error message
 * @param {number} error.status - HTTP status code
 * @param {string} error.type - Error type classification
 * @returns {Object} { title: string, message: string, isSessionExpired: boolean }
 */
export function mapAuthErrorToMessage(error) {
  if (!error) {
    return {
      title: "Unknown Error",
      message: "An unexpected error occurred. Please try again.",
      isSessionExpired: false,
    };
  }

  const errorMessage = (error.message || "").toLowerCase();
  const errorType = error.type?.toUpperCase() || "";
  const status = error.status || error.response?.status;

  // Network error - can't reach server (ECONNREFUSED, timeout, etc.)
  if (
    errorType === "NETWORK_ERROR" ||
    errorMessage.includes("network") ||
    errorMessage.includes("timeout") ||
    errorMessage.includes("cannot connect") ||
    errorMessage.includes("econnrefused") ||
    errorMessage.includes("unreachable")
  ) {
    return {
      title: "Service Unavailable",
      message:
        "Cannot connect to server. The service is temporarily unavailable. Please try again later.",
      isSessionExpired: false,
      isWarning: true,
    };
  }

  // Token expired - only for non-login endpoints
  if (
    errorMessage.includes("expired") ||
    errorMessage.includes("token expired") ||
    errorType === "TOKEN_EXPIRED"
  ) {
    return {
      title: "Session Expired",
      message: "Your session has expired. Please log in again.",
      isSessionExpired: true,
    };
  }

  // Wrong credentials (401 on login endpoint)
  if (
    status === 401 ||
    errorType === "AUTH_ERROR" ||
    errorType === "UNAUTHORIZED"
  ) {
    // Check if error message indicates wrong credentials
    if (
      errorMessage.includes("incorrect") ||
      errorMessage.includes("invalid") ||
      errorMessage.includes("not found") ||
      errorMessage.includes("username or password")
    ) {
      return {
        title: "Invalid Credentials",
        message: "Incorrect username or password. Please try again.",
        isSessionExpired: false,
      };
    }

    // Generic 401 - treat as wrong credentials for login form
    return {
      title: "Invalid Credentials",
      message: "Incorrect username or password. Please try again.",
      isSessionExpired: false,
    };
  }

  // Account disabled (403)
  if (status === 403 || errorType === "PERMISSION_ERROR") {
    if (errorMessage.includes("disabled") || errorMessage.includes("account")) {
      return {
        title: "Account Disabled",
        message:
          "Your account has been disabled. Please contact your administrator.",
        isSessionExpired: false,
      };
    }
    return {
      title: "Access Denied",
      message: "You do not have permission to access this resource.",
      isSessionExpired: false,
    };
  }

  // Validation error (400 / 422)
  if (status === 400 || status === 422 || errorType === "BAD_REQUEST") {
    // If backend provides a specific message, use it
    if (error.message && !errorMessage.includes("please enter")) {
      return {
        title: "Validation Error",
        message: error.message,
        isSessionExpired: false,
      };
    }
    return {
      title: "Invalid Input",
      message: "Please enter both username and password.",
      isSessionExpired: false,
    };
  }

  // Account not found (404)
  if (status === 404 || errorType === "NOT_FOUND") {
    return {
      title: "Account Not Found",
      message: "Account not found. Please check your username and try again.",
      isSessionExpired: false,
    };
  }

  // Server error (5xx)
  if (status >= 500) {
    return {
      title: "Server Error",
      message: "Something went wrong. Please try again later.",
      isSessionExpired: false,
    };
  }

  // Fallback for unhandled errors
  return {
    title: "Error",
    message: error.message || "An unexpected error occurred. Please try again.",
    isSessionExpired: false,
  };
}

/**
 * Determines if an error should show "Session Expired" UI
 * Used for protecting routes where token is checked on load
 * @param {Error|Object} error
 * @returns {boolean}
 */
export function isSessionExpiredError(error) {
  const mapped = mapAuthErrorToMessage(error);
  return mapped.isSessionExpired;
}
