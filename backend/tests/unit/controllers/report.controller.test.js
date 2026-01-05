import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
} from "../../helpers/testHelpers.js";

// Mock service
const mockReportService = {
  getDailyReport: jest.fn(),
  getMonthlyReport: jest.fn(),
  getDailyTransactionStatistics: jest.fn(),
};

const reportServicePath = new URL(
  "../../../src/services/Report/report.service.js",
  import.meta.url
).pathname;

jest.unstable_mockModule(reportServicePath, () => ({
  reportService: mockReportService,
}));

const { getDailyReport, getMonthlyReport, getDailyTransactionStatistics } = await import(
  "../../../src/controllers/Report/report.controller.js"
);

describe("ReportController - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getDailyReport()", () => {
    it("TC_UC09_05 - Kiểm tra tính chính xác số liệu báo cáo", async () => {
      const req = createMockRequest({
        query: {
          date: "2025-10-15",
        },
      });
      const res = createMockResponse();

      const mockReport = {
        date: "2025-10-15",
        byTypeSaving: [
          {
            typeSavingId: 1,
            typeName: "No term",
            totalDeposits: 5000000,
            totalWithdrawals: 2000000,
            difference: 3000000,
          },
          {
            typeSavingId: 2,
            typeName: "3 months",
            totalDeposits: 3000000,
            totalWithdrawals: 0,
            difference: 3000000,
          },
        ],
        summary: {
          totalDeposits: 8000000,
          totalWithdrawals: 2000000,
          difference: 6000000,
        },
      };

      mockReportService.getDailyReport.mockResolvedValue(mockReport);

      await getDailyReport(req, res);

      expect(mockReportService.getDailyReport).toHaveBeenCalledWith("2025-10-15");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Daily report generated successfully",
        success: true,
        data: mockReport,
      });

      // Verify data accuracy
      expect(mockReport.summary.totalDeposits).toBe(8000000);
      expect(mockReport.summary.totalWithdrawals).toBe(2000000);
      expect(mockReport.summary.difference).toBe(6000000);
    });

    it("should return 400 when date is missing", async () => {
      const req = createMockRequest({
        query: {},
      });
      const res = createMockResponse();

      await getDailyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Missing query parameter: date (YYYY-MM-DD)",
      });
    });

    it("should return 400 when date format is invalid", async () => {
      const req = createMockRequest({
        query: {
          date: "15-10-2025", // Wrong format
        },
      });
      const res = createMockResponse();

      await getDailyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid date format. Expected YYYY-MM-DD",
      });
    });

    it("should return 500 on server error", async () => {
      const req = createMockRequest({
        query: {
          date: "2025-10-15",
        },
      });
      const res = createMockResponse();

      mockReportService.getDailyReport.mockRejectedValue(
        new Error("Database error")
      );
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await getDailyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getMonthlyReport()", () => {
    it("TC_UC10_06 - Chức năng Xuất báo cáo", async () => {
      const req = createMockRequest({
        query: {
          typeSavingId: "1",
          month: "10",
          year: "2025",
        },
      });
      const res = createMockResponse();

      const mockReport = {
        month: 10,
        year: 2025,
        typeSavingId: 1,
        typeName: "No term",
        byDay: [
          {
            day: 1,
            newSavingBooks: 5,
            closedSavingBooks: 2,
            difference: 3,
          },
          {
            day: 2,
            newSavingBooks: 3,
            closedSavingBooks: 1,
            difference: 2,
          },
        ],
        summary: {
          newSavingBooks: 8,
          closedSavingBooks: 3,
          difference: 5,
        },
      };

      mockReportService.getMonthlyReport.mockResolvedValue(mockReport);

      await getMonthlyReport(req, res);

      expect(mockReportService.getMonthlyReport).toHaveBeenCalledWith("1", 10, 2025);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Get monthly report successfully",
        success: true,
        data: mockReport,
      });

      // Verify summary totals
      expect(mockReport.summary.newSavingBooks).toBe(8);
      expect(mockReport.summary.closedSavingBooks).toBe(3);
    });

    it("should return 400 when typeSavingId is missing", async () => {
      const req = createMockRequest({
        query: {
          month: "10",
          year: "2025",
        },
      });
      const res = createMockResponse();

      await getMonthlyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Missing required query parameters: typeSavingId, month, year",
      });
    });

    it("should return 400 when month is invalid", async () => {
      const req = createMockRequest({
        query: {
          typeSavingId: "1",
          month: "13", // Invalid month
          year: "2025",
        },
      });
      const res = createMockResponse();

      await getMonthlyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid month or year",
      });
    });

    it("should return 400 when year is invalid", async () => {
      const req = createMockRequest({
        query: {
          typeSavingId: "1",
          month: "10",
          year: "1999", // Too old
        },
      });
      const res = createMockResponse();

      await getMonthlyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid month or year",
      });
    });

    it("should return 500 on server error", async () => {
      const req = createMockRequest({
        query: {
          typeSavingId: "1",
          month: "10",
          year: "2025",
        },
      });
      const res = createMockResponse();

      mockReportService.getMonthlyReport.mockRejectedValue(
        new Error("Database error")
      );
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await getMonthlyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getDailyTransactionStatistics()", () => {
    it("should return daily transaction statistics successfully", async () => {
      const req = createMockRequest({
        query: {
          date: "2025-10-15",
        },
      });
      const res = createMockResponse();

      const mockStats = {
        date: "2025-10-15",
        totalDeposits: 5,
        totalWithdrawals: 3,
        depositAmount: 10000000,
        withdrawalAmount: 5000000,
      };

      mockReportService.getDailyTransactionStatistics.mockResolvedValue(mockStats);

      await getDailyTransactionStatistics(req, res);

      expect(mockReportService.getDailyTransactionStatistics).toHaveBeenCalledWith("2025-10-15");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Get daily transaction statistics successfully",
        success: true,
        data: mockStats,
      });
    });

    it("should return 400 when date is missing", async () => {
      const req = createMockRequest({
        query: {},
      });
      const res = createMockResponse();

      await getDailyTransactionStatistics(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Missing query parameter: date (YYYY-MM-DD)",
      });
    });

    it("should return 400 when date format is invalid", async () => {
      const req = createMockRequest({
        query: {
          date: "15-10-2025",
        },
      });
      const res = createMockResponse();

      await getDailyTransactionStatistics(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid date format. Expected YYYY-MM-DD",
      });
    });

    it("should return 400 when date value is invalid", async () => {
      const req = createMockRequest({
        query: {
          date: "2025-13-35",
        },
      });
      const res = createMockResponse();

      await getDailyTransactionStatistics(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid date value",
      });
    });

    it("should return 500 on server error", async () => {
      const req = createMockRequest({
        query: {
          date: "2025-10-15",
        },
      });
      const res = createMockResponse();

      mockReportService.getDailyTransactionStatistics.mockRejectedValue(
        new Error("Database error")
      );
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await getDailyTransactionStatistics(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });

      consoleErrorSpy.mockRestore();
    });
  });
});

