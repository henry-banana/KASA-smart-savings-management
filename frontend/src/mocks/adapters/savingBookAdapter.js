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
   * Search saving books (list endpoint)
   * Returns contract list items with envelope.
   */
  async searchSavingBooks(
    keyword = "",
    typeFilter = "all",
    statusFilter = "all"
  ) {
    await randomDelay();
    logger.info("🎭 Mock Search SavingBooks", {
      keyword,
      typeFilter,
      statusFilter,
    });

    // Map to contract list item (canonical fields only)
    let items = mockSavingBooks.map((sb) => {
      const type = findTypeSavingById(sb.typeSavingId);
      // Extract numeric accountCode from bookId (e.g., "SB00123" -> 123)
      const accountCode = parseInt(sb.bookId.replace(/\D/g, ""), 10) || 0;
      return {
        bookId: sb.bookId,
        accountCode: accountCode, // numeric value per API contract
        citizenId: sb.citizenId,
        customerName: sb.customerName,
        accountTypeName: type?.typeName || "Unknown",
        typeSavingId: sb.typeSavingId,
        openDate: sb.openDate,
        balance: sb.balance,
        status: sb.status,
      };
    });

    // Filters (case-insensitive)
    items = items.filter((item) => {
      const q = keyword.toLowerCase();
      const matchesSearch =
        !q ||
        item.bookId.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.citizenId.toLowerCase().includes(q);
      const matchesType =
        typeFilter === "all" || item.typeSavingId === typeFilter;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });

    return {
      message: "Search saving books successfully",
      success: true,
      data: items,
      total: items.length,
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
