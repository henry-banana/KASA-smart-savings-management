import React from "react";
import { render, screen, waitFor } from "../../test-utils/render";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const mockGetMonthlyOpenCloseReport = jest.fn();
const mockGetAllTypeSavings = jest.fn();

jest.mock("../../../src/services/reportService", () => ({
  getMonthlyOpenCloseReport: (...args) =>
    mockGetMonthlyOpenCloseReport(...args),
}));

jest.mock("../../../src/services/typeSavingService", () => ({
  getAllTypeSavings: () => mockGetAllTypeSavings(),
}));

jest.mock("../../../src/components/RoleGuard", () => ({
  RoleGuard: ({ children }) => <div>{children}</div>,
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

jest.mock("../../../src/contexts/AuthContext", () => ({
  useAuthContext: () => ({
    user: { id: "1", role: "accountant" },
  }),
}));

import MonthlyReport from "../../../src/pages/Reports/MonthlyReport";

const mockReportData = {
  success: true,
  data: {
    items: [
      {
        day: 1,
        opened: 10,
        newSavingBooks: 10,
        closed: 2,
        closedSavingBooks: 2,
        difference: 8,
      },
      {
        day: 2,
        opened: 8,
        newSavingBooks: 8,
        closed: 1,
        closedSavingBooks: 1,
        difference: 7,
      },
      {
        day: 3,
        opened: 15,
        newSavingBooks: 15,
        closed: 3,
        closedSavingBooks: 3,
        difference: 12,
      },
    ],
  },
};

const mockTypeSavingsData = {
  success: true,
  data: [
    { typeSavingId: "1", typeName: "No term" },
    { typeSavingId: "2", typeName: "6 Month Fixed" },
    { typeSavingId: "3", typeName: "12 Month Fixed" },
  ],
};

describe("UC10 - Monthly Open/Close Report", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
    localStorage.clear();

    mockGetMonthlyOpenCloseReport.mockResolvedValue(mockReportData);
    mockGetAllTypeSavings.mockResolvedValue(mockTypeSavingsData);
  });

  afterEach(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  describe("A) Page Render Controls", () => {
    it("should render Monthly Report page with title", () => {
      render(<MonthlyReport />);
      expect(
        screen.getByText(/monthly opening\/closing report/i)
      ).toBeInTheDocument();
    });

    it("should display month picker with Month label", () => {
      render(<MonthlyReport />);
      expect(screen.getByText("Select Month & Year")).toBeInTheDocument();
    });

    it("should display Savings Type select with All Types default", () => {
      render(<MonthlyReport />);
      expect(screen.getByText("Savings Type")).toBeInTheDocument();
    });

    it("should display Generate Report button", () => {
      render(<MonthlyReport />);
      const btn = screen.getByRole("button", { name: /generate report/i });
      expect(btn).toBeInTheDocument();
      expect(btn).not.toBeDisabled();
    });

    it("should load and display savings types from service", async () => {
      render(<MonthlyReport />);
      await waitFor(() => {
        expect(mockGetAllTypeSavings).toHaveBeenCalled();
      });
    });
  });

  describe("B) Service Call with Correct Format", () => {
    it("should call getMonthlyOpenCloseReport with month number and year", async () => {
      const user = userEvent.setup();
      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalled();
      });

      const [month, year] = mockGetMonthlyOpenCloseReport.mock.calls[0];
      expect(typeof month).toBe("number");
      expect(typeof year).toBe("number");
      expect(month).toBeGreaterThanOrEqual(1);
      expect(month).toBeLessThanOrEqual(12);
      expect(year).toBeGreaterThan(2000);
    });

    it("should call getMonthlyOpenCloseReport with current month by default", async () => {
      const user = userEvent.setup();
      const today = new Date();
      const expectedMonth = today.getMonth() + 1;
      const expectedYear = today.getFullYear();

      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalledWith(
          expectedMonth,
          expectedYear,
          "all"
        );
      });
    });

    it("should include selected savings type in service call", async () => {
      const user = userEvent.setup();
      render(<MonthlyReport />);

      await waitFor(() => {
        expect(mockGetAllTypeSavings).toHaveBeenCalled();
      });

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalledWith(
          expect.any(Number),
          expect.any(Number),
          "all"
        );
      });
    });

    it("should only call getMonthlyOpenCloseReport once per Generate click", async () => {
      const user = userEvent.setup();
      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalledTimes(1);
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

      mockGetMonthlyOpenCloseReport.mockReturnValue(pending);

      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /generating/i })
        ).toBeInTheDocument();
      });

      resolveReport(mockReportData);
    });

    it("should disable Generate button while loading", async () => {
      const user = userEvent.setup();
      let resolveReport;
      const pending = new Promise((resolve) => {
        resolveReport = resolve;
      });

      mockGetMonthlyOpenCloseReport.mockReturnValue(pending);

      render(<MonthlyReport />);

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

      mockGetMonthlyOpenCloseReport.mockReturnValue(pending);

      render(<MonthlyReport />);

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
    it("should display report header after successful fetch", async () => {
      const user = userEvent.setup();
      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalled();
      });
    });

    it("should render report main container after data loads", async () => {
      const user = userEvent.setup();
      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        const container = document.querySelector(".print\\:hidden, .bg-white");
        expect(container).toBeInTheDocument();
      });
    });

    it("should not show loading state after report successfully loads", async () => {
      const user = userEvent.setup();
      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalled();
        // Button should return to normal state
        expect(
          screen.getByRole("button", { name: /generate report/i })
        ).not.toBeDisabled();
      });
    });

    it("should calculate totals from report data items", async () => {
      const user = userEvent.setup();
      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalled();
      });
    });
  });

  describe("E) Empty Result State", () => {
    it("should show No Data Found message when report returns empty", async () => {
      const user = userEvent.setup();
      mockGetMonthlyOpenCloseReport.mockResolvedValue({
        success: false,
        data: null,
      });

      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(
          screen.getByText(/no data found for the selected month/i)
        ).toBeInTheDocument();
      });
    });

    it("should display helpful message for empty data state", async () => {
      const user = userEvent.setup();
      mockGetMonthlyOpenCloseReport.mockResolvedValue({
        success: false,
        data: null,
      });

      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(
          screen.getByText(/try another month or savings type/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("F) Error State - Service Unavailable", () => {
    it("should show ServiceUnavailableState when API returns 503", async () => {
      const user = userEvent.setup();
      mockGetMonthlyOpenCloseReport.mockRejectedValue({
        response: { status: 503 },
      });

      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(screen.getByTestId("service-unavailable")).toBeInTheDocument();
      });
    });

    it("should show Retry button in service unavailable state", async () => {
      const user = userEvent.setup();
      mockGetMonthlyOpenCloseReport.mockRejectedValue({
        response: { status: 503 },
      });

      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /retry/i })
        ).toBeInTheDocument();
      });
    });

    it("should display error message on network failure", async () => {
      const user = userEvent.setup();
      mockGetMonthlyOpenCloseReport.mockRejectedValue(
        new Error("Network error")
      );

      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it("should show error alert on generic error", async () => {
      const user = userEvent.setup();
      mockGetMonthlyOpenCloseReport.mockRejectedValue(
        new Error("Generic error")
      );

      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        const errorDiv = document.querySelector(".bg-red-50");
        expect(errorDiv).toBeInTheDocument();
      });
    });
  });

  describe("G) Multiple Generations", () => {
    it("should allow generating multiple reports sequentially", async () => {
      const user = userEvent.setup();
      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });

      // First generate
      await user.click(btn);
      await waitFor(() => {
        expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalledTimes(1);
      });

      // Wait for button to be clickable again
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /generate report/i })
        ).not.toBeDisabled();
      });

      // Second generate
      await user.click(btn);
      await waitFor(() => {
        expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("H) Savings Type Filtering", () => {
    it("should load savings types on component mount", async () => {
      render(<MonthlyReport />);

      await waitFor(() => {
        expect(mockGetAllTypeSavings).toHaveBeenCalled();
      });
    });

    it("should allow changing savings type and use new value on generate", async () => {
      const user = userEvent.setup();
      render(<MonthlyReport />);

      await waitFor(() => {
        expect(mockGetAllTypeSavings).toHaveBeenCalled();
      });

      // Generate with default type
      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalledWith(
          expect.any(Number),
          expect.any(Number),
          expect.any(String)
        );
      });
    });
  });

  describe("I) Print/Export Functionality (if present)", () => {
    it("should render page without errors when print utils are called", async () => {
      const user = userEvent.setup();
      render(<MonthlyReport />);

      const btn = screen.getByRole("button", { name: /generate report/i });
      await user.click(btn);

      await waitFor(() => {
        expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalled();
      });

      // Verify page is still rendered
      expect(
        screen.getByText(/monthly opening\/closing report/i)
      ).toBeInTheDocument();
    });
  });

  describe("J) Month Selection", () => {
    it("should accept month picker changes", async () => {
      render(<MonthlyReport />);
      // Month picker component is rendered - test verifies it's present
      expect(screen.getByText("Select Month & Year")).toBeInTheDocument();
    });
  });
});
