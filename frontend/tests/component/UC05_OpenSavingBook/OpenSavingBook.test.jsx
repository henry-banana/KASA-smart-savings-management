import React from "react";
import { render, screen, waitFor } from "../../test-utils/render";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const mockCreateSavingBook = jest.fn();
const mockGetInterestRates = jest.fn();
const mockGetRegulations = jest.fn();
const mockSearchCustomerByCitizenId = jest.fn();

jest.mock("../../../src/services/savingBookService", () => ({
  createSavingBook: (...args) => mockCreateSavingBook(...args),
}));

jest.mock("../../../src/services/regulationService", () => ({
  getInterestRates: (...args) => mockGetInterestRates(...args),
  getRegulations: (...args) => mockGetRegulations(...args),
}));

jest.mock("../../../src/services/customerService", () => ({
  customerService: {
    searchCustomerByCitizenId: (...args) =>
      mockSearchCustomerByCitizenId(...args),
  },
}));

jest.mock("../../../src/contexts/AuthContext", () => ({
  useAuthContext: () => ({
    user: {
      userId: "emp1",
      id: "emp1",
      fullName: "John Teller",
      email: "john@example.com",
      role: "teller",
    },
  }),
}));

jest.mock("../../../src/components/RoleGuard", () => ({
  RoleGuard: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../../src/components/ServiceUnavailableState", () => ({
  ServiceUnavailableState: ({ onRetry }) => (
    <div>
      <div>Service Unavailable</div>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

jest.mock("../../../src/components/CuteComponents", () => ({
  StarDecor: () => <div />,
  PiggyBankIllustration: () => <div />,
}));

jest.mock("../../../src/utils/logger", () => ({
  logger: { error: jest.fn(), info: jest.fn() },
}));

import OpenAccount from "../../../src/pages/Savings/OpenAccount";

describe("UC05 - Open Saving Book", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
    localStorage.clear();

    mockGetRegulations.mockResolvedValueOnce({
      success: true,
      data: { minimumBalance: 100000 },
    });

    mockGetInterestRates.mockResolvedValueOnce({
      success: true,
      data: [
        { typeSavingId: "1", typeName: "Flexible", term: 0, rate: 0.05 },
        { typeSavingId: "2", typeName: "3-Month", term: 3, rate: 0.08 },
      ],
    });
  });

  afterEach(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  describe("Render", () => {
    it("should render page with main fields", async () => {
      render(<OpenAccount />);
      await waitFor(() => {
        expect(screen.getByText(/open new saving book/i)).toBeInTheDocument();
      });
      expect(
        screen.getByPlaceholderText(/enter id citizen/i)
      ).toBeInTheDocument();
    });

    it("should display lookup and submit buttons", async () => {
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /lookup/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /open saving book/i })
        ).toBeInTheDocument();
      });
    });

    it("should load saving types on mount", async () => {
      render(<OpenAccount />);
      await waitFor(() => {
        expect(mockGetInterestRates).toHaveBeenCalled();
      });
    });

    it("should load minimum balance on mount", async () => {
      render(<OpenAccount />);
      await waitFor(() => {
        expect(mockGetRegulations).toHaveBeenCalled();
      });
    });
  });

  describe("Validation", () => {
    it("should not show errors initially", async () => {
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter id citizen/i)
        ).toBeInTheDocument();
      });
      expect(
        screen.queryByText(/please enter id card/i)
      ).not.toBeInTheDocument();
    });

    it("should show errors on empty submit", async () => {
      const user = userEvent.setup();
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter id citizen/i)
        ).toBeInTheDocument();
      });
      const submitButton = screen.getByRole("button", {
        name: /open saving book/i,
      });
      await user.click(submitButton);
      await waitFor(() => {
        expect(screen.getAllByText(/please enter/i).length).toBeGreaterThan(0);
      });
      expect(mockCreateSavingBook).not.toHaveBeenCalled();
    });

    it("should show error for invalid ID", async () => {
      const user = userEvent.setup();
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter id citizen/i)
        ).toBeInTheDocument();
      });
      const idInput = screen.getByPlaceholderText(/enter id citizen/i);
      await user.type(idInput, "12345");
      const lookupButton = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupButton);
      await waitFor(() => {
        expect(
          screen.getByText(/invalid citizen id|digits/i)
        ).toBeInTheDocument();
      });
    });

    it("should show error for low amount", async () => {
      const user = userEvent.setup();
      mockSearchCustomerByCitizenId.mockResolvedValueOnce({
        success: true,
        data: { fullname: "Test User", address: "Test St" },
      });
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter id citizen/i)
        ).toBeInTheDocument();
      });
      const idInput = screen.getByPlaceholderText(/enter id citizen/i);
      await user.type(idInput, "123456789012");
      const lookupButton = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupButton);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/customer name will appear/i)
        ).toHaveValue("Test User");
      });
      const depositInput = screen.getByPlaceholderText(/minimum|enter amount/i);
      await user.type(depositInput, "50000");
      const selectButton = screen
        .getAllByText(/flexible/i)[0]
        ?.closest("button");
      if (selectButton) await user.click(selectButton);
      const submitButton = screen.getByRole("button", {
        name: /open saving book/i,
      });
      await user.click(submitButton);
      await waitFor(() => {
        const errors = screen.getAllByText(/minimum amount/i);
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    it("should show error when type not selected", async () => {
      const user = userEvent.setup();
      mockSearchCustomerByCitizenId.mockResolvedValueOnce({
        success: true,
        data: { fullname: "Jane Doe", address: "Oak Ave" },
      });
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter id citizen/i)
        ).toBeInTheDocument();
      });
      const idInput = screen.getByPlaceholderText(/enter id citizen/i);
      await user.type(idInput, "987654321098");
      const lookupButton = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupButton);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/customer name will appear/i)
        ).toHaveValue("Jane Doe");
      });
      const depositInput = screen.getByPlaceholderText(/minimum|enter amount/i);
      await user.type(depositInput, "500000");
      const submitButton = screen.getByRole("button", {
        name: /open saving book/i,
      });
      await user.click(submitButton);
      await waitFor(() => {
        expect(
          screen.getByText(/select.*saving type|please select/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Happy Path", () => {
    it("should create book successfully", async () => {
      const user = userEvent.setup();
      mockSearchCustomerByCitizenId.mockResolvedValueOnce({
        success: true,
        data: { fullname: "Alice Smith", address: "Main St" },
      });
      mockCreateSavingBook.mockResolvedValueOnce({
        success: true,
        data: { bookId: "SB001", accountCode: "ACC001" },
      });
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter id citizen/i)
        ).toBeInTheDocument();
      });
      const idInput = screen.getByPlaceholderText(/enter id citizen/i);
      await user.type(idInput, "111111111111");
      const lookupButton = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupButton);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/customer name will appear/i)
        ).toHaveValue("Alice Smith");
      });
      const depositInput = screen.getByPlaceholderText(/minimum|enter amount/i);
      await user.type(depositInput, "500000");
      const selectButton = screen
        .getAllByText(/flexible/i)[0]
        ?.closest("button");
      if (selectButton) await user.click(selectButton);
      const submitButton = screen.getByRole("button", {
        name: /open saving book/i,
      });
      await user.click(submitButton);
      await waitFor(() => {
        expect(mockCreateSavingBook).toHaveBeenCalled();
        expect(
          screen.getByText(/saving book opened successfully/i)
        ).toBeInTheDocument();
      });
    });

    it("should call service with correct payload", async () => {
      const user = userEvent.setup();
      mockSearchCustomerByCitizenId.mockResolvedValueOnce({
        success: true,
        data: { fullname: "Bob Wilson", address: "Oak Rd" },
      });
      mockCreateSavingBook.mockResolvedValueOnce({
        success: true,
        data: { bookId: "SB002" },
      });
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter id citizen/i)
        ).toBeInTheDocument();
      });
      const idInput = screen.getByPlaceholderText(/enter id citizen/i);
      await user.type(idInput, "222222222222");
      const lookupButton = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupButton);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/customer name will appear/i)
        ).toHaveValue("Bob Wilson");
      });
      const depositInput = screen.getByPlaceholderText(/minimum|enter amount/i);
      await user.type(depositInput, "1000000");
      const selectButton = screen
        .getAllByText(/flexible/i)[0]
        ?.closest("button");
      if (selectButton) await user.click(selectButton);
      const submitButton = screen.getByRole("button", {
        name: /open saving book/i,
      });
      await user.click(submitButton);
      await waitFor(() => {
        expect(mockCreateSavingBook).toHaveBeenCalledWith(
          expect.objectContaining({
            idCard: "222222222222",
            customerName: "Bob Wilson",
            address: "Oak Rd",
            initialDeposit: "1000000",
            employeeId: "emp1",
          })
        );
      });
    });

    it("should reset form after success", async () => {
      const user = userEvent.setup();
      mockSearchCustomerByCitizenId.mockResolvedValueOnce({
        success: true,
        data: { fullname: "Carol Davis", address: "Pine Ave" },
      });
      mockCreateSavingBook.mockResolvedValueOnce({
        success: true,
        data: { bookId: "SB003" },
      });
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter id citizen/i)
        ).toBeInTheDocument();
      });
      const idInput = screen.getByPlaceholderText(/enter id citizen/i);
      await user.type(idInput, "333333333333");
      const lookupButton = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupButton);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/customer name will appear/i)
        ).toHaveValue("Carol Davis");
      });
      const depositInput = screen.getByPlaceholderText(/minimum|enter amount/i);
      await user.type(depositInput, "750000");
      const selectButton = screen
        .getAllByText(/flexible/i)[0]
        ?.closest("button");
      if (selectButton) await user.click(selectButton);
      const submitButton = screen.getByRole("button", {
        name: /open saving book/i,
      });
      await user.click(submitButton);
      await waitFor(() => {
        expect(
          screen.getByText(/saving book opened successfully/i)
        ).toBeInTheDocument();
      });
      // Form resets after success
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/enter id citizen/i)).toHaveValue(
          ""
        );
      });
    });

    it("should display account code", async () => {
      const user = userEvent.setup();
      mockSearchCustomerByCitizenId.mockResolvedValueOnce({
        success: true,
        data: { fullname: "David Brown", address: "Elm St" },
      });
      mockCreateSavingBook.mockResolvedValueOnce({
        success: true,
        data: { bookId: "SB_99999", accountCode: "ACC_99999" },
      });
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter id citizen/i)
        ).toBeInTheDocument();
      });
      const idInput = screen.getByPlaceholderText(/enter id citizen/i);
      await user.type(idInput, "444444444444");
      const lookupButton = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupButton);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/customer name will appear/i)
        ).toHaveValue("David Brown");
      });
      const depositInput = screen.getByPlaceholderText(/minimum|enter amount/i);
      await user.type(depositInput, "2500000");
      const selectButton = screen
        .getAllByText(/flexible/i)[0]
        ?.closest("button");
      if (selectButton) await user.click(selectButton);
      const submitButton = screen.getByRole("button", {
        name: /open saving book/i,
      });
      await user.click(submitButton);
      await waitFor(() => {
        // Check for success message
        expect(
          screen.getByText(/saving book opened successfully/i)
        ).toBeInTheDocument();
        // Check for account code display
        const codeElements = screen.queryAllByText(/SB_99999|ACC_99999/);
        expect(codeElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Error Handling", () => {
    it("should show creation error", async () => {
      const user = userEvent.setup();
      mockSearchCustomerByCitizenId.mockResolvedValueOnce({
        success: true,
        data: { fullname: "Error User", address: "Error St" },
      });
      mockCreateSavingBook.mockRejectedValueOnce(new Error("Creation failed"));
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter id citizen/i)
        ).toBeInTheDocument();
      });
      const idInput = screen.getByPlaceholderText(/enter id citizen/i);
      await user.type(idInput, "555555555555");
      const lookupButton = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupButton);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/customer name will appear/i)
        ).toHaveValue("Error User");
      });
      const depositInput = screen.getByPlaceholderText(/minimum|enter amount/i);
      await user.type(depositInput, "500000");
      const selectButton = screen
        .getAllByText(/flexible/i)[0]
        ?.closest("button");
      if (selectButton) await user.click(selectButton);
      const submitButton = screen.getByRole("button", {
        name: /open saving book/i,
      });
      await user.click(submitButton);
      await waitFor(() => {
        const errorElements = screen.queryAllByText(/failed|error/i);
        expect(errorElements.length).toBeGreaterThan(0);
      });
    });

    it("should show customer not found", async () => {
      const user = userEvent.setup();
      mockSearchCustomerByCitizenId.mockRejectedValueOnce(
        new Error("Customer not found")
      );
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter id citizen/i)
        ).toBeInTheDocument();
      });
      const idInput = screen.getByPlaceholderText(/enter id citizen/i);
      await user.type(idInput, "666666666666");
      const lookupButton = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupButton);
      await waitFor(() => {
        const errorElements = screen.queryAllByText(
          /not found|register|does not exist/i
        );
        expect(errorElements.length).toBeGreaterThan(0);
      });
    });

    it("should handle 409 conflict", async () => {
      const user = userEvent.setup();
      mockSearchCustomerByCitizenId.mockResolvedValueOnce({
        success: true,
        data: { fullname: "Conflict User", address: "Conflict Ave" },
      });
      const error409 = new Error("Saving book already exists");
      error409.status = 409;
      mockCreateSavingBook.mockRejectedValueOnce(error409);
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter id citizen/i)
        ).toBeInTheDocument();
      });
      const idInput = screen.getByPlaceholderText(/enter id citizen/i);
      await user.type(idInput, "777777777777");
      const lookupButton = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupButton);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/customer name will appear/i)
        ).toHaveValue("Conflict User");
      });
      const depositInput = screen.getByPlaceholderText(/minimum|enter amount/i);
      await user.type(depositInput, "500000");
      const selectButton = screen
        .getAllByText(/flexible/i)[0]
        ?.closest("button");
      if (selectButton) await user.click(selectButton);
      const submitButton = screen.getByRole("button", {
        name: /open saving book/i,
      });
      await user.click(submitButton);
      await waitFor(() => {
        const errorElements = screen.queryAllByText(
          /exists|already.*exists|conflict/i
        );
        expect(errorElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Loading State", () => {
    it("should handle loading during creation", async () => {
      const user = userEvent.setup();
      let resolveCreate;
      const createPromise = new Promise((resolve) => {
        resolveCreate = resolve;
      });
      mockSearchCustomerByCitizenId.mockResolvedValueOnce({
        success: true,
        data: { fullname: "Loading Test", address: "Loading St" },
      });
      mockCreateSavingBook.mockReturnValueOnce(createPromise);
      render(<OpenAccount />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/enter id citizen/i)
        ).toBeInTheDocument();
      });
      const idInput = screen.getByPlaceholderText(/enter id citizen/i);
      await user.type(idInput, "888888888888");
      const lookupButton = screen.getByRole("button", { name: /lookup/i });
      await user.click(lookupButton);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/customer name will appear/i)
        ).toHaveValue("Loading Test");
      });
      const depositInput = screen.getByPlaceholderText(/minimum|enter amount/i);
      await user.type(depositInput, "500000");
      const selectButton = screen
        .getAllByText(/flexible/i)[0]
        ?.closest("button");
      if (selectButton) await user.click(selectButton);
      const submitButton = screen.getByRole("button", {
        name: /open saving book/i,
      });
      await user.click(submitButton);
      await waitFor(() => {
        expect(mockCreateSavingBook).toHaveBeenCalled();
      });
      resolveCreate({ success: true, data: { bookId: "SB_LOADING" } });
      await waitFor(() => {
        expect(
          screen.getByText(/saving book opened successfully/i)
        ).toBeInTheDocument();
      });
    });
  });
});
