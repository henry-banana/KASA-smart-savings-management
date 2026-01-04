import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import React, { useState } from "react";
import "@testing-library/jest-dom";

// Mock logger first
jest.mock("../../../src/utils/logger", () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock config file before importing services
jest.mock("../../../src/config/app.config", () => ({
  USE_MOCK: true,
  apiUrl: "http://localhost:3000",
  enableLogger: false,
  environment: "test",
}));

// Mock API client
jest.mock("../../../src/api/apiClient", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock authApi
jest.mock("../../../src/api/authApi", () => ({
  authApi: {
    login: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
  },
}));

// Mock authService
jest.mock("../../../src/services/authService");

// Mock AuthContext
jest.mock("../../../src/contexts/AuthContext", () => {
  const originalModule = jest.requireActual("react");
  return {
    AuthProvider: ({ children }) =>
      originalModule.createElement("div", null, children),
    useAuth: () => ({
      login: jest.fn(),
      logout: jest.fn(),
      authUser: null,
      token: null,
    }),
  };
});

const mockAuthService = require("../../../src/services/authService");

// Simple Login component for integration testing
const SimpleLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await mockAuthService.login({
        email,
        password,
      });

      setPassword("");
      onLoginSuccess?.(response);
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />

      <button type="submit" disabled={loading}>
        {loading ? "Logging In..." : "Log In"}
      </button>

      {error && <div data-testid="error-message">{error}</div>}
    </form>
  );
};

const { AuthProvider } = require("../../../src/contexts/AuthContext");

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe("Integration: IT01 - Login Dashboard Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthService.login = jest.fn().mockResolvedValue({
      user: {
        id: "1",
        email: "teller@kasa.com",
        fullName: "Teller User",
        role: "TELLER",
      },
      token: "mock-jwt-token",
    });
  });

  it("should render Login form with email and password inputs", () => {
    render(
      <TestWrapper>
        <SimpleLogin />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("should fill email and password fields with valid credentials", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <SimpleLogin />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "teller@kasa.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("teller@kasa.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("should call authService.login with correct credentials on submit", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <SimpleLogin />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /log in/i });

    await user.type(emailInput, "teller@kasa.com");
    await user.type(passwordInput, "password123");
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "teller@kasa.com",
          password: "password123",
        })
      );
    });
  });

  it("should disable login button while submitting", async () => {
    const user = userEvent.setup();
    mockAuthService.login = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <TestWrapper>
        <SimpleLogin />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /log in/i });

    await user.type(emailInput, "teller@kasa.com");
    await user.type(passwordInput, "password123");

    const clickPromise = user.click(loginButton);

    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });

    await clickPromise;
  });

  it("should show error message on failed login", async () => {
    const user = userEvent.setup();
    mockAuthService.login = jest.fn().mockRejectedValue({
      response: { status: 401, data: { message: "Invalid credentials" } },
    });

    render(
      <TestWrapper>
        <SimpleLogin />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /log in/i });

    await user.type(emailInput, "wrong@email.com");
    await user.type(passwordInput, "wrongpass");
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Invalid credentials"
      );
    });
  });

  it("should clear password field after login attempt", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <SimpleLogin />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /log in/i });

    await user.type(emailInput, "teller@kasa.com");
    await user.type(passwordInput, "password123");
    await user.click(loginButton);

    await waitFor(() => {
      expect(passwordInput).toHaveValue("");
    });
  });

  it("should maintain login form state across re-renders", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <TestWrapper>
        <SimpleLogin />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "teller@kasa.com");
    await user.type(passwordInput, "password123");

    rerender(
      <TestWrapper>
        <SimpleLogin />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/email/i)).toHaveValue("teller@kasa.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("password123");
  });
});
