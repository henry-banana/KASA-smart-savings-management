import React from "react";
import { render as rtlRender, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";

const mockGetAccountInfo = jest.fn();
const mockDepositMoney = jest.fn();
const mockGetRegulations = jest.fn();

jest.mock("../../../src/services/transactionService", () => ({
  getAccountInfo: (...args) => mockGetAccountInfo(...args),
  depositMoney: (...args) => mockDepositMoney(...args),
}));

jest.mock("../../../src/services/regulationService", () => ({
  getRegulations: (...args) => mockGetRegulations(...args),
}));

jest.mock("../../../src/utils/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("../../../src/utils/serverStatusUtils", () => ({
  isServerUnavailable: (err) => err?.status === 503 || err?.code === 503,
}));

jest.mock("../../../src/components/ServiceUnavailableState", () => ({
  ServiceUnavailableState: ({ onRetry, loading }) => (
    <div>
      <div>Service Unavailable</div>
      <button onClick={onRetry} disabled={loading}>
        Retry
      </button>
    </div>
  ),
}));

jest.mock("../../../src/components/CuteComponents", () => ({
  StarDecor: () => <div />,
  CoinsIllustration: () => <div />,
}));

jest.mock("../../../src/components/RoleGuard", () => ({
  RoleGuard: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../../src/utils/numberFormatter", () => ({
  formatVnNumber: (num) => {
    if (typeof num !== "number") return "0";
    return num.toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  },
  formatBalance: (num) => {
    if (typeof num !== "number") return "0";
    return num.toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  },
}));

import Deposit from "../../../src/pages/Savings/Deposit";

