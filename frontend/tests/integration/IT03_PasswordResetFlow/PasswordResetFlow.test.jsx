import React, { useState } from "react";
import {
  render as rtlRender,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "@testing-library/jest-dom";

const mockRequestPasswordReset = jest.fn();
const mockResetPassword = jest.fn();

jest.mock("../../../src/services/authService", () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    requestPasswordReset: (...args) => mockRequestPasswordReset(...args),
    resetPassword: (...args) => mockResetPassword(...args),
    verifyOtp: jest.fn(),
  },
}));

jest.mock("../../../src/utils/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

import ForgotPassword from "../../../src/pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../../../src/pages/Auth/ForgotPassword/ResetPassword";

// Wrapper component for routing
function ResetPasswordWrapper() {
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;
  const navigate = useNavigate();

  if (!email || !otp) {
    return <div>Invalid access</div>;
  }

  return (
    <ResetPassword
      email={email}
      otp={otp}
      onSuccess={() => navigate("/login")}
      onBack={() => navigate("/forgot-password", { state: { email } })}
      onBackToLogin={() => navigate("/login")}
    />
  );
}

// Custom render with routing
const renderWithRouter = (
  initialRoute = "/forgot-password",
  initialState = null
) => {
  return rtlRender(
    <MemoryRouter
      initialEntries={[{ pathname: initialRoute, state: initialState }]}
    >
      <Routes>
        <Route
          path="/forgot-password"
          element={
            <ForgotPassword
              onContinue={(email) => {
                // This will be captured by the navigate behavior
              }}
              onBack={() => {}}
            />
          }
        />
        <Route path="/reset" element={<ResetPasswordWrapper />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Integration: IT03 - Password Reset Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render ForgotPassword page with email input and submit button", async () => {
    renderWithRouter("/forgot-password");

    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByText(/no worries/i)).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(
      /enter your email or username/i
    );
    expect(emailInput).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("should enable submit button when email is entered", async () => {
    const user = userEvent.setup();
    renderWithRouter("/forgot-password");

    const emailInput = screen.getByPlaceholderText(
      /enter your email or username/i
    );
    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });

    expect(submitButton).toBeDisabled();

    await user.type(emailInput, "user@example.com");

    expect(submitButton).not.toBeDisabled();
  });

  it("should submit valid email and call requestPasswordReset", async () => {
    const user = userEvent.setup();
    const testEmail = "user@example.com";

    mockRequestPasswordReset.mockResolvedValueOnce({
      email: testEmail,
      message: "Password reset link sent",
    });

    renderWithRouter("/forgot-password");

    const emailInput = screen.getByPlaceholderText(
      /enter your email or username/i
    );
    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });

    await user.type(emailInput, testEmail);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRequestPasswordReset).toHaveBeenCalledWith(testEmail);
    });
  });

  it("should show error message when requestPasswordReset fails", async () => {
    const user = userEvent.setup();
    const testEmail = "notfound@example.com";
    const errorMessage = "Email not found";

    mockRequestPasswordReset.mockRejectedValueOnce(new Error(errorMessage));

    renderWithRouter("/forgot-password");

    const emailInput = screen.getByPlaceholderText(
      /enter your email or username/i
    );
    const submitButton = screen.getByRole("button", {
      name: /send reset link/i,
    });

    await user.type(emailInput, testEmail);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockRequestPasswordReset).toHaveBeenCalledWith(testEmail);
  });

  it("should render ResetPassword page with password fields", async () => {
    renderWithRouter("/reset", {
      email: "test@example.com",
      otp: "123456",
    });

    expect(screen.getByText(/reset password/i)).toBeInTheDocument();
    expect(screen.getByText(/choose a strong password/i)).toBeInTheDocument();

    const newPasswordInput = screen.getByPlaceholderText(/enter new password/i);
    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm new password/i);

    expect(newPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: /save password/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it("should validate password mismatch and prevent submission", async () => {
    const user = userEvent.setup();
    renderWithRouter("/reset", {
      email: "test@example.com",
      otp: "123456",
    });

    const newPasswordInput = screen.getByPlaceholderText(/enter new password/i);
    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm new password/i);
    const submitButton = screen.getByRole("button", {
      name: /save password/i,
    });

    await user.type(newPasswordInput, "Password123");
    await user.type(confirmPasswordInput, "Password456");

    // Should show mismatch error
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    expect(submitButton).toBeDisabled();
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it("should submit valid reset password and call resetPassword with correct payload", async () => {
    const user = userEvent.setup();
    const testEmail = "test@example.com";
    const testPassword = "NewPassword123";

    mockResetPassword.mockResolvedValueOnce({
      message: "Password reset successful",
    });

    renderWithRouter("/reset", {
      email: testEmail,
      otp: "123456",
    });

    const newPasswordInput = screen.getByPlaceholderText(/enter new password/i);
    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm new password/i);
    const submitButton = screen.getByRole("button", {
      name: /save password/i,
    });

    await user.type(newPasswordInput, testPassword);
    await user.type(confirmPasswordInput, testPassword);

    expect(submitButton).not.toBeDisabled();

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith(
        expect.objectContaining({
          email: testEmail,
          otp: "123456",
          newPassword: testPassword,
        })
      );
    });
  });

  it("should show error message when resetPassword fails", async () => {
    const user = userEvent.setup();
    const errorMessage = "Invalid OTP code";

    mockResetPassword.mockRejectedValueOnce(new Error(errorMessage));

    renderWithRouter("/reset", {
      email: "test@example.com",
      otp: "123456",
    });

    const newPasswordInput = screen.getByPlaceholderText(/enter new password/i);
    const confirmPasswordInput =
      screen.getByPlaceholderText(/confirm new password/i);
    const submitButton = screen.getByRole("button", {
      name: /save password/i,
    });

    await user.type(newPasswordInput, "NewPassword123");
    await user.type(confirmPasswordInput, "NewPassword123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockResetPassword).toHaveBeenCalled();
  });
});
