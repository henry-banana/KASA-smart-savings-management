import {
  mockSavingBooks,
  findSavingBookById,
  updateSavingBookBalance,
} from "../data/savingBooks.js";
import { findTypeSavingById } from "../data/typeSavings.js";
import {
  addTransaction,
  buildTransactionPayload,
} from "../data/transactions.js";
import { randomDelay, generateId } from "../utils";
import { findEmployeeById, findRoleById } from "../data/employees.js";
import { BUSINESS_RULES, TRANSACTION_TYPES } from "@/constants/business.js";
import { logger } from "@/utils/logger";

// Helper: build contract savingBook object (OpenAPI shape)
const buildSavingBookPayload = (sb) => ({
  bookId: sb.bookId,
  citizenId: sb.citizenId,
  customerName: sb.customerName,
  typeSavingId: sb.typeSavingId,
  openDate: sb.openDate,
  maturityDate: sb.maturityDate,
  balance: sb.balance,
  status: sb.status,
});

// Helper: build employee payload (OpenAPI shape)
const buildEmployeePayload = (employee) => {
  if (!employee) return undefined;
  const role = findRoleById(employee.roleid);
  return {
    employeeId: employee.employeeid,
    fullName: employee.fullname,
    roleName: role?.rolename || "Unknown",
  };
};

// Helper: support both full bookId and numeric account code inputs
const resolveSavingBook = (bookIdOrCode) => {
  const raw = (bookIdOrCode || "").trim();
  if (!raw) return null;

  const normalized = raw.toUpperCase();
  const direct = findSavingBookById(normalized);
  if (direct) return direct;

  const digits = normalized.replace(/\D/g, "");
  if (!digits) return null;

  return mockSavingBooks.find((sb) => {
    const sbDigits = (sb.bookId || "").replace(/\D/g, "");
    return sbDigits === digits;
  });
};

