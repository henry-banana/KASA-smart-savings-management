import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { createMockSupabaseClient, resetSupabaseMock } from "../../helpers/testHelpers.js";

// Cấu hình env giả
process.env.SUPABASE_URL = "http://localhost:8000";
process.env.SUPABASE_KEY = "test-key";

const mockSupabase = createMockSupabaseClient();

jest.unstable_mockModule("@config/database.js", () => ({
  supabase: mockSupabase,
}));

// Import SavingBook AFTER mocking
const { SavingBook } = await import("../../../src/models/SavingBook.js");

describe("SavingBook Model - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetSupabaseMock(mockSupabase);
  });

  describe("Model Configuration", () => {
    it("should have correct table name", () => {
      const savingBook = new SavingBook();
      expect(savingBook.tableName).toBe("savingbook");
    });

    it("should have correct primary key", () => {
      const savingBook = new SavingBook();
      expect(savingBook.primaryKey).toBe("bookid");
    });
  });

  describe("getAll()", () => {
    it("should return all saving books with formatted data", async () => {
      const mockData = [
        {
          bookid: 1,
          registertime: "2025-01-01T00:00:00",
          maturitydate: "2025-07-01",
          status: "active",
          currentbalance: 1000000,
          customer: {
            fullname: "John Doe",
            citizenid: "123456789",
          },
          typesaving: {
            typeid: 1,
            typename: "No term",
          },
        },
      ];

      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.order.mockResolvedValue({ data: mockData, error: null });

      const savingBook = new SavingBook();
      const result = await savingBook.getAll();

      expect(mockSupabase.from).toHaveBeenCalledWith("savingbook");
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        typeId: 1,
        bookId: 1,
        accountCode: 1,
        citizenId: "123456789",
        customerName: "John Doe",
        accountTypeName: "No term",
        openDate: "2025-01-01",
        status: "active",
        balance: 1000000,
        maturityDate: "2025-07-01",
      });
    });

    it("should throw error on database error", async () => {
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const savingBook = new SavingBook();
      await expect(savingBook.getAll()).rejects.toEqual({
        message: "Database error",
      });
    });
  });

  describe("searchByCustomerName()", () => {
    it("should search saving books by customer name", async () => {
      const mockData = [
        {
          bookid: 1,
          registertime: "2025-01-01T00:00:00",
          maturitydate: "2025-07-01",
          status: "active",
          currentbalance: 1000000,
          customer: {
            fullname: "Nguyen Van A",
            citizenid: "123456789",
          },
          typesaving: {
            typeid: 1,
            typename: "No term",
          },
        },
      ];

      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.ilike.mockReturnThis();
      mockSupabase.order.mockResolvedValue({ data: mockData, error: null });

      const savingBook = new SavingBook();
      const result = await savingBook.searchByCustomerName("Nguyen");

      expect(mockSupabase.ilike).toHaveBeenCalledWith("customer.fullname", "%nguyen%");
      expect(result).toHaveLength(1);
      expect(result[0].customerName).toBe("Nguyen Van A");
    });

    it("should handle case-insensitive search", async () => {
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.ilike.mockReturnThis();
      mockSupabase.order.mockResolvedValue({ data: [], error: null });

      const savingBook = new SavingBook();
      await savingBook.searchByCustomerName("JOHN");

      expect(mockSupabase.ilike).toHaveBeenCalledWith("customer.fullname", "%john%");
    });
  });

  describe("searchByCustomerCitizenID()", () => {
    it("should search saving books by citizen ID", async () => {
      const mockData = [
        {
          bookid: 1,
          registertime: "2025-01-01T00:00:00",
          maturitydate: "2025-07-01",
          status: "active",
          currentbalance: 1000000,
          customer: {
            fullname: "John Doe",
            citizenid: "123456789",
          },
          typesaving: {
            typeid: 1,
            typename: "No term",
          },
        },
      ];

      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.order.mockResolvedValue({ data: mockData, error: null });

      const savingBook = new SavingBook();
      const result = await savingBook.searchByCustomerCitizenID("123456789");

      expect(mockSupabase.eq).toHaveBeenCalledWith("customer.citizenid", "123456789");
      expect(result).toHaveLength(1);
      expect(result[0].citizenId).toBe("123456789");
    });

    it("should throw error on database error", async () => {
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const savingBook = new SavingBook();
      await expect(savingBook.searchByCustomerCitizenID("123456789")).rejects.toEqual({
        message: "Database error",
      });
    });
  });

  describe("searchByBookID()", () => {
    it("should search saving book by book ID", async () => {
      const mockData = [
        {
          bookid: 1,
          registertime: "2025-01-01T00:00:00",
          maturitydate: "2025-07-01",
          status: "active",
          currentbalance: 1000000,
          customer: {
            fullname: "John Doe",
            citizenid: "123456789",
          },
          typesaving: {
            typeid: 1,
            typename: "No term",
          },
        },
      ];

      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.order.mockResolvedValue({ data: mockData, error: null });

      const savingBook = new SavingBook();
      const result = await savingBook.searchByBookID(1);

      expect(mockSupabase.eq).toHaveBeenCalledWith("bookid", 1);
      expect(result).toHaveLength(1);
      expect(result[0].bookId).toBe(1);
    });
  });
});
