import React from "react";
import { render, screen, waitFor } from "../../test-utils/render";
import { format } from "date-fns";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const mockGetDailyReport = jest.fn();

jest.mock("../../../src/services/reportService", () => ({
  getDailyReport: (...args) => mockGetDailyReport(...args),
}));

jest.mock("../../../src/services/transactionService", () => ({
  getDepositTransactionStats: jest.fn().mockResolvedValue({
    success: true,
    data: { total: { count: 10, total: 1000000 }, items: [] },
  }),
  getWithdrawalTransactionStats: jest.fn().mockResolvedValue({
    success: true,
    data: { total: { count: 5, total: 500000 }, items: [] },
  }),
}));

jest.mock("../../../src/components/RoleGuard", () => ({
  RoleGuard: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../../src/components/CuteComponents", () => ({
  StarDecor: () => <div data-testid="star-decor" />,
  SparkleDecor: () => <div data-testid="sparkle-decor" />,
}));

jest.mock("../../../src/components/ServiceUnavailableState", () => ({
  ServiceUnavailablePageState: ({ onRetry }) => (
    <div data-testid="service-unavailable">
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

jest.mock("../../../src/utils/logger", () => ({
  logger: { error: jest.fn(), info: jest.fn() },
}));

jest.mock("react-to-print", () => ({
  useReactToPrint: () => jest.fn(),
}));

jest.mock("../../../src/utils/numberFormatter", () => ({
  formatVnNumber: (num) => {
    if (!num) return "0";
    return (num / 1000000).toFixed(2);
  },
}));

jest.mock("../../../src/utils/serverStatusUtils", () => ({
  isServerUnavailable: (err) => err?.response?.status === 503,
}));

jest.mock("../../../src/components/ui/skeleton", () => ({
  Skeleton: ({ className }) => (
    <div className={className} data-testid="skeleton" />
  ),
}));

jest.mock("recharts", () => ({
  BarChart: () => <div data-testid="bar-chart" />,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  ResponsiveContainer: () => <div data-testid="chart-container" />,
}));

import DailyReport from "../../../src/pages/Reports/DailyReport";

const mockReportData = {
  success: true,
  data: {
    summary: {
      totalDeposits: 50000000,
      totalWithdrawals: 30000000,
      difference: 20000000,
    },
    byTypeSaving: [
      {
        typeSavingId: "type1",
        typeName: "No term",
        totalDeposits: 20000000,
        totalWithdrawals: 10000000,
        difference: 10000000,
      },
      {
        typeSavingId: "type2",
        typeName: "6 Month Fixed",
        totalDeposits: 30000000,
        totalWithdrawals: 20000000,
        difference: 10000000,
      },
    ],
  },
};

describe("UC09 - Daily Sales Report", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
    localStorage.clear();

    mockGetDailyReport.mockResolvedValue(mockReportData);
  });

  afterEach(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  describe("A) Page Renders Main Controls", () => {
    it("should render Daily Report page with title", () => {
      render(<DailyReport />);
      expect(screen.getByText(/daily report/i)).toBeInTheDocument();
    });

    it("should display date picker with Select Date label", () => {
      render(<DailyReport />);
      expect(screen.getByText("Select Date")).toBeInTheDocument();
    });

    it("should display Generate Report button", () => {
      render(<DailyReport />);
      const btn = screen.getByRole("button", { name: /generate report/i });
      expect(btn).toBeInTheDocument();
      expect(btn).not.toBeDisabled();
    });
  });

  describe("B) Generate Report Service Call", () => {
    it("should call getDailyReport with date string on Generate button click", async () => {
      const user = userEvent.setup();
      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetDailyReport).toHaveBeenCalled();
      });

      const dateArg = mockGetDailyReport.mock.calls[0][0];
      expect(dateArg).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should call getDailyReport with today's date by default", async () => {
      const user = userEvent.setup();

      // Use the same formatting logic as the component (date-fns format)
      const now = new Date();
      const expectedDateStr = format(now, "yyyy-MM-dd");

      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetDailyReport).toHaveBeenCalledWith(expectedDateStr);
      });
    });

    it("should only call getDailyReport once per Generate click", async () => {
      const user = userEvent.setup();
      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetDailyReport).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("C) Loading State", () => {
    it("should show Generating... text on button while loading", async () => {
      const user = userEvent.setup();
      let resolveReport;
      const pending = new Promise((resolve) => {
        resolveReport = resolve;
      });

      mockGetDailyReport.mockReturnValue(pending);

      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /generating/i })
        ).toBeInTheDocument();
      });

      resolveReport(mockReportData);

      await waitFor(() => {
        expect(mockGetDailyReport).toHaveBeenCalled();
      });
    });

    it("should disable Generate button while loading", async () => {
      const user = userEvent.setup();
      let resolveReport;
      const pending = new Promise((resolve) => {
        resolveReport = resolve;
      });

      mockGetDailyReport.mockReturnValue(pending);

      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /generating/i })
        ).toBeDisabled();
      });

      resolveReport(mockReportData);
    });

    it("should display skeleton loaders while report is pending", async () => {
      const user = userEvent.setup();
      let resolveReport;
      const pending = new Promise((resolve) => {
        resolveReport = resolve;
      });

      mockGetDailyReport.mockReturnValue(pending);

      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        const skeletons = screen.getAllByTestId("skeleton");
        expect(skeletons.length).toBeGreaterThan(0);
      });

      resolveReport(mockReportData);
    });
  });

  describe("D) Success Path - Report Display", () => {
    it("should display Page header and description after successful report fetch", async () => {
      const user = userEvent.setup();
      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(screen.getByText(/daily report/i)).toBeInTheDocument();
      });
    });

    it("should render the main report container after report loads", async () => {
      const user = userEvent.setup();
      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        const container = document.querySelector("[data-slot='card-content']");
        expect(container).toBeInTheDocument();
      });
    });

    it("should not show loading state after report successfully loads", async () => {
      const user = userEvent.setup();
      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetDailyReport).toHaveBeenCalled();
        // Button should return to "Generate Report" text, not "Generating"
        expect(
          screen.getByRole("button", { name: /generate report/i })
        ).toBeInTheDocument();
      });
    });
  });

  describe("E) Empty Result State", () => {
    it("should show No Data Found message when report returns no data", async () => {
      const user = userEvent.setup();
      mockGetDailyReport.mockResolvedValue({
        success: false,
        data: null,
      });

      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        const headings = screen.getAllByText(/no data found/i);
        expect(headings.length).toBeGreaterThan(0);
      });
    });

    it("should display helpful message for empty data state", async () => {
      const user = userEvent.setup();
      mockGetDailyReport.mockResolvedValue({
        success: false,
        data: null,
      });

      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(screen.getByText(/try another date/i)).toBeInTheDocument();
      });
    });
  });

  describe("F) Error State - Service Unavailable", () => {
    it("should show ServiceUnavailableState when getDailyReport returns 503", async () => {
      const user = userEvent.setup();
      mockGetDailyReport.mockRejectedValue({
        response: { status: 503 },
        message: "Service Unavailable",
      });

      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(screen.getByTestId("service-unavailable")).toBeInTheDocument();
      });
    });

    it("should show Retry button in unavailable state", async () => {
      const user = userEvent.setup();
      mockGetDailyReport.mockRejectedValue({
        response: { status: 503 },
      });

      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /retry/i })
        ).toBeInTheDocument();
      });
    });

    it("should show error message on network failure", async () => {
      const user = userEvent.setup();
      mockGetDailyReport.mockRejectedValue(new Error("Network error"));

      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(
          screen.getByText(/failed to generate report/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("G) Report Date Format Validation", () => {
    it("should use yyyy-mm-dd format for API call", async () => {
      const user = userEvent.setup();
      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        const callDate = mockGetDailyReport.mock.calls[0][0];
        // Verify format: YYYY-MM-DD
        expect(callDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        // Verify it's a valid date
        const dateObj = new Date(callDate);
        expect(dateObj.toString()).not.toBe("Invalid Date");
      });
    });
  });

  describe("H) Multiple Generate Calls", () => {
    it("should allow generating multiple reports sequentially", async () => {
      const user = userEvent.setup();
      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });

      // First generate
      await user.click(btn);
      await waitFor(() => {
        expect(mockGetDailyReport).toHaveBeenCalledTimes(1);
      });

      // Reset button to clickable state and generate again
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /generate report/i })
        ).not.toBeDisabled();
      });

      await user.click(btn);
      await waitFor(() => {
        expect(mockGetDailyReport).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("I) Report Component Integration", () => {
    it("should render report area when data is successfully fetched", async () => {
      const user = userEvent.setup();
      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetDailyReport).toHaveBeenCalled();
        const cardContent = document.querySelector(
          "[data-slot='card-content']"
        );
        expect(cardContent).toBeInTheDocument();
      });
    });

    it("should have report container as child of main section", async () => {
      const user = userEvent.setup();
      render(<DailyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        const mainSection = screen.getByText(/daily report/i).closest("div");
        expect(mainSection).toBeInTheDocument();
      });
    });
  });
});
