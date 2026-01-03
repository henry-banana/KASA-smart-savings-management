import React from "react";
import { render, screen, waitFor } from "../../test-utils/render";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const mockNavigate = jest.fn();
const mockCreateUser = jest.fn();
const mockGetAllUsers = jest.fn();
const mockGetBranchNames = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../src/utils/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("../../../src/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "admin1", role: "admin", email: "admin@example.com" },
    isAuthenticated: true,
  }),
}));

jest.mock("../../../src/services/userService", () => ({
  userService: {
    createUser: (...args) => mockCreateUser(...args),
    getAllUsers: (...args) => mockGetAllUsers(...args),
    updateUser: jest.fn(),
    updateUserStatus: jest.fn(),
  },
}));

jest.mock("../../../src/services/branchService", () => ({
  branchService: {
    getBranchNames: (...args) => mockGetBranchNames(...args),
  },
}));

jest.mock("../../../src/components/RoleGuard", () => ({
  RoleGuard: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../../src/components/ServiceUnavailableState", () => ({
  ServiceUnavailablePageState: ({ onRetry }) => <div>Service Unavailable</div>,
}));

jest.mock("../../../src/components/CuteComponents", () => ({
  StarDecor: () => <div />,
}));

import UserManagement from "../../../src/pages/Users/UserManagement";

// Helper to open dialog and fill form
const openDialogAndFillForm = async (user, values = {}) => {
  const { fullName = "John Doe", email = "john@example.com" } = values;

  const addButton = screen.getByRole("button", { name: /add/i });
  await user.click(addButton);

  const fullNameInput = screen.getByPlaceholderText(/enter full name/i);
  const emailInput = screen.getByPlaceholderText(/enter email address/i);

  if (fullName) {
    await user.clear(fullNameInput);
    await user.type(fullNameInput, fullName);
  }
  if (email) {
    await user.clear(emailInput);
    await user.type(emailInput, email);
  }

  return { fullNameInput, emailInput };
};

