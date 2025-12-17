import {
  mockSavingBooks,
  findSavingBookById,
  addSavingBook,
} from "../data/savingBooks";
import { findTypeSavingById } from "../data/typeSavings";
import { randomDelay, generateId } from "../utils";
import { logger } from "@/utils/logger";

// Helper: add months to YYYY-MM-DD date string
const addMonths = (dateStr, months) => {
  if (!dateStr || months <= 0) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setMonth(dt.getMonth() + months);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const mockSavingBookAdapter = {
  /**
   * Search saving books (list endpoint) with pagination
   * Returns contract list items with envelope and pagination metadata.
   */
  async searchSavingBooks(
    keyword = "",
    typeFilter = "all",
    statusFilter = "all",
    page = 1,
    pageSize = 10
  ) {
    await randomDelay();
    logger.info("🎭 Mock Search SavingBooks (Paginated)", {
      keyword,
      typeFilter,
      statusFilter,
      page,
      pageSize,
    });

    // Map to contract list item (canonical fields only)
    let items = mockSavingBooks.map((sb) => {
      const type = findTypeSavingById(sb.typeSavingId);
      // Use bookId directly as accountCode string per API contract
      return {
        bookId: sb.bookId,
        accountCode: sb.bookId, // string value matching bookId
        citizenId: sb.citizenId,
        customerName: sb.customerName,
        accountTypeName: type?.typeName || "Unknown",
        typeSavingId: sb.typeSavingId,
        openDate: sb.openDate,
        balance: sb.balance,
        status: sb.status,
      };
    });

    // Apply filters (case-insensitive)
    items = items.filter((item) => {
      const q = keyword.toLowerCase();
      const matchesSearch =
        !q ||
        item.bookId.toLowerCase().includes(q) ||
        String(item.accountCode).toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.citizenId.toLowerCase().includes(q);
      const matchesType =
        typeFilter === "all" || item.typeSavingId === typeFilter;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });

    // Get total after filtering
    const total = items.length;

    // Apply pagination - enforce pageSize = 10
    const actualPageSize = 10; // hardcoded for consistency
    const actualPage = Math.max(1, parseInt(page) || 1);
    const totalPages = Math.ceil(total / actualPageSize);

    // Calculate offset
    const offset = (actualPage - 1) * actualPageSize;
    const paginatedItems = items.slice(offset, offset + actualPageSize);

    return {
      message: "Search savingbooks successfully",
      success: true,
      data: paginatedItems,
      total,
      page: actualPage,
      pageSize: actualPageSize,
      totalPages: totalPages || 1,
    };
  },

  /**
   * Get saving book detail by ID
   * Returns full contract object.
   */
  async getSavingBookById(bookId) {
    await randomDelay();
    logger.info("🎭 Mock Get SavingBook By ID", { bookId });

    const savingBook = findSavingBookById(bookId);
    if (!savingBook) {
      throw new Error("Saving book not found");
    }

    const type = findTypeSavingById(savingBook.typeSavingId);

    const detail = {
      bookId: savingBook.bookId,
      citizenId: savingBook.citizenId,
      customerName: savingBook.customerName,
      typeSavingId: savingBook.typeSavingId,
      openDate: savingBook.openDate,
      maturityDate: savingBook.maturityDate,
      balance: savingBook.balance,
      status: savingBook.status,
      typeSaving: type
        ? {
            typeSavingId: type.typeSavingId,
            typeName: type.typeName,
            term: type.term,
            interestRate: type.interestRate,
          }
        : undefined,
      transactions: [], // mock-extension: fill with canonical Transaction objects if available
    };

    return {
      message: "Get saving book successfully",
      success: true,
      data: detail,
    };
  },

  /**
   * Create new saving book
   * Accepts contract input and returns full object.
   */
  async createSavingBook(data) {
    await randomDelay();
    logger.info("🎭 Mock Create SavingBook", { data });

    // Basic validation (English messages)
    if (!data) throw new Error("Request data is required");
    if (!data.citizenId?.trim()) throw new Error("Citizen ID is required");
    if (!data.customerName?.trim())
      throw new Error("Customer name is required");
    if (!data.typeSavingId?.trim())
      throw new Error("Type saving ID is required");
    if (!data.employeeId?.trim()) throw new Error("Employee ID is required");
    const type = findTypeSavingById(data.typeSavingId);
    if (!type) throw new Error("Type saving not found");

    const openDate = new Date().toISOString().split("T")[0];
    const maturityDate = type.term > 0 ? addMonths(openDate, type.term) : null;
    const balance =
      typeof data.initialDeposit === "number" ? data.initialDeposit : 0;

    const newSavingBook = {
      bookId: generateId("SB"),
      citizenId: data.citizenId,
      customerName: data.customerName,
      typeSavingId: type.typeSavingId,
      openDate,
      maturityDate,
      balance,
      status: "open",
    };

    // Persist in mock store
    addSavingBook(newSavingBook);

    return {
      message: "Create savingbook successfully",
      success: true,
      data: {
        ...newSavingBook,
        typeSaving: {
          typeSavingId: type.typeSavingId,
          typeName: type.typeName,
          term: type.term,
          interestRate: type.interestRate,
        },
      },
    };
  },
};
