import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock repository
const mockReportRepository = {
  getDailyData: jest.fn(),
  getMonthlyData: jest.fn(),
};

jest.unstable_mockModule("@src/repositories/Report/ReportRepository.js", () => ({
  reportRepository: mockReportRepository,
}));

const { reportService } = await import("@src/services/Report/report.service.js");

describe("ReportService - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getDailyReport()", () => {
    it("TC_UC09_05 - Kiểm tra tính chính xác số liệu báo cáo", async () => {
      const date = "2025-10-15";

      const mockTypes = [
        { typeid: 1, typename: "No term" },
        { typeid: 2, typename: "3 months" },
      ];

      const mockTransactions = [
        {
          transactionid: 1,
          amount: 5000000,
          transactiontype: "Deposit",
          savingbook: { typeid: 1 },
        },
        {
          transactionid: 2,
          amount: 2000000,
          transactiontype: "WithDraw",
          savingbook: { typeid: 1 },
        },
        {
          transactionid: 3,
          amount: 3000000,
          transactiontype: "Deposit",
          savingbook: { typeid: 2 },
        },
      ];

      mockReportRepository.getDailyData.mockResolvedValue({
        types: mockTypes,
        transactions: mockTransactions,
      });

      const result = await reportService.getDailyReport(date);

      expect(result.date).toBe(date);
      expect(result.byTypeSaving).toHaveLength(2);

      // Verify calculations for "No term"
      const noTermType = result.byTypeSaving.find((t) => t.typeSavingId === 1);
      expect(noTermType.totalDeposits).toBe(5000000);
      expect(noTermType.totalWithdrawals).toBe(2000000);
      expect(noTermType.difference).toBe(3000000);

      // Verify summary totals
      expect(result.summary.totalDeposits).toBe(8000000);
      expect(result.summary.totalWithdrawals).toBe(2000000);
      expect(result.summary.difference).toBe(6000000);
    });

    it("should handle empty transactions", async () => {
      const date = "2025-10-15";

      mockReportRepository.getDailyData.mockResolvedValue({
        types: [{ typeid: 1, typename: "No term" }],
        transactions: [],
      });

      const result = await reportService.getDailyReport(date);

      expect(result.summary.totalDeposits).toBe(0);
      expect(result.summary.totalWithdrawals).toBe(0);
      expect(result.summary.difference).toBe(0);
    });
  });

  describe("getMonthlyReport()", () => {
    it("TC_UC10_06 - Chức năng Xuất báo cáo", async () => {
      const typeSavingId = 1;
      const month = 10;
      const year = 2025;

      const mockTypeInfo = {
        typeid: 1,
        typename: "No term",
      };

      // Books opened on day 1 and 2
      const mockNewBooks = [
        {
          bookid: 1,
          registertime: new Date(2025, 9, 1).toISOString(), // October 1
        },
        {
          bookid: 2,
          registertime: new Date(2025, 9, 1).toISOString(), // October 1
        },
        {
          bookid: 3,
          registertime: new Date(2025, 9, 2).toISOString(), // October 2
        },
      ];

      // Books closed on day 1
      const mockClosedBooks = [
        {
          bookid: 4,
          closeddate: new Date(2025, 9, 1).toISOString(), // October 1
        },
      ];

      mockReportRepository.getMonthlyData.mockResolvedValue({
        typeInfo: mockTypeInfo,
        newBooks: mockNewBooks,
        closedBooks: mockClosedBooks,
      });

      const result = await reportService.getMonthlyReport(
        typeSavingId,
        month,
        year
      );

      expect(result.month).toBe(month);
      expect(result.year).toBe(year);
      expect(result.typeSavingId).toBe(typeSavingId);
      expect(result.typeName).toBe("No term");

      // Verify day 1 data
      const day1 = result.byDay.find((d) => d.day === 1);
      expect(day1.newSavingBooks).toBe(2);
      expect(day1.closedSavingBooks).toBe(1);
      expect(day1.difference).toBe(1);

      // Verify day 2 data
      const day2 = result.byDay.find((d) => d.day === 2);
      expect(day2.newSavingBooks).toBe(1);
      expect(day2.closedSavingBooks).toBe(0);

      // Verify summary
      expect(result.summary.newSavingBooks).toBe(3);
      expect(result.summary.closedSavingBooks).toBe(1);
      expect(result.summary.difference).toBe(2);
    });

    it("should handle February correctly (28 days)", async () => {
      const typeSavingId = 1;
      const month = 2;
      const year = 2025;

      mockReportRepository.getMonthlyData.mockResolvedValue({
        typeInfo: { typeid: 1, typename: "No term" },
        newBooks: [],
        closedBooks: [],
      });

      const result = await reportService.getMonthlyReport(
        typeSavingId,
        month,
        year
      );

      // February 2025 has 28 days
      expect(result.byDay).toHaveLength(28);
    });

    it("should handle leap year February correctly (29 days)", async () => {
      const typeSavingId = 1;
      const month = 2;
      const year = 2024; // Leap year

      mockReportRepository.getMonthlyData.mockResolvedValue({
        typeInfo: { typeid: 1, typename: "No term" },
        newBooks: [],
        closedBooks: [],
      });

      const result = await reportService.getMonthlyReport(
        typeSavingId,
        month,
        year
      );

      // February 2024 has 29 days
      expect(result.byDay).toHaveLength(29);
    });

    it("should handle months with 31 days", async () => {
      const typeSavingId = 1;
      const month = 10; // October
      const year = 2025;

      mockReportRepository.getMonthlyData.mockResolvedValue({
        typeInfo: { typeid: 1, typename: "No term" },
        newBooks: [],
        closedBooks: [],
      });

      const result = await reportService.getMonthlyReport(
        typeSavingId,
        month,
        year
      );

      // October has 31 days
      expect(result.byDay).toHaveLength(31);
    });
  });
});