describe("UC01 - Create Staff Account", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockGetAllUsers.mockResolvedValueOnce([]);
    mockGetBranchNames.mockResolvedValueOnce(["Thủ Đức", "Quận 1", "Quận 3"]);
    localStorage.clear();
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  // ========== RENDER TESTS (3 tests) ==========
  describe("Render Tests", () => {
    it("should render User Management page", async () => {
      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
      });
    });

    it("should display Add button", async () => {
      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole("button", { name: /add/i });
      expect(addButton).toBeInTheDocument();
    });

    it("should open dialog when Add button is clicked", async () => {
      const user = userEvent.setup();
      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole("button", { name: /add/i });
      await user.click(addButton);

      expect(screen.getByText(/add new user/i)).toBeInTheDocument();
    });
  });

  // ========== VALIDATION TESTS (3 tests) ==========
  describe("Form Validation Tests", () => {
    it("should accept full name input", async () => {
      const user = userEvent.setup();
      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole("button", { name: /add/i });
      await user.click(addButton);

      const fullNameInput = screen.getByPlaceholderText(/enter full name/i);
      await user.type(fullNameInput, "John Doe");

      expect(fullNameInput.value).toBe("John Doe");
    });

    it("should accept email input", async () => {
      const user = userEvent.setup();
      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole("button", { name: /add/i });
      await user.click(addButton);

      const emailInput = screen.getByPlaceholderText(/enter email address/i);
      await user.type(emailInput, "john@example.com");

      expect(emailInput.value).toBe("john@example.com");
    });

    it("should have Create User button", async () => {
      const user = userEvent.setup();
      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole("button", { name: /add/i });
      await user.click(addButton);

      const createButton = screen.getByRole("button", { name: /create user/i });
      expect(createButton).toBeInTheDocument();
    });
  });

  // ========== HAPPY PATH TESTS (3 tests) ==========
  describe("User Creation Flow", () => {
    it("should allow filling and clearing form fields", async () => {
      const user = userEvent.setup();
      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole("button", { name: /add/i });
      await user.click(addButton);

      const fullNameInput = screen.getByPlaceholderText(/enter full name/i);
      const emailInput = screen.getByPlaceholderText(/enter email address/i);

      // Type data
      await user.type(fullNameInput, "John Doe");
      await user.type(emailInput, "john@example.com");

      expect(fullNameInput.value).toBe("John Doe");
      expect(emailInput.value).toBe("john@example.com");

      // Clear data
      await user.clear(fullNameInput);
      await user.clear(emailInput);

      expect(fullNameInput.value).toBe("");
      expect(emailInput.value).toBe("");
    });

    it("should display form fields with correct labels", async () => {
      const user = userEvent.setup();
      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole("button", { name: /add/i });
      await user.click(addButton);

      expect(screen.getByText(/full name/i)).toBeInTheDocument();
      expect(screen.getByText(/email/i)).toBeInTheDocument();
    });

    it("should keep dialog open after interaction", async () => {
      const user = userEvent.setup();
      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole("button", { name: /add/i });
      await user.click(addButton);

      expect(screen.getByText(/add new user/i)).toBeInTheDocument();

      const fullNameInput = screen.getByPlaceholderText(/enter full name/i);
      await user.type(fullNameInput, "Test User");

      // Dialog should still be visible
      expect(screen.getByText(/add new user/i)).toBeInTheDocument();
    });

    // ========== SUBMISSION TESTS (4 tests) ==========
    it("should successfully create user and refresh list", async () => {
      const user = userEvent.setup();
      mockCreateUser.mockResolvedValueOnce({
        id: "user1",
        email: "john@example.com",
      });
      mockGetAllUsers.mockResolvedValueOnce([
        { id: "user1", fullName: "John Doe", email: "john@example.com" },
      ]);

      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
      });

      await openDialogAndFillForm(user, {
        fullName: "John Doe",
        email: "john@example.com",
      });

      const createButton = screen.getByRole("button", { name: /create user/i });
      await user.click(createButton);

      // Verify mockCreateUser called with correct payload
      await waitFor(() => {
        expect(mockCreateUser).toHaveBeenCalledTimes(1);
        expect(mockCreateUser).toHaveBeenCalledWith({
          fullName: "John Doe",
          email: "john@example.com",
          roleName: "Teller", // Default role normalized to backend format
          branchName: expect.any(String),
        });
      });

      // Verify mockGetAllUsers called to refresh list
      expect(mockGetAllUsers).toHaveBeenCalledTimes(2); // Once on mount, once after create
    });

    it("should not allow submission with empty required fields", async () => {
      const user = userEvent.setup();
      const validationError = "Full name is required";
      // Don't mock createUser - validation should prevent the call
      mockGetAllUsers.mockResolvedValueOnce([]);

      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole("button", { name: /add/i });
      await user.click(addButton);

      // Verify dialog is open
      await waitFor(() => {
        expect(screen.getByText(/add new user/i)).toBeInTheDocument();
      });

      // Try to submit without filling any fields
      const createButton = screen.getByRole("button", { name: /create user/i });
      await user.click(createButton);

      // Verify error message appears (component shows validation error in error box)
      // Use regex to find text in nested elements
      await waitFor(
        () => {
          expect(screen.getByText(/Full name is required/)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      // Verify dialog remains open for user to correct
      expect(screen.getByText(/add new user/i)).toBeInTheDocument();

      // Verify createUser was NOT called (validation prevented it)
      expect(mockCreateUser).not.toHaveBeenCalled();

      // Verify getAllUsers was only called on mount
      expect(mockGetAllUsers).toHaveBeenCalledTimes(1);
    });

    it("should display error message when email already exists", async () => {
      const user = userEvent.setup();
      const errorMessage = "Email already exists";
      mockCreateUser.mockRejectedValueOnce({
        message: errorMessage,
      });

      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
      });

      await openDialogAndFillForm(user, {
        fullName: "John Doe",
        email: "existing@example.com",
      });

      const createButton = screen.getByRole("button", { name: /create user/i });
      await user.click(createButton);

      // Verify error message appears in error box
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });

      // Verify dialog remains open
      expect(screen.getByText(/add new user/i)).toBeInTheDocument();

      // Verify createUser was called
      expect(mockCreateUser).toHaveBeenCalled();

      // Verify getAllUsers NOT called on error (no refresh)
      expect(mockGetAllUsers).toHaveBeenCalledTimes(1); // Only on mount
    });

    it("should show loading state while submitting and then close dialog", async () => {
      const user = userEvent.setup();
      let resolveCreate;
      const createPromise = new Promise((resolve) => {
        resolveCreate = resolve;
      });
      mockCreateUser.mockReturnValueOnce(createPromise);
      mockGetAllUsers.mockResolvedValueOnce([]);
      mockGetAllUsers.mockResolvedValueOnce([]); // Second call after create

      render(<UserManagement />);

      await waitFor(() => {
        expect(screen.getByText(/user management/i)).toBeInTheDocument();
      });

      await openDialogAndFillForm(user, {
        fullName: "Jane Smith",
        email: "jane@example.com",
      });

      const createButton = screen.getByRole("button", { name: /create user/i });
      await user.click(createButton);

      // Verify create was called
      expect(mockCreateUser).toHaveBeenCalled();

      // Dialog should still be open while loading
      expect(screen.getByText(/add new user/i)).toBeInTheDocument();

      // Resolve the promise with success response
      resolveCreate({ success: true, data: { id: "user2" } });

      // After promise resolves, dialog should close
      await waitFor(() => {
        expect(screen.queryByText(/add new user/i)).not.toBeInTheDocument();
      });

      // Verify getAllUsers was called twice (mount + refresh)
      expect(mockGetAllUsers).toHaveBeenCalledTimes(2);
    });
  });
});
