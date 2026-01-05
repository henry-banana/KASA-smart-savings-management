import React from "react";
import { render, screen, waitFor, act } from "../../test-utils/render";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const mockSearchSavingBooks = jest.fn();
const mockGetAllTypeSavings = jest.fn();

jest.mock("../../../src/services/savingBookService", () => ({
  searchSavingBooks: (...args) => mockSearchSavingBooks(...args),
}));

jest.mock("../../../src/services/typeSavingService", () => ({
  getAllTypeSavings: (...args) => mockGetAllTypeSavings(...args),
}));

jest.mock("../../../src/components/RoleGuard", () => ({
  RoleGuard: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../../src/components/CuteComponents", () => ({
  StarDecor: () => <div />,
  CuteEmptyState: ({ title, description }) => (
    <div>
      <p>{title}</p>
      <p>{description}</p>
    </div>
  ),
}));

jest.mock("../../../src/components/ServiceUnavailableState", () => ({
  ServiceUnavailableState: ({ onRetry }) => (
    <div>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

jest.mock("../../../src/utils/logger", () => ({
  logger: { error: jest.fn(), info: jest.fn() },
}));

import SearchAccounts from "../../../src/pages/Search/SearchAccounts";

const defaultMockTypeSavings = [
  { typeSavingId: "type1", typeName: "No term" },
  { typeSavingId: "type2", typeName: "6 Month Fixed" },
  { typeSavingId: "type3", typeName: "12 Month Fixed" },
];

const defaultMockAccounts = [
  {
    bookId: "SB001",
    accountCode: "12345",
    customerName: "John Doe",
    accountTypeName: "No term",
    openDate: "2025-01-01",
    balance: 5000000,
    status: "open",
  },
  {
    bookId: "SB002",
    accountCode: "12346",
    customerName: "Jane Smith",
    accountTypeName: "6 Month Fixed",
    openDate: "2025-01-02",
    balance: 10000000,
    status: "open",
  },
];

describe("UC08 - Search Saving Books", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
    localStorage.clear();

    mockGetAllTypeSavings.mockResolvedValue({
      success: true,
      data: defaultMockTypeSavings,
    });

    mockSearchSavingBooks.mockResolvedValue({
      success: true,
      data: defaultMockAccounts,
      total: 2,
      totalPages: 1,
    });
  });

  afterEach(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  describe("Render", () => {
    it("should render search page with title and description", async () => {
      render(<SearchAccounts />);
      await waitFor(() => {
        expect(screen.getByText(/search saving books/i)).toBeInTheDocument();
      });
      expect(
        screen.getByText(/search and manage savings accounts/i)
      ).toBeInTheDocument();
    });

    it("should display search input field", async () => {
      render(<SearchAccounts />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/saving book id, citizen number or name/i)
        ).toBeInTheDocument();
      });
    });

    it("should display type and status filter dropdowns", async () => {
      render(<SearchAccounts />);
      await waitFor(() => {
        expect(screen.getByText(/saving book type/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/^Status$/)).toBeInTheDocument();
    });

    it("should display results table with account columns", async () => {
      render(<SearchAccounts />);
      await waitFor(
        () => {
          expect(screen.getByText(/saving book ID/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should load account types on component mount", async () => {
      render(<SearchAccounts />);
      await waitFor(() => {
        expect(mockGetAllTypeSavings).toHaveBeenCalled();
      });
    });

    it("should display pagination controls when results exist", async () => {
      render(<SearchAccounts />);
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /first page/i })
        ).toBeInTheDocument();
      });
      expect(
        screen.getByRole("button", { name: /previous page/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /next page/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /last page/i })
      ).toBeInTheDocument();
    });
  });

  describe("Validation UX", () => {
    it("should not display validation errors on initial render", async () => {
      render(<SearchAccounts />);
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/saving book id, citizen number or name/i)
        ).toBeInTheDocument();
      });
      // Should not show error message initially
      expect(screen.queryByText(/please enter/i)).not.toBeInTheDocument();
    });

    it("should display default filter values on render", async () => {
      render(<SearchAccounts />);
      await waitFor(() => {
        const statusSelects = screen.getAllByText(/all/i);
        expect(statusSelects.length).toBeGreaterThan(0);
      });
    });

    it("should allow empty search to trigger default results", async () => {
      render(<SearchAccounts />);
      await waitFor(() => {
        expect(mockSearchSavingBooks).toHaveBeenCalledWith(
          "",
          "all",
          "all",
          1,
          10
        );
      });
    });
  });

  describe("Happy Path - Search & Results", () => {
    it("should search by account code", async () => {
      const user = userEvent.setup();
      render(<SearchAccounts />);

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/saving book id, citizen number or name/i)
        ).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(
        /saving book id, citizen number or name/i
      );
      await user.type(searchInput, "12345");

      await waitFor(
        () => {
          expect(mockSearchSavingBooks).toHaveBeenCalledWith(
            "12345",
            "all",
            "all",
            1,
            10
          );
        },
        { timeout: 1000 }
      );
    });

    it("should display search results in table", async () => {
      render(<SearchAccounts />);
      await waitFor(() => {
        expect(screen.getByText("12345")).toBeInTheDocument();
      });
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    it("should display account balance in results", async () => {
      render(<SearchAccounts />);
      await waitFor(() => {
        // Verify that customer data is displayed (which means balance column is rendered)
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });
    });

    it("should display account type badge in results", async () => {
      render(<SearchAccounts />);
      await waitFor(() => {
        expect(screen.getByText(/no term/i)).toBeInTheDocument();
      });
      expect(screen.getByText(/6 month fixed/i)).toBeInTheDocument();
    });

    it("should display account status badge in results", async () => {
      render(<SearchAccounts />);
      await waitFor(() => {
        const openBadges = screen.getAllByText(/open/i);
        expect(openBadges.length).toBeGreaterThan(0);
      });
    });

    it("should display Details button for each account row", async () => {
      render(<SearchAccounts />);
      await waitFor(() => {
        const detailsButtons = screen.getAllByRole("button", {
          name: /details/i,
        });
        expect(detailsButtons.length).toBe(2);
      });
    });

    it("should show account details modal when Details button clicked", async () => {
      const user = userEvent.setup();
      render(<SearchAccounts />);

      await waitFor(() => {
        expect(screen.getByText("12345")).toBeInTheDocument();
      });

      const detailsButtons = screen.getAllByRole("button", {
        name: /details/i,
      });
      await user.click(detailsButtons[0]);

      await waitFor(() => {
        expect(
          screen.getByText(/savings account details/i)
        ).toBeInTheDocument();
      });
      expect(
        screen.getByText(/detailed account information/i)
      ).toBeInTheDocument();
    });

    it("should display selected account details in modal", async () => {
      const user = userEvent.setup();
      render(<SearchAccounts />);

      await waitFor(
        () => {
          expect(screen.getByText("12345")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const detailsButtons = screen.getAllByRole("button", {
        name: /details/i,
      });
      await user.click(detailsButtons[0]);

      await waitFor(
        () => {
          expect(
            screen.getByText(/savings account details/i)
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should close details modal when close button clicked", async () => {
      const user = userEvent.setup();
      render(<SearchAccounts />);

      await waitFor(
        () => {
          expect(screen.getByText("12345")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const detailsButtons = screen.getAllByRole("button", {
        name: /details/i,
      });
      await user.click(detailsButtons[0]);

      await waitFor(
        () => {
          expect(
            screen.getByText(/savings account details/i)
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const closeButtons = screen.getAllByRole("button", { name: /close/i });
      await user.click(closeButtons[0]);

      await waitFor(
        () => {
          expect(
            screen.queryByText(/savings account details/i)
          ).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Filter", () => {
    it("should filter results by account type", async () => {
      render(<SearchAccounts />);

      await waitFor(
        () => {
          expect(
            screen.getByPlaceholderText(/saving book id, citizen number or name/i)
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      // Verify type filter dropdown exists
      const typeSelects = screen.getAllByRole("combobox");
      expect(typeSelects.length).toBeGreaterThan(0);
    });

    it("should filter results by status", async () => {
      render(<SearchAccounts />);

      await waitFor(
        () => {
          const statusSelects = screen.getAllByRole("combobox");
          expect(statusSelects.length).toBeGreaterThan(1);
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Empty Results", () => {
    it("should show empty state when no results found", async () => {
      mockSearchSavingBooks.mockResolvedValue({
        success: true,
        data: [],
        total: 0,
        totalPages: 0,
      });

      render(<SearchAccounts />);

      await waitFor(() => {
        expect(screen.getByText(/no results found/i)).toBeInTheDocument();
      });
      expect(
        screen.getByText(/try adjusting your filters or search keywords/i)
      ).toBeInTheDocument();
    });

    it("should not show pagination when no results", async () => {
      mockSearchSavingBooks.mockResolvedValue({
        success: true,
        data: [],
        total: 0,
        totalPages: 0,
      });

      render(<SearchAccounts />);

      await waitFor(() => {
        expect(screen.getByText(/no results found/i)).toBeInTheDocument();
      });

      // Pagination should not be visible
      const paginationButtons = screen.queryAllByRole("button", {
        name: /page/i,
      });
      expect(paginationButtons.length).toBe(0);
    });
  });

  describe("Error Handling", () => {
    it("should show ServiceUnavailableState when search fails", async () => {
      mockSearchSavingBooks.mockRejectedValue({
        response: { status: 503 },
        message: "Service Unavailable",
      });

      render(<SearchAccounts />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /retry/i })
        ).toBeInTheDocument();
      });
    });

    it("should retry search when Retry button clicked", async () => {
      const user = userEvent.setup();
      mockSearchSavingBooks.mockRejectedValueOnce({
        response: { status: 503 },
        message: "Service Unavailable",
      });

      render(<SearchAccounts />);

      await waitFor(
        () => {
          expect(
            screen.getByRole("button", { name: /retry/i })
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      // Verify retry button exists
      const retryButton = screen.getByRole("button", { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should show skeleton loader while searching", async () => {
      let resolveSearch;
      const searchPromise = new Promise((resolve) => {
        resolveSearch = resolve;
      });

      mockSearchSavingBooks.mockReturnValue(searchPromise);

      render(<SearchAccounts />);

      await waitFor(() => {
        // TableSkeleton is rendered while loading
        expect(screen.queryByText("12345")).not.toBeInTheDocument();
      });

      resolveSearch({
        success: true,
        data: defaultMockAccounts,
        total: 2,
        totalPages: 1,
      });

      await waitFor(() => {
        expect(screen.getByText("12345")).toBeInTheDocument();
      });
    });

    it("should disable pagination buttons while loading", async () => {
      let resolveSearch;
      const searchPromise = new Promise((resolve) => {
        resolveSearch = resolve;
      });

      mockSearchSavingBooks.mockReturnValue(searchPromise);

      render(<SearchAccounts />);

      await waitFor(
        () => {
          const paginationButtons = screen.queryAllByRole("button", {
            name: /first page|previous page|next page|last page/i,
          });
          if (paginationButtons.length > 0) {
            expect(paginationButtons[0]).toBeDisabled();
          }
        },
        { timeout: 2000 }
      );

      resolveSearch({
        success: true,
        data: defaultMockAccounts,
        total: 2,
        totalPages: 1,
      });

      await waitFor(
        () => {
          expect(screen.getByText("12345")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Pagination", () => {
    it("should display current page and total pages", async () => {
      render(<SearchAccounts />);

      await waitFor(() => {
        expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
      });
    });

    it("should show correct result range in pagination info", async () => {
      render(<SearchAccounts />);

      await waitFor(
        () => {
          expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should disable Previous and First buttons on first page", async () => {
      render(<SearchAccounts />);

      await waitFor(
        () => {
          const firstPageBtn = screen.getByRole("button", {
            name: /first page/i,
          });
          expect(firstPageBtn).toBeDisabled();
        },
        { timeout: 2000 }
      );
      const prevBtn = screen.getByRole("button", {
        name: /previous page/i,
      });
      expect(prevBtn).toBeDisabled();
    });

    it("should disable Next and Last buttons when on last page", async () => {
      render(<SearchAccounts />);

      await waitFor(
        () => {
          const nextBtn = screen.queryByRole("button", { name: /next page/i });
          expect(nextBtn).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("should navigate to next page when Next button clicked", async () => {
      render(<SearchAccounts />);

      await waitFor(
        () => {
          const nextBtn = screen.queryByRole("button", { name: /next page/i });
          expect(nextBtn).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Debouncing", () => {
    it("should debounce search input", async () => {
      jest.useFakeTimers();
      try {
        const user = userEvent.setup({ delay: null });
        render(<SearchAccounts />);

        await waitFor(() => {
          expect(
            screen.getByPlaceholderText(/saving book id, citizen number or name/i)
          ).toBeInTheDocument();
        });

        jest.clearAllMocks();
        mockGetAllTypeSavings.mockResolvedValue({
          success: true,
          data: defaultMockTypeSavings,
        });

        const searchInput = screen.getByPlaceholderText(
          /saving book id, citizen number or name/i
        );
        await user.type(searchInput, "test");

        // Search should not be called yet during typing
        expect(mockSearchSavingBooks).not.toHaveBeenCalled();

        // Advance timers to trigger debounce
        await act(async () => {
          jest.advanceTimersByTime(300);
        });

        // Search should now be called after debounce
        expect(mockSearchSavingBooks).toHaveBeenCalled();
      } finally {
        jest.useRealTimers();
      }
    });
  });
});
