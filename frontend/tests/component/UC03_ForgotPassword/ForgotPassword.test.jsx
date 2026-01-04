import React from "react";
import { render, screen, waitFor } from "../../test-utils/render";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock functions
const mockNavigate = jest.fn();

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

// Mock authService - create factory function
const mockRequestPasswordReset = jest.fn();
jest.mock("../../../src/services/authService", () => ({
  authService: {
    requestPasswordReset: (...args) => mockRequestPasswordReset(...args),
  },
}));

// Import component - this is a wrapper, we'll test the underlying component
import ForgotPassword from "../../../src/pages/Auth/ForgotPassword/ForgotPassword";

describe("ForgotPassword Component (UC03)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  describe("Render - Initial Display", () => {
    it("should render Forgot Password screen with email input and submit button", () => {
      const mockOnContinue = jest.fn();
      const mockOnBack = jest.fn();

      render(
        <ForgotPassword onContinue={mockOnContinue} onBack={mockOnBack} />
      );

      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
      expect(
        screen.getByText(/enter your email or username/i)
      ).toBeInTheDocument();

      const emailInput = screen.getByPlaceholderText(
        /enter your email or username/i
      );
      expect(emailInput).toBeInTheDocument();

      const submitButton = screen.getByRole("button", {
        name: /send otp code/i,
      });
      expect(submitButton).toBeInTheDocument();

      const backLink = screen.getByRole("button", { name: /back to login/i });
      expect(backLink).toBeInTheDocument();
    });

    it("should not show error message on initial render", () => {
      const mockOnContinue = jest.fn();
      const mockOnBack = jest.fn();

      render(
        <ForgotPassword onContinue={mockOnContinue} onBack={mockOnBack} />
      );

      expect(
        screen.queryByText(/unable to send password reset/i)
      ).not.toBeInTheDocument();
    });

    it("should have submit button disabled when email input is empty", () => {
      const mockOnContinue = jest.fn();
      const mockOnBack = jest.fn();

      render(
        <ForgotPassword onContinue={mockOnContinue} onBack={mockOnBack} />
      );

      const submitButton = screen.getByRole("button", {
        name: /send otp code/i,
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Validation - Input Handling", () => {
    it("should enable submit button when email is entered", async () => {
      const user = userEvent.setup();
      const mockOnContinue = jest.fn();
      const mockOnBack = jest.fn();

      render(
        <ForgotPassword onContinue={mockOnContinue} onBack={mockOnBack} />
      );

      const emailInput = screen.getByPlaceholderText(
        /enter your email or username/i
      );
      const submitButton = screen.getByRole("button", {
        name: /send otp code/i,
      });

      expect(submitButton).toBeDisabled();

      await user.type(emailInput, "test@example.com");

      expect(submitButton).not.toBeDisabled();
    });

    it("should disable submit when input is only whitespace", async () => {
      const user = userEvent.setup();
      const mockOnContinue = jest.fn();
      const mockOnBack = jest.fn();

      render(
        <ForgotPassword onContinue={mockOnContinue} onBack={mockOnBack} />
      );

      const emailInput = screen.getByPlaceholderText(
        /enter your email or username/i
      );
      const submitButton = screen.getByRole("button", {
        name: /send otp code/i,
      });

      await user.type(emailInput, "   ");

      expect(submitButton).toBeDisabled();
    });
  });

  describe("Happy Path - Password Reset Request", () => {
    it("should call onContinue with email when password reset request succeeds", async () => {
      const user = userEvent.setup();
      const mockOnContinue = jest.fn();
      const mockOnBack = jest.fn();

      mockRequestPasswordReset.mockResolvedValueOnce({
        email: "test@example.com",
        message: "Reset link sent",
      });

      render(
        <ForgotPassword onContinue={mockOnContinue} onBack={mockOnBack} />
      );

      const emailInput = screen.getByPlaceholderText(
        /enter your email or username/i
      );
      const submitButton = screen.getByRole("button", {
        name: /send otp code/i,
      });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnContinue).toHaveBeenCalledWith("test@example.com");
      });
    });

    it("should use original input email when response does not include email", async () => {
      const user = userEvent.setup();
      const mockOnContinue = jest.fn();
      const mockOnBack = jest.fn();

      mockRequestPasswordReset.mockResolvedValueOnce({
        message: "Reset link sent",
      });

      render(
        <ForgotPassword onContinue={mockOnContinue} onBack={mockOnBack} />
      );

      const emailInput = screen.getByPlaceholderText(
        /enter your email or username/i
      );
      const submitButton = screen.getByRole("button", {
        name: /send otp code/i,
      });

      await user.type(emailInput, "testuser@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnContinue).toHaveBeenCalledWith("testuser@example.com");
      });
    });

    it("should disable submit button while request is pending", async () => {
      const user = userEvent.setup();
      const mockOnContinue = jest.fn();
      const mockOnBack = jest.fn();

      let resolveRequest;
      const pendingPromise = new Promise((resolve) => {
        resolveRequest = resolve;
      });

      mockRequestPasswordReset.mockReturnValueOnce(pendingPromise);

      render(
        <ForgotPassword onContinue={mockOnContinue} onBack={mockOnBack} />
      );

      const emailInput = screen.getByPlaceholderText(
        /enter your email or username/i
      );
      const submitButton = screen.getByRole("button", {
        name: /send otp code/i,
      });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/processing/i)).toBeInTheDocument();

      resolveRequest({ email: "test@example.com", message: "Sent" });

      await waitFor(() => {
        expect(mockOnContinue).toHaveBeenCalledWith("test@example.com");
      });
    });
  });

  describe("Error Handling - Failed Request", () => {
    it("should show error message on 400 bad request", async () => {
      const user = userEvent.setup();
      const mockOnContinue = jest.fn();
      const mockOnBack = jest.fn();

      mockRequestPasswordReset.mockRejectedValueOnce(
        new Error("Email not found")
      );

      render(
        <ForgotPassword onContinue={mockOnContinue} onBack={mockOnBack} />
      );

      const emailInput = screen.getByPlaceholderText(
        /enter your email or username/i
      );
      const submitButton = screen.getByRole("button", {
        name: /send otp code/i,
      });

      await user.type(emailInput, "nonexistent@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email not found/i)).toBeInTheDocument();
      });

      expect(mockOnContinue).not.toHaveBeenCalled();
    });

    it("should show error message on 404 user not found", async () => {
      const user = userEvent.setup();
      const mockOnContinue = jest.fn();
      const mockOnBack = jest.fn();

      mockRequestPasswordReset.mockRejectedValueOnce(
        new Error("User not found")
      );

      render(
        <ForgotPassword onContinue={mockOnContinue} onBack={mockOnBack} />
      );

      const emailInput = screen.getByPlaceholderText(
        /enter your email or username/i
      );
      const submitButton = screen.getByRole("button", {
        name: /send otp code/i,
      });

      await user.type(emailInput, "unknown@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/user not found/i)).toBeInTheDocument();
      });

      expect(mockOnContinue).not.toHaveBeenCalled();
    });

    it("should show generic error message when no error detail provided", async () => {
      const user = userEvent.setup();
      const mockOnContinue = jest.fn();
      const mockOnBack = jest.fn();

      mockRequestPasswordReset.mockRejectedValueOnce(new Error());

      render(
        <ForgotPassword onContinue={mockOnContinue} onBack={mockOnBack} />
      );

      const emailInput = screen.getByPlaceholderText(
        /enter your email or username/i
      );
      const submitButton = screen.getByRole("button", {
        name: /send otp code/i,
      });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/unable to send password reset request/i)
        ).toBeInTheDocument();
      });

      expect(mockOnContinue).not.toHaveBeenCalled();
    });
  });

  describe("Navigation - Back Button", () => {
    it("should call onBack when back to login button is clicked", async () => {
      const user = userEvent.setup();
      const mockOnContinue = jest.fn();
      const mockOnBack = jest.fn();

      render(
        <ForgotPassword onContinue={mockOnContinue} onBack={mockOnBack} />
      );

      const backButton = screen.getByRole("button", { name: /back to login/i });
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalled();
    });
  });
});
