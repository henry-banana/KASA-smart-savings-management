/**
 * Utilities to detect and handle server unavailable / connection errors
 * Provides consistent UX when backend server is down or unreachable
 */

/**
 * Checks if error is due to server being unavailable
 * Covers: ECONNREFUSED, network errors, 503, timeout, no response
 * @param {Error|Object} error - Error from API call
 * @returns {boolean} true if server is likely unavailable
 */
export function isServerUnavailable(error) {
  if (!error) return false;

  const message = (error.message || "").toLowerCase();
  const type = (error.type || "").toUpperCase();
  const status = error.status || error.response?.status;

  // Network error types
  if (type === "NETWORK_ERROR") return true;
  if (message.includes("econnrefused")) return true;
  if (message.includes("cannot connect")) return true;
  if (message.includes("network error")) return true;
  if (message.includes("timeout")) return true;
  if (message.includes("unreachable")) return true;
  if (message.includes("no response")) return true;

  // HTTP status codes
  if (status === 503) return true; // Service Unavailable
  if (status === 0) return true; // No response

  // Axios/fetch errors with no response object (server not reachable)
  if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK")
    return true;

  return false;
}

/**
 * Checks if error is a business/validation error (not server unavailable)
 * @param {Error|Object} error - Error from API call
 * @returns {boolean} true if error is due to user action or validation
 */
export function isBusinessError(error) {
  if (!error) return false;

  const status = error.status || error.response?.status;

  // Client-side errors
  if (status === 400) return true; // Bad Request
  if (status === 404) return true; // Not Found
  if (status === 422) return true; // Validation Error

  // Auth errors
  if (status === 401) return true; // Unauthorized
  if (status === 403) return true; // Forbidden

  return false;
}

/**
 * Checks if error is a server error but not unavailable
 * (500, 502, etc - server is running but something went wrong)
 * @param {Error|Object} error - Error from API call
 * @returns {boolean}
 */
export function isServerError(error) {
  if (!error) return false;

  const status = error.status || error.response?.status;

  // Server errors (but not 503 Service Unavailable)
  if (status >= 500 && status !== 503) return true;

  return false;
}

/**
 * Classifies error into one of four categories
 * @param {Error|Object} error
 * @returns {string} 'unavailable' | 'business' | 'server' | 'unknown'
 */
export function classifyError(error) {
  if (isServerUnavailable(error)) return "unavailable";
  if (isBusinessError(error)) return "business";
  if (isServerError(error)) return "server";
  return "unknown";
}
