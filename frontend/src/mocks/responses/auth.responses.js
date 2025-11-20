/**
 * Response structure templates for Authentication API
 * Based on backend/src/controllers/UserAccount/login.controller.js
 * Endpoint: POST /api/auth
 * 
 * Note: These are TEMPLATES only. Use builder functions to create responses with actual data.
 */

/**
 * Build successful login response
 * @param {string} roleName - User's role name from database
 * @returns {Object} Login success response
 */
export const buildLoginSuccessResponse = (roleName) => ({
  message: "Login successful",
  success: true,
  roleName
});

/**
 * Response templates for errors (no data needed)
 */
export const authResponseTemplates = {
  loginFailed: {
    message: "Invalid username or password",
    success: false
  },
  
  loginIncorrectPassword: {
    message: "Incorrect password",
    success: false
  },
  
  loginMissingFields: {
    message: "Missing username or password"
  },
  
  loginServerError: {
    message: "Employee not found",
    detail: "Internal server error"
  }
};

export default {
  buildLoginSuccessResponse,
  ...authResponseTemplates
};