export const mockTransactionAdapter = {
  /**
   * Get account info (contract fields only)
   */
  async getAccountInfo(bookId) {
    await randomDelay();
    logger.info("🎭 Mock Get Account Info", { bookId });

    const savingBook = resolveSavingBook(bookId);
    if (!savingBook) {
      throw new Error("Account not found");
    }

    const typeSaving = findTypeSavingById(savingBook.typeSavingId);

    return {
      message: "Get account info successfully",
      success: true,
      data: {
        bookId: savingBook.bookId,
        customerName: savingBook.customerName,
        accountTypeName: typeSaving?.typeName || "Unknown",
        balance: savingBook.balance,
        openDate: savingBook.openDate,
        interestRate: typeSaving?.interestRate || 0,
        // mock-extension: needed by withdraw page for maturity check
        maturityDate: savingBook.maturityDate,
        // mock-extension: needed for closed account validation
        status: savingBook.status,
      },
    };
  },

  /**
   * Deposit money (non-term only, min amount rule)
   */
  async depositMoney({ bookId, amount, employeeId }) {
    await randomDelay();
    logger.info("🎭 Mock Deposit", { bookId, amount, employeeId });

    if (!bookId) throw new Error("Book ID is required");
    if (typeof amount !== "number" || isNaN(amount))
      throw new Error("Amount must be a number");
    if (amount < BUSINESS_RULES.MIN_DEPOSIT)
      throw new Error(`Minimum balance is ${BUSINESS_RULES.MIN_DEPOSIT}`);

    const savingBook = resolveSavingBook(bookId);
    if (!savingBook) throw new Error("Account not found");
    if (savingBook.status !== "open")
      throw new Error("Cannot deposit to a closed account");

    const typeSaving = findTypeSavingById(savingBook.typeSavingId);
    if (typeSaving && typeSaving.term > 0) {
      throw new Error("Cannot deposit into fixed-term account");
    }

    const result = updateSavingBookBalance(savingBook.bookId, amount);
    if (!result) throw new Error("Failed to update balance");

    // Build transaction record matching backend API contract
    const transactionId = generateId("TXN");
    const transactionDate = new Date().toISOString();
    const employeeObj =
      findEmployeeById(employeeId) || findEmployeeById("EMP001");

    // Store transaction in mock data with full context
    const newTransaction = {
      transactionId,
      bookId: savingBook.bookId,
      type: "deposit",
      amount,
      transactionDate,
      employeeId: employeeObj?.employeeid || "EMP001",
    };
    addTransaction(newTransaction);

    // Build response using buildTransactionPayload (matches backend format)
    const transactionPayload = buildTransactionPayload(newTransaction);

    return {
      message: "Deposit successfully",
      success: true,
      data: transactionPayload,
    };
  },

  /**
   * Withdraw money with early withdrawal rules
   */
  async withdrawMoney({
    bookId,
    amount,
    shouldCloseAccount = false,
    employeeId,
  }) {
    await randomDelay();
    logger.info("🎭 Mock Withdraw", {
      bookId,
      amount,
      shouldCloseAccount,
      employeeId,
    });

    if (!bookId) throw new Error("Book ID is required");
    if (typeof amount !== "number" || isNaN(amount))
      throw new Error("Amount must be a number");
    if (amount <= 0) throw new Error("Amount must be greater than 0");

    const savingBook = resolveSavingBook(bookId);
    if (!savingBook) throw new Error("Account not found");
    if (savingBook.status !== "open")
      throw new Error("Cannot withdraw from a closed account");
    if (amount > savingBook.balance) throw new Error("Insufficient balance");

    const typeSaving = findTypeSavingById(savingBook.typeSavingId);
    const isFixedTerm =
      typeSaving && typeSaving.term > 0 && savingBook.maturityDate;
    const today = new Date();
    const maturityDate = savingBook.maturityDate
      ? new Date(savingBook.maturityDate)
      : null;

    if (isFixedTerm && maturityDate && today < maturityDate) {
      // Early withdrawal before maturity requires closing the account & full balance
      if (!shouldCloseAccount) {
        throw new Error("Early withdrawal requires shouldCloseAccount=true");
      }
      if (amount !== savingBook.balance) {
        throw new Error("Must withdraw full balance to close before maturity");
      }
    }

    // Perform balance update
    const result = updateSavingBookBalance(savingBook.bookId, -amount);
    if (!result) throw new Error("Failed to update balance");

    // Close account if early withdrawal closing or balance reaches zero
    if (
      (isFixedTerm && today < maturityDate && shouldCloseAccount) ||
      result.balanceAfter === 0
    ) {
      const sb = findSavingBookById(bookId);
      if (sb) sb.status = "close";
    }

    // Build transaction record matching backend API contract
    const transactionId = generateId("TXN");
    const transactionDate = new Date().toISOString();
    const employeeObj =
      findEmployeeById(employeeId) || findEmployeeById("EMP001");

    // Store transaction in mock data with full context
    const newTransaction = {
      transactionId,
      bookId: savingBook.bookId,
      type: "withdraw",
      amount,
      transactionDate,
      employeeId: employeeObj?.employeeid || "EMP001",
    };
    addTransaction(newTransaction);

    // Build response using buildTransactionPayload (matches backend format)
    const transactionPayload = buildTransactionPayload(newTransaction);

    return {
      message: "Withdraw successfully",
      success: true,
      data: transactionPayload,
    };
  },

  /**
   * Get deposit transaction statistics grouped by saving type for a specific date
   * Used by DailyReport Transaction Statistics section
   */
  async getDepositTransactionStats(date) {
    await randomDelay();
    const reportDate = date || new Date().toISOString().split("T")[0];
    logger.info("🎭 Mock Deposit Transaction Stats", { date: reportDate });

    const { mockTransactions } = await import("../data/transactions.js");
    const { mockSavingBooks } = await import("../data/savingBooks.js");
    const { mockTypeSavings } = await import("../data/typeSavings.js");

    // Filter deposit transactions by date
    const dailyDeposits = mockTransactions.filter(
      (t) => t.transactionDate?.startsWith(reportDate) && t.type === "deposit"
    );

    // Calculate statistics by type
    const items = mockTypeSavings.map((type) => {
      const booksOfType = mockSavingBooks.filter(
        (sb) => sb.typeSavingId === type.typeSavingId
      );
      const bookIds = booksOfType.map((sb) => sb.bookId);
      const typeDeposits = dailyDeposits.filter((t) =>
        bookIds.includes(t.bookId)
      );

      return {
        typeSavingId: type.typeSavingId,
        typeName: type.typeName,
        count: typeDeposits.length,
        totalAmount: typeDeposits.reduce((sum, t) => sum + t.amount, 0),
      };
    });

    const total = {
      count: items.reduce((sum, item) => sum + item.count, 0),
      totalAmount: items.reduce((sum, item) => sum + item.totalAmount, 0),
    };

    return {
      message: "Get deposit transaction statistics successfully",
      success: true,
      data: { date: reportDate, items, total },
    };
  },

  /**
   * Get withdrawal transaction statistics grouped by saving type for a specific date
   * Used by DailyReport Transaction Statistics section
   */
  async getWithdrawalTransactionStats(date) {
    await randomDelay();
    const reportDate = date || new Date().toISOString().split("T")[0];
    logger.info("🎭 Mock Withdrawal Transaction Stats", { date: reportDate });

    const { mockTransactions } = await import("../data/transactions.js");
    const { mockSavingBooks } = await import("../data/savingBooks.js");
    const { mockTypeSavings } = await import("../data/typeSavings.js");

    // Filter withdrawal transactions by date
    const dailyWithdrawals = mockTransactions.filter(
      (t) => t.transactionDate?.startsWith(reportDate) && t.type === "withdraw"
    );

    // Calculate statistics by type
    const items = mockTypeSavings.map((type) => {
      const booksOfType = mockSavingBooks.filter(
        (sb) => sb.typeSavingId === type.typeSavingId
      );
      const bookIds = booksOfType.map((sb) => sb.bookId);
      const typeWithdrawals = dailyWithdrawals.filter((t) =>
        bookIds.includes(t.bookId)
      );

      return {
        typeSavingId: type.typeSavingId,
        typeName: type.typeName,
        count: typeWithdrawals.length,
        totalAmount: typeWithdrawals.reduce((sum, t) => sum + t.amount, 0),
      };
    });

    const total = {
      count: items.reduce((sum, item) => sum + item.count, 0),
      totalAmount: items.reduce((sum, item) => sum + item.totalAmount, 0),
    };

    return {
      message: "Get withdrawal transaction statistics successfully",
      success: true,
      data: { date: reportDate, items, total },
    };
  },
};
