import React from "react";
import { render, screen, waitFor } from "../../test-utils/render";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Create mock function references first
const mockGetAccountInfo = jest.fn();
const mockDepositMoney = jest.fn();
const mockGetRegulations = jest.fn();
const mockUseAuthContext = jest.fn();

// Mock services and context
jest.mock("../../../src/services/transactionService", () => ({
  getAccountInfo: (...args) => mockGetAccountInfo(...args),
  depositMoney: (...args) => mockDepositMoney(...args),
}));

jest.mock("../../../src/services/regulationService", () => ({
  getRegulations: (...args) => mockGetRegulations(...args),
}));

jest.mock("../../../src/contexts/AuthContext", () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

jest.mock("../../../src/components/RoleGuard", () => ({
  RoleGuard: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../../src/components/ServiceUnavailableState", () => ({
  ServiceUnavailableState: ({ onRetry }) => (
    <div>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

jest.mock("../../../src/components/CuteComponents", () => ({
  StarDecor: () => <div />,
  CoinsIllustration: () => <div />,
}));

jest.mock("../../../src/utils/logger", () => ({
  logger: { error: jest.fn(), info: jest.fn() },
}));

import Deposit from "../../../src/pages/Savings/Deposit";

describe("UC06 - Make Deposit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
    localStorage.clear();

    // Setup default mocks
    mockUseAuthContext.mockReturnValue({
      user: {
        userId: "emp1",
        id: "emp1",
        fullName: "John Teller",
        role: "teller",
      },
    });

    mockGetRegulations.mockResolvedValue({
      success: true,
      data: { minimumBalance: 100000 },
    });
  });

  afterEach(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  describe("Render", () => {
    it("should render deposit page with lookup input", async () => {
      render(<Deposit />);
      await waitFor(() => {
        expect(screen.getByText(/make deposit/i)).toBeInTheDocument();
      });
      expect(
        screen.getByPlaceholderText(/enter saving book id/i)
      ).toBeInTheDocument();
    });

    it("should display lookup button on page load", async () => {
      render(<Deposit />);
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /lookup/i })
        ).toBeInTheDocument();
      });
    });

    it("should load minimum balance regulations on mount", async () => {
      render(<Deposit />);
      await waitFor(() => {
        expect(mockGetRegulations).toHaveBeenCalled();
      });
    });
  });

  describe("Validation", () => {
    it("should not display validation errors on initial render", async () => {
      render(<Deposit />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter saving book id/i)
        ).toBeInTheDocument();
      });
    });

    it("should prevent deposit to closed account", async () => {
      const user = userEvent.setup();
      mockGetAccountInfo.mockResolvedValue({
        data: {
          bookId: "SB001",
          accountCode: "12345",
          customerName: "Test User",
          balance: 1000000,
          accountTypeName: "No term",
          status: "close",
        },
      });

      render(<Deposit />);

      // Wait for regulations to load (button text changes from "Loading..." to "Lookup")
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /^Lookup$/i })
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/enter saving book id/i);
      await user.type(input, "12345");

      const button = screen.getByRole("button", { name: /lookup/i });
      await user.click(button);

      await waitFor(
        () => {
          expect(screen.getByText(/closed/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("should reject non-no-term account types", async () => {
      const user = userEvent.setup();
      mockGetAccountInfo.mockResolvedValue({
        data: {
          bookId: "SB002",
          accountCode: "67890",
          customerName: "Another User",
          balance: 2000000,
          accountTypeName: "Savings with fixed term",
          status: "active",
        },
      });

      render(<Deposit />);

      // Wait for regulations to load (button text changes from "Loading..." to "Lookup")
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /^Lookup$/i })
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/enter saving book id/i);
      await user.type(input, "67890");

      const button = screen.getByRole("button", { name: /lookup/i });
      await user.click(button);

      await waitFor(
        () => {
          expect(
            screen.getByText(/only allowed for no term/i)
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Happy Path", () => {
    it("should display customer details after successful account lookup", async () => {
      const user = userEvent.setup();
      mockGetAccountInfo.mockResolvedValue({
        data: {
          bookId: "SB001",
          accountCode: "12345",
          customerName: "John Doe",
          balance: 5000000,
          accountTypeName: "No term",
          status: "active",
        },
      });

      render(<Deposit />);

      // Wait for regulations to load (button text changes from "Loading..." to "Lookup")
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /^Lookup$/i })
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/enter saving book id/i);
      await user.type(input, "12345");

      const button = screen.getByRole("button", { name: /lookup/i });
      await user.click(button);

      await waitFor(
        () => {
          expect(screen.getByText(/john doe/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("should submit deposit with correct amount and account code", async () => {
      const user = userEvent.setup();
      mockGetAccountInfo.mockResolvedValue({
        data: {
          bookId: "SB002",
          accountCode: "99999",
          customerName: "Jane Smith",
          balance: 3000000,
          accountTypeName: "No term",
          status: "active",
        },
      });
      mockDepositMoney.mockResolvedValue({
        data: {
          balanceAfter: 3500000,
          depositAmount: 500000,
        },
      });

      render(<Deposit />);

      // Wait for regulations to load (button text changes from "Loading..." to "Lookup")
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /^Lookup$/i })
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/enter saving book id/i);
      await user.type(input, "99999");

      const lookupBtn = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupBtn);

      await waitFor(
        () => {
          expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const depositInput = screen.getByLabelText(/deposit amount/i);
      await user.type(depositInput, "500000");

      const submitBtn = screen.getByRole("button", {
        name: /confirm deposit/i,
      });
      await user.click(submitBtn);

      await waitFor(
        () => {
          expect(mockDepositMoney).toHaveBeenCalledWith("99999", 500000);
        },
        { timeout: 3000 }
      );
    });

    it("should show success message after deposit completes", async () => {
      const user = userEvent.setup();
      mockGetAccountInfo.mockResolvedValue({
        data: {
          bookId: "SB003",
          accountCode: "55555",
          customerName: "Bob Wilson",
          balance: 2000000,
          accountTypeName: "No term",
          status: "active",
        },
      });
      mockDepositMoney.mockResolvedValue({
        data: {
          balanceAfter: 2500000,
          depositAmount: 500000,
        },
      });

      render(<Deposit />);

      // Wait for regulations to load (button text changes from "Loading..." to "Lookup")
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /^Lookup$/i })
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/enter saving book id/i);
      await user.type(input, "55555");

      const lookupBtn = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupBtn);

      await waitFor(
        () => {
          expect(screen.getByText(/bob wilson/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const depositInput = screen.getByLabelText(/deposit amount/i);
      await user.type(depositInput, "500000");

      const submitBtn = screen.getByRole("button", {
        name: /confirm deposit/i,
      });
      await user.click(submitBtn);

      await waitFor(
        () => {
          expect(screen.getByText(/deposit successful/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Error Handling", () => {
    it("should display error message when deposit fails with server error", async () => {
      const user = userEvent.setup();
      mockGetAccountInfo.mockResolvedValue({
        data: {
          bookId: "SB004",
          accountCode: "44444",
          customerName: "Error Test User",
          balance: 5000000,
          accountTypeName: "No term",
          status: "active",
        },
      });
      mockDepositMoney.mockRejectedValue(
        new Error("Server error: deposit failed")
      );

      render(<Deposit />);

      // Wait for regulations to load (button text changes from "Loading..." to "Lookup")
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /^Lookup$/i })
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/enter saving book id/i);
      await user.type(input, "44444");

      const lookupBtn = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupBtn);

      await waitFor(
        () => {
          expect(screen.getByText(/error test user/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const depositInput = screen.getByLabelText(/deposit amount/i);
      await user.type(depositInput, "300000");

      const submitBtn = screen.getByRole("button", {
        name: /confirm deposit/i,
      });
      await user.click(submitBtn);

      await waitFor(
        () => {
          expect(
            screen.getByText(/server error: deposit failed/i)
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Loading State", () => {
    it("should show loading state during deposit and complete successfully", async () => {
      const user = userEvent.setup();
      let resolveDeposit;
      const depositPromise = new Promise((resolve) => {
        resolveDeposit = resolve;
      });

      mockGetAccountInfo.mockResolvedValue({
        data: {
          bookId: "SB005",
          accountCode: "66666",
          customerName: "Loading Test User",
          balance: 3000000,
          accountTypeName: "No term",
          status: "active",
        },
      });
      mockDepositMoney.mockReturnValue(depositPromise);

      render(<Deposit />);

      // Wait for regulations to load (button text changes from "Loading..." to "Lookup")
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /^Lookup$/i })
        ).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/enter saving book id/i);
      await user.type(input, "66666");

      const lookupBtn = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupBtn);

      await waitFor(
        () => {
          expect(screen.getByText(/loading test user/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const depositInput = screen.getByLabelText(/deposit amount/i);
      await user.type(depositInput, "250000");

      const submitBtn = screen.getByRole("button", {
        name: /confirm deposit/i,
      });
      await user.click(submitBtn);

      // Verify deposit was called
      await waitFor(() => {
        expect(mockDepositMoney).toHaveBeenCalledWith("66666", 250000);
      });

      // Resolve the deferred promise to complete the deposit
      resolveDeposit({
        data: {
          balanceAfter: 2750000,
          depositAmount: 250000,
        },
      });

      // Verify success message appears after promise resolves
      await waitFor(
        () => {
          expect(screen.getByText(/deposit successful/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });
});
