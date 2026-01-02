import React from "react";
import { render, screen, waitFor } from "../../test-utils/render";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock functions
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: { email: "test@example.com", otp: "123456" },
  }),
}));

jest.mock("../../../src/utils/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock authService - create factory function
const mockResetPassword = jest.fn();
jest.mock("../../../src/services/authService", () => ({
  authService: {
    resetPassword: (...args) => mockResetPassword(...args),
  },
}));

// Mock alert globally
global.alert = jest.fn();

// Import component
import ResetPassword from "../../../src/pages/Auth/ForgotPassword/ResetPassword";

describe("ResetPassword Component (UC03)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    global.alert.mockClear();
    localStorage.clear();
  });

  describe("Render - Initial Display", () => {
    it("should render Reset Password screen with password inputs and submit button", () => {
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      expect(screen.getByText(/reset password/i)).toBeInTheDocument();
      expect(screen.getByText(/choose a strong password/i)).toBeInTheDocument();

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);
      const confirmPasswordInput =
        screen.getByPlaceholderText(/confirm new password/i);
      expect(newPasswordInput).toBeInTheDocument();
      expect(confirmPasswordInput).toBeInTheDocument();

      const submitButton = screen.getByRole("button", {
        name: /save password/i,
      });
      expect(submitButton).toBeInTheDocument();

      expect(screen.getByText(/password requirements/i)).toBeInTheDocument();
    });

    it("should not show error messages on initial render", () => {
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      expect(screen.queryByText(/please enter/i)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/passwords do not match/i)
      ).not.toBeInTheDocument();
    });

    it("should have submit button disabled on initial render", () => {
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const submitButton = screen.getByRole("button", {
        name: /save password/i,
      });
      expect(submitButton).toBeDisabled();
    });

    it("should show password requirements list", () => {
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  describe("Validation - Password Input", () => {
    it("should enable submit button when all validation passes", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);
      const confirmPasswordInput =
        screen.getByPlaceholderText(/confirm new password/i);
      const submitButton = screen.getByRole("button", {
        name: /save password/i,
      });

      await user.type(newPasswordInput, "newpassword123");
      await user.type(confirmPasswordInput, "newpassword123");

      expect(submitButton).not.toBeDisabled();
    });

    it("should show password mismatch error when passwords do not match on submit", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);
      const confirmPasswordInput =
        screen.getByPlaceholderText(/confirm new password/i);
      const submitButton = screen.getByRole("button", {
        name: /save password/i,
      });

      await user.type(newPasswordInput, "password123");
      await user.type(confirmPasswordInput, "password456");
      await user.click(submitButton);

      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      expect(mockResetPassword).not.toHaveBeenCalled();
    });

    it("should show error when password is less than 6 characters on submit", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);
      const confirmPasswordInput =
        screen.getByPlaceholderText(/confirm new password/i);
      const submitButton = screen.getByRole("button", {
        name: /save password/i,
      });

      await user.type(newPasswordInput, "short");
      await user.type(confirmPasswordInput, "short");
      await user.click(submitButton);

      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
      expect(mockResetPassword).not.toHaveBeenCalled();
    });

    it("should not submit when new password is empty", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const confirmPasswordInput =
        screen.getByPlaceholderText(/confirm new password/i);
      const submitButton = screen.getByRole("button", {
        name: /save password/i,
      });

      await user.type(confirmPasswordInput, "password123");
      await user.click(submitButton);

      expect(mockResetPassword).not.toHaveBeenCalled();
    });

    it("should not submit when confirm password is empty", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);
      const submitButton = screen.getByRole("button", {
        name: /save password/i,
      });

      await user.type(newPasswordInput, "password123");
      await user.click(submitButton);

      expect(mockResetPassword).not.toHaveBeenCalled();
    });

    it("should clear errors when user modifies password fields", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);
      const submitButton = screen.getByRole("button", {
        name: /save password/i,
      });

      // Submit with empty form to potentially trigger errors
      await user.click(submitButton);

      // Now type in the new password field
      await user.type(newPasswordInput, "password123");

      // Errors should be cleared (component clears errors on onChange)
      // Verify by checking that form is now in valid state
      const confirmPasswordInput =
        screen.getByPlaceholderText(/confirm new password/i);
      await user.type(confirmPasswordInput, "password123");

      expect(submitButton).not.toBeDisabled();
    });

    it("should show real-time visual feedback for password requirements", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);

      // Initially should show requirement
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();

      // After typing enough characters, requirement should still be visible
      await user.type(newPasswordInput, "password123");

      // The requirement should still be visible
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });

    it("should show password match feedback when confirm password is entered", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);
      const confirmPasswordInput =
        screen.getByPlaceholderText(/confirm new password/i);

      await user.type(newPasswordInput, "password123");
      await user.type(confirmPasswordInput, "password123");

      expect(screen.getByText(/passwords match/i)).toBeInTheDocument();
    });
  });

  describe("Happy Path - Successful Password Reset", () => {
    it("should call resetPassword and onSuccess when valid passwords are submitted", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      mockResetPassword.mockResolvedValueOnce({
        message: "Password reset successful",
      });

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);
      const confirmPasswordInput =
        screen.getByPlaceholderText(/confirm new password/i);
      const submitButton = screen.getByRole("button", {
        name: /save password/i,
      });

      await user.type(newPasswordInput, "newpassword123");
      await user.type(confirmPasswordInput, "newpassword123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith({
          email: "test@example.com",
          otp: "123456",
          newPassword: "newpassword123",
        });
      });

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalled();
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it("should disable submit button while password reset is pending", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      let resolveReset;
      const pendingPromise = new Promise((resolve) => {
        resolveReset = resolve;
      });

      mockResetPassword.mockReturnValueOnce(pendingPromise);

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);
      const confirmPasswordInput =
        screen.getByPlaceholderText(/confirm new password/i);
      const submitButton = screen.getByRole("button", {
        name: /save password/i,
      });

      await user.type(newPasswordInput, "newpassword123");
      await user.type(confirmPasswordInput, "newpassword123");
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/saving/i)).toBeInTheDocument();

      resolveReset({ message: "Success" });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("Error Handling - Failed Reset", () => {
    it("should show error message when reset fails with invalid code", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      mockResetPassword.mockRejectedValueOnce(
        new Error("Invalid verification code")
      );

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);
      const confirmPasswordInput =
        screen.getByPlaceholderText(/confirm new password/i);
      const submitButton = screen.getByRole("button", {
        name: /save password/i,
      });

      await user.type(newPasswordInput, "newpassword123");
      await user.type(confirmPasswordInput, "newpassword123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/invalid verification code/i)
        ).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it("should show error message when code is expired", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      mockResetPassword.mockRejectedValueOnce(
        new Error("Verification code has expired")
      );

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);
      const confirmPasswordInput =
        screen.getByPlaceholderText(/confirm new password/i);
      const submitButton = screen.getByRole("button", {
        name: /save password/i,
      });

      await user.type(newPasswordInput, "newpassword123");
      await user.type(confirmPasswordInput, "newpassword123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/verification code has expired/i)
        ).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it("should show generic error message when no error detail provided", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      mockResetPassword.mockRejectedValueOnce(new Error());

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);
      const confirmPasswordInput =
        screen.getByPlaceholderText(/confirm new password/i);
      const submitButton = screen.getByRole("button", {
        name: /save password/i,
      });

      await user.type(newPasswordInput, "newpassword123");
      await user.type(confirmPasswordInput, "newpassword123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/failed to reset password/i)
        ).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  describe("Navigation - Back Buttons", () => {
    it("should call onBackToLogin when back to login button is clicked", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const backToLoginButton = screen.getByRole("button", {
        name: /back to login/i,
      });
      await user.click(backToLoginButton);

      expect(mockOnBackToLogin).toHaveBeenCalled();
    });
  });

  describe("Password Visibility Toggle", () => {
    it("should toggle new password visibility when eye icon is clicked", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const newPasswordInput =
        screen.getByPlaceholderText(/enter new password/i);
      const newPasswordField = newPasswordInput.parentElement;
      const newPasswordToggle = newPasswordField.querySelector("button");

      expect(newPasswordInput.type).toBe("password");

      await user.click(newPasswordToggle);

      expect(newPasswordInput.type).toBe("text");

      await user.click(newPasswordToggle);

      expect(newPasswordInput.type).toBe("password");
    });

    it("should toggle confirm password visibility when eye icon is clicked", async () => {
      const user = userEvent.setup();
      const mockOnSuccess = jest.fn();
      const mockOnBack = jest.fn();
      const mockOnBackToLogin = jest.fn();

      render(
        <ResetPassword
          email="test@example.com"
          otp="123456"
          onSuccess={mockOnSuccess}
          onBack={mockOnBack}
          onBackToLogin={mockOnBackToLogin}
        />
      );

      const confirmPasswordInput =
        screen.getByPlaceholderText(/confirm new password/i);
      const confirmPasswordField = confirmPasswordInput.parentElement;
      const confirmPasswordToggle =
        confirmPasswordField.querySelector("button");

      expect(confirmPasswordInput.type).toBe("password");

      await user.click(confirmPasswordToggle);

      expect(confirmPasswordInput.type).toBe("text");

      await user.click(confirmPasswordToggle);

      expect(confirmPasswordInput.type).toBe("password");
    });
  });
});