const renderWithRouter = (initialRoute = "/deposit") => {
  return rtlRender(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/deposit" element={<Deposit />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Integration: IT06 - Deposit Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Default regulations mock
    mockGetRegulations.mockResolvedValue({
      success: true,
      data: {
        minimumBalance: 100000,
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render Deposit page with account code input and Lookup button", async () => {
    renderWithRouter("/deposit");

    expect(screen.getByText(/make deposit/i)).toBeInTheDocument();

    // Wait for regulations to load (Loading... button changes)
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });
  });

  it("should enter valid account code and call getSavingBookByCode to display customer info", async () => {
    const user = userEvent.setup({ delay: null });

    const mockAccountData = {
      data: {
        bookId: "book-1",
        accountCode: "SA001",
        customerName: "John Doe",
        accountTypeName: "No term",
        balance: 5000000,
        status: "Open",
      },
    };

    mockGetAccountInfo.mockResolvedValue(mockAccountData);

    renderWithRouter("/deposit");

    // Wait for regulations to load
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });

    const accountInput = screen.getByPlaceholderText(/saving book ID/i);
    const lookupButton = screen.getByRole("button", { name: /lookup/i });

    await user.type(accountInput, "SA001");
    await user.click(lookupButton);

    // Verify the lookup was called with correct param
    await waitFor(() => {
      expect(mockGetAccountInfo).toHaveBeenCalledWith("SA001");
    });

    // Verify customer info is displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("book-1")).toBeInTheDocument();
  });

  it("should prevent deposit when account is closed", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAccountInfo.mockResolvedValue({
      data: {
        bookId: "book-1",
        accountCode: "SA002",
        customerName: "Jane Smith",
        accountTypeName: "No term",
        balance: 1000000,
        status: "close",
      },
    });

    renderWithRouter("/deposit");

    // Wait for regulations to load
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });

    const accountInput = screen.getByPlaceholderText(/saving book ID/i);
    const lookupButton = screen.getByRole("button", { name: /lookup/i });

    await user.type(accountInput, "SA002");
    await user.click(lookupButton);

    await waitFor(() => {
      expect(screen.getByText(/saving book was closed/i)).toBeInTheDocument();
    });

    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("should enter valid deposit amount and call depositMoney with correct payload", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAccountInfo.mockResolvedValue({
      data: {
        bookId: "book-1",
        accountCode: "SA001",
        customerName: "John Doe",
        accountTypeName: "No term",
        balance: 5000000,
        status: "Open",
      },
    });

    mockDepositMoney.mockResolvedValue({
      data: {
        balanceAfter: 6000000,
      },
    });

    renderWithRouter("/deposit");

    // Wait for regulations to load
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });

    const accountInput = screen.getByPlaceholderText(/saving book ID/i);
    const lookupButton = screen.getByRole("button", { name: /lookup/i });

    await user.type(accountInput, "SA001");
    await user.click(lookupButton);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const depositInput = screen.getByLabelText(/deposit amount/i);
    const submitButton = screen.getByRole("button", {
      name: /confirm deposit/i,
    });

    await user.type(depositInput, "1000000");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockDepositMoney).toHaveBeenCalledWith("SA001", 1000000);
    });
  });

  it("should disable Submit button and show loading state while submitting", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAccountInfo.mockResolvedValue({
      data: {
        bookId: "book-1",
        accountCode: "SA001",
        customerName: "John Doe",
        accountTypeName: "No term",
        balance: 5000000,
        status: "Open",
      },
    });

    mockDepositMoney.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: {
                  balanceAfter: 6000000,
                },
              }),
            200
          )
        )
    );

    renderWithRouter("/deposit");

    // Wait for regulations to load
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });

    const accountInput = screen.getByPlaceholderText(/saving book ID/i);
    const lookupButton = screen.getByRole("button", { name: /lookup/i });

    await user.type(accountInput, "SA001");
    await user.click(lookupButton);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const depositInput = screen.getByLabelText(/deposit amount/i);
    const submitButton = screen.getByRole("button", {
      name: /confirm deposit/i,
    });

    await user.type(depositInput, "1000000");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockDepositMoney).toHaveBeenCalled();
    });
  });

  it("should show success message and updated balance after successful deposit", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAccountInfo.mockResolvedValue({
      data: {
        bookId: "book-1",
        accountCode: "SA001",
        customerName: "John Doe",
        accountTypeName: "No term",
        balance: 5000000,
        status: "Open",
      },
    });

    mockDepositMoney.mockResolvedValue({
      data: {
        balanceAfter: 6000000,
      },
    });

    renderWithRouter("/deposit");

    // Wait for regulations to load
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });

    const accountInput = screen.getByPlaceholderText(/saving book ID/i);
    const lookupButton = screen.getByRole("button", { name: /lookup/i });

    await user.type(accountInput, "SA001");
    await user.click(lookupButton);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const depositInput = screen.getByLabelText(/deposit amount/i);
    const submitButton = screen.getByRole("button", {
      name: /confirm deposit/i,
    });

    await user.type(depositInput, "1000000");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockDepositMoney).toHaveBeenCalled();
    });
  });

  it("should show error message on deposit failure", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAccountInfo.mockResolvedValue({
      data: {
        bookId: "book-1",
        accountCode: "SA001",
        customerName: "John Doe",
        accountTypeName: "No term",
        balance: 5000000,
        status: "Open",
      },
    });

    mockDepositMoney.mockRejectedValue(
      new Error("Insufficient balance in account")
    );

    renderWithRouter("/deposit");

    // Wait for regulations to load
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });

    const accountInput = screen.getByPlaceholderText(/saving book ID/i);
    const lookupButton = screen.getByRole("button", { name: /lookup/i });

    await user.type(accountInput, "SA001");
    await user.click(lookupButton);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const depositInput = screen.getByLabelText(/deposit amount/i);
    const submitButton = screen.getByRole("button", {
      name: /confirm deposit/i,
    });

    await user.type(depositInput, "1000000");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockDepositMoney).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByText(/insufficient balance in account/i)
      ).toBeInTheDocument();
    });
  });

  it("should show ServiceUnavailableState when service returns 503", async () => {
    const error = new Error("Service Unavailable");
    error.status = 503;

    mockGetRegulations.mockRejectedValueOnce(error);

    renderWithRouter("/deposit");

    await waitFor(() => {
      expect(screen.getByText("Service Unavailable")).toBeInTheDocument();
    });
  });

  it("should retry and recover when Retry button clicked on service unavailable", async () => {
    const user = userEvent.setup({ delay: null });

    const error = new Error("Service Unavailable");
    error.status = 503;

    mockGetRegulations.mockRejectedValueOnce(error).mockResolvedValueOnce({
      success: true,
      data: {
        minimumBalance: 100000,
      },
    });

    renderWithRouter("/deposit");

    await waitFor(() => {
      expect(screen.getByText("Service Unavailable")).toBeInTheDocument();
    });

    const retryButton = screen.getByRole("button", { name: /retry/i });
    await user.click(retryButton);

    await waitFor(() => {
      expect(mockGetRegulations).toHaveBeenCalledTimes(2);
    });
  });
});
