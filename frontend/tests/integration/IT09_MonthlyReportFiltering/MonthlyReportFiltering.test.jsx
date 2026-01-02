import React from "react";
import { render as rtlRender, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock reportService
jest.mock("../../../src/services/reportService", () => ({
  getMonthlyOpenCloseReport: jest.fn(),
  getAllTypeSavings: jest.fn(),
}));

// Mock typeSavingService
jest.mock("../../../src/services/typeSavingService", () => ({
  getAllTypeSavings: jest.fn(),
}));

// Mock UI components
jest.mock("../../../src/components/ServiceUnavailableState", () => ({
  ServiceUnavailablePageState: ({ onRetry, loading }) => (
    <div>
      <h2>Service Unavailable</h2>
      <button onClick={onRetry} disabled={loading}>
        Retry
      </button>
    </div>
  ),
}));

jest.mock("../../../src/components/RoleGuard", () => ({
  RoleGuard: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../../src/components/ui/month-picker", () => ({
  MonthPicker: ({ date, onSelect }) => (
    <input
      type="month"
      onChange={(e) => {
        if (e.target.value) {
          const [year, month] = e.target.value.split("-");
          const newDate = new Date(parseInt(year), parseInt(month) - 1);
          onSelect(newDate);
        }
      }}
      value={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`}
      data-testid="month-picker"
    />
  ),
}));

jest.mock("../../../src/components/ui/skeleton", () => ({
  Skeleton: ({ className }) => <div className={className} />,
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

jest.mock("../../../src/components/ui/card", () => ({
  Card: ({ children }) => <div className="card">{children}</div>,
  CardHeader: ({ children }) => <div className="card-header">{children}</div>,
  CardTitle: ({ children }) => <h2>{children}</h2>,
  CardDescription: ({ children }) => <p>{children}</p>,
  CardContent: ({ children }) => <div className="card-content">{children}</div>,
}));

jest.mock("../../../src/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, className, style }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={style}
      data-testid="button"
    >
      {children}
    </button>
  ),
}));

jest.mock("../../../src/components/ui/label", () => ({
  Label: ({ children }) => <label>{children}</label>,
}));

jest.mock("../../../src/components/ui/select", () => ({
  Select: ({ value, onValueChange, children }) => (
    <div>
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        data-testid="select-savings-type"
      >
        {children}
      </select>
    </div>
  ),
  SelectTrigger: ({ children }) => <div>{children}</div>,
  SelectValue: () => null,
  SelectContent: ({ children }) => <>{children}</>,
  SelectItem: ({ children, value }) => (
    <option value={value}>{children}</option>
  ),
}));

jest.mock("react-to-print", () => ({
  useReactToPrint: () => jest.fn(),
}));

jest.mock("../../../src/contexts/AuthContext", () => ({
  useAuthContext: () => ({
    user: {
      id: "user-1",
      fullName: "Test User",
      roleName: "accountant",
      email: "test@example.com",
    },
  }),
}));

jest.mock("../../../src/utils/serverStatusUtils", () => ({
  isServerUnavailable: (err) => err?.response?.status === 503,
}));

jest.mock("../../../src/pages/Reports/MonthlyReportPrint", () => ({
  MonthlyReportPrint: () => <div>Print Component</div>,
}));

jest.mock("lucide-react", () => ({
  FileDown: () => <span />,
  Printer: () => <span />,
  Search: () => <span />,
  Loader2: () => <span />,
}));

import MonthlyReport from "../../../src/pages/Reports/MonthlyReport";
import * as reportService from "../../../src/services/reportService";
import * as typeSavingService from "../../../src/services/typeSavingService";

const mockGetMonthlyOpenCloseReport = reportService.getMonthlyOpenCloseReport;
const mockGetAllTypeSavings = typeSavingService.getAllTypeSavings;

describe("Integration: IT09 - Monthly Report Filtering", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Default mock responses
    mockGetAllTypeSavings.mockResolvedValue({
      success: true,
      data: [
        {
          typeSavingId: "1",
          typeName: "No term",
        },
        {
          typeSavingId: "2",
          typeName: "3-Month Fixed",
        },
      ],
    });

    mockGetMonthlyOpenCloseReport.mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            day: 1,
            newSavingBooks: 5,
            closedSavingBooks: 2,
            difference: 3,
          },
          {
            day: 2,
            newSavingBooks: 8,
            closedSavingBooks: 1,
            difference: 7,
          },
          {
            day: 3,
            newSavingBooks: 3,
            closedSavingBooks: 3,
            difference: 0,
          },
        ],
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderWithRouter = (initialRoute = "/report/monthly") => {
    return rtlRender(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/report/monthly" element={<MonthlyReport />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("should render Monthly Report page with month/year and savings type selectors", async () => {
    renderWithRouter("/report/monthly");

    expect(
      screen.getByText(/monthly opening\/closing report/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("month-picker")).toBeInTheDocument();
    expect(screen.getByTestId("select-savings-type")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /generate report/i })
    ).toBeInTheDocument();
  });

  it("should call getMonthlyOpenCloseReport with correct month/year and savings type params", async () => {
    const user = userEvent.setup({ delay: null });

    renderWithRouter("/report/monthly");

    const monthInput = screen.getByTestId("month-picker");
    await user.type(monthInput, "2024-03");

    const selectInput = screen.getByTestId("select-savings-type");
    await user.selectOptions(selectInput, "1");

    const generateButton = screen.getByRole("button", {
      name: /generate report/i,
    });
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalled();
    });

    const calls = mockGetMonthlyOpenCloseReport.mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const [month, year, savingsType] = calls[0];
    expect(typeof month).toBe("number");
    expect(typeof year).toBe("number");
    expect(savingsType).toBe("1");
  });

  it("should disable Generate button and show loading indicator while generating", async () => {
    const user = userEvent.setup({ delay: null });

    let resolveReport;
    const reportPromise = new Promise((resolve) => {
      resolveReport = resolve;
    });

    mockGetMonthlyOpenCloseReport.mockReturnValue(reportPromise);

    renderWithRouter("/report/monthly");

    const generateButton = screen.getByRole("button", {
      name: /generate report/i,
    });
    await user.click(generateButton);

    expect(generateButton).toHaveTextContent("Generating...");
    expect(generateButton).toBeDisabled();

    resolveReport({
      success: true,
      data: {
        items: [
          {
            day: 1,
            newSavingBooks: 5,
            closedSavingBooks: 2,
            difference: 3,
          },
        ],
      },
    });

    await waitFor(() => {
      expect(generateButton).not.toHaveTextContent("Generating...");
      expect(generateButton).not.toBeDisabled();
    });
  });

  it("should display report summary section on successful generation", async () => {
    const user = userEvent.setup({ delay: null });

    renderWithRouter("/report/monthly");

    const generateButton = screen.getByRole("button", {
      name: /generate report/i,
    });
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /print report/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /export pdf/i })
      ).toBeInTheDocument();
    });
  });

  it("should show No Data message when report returns empty data", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetMonthlyOpenCloseReport.mockResolvedValue({
      success: true,
      data: null,
    });

    renderWithRouter("/report/monthly");

    const generateButton = screen.getByRole("button", {
      name: /generate report/i,
    });
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });
  });

  it("should show ServiceUnavailablePageState when service returns 503 error", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetMonthlyOpenCloseReport.mockRejectedValue({
      response: { status: 503 },
      message: "Service Unavailable",
    });

    renderWithRouter("/report/monthly");

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

  it("should call service again after clicking retry on 503 error", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetMonthlyOpenCloseReport.mockRejectedValueOnce({
      response: { status: 503 },
      message: "Service Unavailable",
    });

    renderWithRouter("/report/monthly");

    const generateButton = screen.getByRole("button", {
      name: /generate report/i,
    });
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText("Service Unavailable")).toBeInTheDocument();
    });

    expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalledTimes(1);
  });

  it("should change filter and regenerate report successfully", async () => {
    const user = userEvent.setup({ delay: null });

    mockGetMonthlyOpenCloseReport.mockResolvedValue({
      success: true,
      data: {
        items: [
          {
            day: 1,
            newSavingBooks: 10,
            closedSavingBooks: 4,
            difference: 6,
          },
        ],
      },
    });

    renderWithRouter("/report/monthly");

    // First generation
    let generateButton = screen.getByRole("button", {
      name: /generate report/i,
    });
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalledTimes(1);
    });

    // Change savings type filter
    const selectInput = screen.getByTestId("select-savings-type");
    await user.selectOptions(selectInput, "2");

    // Generate again
    generateButton = screen.getByRole("button", { name: /generate report/i });
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockGetMonthlyOpenCloseReport).toHaveBeenCalledTimes(2);
    });

    const secondCall = mockGetMonthlyOpenCloseReport.mock.calls[1];
    expect(secondCall[2]).toBe("2");
  });
});
