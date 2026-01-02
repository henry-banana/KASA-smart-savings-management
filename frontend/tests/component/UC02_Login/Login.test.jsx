import React from "react";
import { render, screen, waitFor } from "../../test-utils/render";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock logger
jest.mock("../../../src/utils/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock useConfig hook
jest.mock("../../../src/contexts/ConfigContext", () => ({
  useConfig: () => ({
    devMode: false,
  }),
}));

// Mock useAuth hook - this is what the Login component actually uses
const mockLogin = jest.fn();
jest.mock("../../../src/hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// NOW import Login
import Login from "../../../src/pages/Auth/Login";

describe("Login Component (UC02)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  describe("Render - Initial Display", () => {
    it("should render Login screen with title and description", () => {
      render(<Login />);
      expect(screen.getByText("Log in to KASA ✨")).toBeInTheDocument();
      // Verify the form is rendered with inputs and button
      expect(
        screen.getByPlaceholderText(/enter username/i)
      ).toBeInTheDocument();
    });

    it("should display username and password input fields", () => {
      render(<Login />);
      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it("should display submit button and not show validation errors initially", () => {
      render(<Login />);
      const submitButton = screen.getByRole("button", { name: /log in/i });
      expect(submitButton).toBeInTheDocument();
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/password is required/i)
      ).not.toBeInTheDocument();
    });
  });

  describe("Validation - Error Messages", () => {
    it("should show username/email required error when submit with empty username", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /log in/i });

      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    it("should show password required error when submit with empty password", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const submitButton = screen.getByRole("button", { name: /log in/i });

      await user.type(usernameInput, "test@example.com");
      await user.click(submitButton);

      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    it("should show invalid email format error for non-email username", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /log in/i });

      await user.type(usernameInput, "notanemail");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  describe("Happy Path - Successful Login", () => {
    it("should call login with correct credentials and navigate on teller login", async () => {
      const user = userEvent.setup();

      mockLogin.mockResolvedValue({
        id: "123",
        role: "teller",
      });

      render(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /log in/i });

      await user.type(usernameInput, "testuser@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: "testuser@example.com",
          password: "password123",
        });
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("should navigate to regulations page on admin login", async () => {
      const user = userEvent.setup();

      mockLogin.mockResolvedValue({
        id: "456",
        role: "admin",
      });

      render(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /log in/i });

      await user.type(usernameInput, "admin@example.com");
      await user.type(passwordInput, "adminpass123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/regulations");
      });
    });

    it("should trim whitespace from email and password before login", async () => {
      const user = userEvent.setup();

      mockLogin.mockResolvedValue({ id: "123", role: "teller" });

      render(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /log in/i });

      await user.type(usernameInput, "  testuser@example.com  ");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: "testuser@example.com",
          password: "password123",
        });
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      });
    });
  });
});
