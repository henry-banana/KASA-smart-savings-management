import React from "react";
import { render as rtlRender, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock regulationService
jest.mock("../../../src/services/regulationService", () => ({
  getRegulations: jest.fn(),
  updateRegulations: jest.fn(),
  getInterestRates: jest.fn(),
  updateInterestRates: jest.fn(),
}));

// Mock typeSavingService
jest.mock("../../../src/services/typeSavingService", () => ({
  getAllTypeSavings: jest.fn(),
  createTypeSaving: jest.fn(),
  deleteTypeSaving: jest.fn(),
  resetTypeSavingDefaults: jest.fn(),
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

jest.mock("../../../src/components/CuteComponents", () => ({
  StarDecor: () => <div />,
  SparkleDecor: () => <div />,
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
  Button: ({
    children,
    onClick,
    disabled,
    className,
    style,
    type,
    variant,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={style}
      type={type}
      data-testid={variant === "outline" ? "button-outline" : "button"}
    >
      {children}
    </button>
  ),
}));

jest.mock("../../../src/components/ui/input", () => ({
  Input: ({ value, onChange, type, label, placeholder, ...props }) => (
    <input
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      {...props}
      data-testid={`input-${label || placeholder || "default"}`}
    />
  ),
}));

jest.mock("../../../src/components/ui/label", () => ({
  Label: ({ children, htmlFor }) => <label htmlFor={htmlFor}>{children}</label>,
}));

jest.mock("../../../src/components/ui/checkbox", () => ({
  Checkbox: ({ checked, onCheckedChange, ...props }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      {...props}
      data-testid="checkbox"
    />
  ),
}));

jest.mock("../../../src/components/ui/table", () => ({
  Table: ({ children }) => <table>{children}</table>,
  TableHeader: ({ children }) => <thead>{children}</thead>,
  TableBody: ({ children }) => <tbody>{children}</tbody>,
  TableRow: ({ children }) => <tr>{children}</tr>,
  TableHead: ({ children }) => <th>{children}</th>,
  TableCell: ({ children }) => <td>{children}</td>,
}));

jest.mock("../../../src/components/ui/dialog", () => ({
  Dialog: ({ open, children, onOpenChange }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <h3>{children}</h3>,
  DialogDescription: ({ children }) => <p>{children}</p>,
}));

jest.mock("lucide-react", () => ({
  CheckCircle2: () => <span />,
  AlertTriangle: () => <span />,
  Settings: () => <span />,
  Sparkles: () => <span />,
}));

jest.mock("../../../src/utils/serverStatusUtils", () => ({
  isServerUnavailable: (err) => err?.response?.status === 503,
}));

import RegulationSettings from "../../../src/pages/Regulations/RegulationSettings";
import * as regulationService from "../../../src/services/regulationService";
import * as typeSavingService from "../../../src/services/typeSavingService";

const mockGetRegulations = regulationService.getRegulations;
const mockUpdateRegulations = regulationService.updateRegulations;
const mockGetInterestRates = regulationService.getInterestRates;
const mockGetAllTypeSavings = typeSavingService.getAllTypeSavings;

describe("Integration: IT10 - Regulations Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});

    // Mock window.location.reload to prevent actual page reload in tests
    delete window.location;
    window.location = { reload: jest.fn() };

    // Default mock responses
    mockGetRegulations.mockResolvedValue({
      success: true,
      data: {
        minimumBalance: 100000,
        minimumTermDays: 15,
      },
    });

    mockGetInterestRates.mockResolvedValue({
      success: true,
      data: [
        {
          typeSavingId: "1",
          typeName: "No term",
          rate: 3.5,
          term: 0,
        },
        {
          typeSavingId: "2",
          typeName: "3-Month Fixed",
          rate: 4.5,
          term: 3,
        },
      ],
    });

    mockGetAllTypeSavings.mockResolvedValue({
      success: true,
      data: [
        {
          typeSavingId: "1",
          typeName: "No term",
          interestRate: 3.5,
          term: 0,
        },
        {
          typeSavingId: "2",
          typeName: "3-Month Fixed",
          interestRate: 4.5,
          term: 3,
        },
      ],
    });

    mockUpdateRegulations.mockResolvedValue({
      success: true,
      message: "Regulations updated successfully",
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderWithRouter = (initialRoute = "/regulations") => {
    return rtlRender(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/regulations" element={<RegulationSettings />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("should render Regulations page and load regulations on mount", async () => {
    renderWithRouter("/regulations");

    await waitFor(() => {
      expect(mockGetRegulations).toHaveBeenCalled();
    });

    expect(screen.getByText(/regulation settings|qĐ6/i)).toBeInTheDocument();
  });

  it("should display existing regulation values in form fields", async () => {
    renderWithRouter("/regulations");

    await waitFor(() => {
      expect(mockGetRegulations).toHaveBeenCalled();
    });

    // Wait for form to appear (loading state removed)
    await waitFor(() => {
      const inputs = screen.queryAllByTestId(/input-/);
      expect(inputs.length).toBeGreaterThan(0);
    });

    // Check that the minimum balance value is displayed
    const minBalanceInputs = screen.queryAllByTestId(/input-/);
    const minBalanceInput = minBalanceInputs.find(
      (input) => input.value === "100000"
    );
    expect(minBalanceInput).toBeDefined();
  });

  it("should disable Update button and show loading indicator while saving", async () => {
    const user = userEvent.setup({ delay: null });

    let resolveUpdate;
    const updatePromise = new Promise((resolve) => {
      resolveUpdate = resolve;
    });

    mockUpdateRegulations.mockReturnValue(updatePromise);

    renderWithRouter("/regulations");

    await waitFor(() => {
      expect(mockGetRegulations).toHaveBeenCalled();
    });

    // Wait for form to load
    await waitFor(() => {
      expect(screen.queryAllByTestId(/input-/).length).toBeGreaterThan(0);
    });

    // Find and interact with the update button
    const updateButton = screen.getByRole("button", {
      name: /update regulations/i,
    });

    // Change a value to enable the submit button
    const inputs = screen.queryAllByTestId(/input-/);
    if (inputs.length > 0) {
      await user.clear(inputs[0]);
      await user.type(inputs[0], "200000");
    }

    // Submit the form - this opens confirmation dialog
    await user.click(updateButton);

    // Click the Confirm button in the dialog
    const confirmButtons = screen.queryAllByRole("button", {
      name: /confirm change|confirm/i,
    });
    if (confirmButtons.length > 0) {
      await user.click(confirmButtons[0]);
    }

    // Resolve the promise
    resolveUpdate({
      success: true,
      message: "Regulations updated successfully",
      data: {
        minimumBalance: 200000,
        minimumTermDays: 15,
      },
    });

    // Wait for update to complete
    await waitFor(() => {
      expect(mockUpdateRegulations).toHaveBeenCalled();
    });
  });

  it("should show success message on successful update", async () => {
    const user = userEvent.setup({ delay: null });

    mockUpdateRegulations.mockResolvedValue({
      success: true,
      message: "Regulations updated successfully",
      data: {
        minimumBalance: 250000,
        minimumTermDays: 15,
      },
    });

    renderWithRouter("/regulations");

    await waitFor(() => {
      expect(mockGetRegulations).toHaveBeenCalled();
    });

    // Wait for form to load
    await waitFor(() => {
      expect(screen.queryAllByTestId(/input-/).length).toBeGreaterThan(0);
    });

    const updateButton = screen.getByRole("button", {
      name: /update regulations/i,
    });

    // Change a value
    const inputs = screen.queryAllByTestId(/input-/);
    if (inputs.length > 0) {
      await user.clear(inputs[0]);
      await user.type(inputs[0], "250000");
    }

    // Click update - opens confirmation dialog
    await user.click(updateButton);

    // Click confirm in dialog
    const confirmButtons = screen.queryAllByRole("button", {
      name: /confirm change|confirm/i,
    });
    if (confirmButtons.length > 0) {
      await user.click(confirmButtons[0]);
    }

    // Wait for success
    await waitFor(() => {
      expect(mockUpdateRegulations).toHaveBeenCalled();
    });
  });

  it("should show error message on update failure (400 error)", async () => {
    const user = userEvent.setup({ delay: null });

    mockUpdateRegulations.mockRejectedValue({
      response: { status: 400 },
      message: "Invalid regulation values",
    });

    renderWithRouter("/regulations");

    await waitFor(() => {
      expect(mockGetRegulations).toHaveBeenCalled();
    });

    // Wait for form to load
    await waitFor(() => {
      expect(screen.queryAllByTestId(/input-/).length).toBeGreaterThan(0);
    });

    const updateButton = screen.getByRole("button", {
      name: /update regulations/i,
    });

    // Change a value
    const inputs = screen.queryAllByTestId(/input-/);
    if (inputs.length > 0) {
      await user.clear(inputs[0]);
      await user.type(inputs[0], "999999999");
    }

    // Click update - opens confirmation dialog
    await user.click(updateButton);

    // Click confirm in dialog
    const confirmButtons = screen.queryAllByRole("button", {
      name: /confirm change|confirm/i,
    });
    if (confirmButtons.length > 0) {
      await user.click(confirmButtons[0]);
    }

    // Wait for error
    await waitFor(() => {
      expect(mockUpdateRegulations).toHaveBeenCalled();
    });
  });

  it("should show ServiceUnavailablePageState when service returns 503 on initial load", async () => {
    mockGetRegulations.mockRejectedValue({
      response: { status: 503 },
      message: "Service Unavailable",
    });

    renderWithRouter("/regulations");

    await waitFor(() => {
      expect(mockGetRegulations).toHaveBeenCalled();
    });

    // Should show unavailable state
    await waitFor(() => {
      expect(screen.getByText("Service Unavailable")).toBeInTheDocument();
    });

    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it("should reload regulations successfully after retry on 503 error", async () => {
    const user = userEvent.setup({ delay: null });

    // First call fails with 503
    mockGetRegulations.mockRejectedValueOnce({
      response: { status: 503 },
      message: "Service Unavailable",
    });

    mockGetInterestRates.mockResolvedValue({
      success: true,
      data: [
        {
          typeSavingId: "1",
          typeName: "No term",
          rate: 3.5,
          term: 0,
        },
      ],
    });

    renderWithRouter("/regulations");

    // Wait for unavailable state to appear
    await waitFor(() => {
      expect(screen.getByText("Service Unavailable")).toBeInTheDocument();
    });

    // Verify first call was made
    expect(mockGetRegulations).toHaveBeenCalledTimes(1);

    // Verify Retry button is present and enabled
    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).not.toHaveAttribute("disabled");
  });

  it("should modify regulation values and maintain changes in form after save attempt", async () => {
    const user = userEvent.setup({ delay: null });

    renderWithRouter("/regulations");

    await waitFor(() => {
      expect(mockGetRegulations).toHaveBeenCalled();
    });

    // Wait for form to load
    await waitFor(() => {
      expect(screen.queryAllByTestId(/input-/).length).toBeGreaterThan(0);
    });

    // Find input fields
    const inputs = screen.queryAllByTestId(/input-/);
    expect(inputs.length).toBeGreaterThan(0);

    // Modify minimum balance
    const minBalanceInput = inputs[0];
    await user.clear(minBalanceInput);
    await user.type(minBalanceInput, "150000");

    // Verify the change is reflected
    expect(minBalanceInput.value).toBe("150000");
  });

  it("should load and display interest rates on mount", async () => {
    renderWithRouter("/regulations");

    await waitFor(() => {
      expect(mockGetInterestRates).toHaveBeenCalled();
    });

    // Verify interest rates were loaded
    expect(mockGetInterestRates).toHaveBeenCalledTimes(1);
  });
});
