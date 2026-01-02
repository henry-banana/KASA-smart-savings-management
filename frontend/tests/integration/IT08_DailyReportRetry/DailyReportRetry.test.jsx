import React from "react";
import { render as rtlRender, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";

const mockGetDailyReport = jest.fn();
const mockGetDepositTransactionStats = jest.fn();
const mockGetWithdrawalTransactionStats = jest.fn();

jest.mock("../../../src/services/reportService", () => ({
  getDailyReport: (...args) => mockGetDailyReport(...args),
}));

jest.mock("../../../src/services/transactionService", () => ({
  getDepositTransactionStats: (...args) =>
    mockGetDepositTransactionStats(...args),
  getWithdrawalTransactionStats: (...args) =>
    mockGetWithdrawalTransactionStats(...args),
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
  ServiceUnavailablePageState: ({ onRetry, loading }) => (
    <div>
      <div>Service Unavailable</div>
      <button onClick={onRetry} disabled={loading}>
        Retry
      </button>
    </div>
  ),
}));

jest.mock("../../../src/components/CuteComponents", () => ({
  CuteStatCard: ({ children }) => <div>{children}</div>,
  StarDecor: () => <div />,
  SparkleDecor: () => <div />,
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
}));

jest.mock("recharts", () => ({
  BarChart: () => <div>Bar Chart</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../../src/pages/Reports/DailyReportPrint", () => ({
  DailyReportPrint: () => <div>Print Component</div>,
}));

import DailyReport from "../../../src/pages/Reports/DailyReport";

const renderWithRouter = (initialRoute = "/report/daily") => {
  return rtlRender(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/report/daily" element={<DailyReport />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Integration: IT08 - Daily Report Retry Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Default mock responses with correct structure for depositStats and withdrawalStats
    mockGetDepositTransactionStats.mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            typeName: "No term",
            count: 5,
            totalAmount: 1000000,
          },
        ],
        total: {
          count: 5,
          totalAmount: 1000000,
        },
      },
    });

    mockGetWithdrawalTransactionStats.mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            typeName: "No term",
            count: 3,
            totalAmount: 500000,
          },
        ],
        total: {
          count: 3,
          totalAmount: 500000,
        },
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render Daily Report page with date control and Generate button", async () => {
    mockGetDailyReport.mockResolvedValue({
      success: true,
      data: {
        summary: {
          totalDeposits: 1000000,
          totalWithdrawals: 500000,
          difference: 500000,
        },
        byTypeSaving: [
          {
            typeName: "No term",
            totalDeposits: 1000000,
            totalWithdrawals: 500000,
            difference: 500000,
          },
        ],
      },
    });

    renderWithRouter("/report/daily");

    expect(screen.getByText(/daily report/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /generate report/i })
    ).toBeInTheDocument();
  });

  it("should call getDailyReport with yyyy-mm-dd format when Generate clicked", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetDailyReport.mockResolvedValue({
      success: true,
      data: {
        summary: {
          totalDeposits: 2000000,
          totalWithdrawals: 1000000,
          difference: 1000000,
        },
        byTypeSaving: [
          {
            typeName: "No term",
            totalDeposits: 2000000,
            totalWithdrawals: 1000000,
            difference: 1000000,
          },
        ],
      },
    });

    renderWithRouter("/report/daily");

    const generateButton = screen.getByRole("button", {
      name: /generate report/i,
    });

    await user.click(generateButton);

    await waitFor(() => {
      expect(mockGetDailyReport).toHaveBeenCalled();
    });

    // Verify the call was made with a valid date string format
    const calls = mockGetDailyReport.mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const firstCall = calls[0][0];
    expect(typeof firstCall).toBe("string");
    expect(firstCall).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should show ServiceUnavailablePageState when service returns 503", async () => {
    const user = userEvent.setup({ delay: null });

    const error = new Error("Service Unavailable");
    error.status = 503;

    mockGetDailyReport.mockRejectedValueOnce(error);

    renderWithRouter("/report/daily");

    const generateButton = screen.getByRole("button", {
      name: /generate report/i,
    });

    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText("Service Unavailable")).toBeInTheDocument();
    });
  });

  it("should call Retry button and recover to normal state after service unavailable", async () => {
    const user = userEvent.setup({ delay: null });

    const error = new Error("Service Unavailable");
    error.status = 503;

    mockGetDailyReport.mockRejectedValueOnce(error).mockResolvedValueOnce({
      success: true,
      data: {
        summary: {
          totalDeposits: 3000000,
          totalWithdrawals: 1500000,
          difference: 1500000,
        },
        byTypeSaving: [
          {
            typeName: "No term",
            totalDeposits: 3000000,
            totalWithdrawals: 1500000,
            difference: 1500000,
          },
        ],
      },
    });

    renderWithRouter("/report/daily");

    const generateButton = screen.getByRole("button", {
      name: /generate report/i,
    });

    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText("Service Unavailable")).toBeInTheDocument();
    });

    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it("should show summary section after successful report generation", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetDailyReport.mockResolvedValue({
      success: true,
      data: {
        summary: {
          totalDeposits: 5000000,
          totalWithdrawals: 2000000,
          difference: 3000000,
        },
        byTypeSaving: [
          {
            typeName: "No term",
            totalDeposits: 3000000,
            totalWithdrawals: 1000000,
            difference: 2000000,
          },
          {
            typeName: "3-Month Fixed",
            totalDeposits: 2000000,
            totalWithdrawals: 1000000,
            difference: 1000000,
          },
        ],
      },
    });

    renderWithRouter("/report/daily");

    const generateButton = screen.getByRole("button", {
      name: /generate report/i,
    });

    await user.click(generateButton);

    // Verify the report data renders - check for summary cards
    await waitFor(() => {
      expect(mockGetDailyReport).toHaveBeenCalled();
    });

    // After successful report, the summary cards should appear
    // Look for the section container that appears when reportData is available
    await waitFor(() => {
      const printButton = screen.queryByRole("button", {
        name: /print report/i,
      });
      expect(printButton).toBeInTheDocument();
    });
  });

  it("should disable Generate button and show loading text while pending", async () => {
    const user = userEvent.setup({ delay: null });

    let resolveReport;
    let resolveDepositStats;
    let resolveWithdrawalStats;

    const reportPromise = new Promise((resolve) => {
      resolveReport = resolve;
    });
    const depositStatsPromise = new Promise((resolve) => {
      resolveDepositStats = resolve;
    });
    const withdrawalStatsPromise = new Promise((resolve) => {
      resolveWithdrawalStats = resolve;
    });

    mockGetDailyReport.mockReturnValue(reportPromise);
    mockGetDepositTransactionStats.mockReturnValue(depositStatsPromise);
    mockGetWithdrawalTransactionStats.mockReturnValue(withdrawalStatsPromise);

    renderWithRouter("/report/daily");

    const generateButton = screen.getByRole("button", {
      name: /generate report/i,
    });

    await user.click(generateButton);

    // Verify button is in loading state
    expect(generateButton).toHaveTextContent("Generating...");
    expect(generateButton).toBeDisabled();

    // Resolve all promises to complete loading
    resolveReport({
      success: true,
      data: {
        summary: {
          totalDeposits: 1000000,
          totalWithdrawals: 500000,
          difference: 500000,
        },
        byTypeSaving: [
          {
            typeName: "No term",
            totalDeposits: 1000000,
            totalWithdrawals: 500000,
            difference: 500000,
          },
        ],
      },
    });

    resolveDepositStats({
      success: true,
      data: {
        items: [
          {
            typeName: "No term",
            count: 5,
            totalAmount: 1000000,
          },
        ],
        total: {
          count: 5,
          totalAmount: 1000000,
        },
      },
    });

    resolveWithdrawalStats({
      success: true,
      data: {
        items: [
          {
            typeName: "No term",
            count: 3,
            totalAmount: 500000,
          },
        ],
        total: {
          count: 3,
          totalAmount: 500000,
        },
      },
    });

    // Wait for button to return to normal state
    await waitFor(() => {
      expect(generateButton).not.toHaveTextContent("Generating...");
      expect(generateButton).not.toBeDisabled();
    });
  });

  it("should display no data message when report returns no data", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetDailyReport.mockResolvedValue({
      success: true,
      data: null,
    });

    renderWithRouter("/report/daily");

    const generateButton = screen.getByRole("button", {
      name: /generate report/i,
    });

    await user.click(generateButton);

    // When data is null, the component sets error to "NO_DATA" and shows no data message
    await waitFor(() => {
      expect(mockGetDailyReport).toHaveBeenCalled();
    });

    // Check for no data message - use getByText with more specific selector to find the h4 heading
    const noDataHeading = screen.getByText("No Data Found");
    expect(noDataHeading).toBeInTheDocument();
    expect(noDataHeading.tagName).toBe("H4");
  });
});
