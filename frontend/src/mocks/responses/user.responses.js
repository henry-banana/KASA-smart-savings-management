/**
 * Response structure templates for User Management API
 * Based on OPENAPI.docx.md sections 10.2-10.5
 * Endpoints:
 * - GET /api/users
 * - POST /api/users
 * - PUT /api/users/:id
 * - PATCH /api/users/:id/status
 * - GET /api/branch/name
 *
 * Note: Use builder functions to create responses with actual data from data/
 */

/**
 * Builder functions - inject data here
 */
export const buildGetAllUsersResponse = (users) => ({
  message: "Get users successfully",
  success: true,
  data: users,
  total: users.length,
});

export const buildCreateUserResponse = (user) => ({
  message: "Create user successfully",
  success: true,
  data: user,
});

export const buildUpdateUserResponse = (user) => ({
  message: "Update user successfully",
  success: true,
  data: user,
});

export const buildUpdateUserStatusResponse = (user) => ({
  message: "Update user status successfully",
  success: true,
  data: user,
});

export const buildGetBranchNamesResponse = (branches) => ({
  message: "Branches retrieved successfully",
  success: true,
  total: branches.length,
  data: branches,
});

/*
 * Error response templates (no data needed)
 */
export const userResponseTemplates = {
  // User CRUD errors
  getUsersNotFound: {
    message: "No users found",
    success: false,
  },

  getUserByIdNotFound: {
    message: "User not found",
    success: false,
  },

  createMissingFields: {
    message: "Missing required fields: fullName, roleName, email",
    success: false,
  },

  createDuplicateEmail: {
    message: "Email already exists",
    success: false,
  },

  createInvalidEmail: {
    message: "Invalid email format",
    success: false,
  },

  createRoleNotFound: {
    message: "Role not found",
    success: false,
  },

  createBranchNotFound: {
    message: "Branch not found",
    success: false,
  },

  updateNotFound: {
    message: "User not found",
    success: false,
  },

  updateInvalidEmail: {
    message: "Invalid email format",
    success: false,
  },

  updateRoleNotFound: {
    message: "Role not found",
    success: false,
  },

  updateBranchNotFound: {
    message: "Branch not found",
    success: false,
  },

  updateStatusNotFound: {
    message: "User not found",
    success: false,
  },

  updateStatusInvalidStatus: {
    message: "Invalid status. Must be 'active' or 'disabled'",
    success: false,
  },

  // Branch errors
  getBranchNamesNotFound: {
    message: "No branches found",
    success: false,
  },

  serverError: {
    message: "Internal server error",
    success: false,
  },
};

export default {
  buildGetAllUsersResponse,
  buildCreateUserResponse,
  buildUpdateUserResponse,
  buildUpdateUserStatusResponse,
  buildGetBranchNamesResponse,
  ...userResponseTemplates,
};
