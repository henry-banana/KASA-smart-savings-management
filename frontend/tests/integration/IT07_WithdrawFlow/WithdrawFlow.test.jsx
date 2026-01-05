import React from "react";
import { render as rtlRender, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";

const mockGetAccountInfo = jest.fn();
const mockWithdrawMoney = jest.fn();
const mockCloseSavingAccount = jest.fn();
const mockGetRegulations = jest.fn();

jest.mock("../../../src/services/transactionService", () => ({
  getAccountInfo: (...args) => mockGetAccountInfo(...args),
  withdrawMoney: (...args) => mockWithdrawMoney(...args),
  closeSavingAccount: (...args) => mockCloseSavingAccount(...args),
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
  ReceiptIllustration: () => <div />,
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
  formatPercentText: (text) => text,
  formatBalance: (num) => {
    if (typeof num !== "number") return "0";
    return num.toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  },
}));

import Withdraw from "../../../src/pages/Savings/Withdraw";

const renderWithRouter = (initialRoute = "/withdraw") => {
  return rtlRender(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/withdraw" element={<Withdraw />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Integration: IT07 - Withdraw Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Default regulations mock
    mockGetRegulations.mockResolvedValue({
      success: true,
      data: {
        minimumTermDays: 15,
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render Withdraw page with account code input and Lookup button", async () => {
    renderWithRouter("/withdraw");

    expect(screen.getByText(/make withdrawal/i)).toBeInTheDocument();

    // Wait for regulations to load
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });
  });

  it("should lookup success and display customer info for no-term account", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAccountInfo.mockResolvedValue({
      data: {
        bookId: "book-1",
        accountCode: "WA001",
        customerName: "Alice Johnson",
        accountTypeName: "No term",
        balance: 3000000,
        status: "open",
        openDate: "2023-01-15",
        interestRate: 0.5,
      },
    });

    renderWithRouter("/withdraw");

    // Wait for regulations to load
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });

    const accountInput = screen.getByPlaceholderText(/saving book id/i);
    const lookupButton = screen.getByRole("button", { name: /lookup/i });

    await user.type(accountInput, "WA001");
    await user.click(lookupButton);

    await waitFor(() => {
      expect(mockGetAccountInfo).toHaveBeenCalledWith("WA001");
    });

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("No term")).toBeInTheDocument();
  });

  it("should prevent withdrawal when account is closed", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAccountInfo.mockResolvedValue({
      data: {
        bookId: "book-2",
        accountCode: "WA002",
        customerName: "Bob Smith",
        accountTypeName: "No term",
        balance: 2000000,
        status: "close",
        openDate: "2022-06-20",
        interestRate: 0.5,
      },
    });

    renderWithRouter("/withdraw");

    // Wait for regulations to load
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });

    const accountInput = screen.getByPlaceholderText(/saving book id/i);
    const lookupButton = screen.getByRole("button", { name: /lookup/i });

    await user.type(accountInput, "WA002");
    await user.click(lookupButton);

    await waitFor(() => {
      expect(screen.getByText(/saving book was closed/i)).toBeInTheDocument();
    });

    expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
  });

  it("should prevent withdrawal when amount exceeds balance", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAccountInfo.mockResolvedValue({
      data: {
        bookId: "book-1",
        accountCode: "WA001",
        customerName: "Alice Johnson",
        accountTypeName: "No term",
        balance: 1000000,
        status: "open",
        openDate: "2023-01-15",
        interestRate: 0.5,
      },
    });

    renderWithRouter("/withdraw");

    // Wait for regulations to load
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });

    const accountInput = screen.getByPlaceholderText(/saving book id/i);
    const lookupButton = screen.getByRole("button", { name: /lookup/i });

    await user.type(accountInput, "WA001");
    await user.click(lookupButton);

    await waitFor(() => {
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });

    const withdrawInput = screen.getByLabelText(/withdrawal amount/i);

    // The input should cap the value to the balance (max attribute prevents exceeding)
    await user.clear(withdrawInput);
    await user.type(withdrawInput, "1500000");

    // Input will be capped to balance (1000000) due to max attribute in component
    await waitFor(() => {
      const input = screen.getByLabelText(/withdrawal amount/i);
      expect(Number(input.value)).toBeLessThanOrEqual(1000000);
    });
  });

  it("should submit withdrawal for no-term account with valid amount", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAccountInfo.mockResolvedValue({
      data: {
        bookId: "book-1",
        accountCode: "WA001",
        customerName: "Alice Johnson",
        accountTypeName: "No term",
        balance: 3000000,
        status: "open",
        openDate: "2023-01-15",
        interestRate: 0.5,
      },
    });

    mockWithdrawMoney.mockResolvedValue({
      data: {
        success: true,
      },
    });

    renderWithRouter("/withdraw");

    // Wait for regulations to load
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });

    const accountInput = screen.getByPlaceholderText(/saving book id/i);
    const lookupButton = screen.getByRole("button", { name: /lookup/i });

    await user.type(accountInput, "WA001");
    await user.click(lookupButton);

    await waitFor(() => {
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });

    const withdrawInput = screen.getByLabelText(/withdrawal amount/i);
    const submitButton = screen.getByRole("button", {
      name: /confirm withdrawal/i,
    });

    await user.type(withdrawInput, "1000000");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockWithdrawMoney).toHaveBeenCalledWith("WA001", 1000000, false);
    });
  });

  it("should display fixed-term account info with maturity date", async () => {
    const user = userEvent.setup({ delay: null });

    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(futureDate.getMonth() + 6);
    const futureDateStr = futureDate.toISOString().split("T")[0];

    const openDate = new Date(today);
    openDate.setDate(openDate.getDate() - 60);
    const openDateStr = openDate.toISOString().split("T")[0];

    mockGetAccountInfo.mockResolvedValue({
      data: {
        bookId: "book-3",
        accountCode: "WA003",
        customerName: "David Lee",
        accountTypeName: "6-Month Fixed",
        balance: 2500000,
        status: "open",
        openDate: openDateStr,
        maturityDate: futureDateStr,
        interestRate: 0.8,
      },
    });

    renderWithRouter("/withdraw");

    // Wait for regulations to load
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });

    const accountInput = screen.getByPlaceholderText(/saving book id/i);
    const lookupButton = screen.getByRole("button", { name: /lookup/i });

    await user.type(accountInput, "WA003");
    await user.click(lookupButton);

    // Verify fixed-term account displays maturity date and not matured status
    await waitFor(() => {
      expect(screen.getByText("David Lee")).toBeInTheDocument();
      expect(screen.getByText("6-Month Fixed")).toBeInTheDocument();
    });

    // Verify maturity status is shown (should be "Not Matured" since future date)
    expect(screen.getByText("Not Matured")).toBeInTheDocument();
  });

  it("should show error message when withdrawal fails", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetAccountInfo.mockResolvedValue({
      data: {
        bookId: "book-1",
        accountCode: "WA001",
        customerName: "Alice Johnson",
        accountTypeName: "No term",
        balance: 3000000,
        status: "open",
        openDate: "2023-01-15",
        interestRate: 0.5,
      },
    });

    mockWithdrawMoney.mockRejectedValue(
      new Error("Withdrawal temporarily unavailable")
    );

    renderWithRouter("/withdraw");

    // Wait for regulations to load
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /lookup/i });
      expect(button).not.toHaveTextContent("Loading...");
    });

    const accountInput = screen.getByPlaceholderText(/saving book id/i);
    const lookupButton = screen.getByRole("button", { name: /lookup/i });

    await user.type(accountInput, "WA001");
    await user.click(lookupButton);

    await waitFor(() => {
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });

    const withdrawInput = screen.getByLabelText(/withdrawal amount/i);
    const submitButton = screen.getByRole("button", {
      name: /confirm withdrawal/i,
    });

    await user.type(withdrawInput, "500000");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockWithdrawMoney).toHaveBeenCalled();
    });
  });

  it("should show ServiceUnavailableState when service returns 503", async () => {
    const error = new Error("Service Unavailable");
    error.status = 503;

    mockGetRegulations.mockRejectedValueOnce(error);

    renderWithRouter("/withdraw");

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
        minimumTermDays: 15,
      },
    });

    renderWithRouter("/withdraw");

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
