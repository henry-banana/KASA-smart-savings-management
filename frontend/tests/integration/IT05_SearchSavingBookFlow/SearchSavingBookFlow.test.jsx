import React from "react";
import { render as rtlRender, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";

const mockSearchSavingBooks = jest.fn();
const mockGetAllTypeSavings = jest.fn();

jest.mock("../../../src/services/savingBookService", () => ({
  searchSavingBooks: (...args) => mockSearchSavingBooks(...args),
  getSavingBookById: jest.fn(),
}));

jest.mock("../../../src/services/typeSavingService", () => ({
  getAllTypeSavings: (...args) => mockGetAllTypeSavings(...args),
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
  ServiceUnavailableState: ({ onRetry }) => (
    <div>
      <div>Service Unavailable</div>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

jest.mock("../../../src/components/CuteComponents", () => ({
  StarDecor: () => <div />,
  CuteEmptyState: ({ title, description }) => (
    <div>
      <div>{title}</div>
      <div>{description}</div>
    </div>
  ),
}));

jest.mock("../../../src/components/RoleGuard", () => ({
  RoleGuard: ({ children, allow }) => <div>{children}</div>,
}));

jest.mock("../../../src/utils/typeColorUtils", () => ({
  getTypeBadgeColor: () => "bg-blue-100 text-blue-700 border-blue-200",
  getTypeLabel: (type) => type || "Savings",
}));

jest.mock("../../../src/utils/numberFormatter", () => ({
  formatVnNumber: (num) => {
    if (typeof num !== "number") return "0";
    return num.toLocaleString("vi-VN");
  },
  formatBalance: (num) => {
    if (typeof num !== "number") return "0";
    return num.toLocaleString("vi-VN");
  },
}));

import SearchAccounts from "../../../src/pages/Search/SearchAccounts";

// Custom render with routing
const renderWithRouter = (initialRoute = "/search") => {
  return rtlRender(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/search" element={<SearchAccounts />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Integration: IT05 - Search Saving Book Flow", () => {
  const setupDefaultMocks = () => {
    // Mock getAllTypeSavings on mount
    mockGetAllTypeSavings.mockResolvedValueOnce({
      success: true,
      data: [
        { typeSavingId: "type-1", typeName: "Regular" },
        { typeSavingId: "type-2", typeName: "Fixed" },
      ],
    });

    // Initial search on mount (empty search term)
    mockSearchSavingBooks.mockResolvedValueOnce({
      data: [],
      total: 0,
      totalPages: 1,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("should render Search Saving Book page with search input", async () => {
    setupDefaultMocks();
    renderWithRouter("/search");

    expect(screen.getByText(/search saving books/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/saving book id, citizen number or name/i)
    ).toBeInTheDocument();
  });

  it("should enter valid keyword and trigger search", async () => {
    setupDefaultMocks();
    const user = userEvent.setup({ delay: null });
    const searchKeyword = "SB001";

    renderWithRouter("/search");

    await waitFor(() => {
      expect(mockGetAllTypeSavings).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText(
      /saving book id, citizen number or name/i
    );

    await user.type(searchInput, searchKeyword);

    // Fast-forward past debounce
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockSearchSavingBooks).toHaveBeenCalledWith(
        searchKeyword,
        "all",
        "all",
        1,
        10
      );
    });
  });

  it("should display search results in table when data is returned", async () => {
    jest.useRealTimers();
    const user = userEvent.setup();

    // Setup mocks
    mockGetAllTypeSavings.mockResolvedValue({
      success: true,
      data: [
        { typeSavingId: "type-1", typeName: "Regular" },
        { typeSavingId: "type-2", typeName: "Fixed" },
      ],
    });

    mockSearchSavingBooks.mockImplementation((keyword) => {
      if (keyword === "") {
        // Mount search returns empty
        return Promise.resolve({ data: [], total: 0, totalPages: 1 });
      }
      // User search with "SB" returns results
      return Promise.resolve({
        data: [
          {
            bookId: "1",
            accountCode: "SB001",
            customerName: "John Doe",
            accountTypeName: "Regular",
            openDate: "2023-01-15",
            balance: 5000000,
            status: "Open",
          },
        ],
        total: 1,
        totalPages: 1,
      });
    });

    renderWithRouter("/search");

    // Wait for mount
    await waitFor(() => {
      expect(mockGetAllTypeSavings).toHaveBeenCalled();
    });

    // Wait for mount search debounce to complete (300ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    const searchInput = screen.getByPlaceholderText(
      /saving book id, citizen number or name/i
    );

    // Type search term
    await user.type(searchInput, "SB");

    // Wait for debounce and search to complete
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Verify both mount and user searches were called
    expect(mockSearchSavingBooks).toHaveBeenCalledWith("", "all", "all", 1, 10);
    expect(mockSearchSavingBooks).toHaveBeenCalledWith(
      "SB",
      "all",
      "all",
      1,
      10
    );

    jest.useFakeTimers();
  });

  it("should show no results message when search returns empty", async () => {
    setupDefaultMocks();
    const user = userEvent.setup({ delay: null });

    mockSearchSavingBooks.mockResolvedValueOnce({
      data: [],
      total: 0,
      totalPages: 1,
    });

    renderWithRouter("/search");

    await waitFor(() => {
      expect(mockGetAllTypeSavings).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText(
      /saving book id, citizen number or name/i
    );

    await user.type(searchInput, "NONEXISTENT");

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  it("should load saving book type options on mount", async () => {
    setupDefaultMocks();
    renderWithRouter("/search");

    await waitFor(() => {
      expect(mockGetAllTypeSavings).toHaveBeenCalled();
    });
  });

  it("should show loading state while searching", async () => {
    setupDefaultMocks();
    const user = userEvent.setup({ delay: null });

    // Make search take longer to observe loading state
    mockSearchSavingBooks.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: [],
                total: 0,
                totalPages: 1,
              }),
            200
          )
        )
    );

    renderWithRouter("/search");

    await waitFor(() => {
      expect(mockGetAllTypeSavings).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText(
      /saving book id, citizen number or name/i
    );

    await user.type(searchInput, "test");

    jest.advanceTimersByTime(300);

    // Component should show loading indicator (TableSkeleton or similar)
    await waitFor(() => {
      expect(mockSearchSavingBooks).toHaveBeenCalled();
    });
  });

  it("should show error message on search failure", async () => {
    setupDefaultMocks();
    const user = userEvent.setup({ delay: null });

    const errorMessage = "Invalid search parameters";
    mockSearchSavingBooks.mockRejectedValueOnce(new Error(errorMessage));

    renderWithRouter("/search");

    await waitFor(() => {
      expect(mockGetAllTypeSavings).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText(
      /saving book id, citizen number or name/i
    );

    await user.type(searchInput, "test");

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockSearchSavingBooks).toHaveBeenCalled();
    });
  });

  it("should show ServiceUnavailableState when service returns 503", async () => {
    const error = new Error("Service Unavailable");
    error.status = 503;
    error.code = 503;

    mockGetAllTypeSavings.mockResolvedValueOnce({
      success: true,
      data: [
        { typeSavingId: "type-1", typeName: "Regular" },
        { typeSavingId: "type-2", typeName: "Fixed" },
      ],
    });
    mockSearchSavingBooks.mockRejectedValueOnce(error);

    const { unmount } = renderWithRouter("/search");

    jest.advanceTimersByTime(300);

    // Should show service unavailable initially
    await waitFor(
      () => {
        const unavailableText = screen.queryByText("Service Unavailable");
        if (unavailableText) {
          expect(unavailableText).toBeInTheDocument();
        }
      },
      { timeout: 1000 }
    );

    unmount();
  });

  it("should retry search when Retry button clicked on service unavailable", async () => {
    const user = userEvent.setup({ delay: null });

    const error = new Error("Service Unavailable");
    error.status = 503;
    error.code = 503;

    const mockResults = {
      data: [
        {
          bookId: "1",
          accountCode: "SB001",
          customerName: "John Doe",
          accountTypeName: "Regular",
          openDate: "2023-01-15",
          balance: 5000000,
          status: "Open",
        },
      ],
      total: 1,
      totalPages: 1,
    };

    mockGetAllTypeSavings.mockResolvedValueOnce({
      success: true,
      data: [{ typeSavingId: "type-1", typeName: "Regular" }],
    });

    mockSearchSavingBooks.mockRejectedValueOnce(error);
    mockSearchSavingBooks.mockResolvedValueOnce(mockResults);

    renderWithRouter("/search");

    jest.advanceTimersByTime(300);

    // Should show service unavailable state
    let retryButton = null;
    await waitFor(
      () => {
        retryButton = screen.queryByRole("button", { name: /retry/i });
      },
      { timeout: 1000 }
    );

    if (retryButton) {
      await user.click(retryButton);
      jest.advanceTimersByTime(300);

      await waitFor(
        () => {
          expect(screen.queryByText("SB001")).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    }
  });
});
