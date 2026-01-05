import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { createMockSupabaseClient, resetSupabaseMock } from "../../helpers/testHelpers.js";

// Cấu hình env giả
process.env.SUPABASE_URL = "http://localhost:8000";
process.env.SUPABASE_KEY = "test-key";

const mockSupabase = createMockSupabaseClient();

jest.unstable_mockModule("@config/database.js", () => ({
  supabase: mockSupabase,
}));

// Import Transaction AFTER mocking
const { Transaction } = await import("../../../src/models/Transaction.js");

describe("Transaction Model - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetSupabaseMock(mockSupabase);
  });

  describe("Model Configuration", () => {
    it("should have correct table name and primary key", () => {
      expect(Transaction.tableName).toBe("transaction");
      expect(Transaction.primaryKey).toBe("transactionid");
    });
  });

  describe("getAll()", () => {
    it("should return all transactions with joined data", async () => {
      const mockData = [
        {
          transactionid: 1,
          bookid: 1,
          transactiontype: "deposit",
          amount: 1000000,
          transactiondate: "2025-01-01T00:00:00",
          tellerid: "TELLER001",
          savingbook: {
            bookid: 1,
            customerid: 1,
            typeid: 1,
            customer: {
              customerid: 1,
              fullname: "John Doe",
              citizenid: "123456789",
            },
            typesaving: {
              typeid: 1,
              typename: "No term",
              interest: 0.15,
            },
          },
          useraccount: {
            userid: "TELLER001",
            employee: {
              employeeid: "EMP001",
              fullname: "Teller Name",
              roleid: 2,
            },
          },
        },
      ];

      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockResolvedValue({ data: mockData, error: null });

      const result = await Transaction.getAll();

      expect(mockSupabase.from).toHaveBeenCalledWith("transaction");
      expect(result).toEqual(mockData);
      expect(result).toHaveLength(1);
    });

    it("should throw error on database error", async () => {
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      await expect(Transaction.getAll()).rejects.toThrow(
        "GetAll failed in transaction: Database error"
      );
    });
  });

  describe("getTransactionsByDate()", () => {
    it("should return transactions for a specific date", async () => {
      const mockData = [
        {
          transactionid: 1,
          bookid: 1,
          transactiontype: "deposit",
          amount: 1000000,
          transactiondate: "2025-01-01T10:00:00",
          tellerid: "TELLER001",
          savingbook: {
            typeid: 1,
            typesaving: {
              typeid: 1,
              typename: "No term",
            },
          },
        },
      ];

      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.gte.mockReturnThis();
      mockSupabase.lt.mockResolvedValue({ data: mockData, error: null });

      const result = await Transaction.getTransactionsByDate("2025-01-01");

      expect(mockSupabase.gte).toHaveBeenCalledWith("transactiondate", "2025-01-01T00:00:00");
      expect(mockSupabase.lt).toHaveBeenCalledWith("transactiondate", "2025-01-01T23:59:59");
      expect(result).toEqual(mockData);
    });

    it("should throw error when date is missing", async () => {
      await expect(Transaction.getTransactionsByDate()).rejects.toThrow(
        "Missing date parameter"
      );
    });

    it("should return empty array when no transactions found", async () => {
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.gte.mockReturnThis();
      mockSupabase.lt.mockResolvedValue({ data: null, error: null });

      const result = await Transaction.getTransactionsByDate("2025-01-01");

      expect(result).toEqual([]);
    });

    it("should throw error on database error", async () => {
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.gte.mockReturnThis();
      mockSupabase.lt.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      await expect(Transaction.getTransactionsByDate("2025-01-01")).rejects.toThrow(
        "GetTransactionsByDate failed: Database error"
      );
    });
  });

  describe("getTransactionsByDateRange()", () => {
    it("should return transactions within date range", async () => {
      const mockData = [
        {
          transactionid: 1,
          amount: 1000000,
          transactiontype: "deposit",
          transactiondate: "2025-01-01T10:00:00",
          savingbook: {
            typeid: 1,
          },
        },
        {
          transactionid: 2,
          amount: 500000,
          transactiontype: "withdrawal",
          transactiondate: "2025-01-15T14:00:00",
          savingbook: {
            typeid: 2,
          },
        },
      ];

      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.gte.mockReturnThis();
      mockSupabase.lte.mockReturnThis();
      mockSupabase.order.mockResolvedValue({ data: mockData, error: null });

      const result = await Transaction.getTransactionsByDateRange("2025-01-01", "2025-01-31");

      expect(mockSupabase.gte).toHaveBeenCalledWith("transactiondate", "2025-01-01T00:00:00");
      expect(mockSupabase.lte).toHaveBeenCalledWith("transactiondate", "2025-01-31T23:59:59");
      expect(mockSupabase.order).toHaveBeenCalledWith("transactiondate", { ascending: true });
      expect(result).toEqual(mockData);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no transactions in range", async () => {
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.gte.mockReturnThis();
      mockSupabase.lte.mockReturnThis();
      mockSupabase.order.mockResolvedValue({ data: null, error: null });

      const result = await Transaction.getTransactionsByDateRange("2025-12-01", "2025-12-31");

      expect(result).toEqual([]);
    });

    it("should throw error on database error", async () => {
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.gte.mockReturnThis();
      mockSupabase.lte.mockReturnThis();
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      await expect(
        Transaction.getTransactionsByDateRange("2025-01-01", "2025-01-31")
      ).rejects.toThrow("GetTransactionsByDateRange failed: Database error");
    });
  });

  describe("getRecentTransactions()", () => {
    it("should return recent transactions with default limit", async () => {
      const mockData = [
        {
          transactionid: 5,
          transactiondate: "2025-01-05T10:00:00",
          transactiontype: "deposit",
          amount: 1000000,
          bookid: 1,
          savingbook: {
            bookid: 1,
            customer: {
              fullname: "John Doe",
            },
          },
        },
      ];

      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.order.mockReturnThis();
      mockSupabase.limit.mockResolvedValue({ data: mockData, error: null });

      const result = await Transaction.getRecentTransactions();

      expect(mockSupabase.order).toHaveBeenCalledWith("transactiondate", { ascending: false });
      expect(mockSupabase.limit).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockData);
    });

    it("should return recent transactions with custom limit", async () => {
      const mockData = [];

      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.order.mockReturnThis();
      mockSupabase.limit.mockResolvedValue({ data: mockData, error: null });

      const result = await Transaction.getRecentTransactions(10);

      expect(mockSupabase.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual([]);
    });

    it("should return empty array when no transactions found", async () => {
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.order.mockReturnThis();
      mockSupabase.limit.mockResolvedValue({ data: null, error: null });

      const result = await Transaction.getRecentTransactions();

      expect(result).toEqual([]);
    });

    it("should throw error on database error", async () => {
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.order.mockReturnThis();
      mockSupabase.limit.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      await expect(Transaction.getRecentTransactions()).rejects.toThrow(
        "GetRecentTransactions failed: Database error"
      );
    });
  });
});
