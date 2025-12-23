import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
  createMockSavingBook,
} from "../../helpers/testHelpers.js";

// Mock service
const mockSavingBookService = {
  addSavingBook: jest.fn(),
  updateSavingBook: jest.fn(),
  deleteSavingBook: jest.fn(),
  getSavingBookById: jest.fn(),
  searchSavingBook: jest.fn(),
  closeSavingBook: jest.fn(),
};

jest.unstable_mockModule("@src/services/SavingBook/savingBook.service.js", () => ({
  savingBookService: mockSavingBookService,
}));

const {
  addSavingBook,
  updateSavingBook,
  deleteSavingBook,
  getSavingBookById,
  searchSavingBook,
  closeSavingBook,
} = await import("../../../src/controllers/SavingBook/savingBook.controller.js");

describe("SavingBookController - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addSavingBook()", () => {
    it("TC_UC05_06 - Chọn thẻ loại sổ và tính toán vẹn dữ liệu", async () => {
      const req = createMockRequest({
        body: {
          typeSavingID: 1,
          initialDeposit: 1000000,
          employeeID: "EMP001",
          citizenID: "123456789012",
        },
      });
      const res = createMockResponse();

      const mockResult = {
        bookId: 1,
        citizenId: "123456789012",
        customerName: "Test Customer",
        typesavingId: 1,
        openDate: "2025-01-01",
        maturityDate: "2025-04-01",
        balance: 1000000,
        status: "Open",
        typesaving: {
          typesavingId: 1,
          typeName: "3 months",
          term: 3,
          interestRate: 0.5,
          minimumDeposit: 100000,
        },
      };

      mockSavingBookService.addSavingBook.mockResolvedValue(mockResult);

      await addSavingBook(req, res);

      expect(mockSavingBookService.addSavingBook).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Saving book added successfully",
        success: true,
        total: 1,
        data: mockResult,
      });
    });

    it("should return 500 when service throws error", async () => {
      const req = createMockRequest({
        body: {
          typeSavingID: 1,
          initialDeposit: 1000000,
          employeeID: "EMP001",
          citizenID: "123456789012",
        },
      });
      const res = createMockResponse();

      mockSavingBookService.addSavingBook.mockRejectedValue(
        new Error("Customer not found")
      );
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await addSavingBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to add saving book",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getSavingBookById()", () => {
    it("should return saving book when found", async () => {
      const req = createMockRequest({
        params: { id: "1" },
      });
      const res = createMockResponse();

      const mockBook = createMockSavingBook({ bookid: 1 });

      mockSavingBookService.getSavingBookById.mockResolvedValue(mockBook);

      await getSavingBookById(req, res);

      expect(mockSavingBookService.getSavingBookById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Get saving book successfully",
        success: true,
        total: 1,
        data: mockBook,
      });
    });

    it("should return 404 when saving book not found", async () => {
      const req = createMockRequest({
        params: { id: "999" },
      });
      const res = createMockResponse();

      mockSavingBookService.getSavingBookById.mockResolvedValue(null);

      await getSavingBookById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Saving book not found",
        success: false,
      });
    });
  });

  describe("searchSavingBook()", () => {
    it("TC_UC08_04 - Lỗi không nhập tiêu chí - should return all books when no keyword", async () => {
      const req = createMockRequest({
        query: {
          // No search criteria provided
          pageSize: "10",
          pageNumber: "1",
        },
      });
      const res = createMockResponse();

      // Mock service to return all books when no keyword
      mockSavingBookService.searchSavingBook.mockResolvedValue({
        total: 5,
        data: [
          createMockSavingBook({ bookid: 1 }),
          createMockSavingBook({ bookid: 2 }),
          createMockSavingBook({ bookid: 3 }),
          createMockSavingBook({ bookid: 4 }),
          createMockSavingBook({ bookid: 5 }),
        ],
      });

      await searchSavingBook(req, res);

      // Current implementation allows empty keyword and returns all books
      expect(mockSavingBookService.searchSavingBook).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Get all saving books successfully",
          success: true,
          total: 5,
        })
      );
    });

    it("TC_UC08_05 - Không tìm thấy kết quả tra cứu", async () => {
      const req = createMockRequest({
        query: {
          keyword: "NONEXISTENT123",
          pageSize: "10",
          pageNumber: "1",
        },
      });
      const res = createMockResponse();

      mockSavingBookService.searchSavingBook.mockResolvedValue({
        total: 0,
        data: [],
      });

      await searchSavingBook(req, res);

      expect(mockSavingBookService.searchSavingBook).toHaveBeenCalledWith(
        "NONEXISTENT123",
        10,
        1
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Search saving books successfully",
        success: true,
        total: 0,
        pageSize: 10,
        pageNumber: 1,
        totalPages: 0,
        data: [],
      });
    });

    it("should search by keyword successfully", async () => {
      const req = createMockRequest({
        query: {
          keyword: "123456789012",
          pageSize: "10",
          pageNumber: "1",
        },
      });
      const res = createMockResponse();

      const mockResults = [createMockSavingBook({ bookid: 1 })];

      mockSavingBookService.searchSavingBook.mockResolvedValue({
        total: 1,
        data: mockResults,
      });

      await searchSavingBook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 1,
          data: mockResults,
        })
      );
    });

    it("should get all saving books when keyword is empty", async () => {
      const req = createMockRequest({
        query: {
          pageSize: "10",
          pageNumber: "1",
        },
      });
      const res = createMockResponse();

      mockSavingBookService.searchSavingBook.mockResolvedValue({
        total: 5,
        data: [],
      });

      await searchSavingBook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Get all saving books successfully",
        })
      );
    });
  });

  describe("updateSavingBook()", () => {
    it("should update saving book successfully", async () => {
      const req = createMockRequest({
        params: { id: "1" },
        body: {
          status: "Close",
          currentBalance: 0,
        },
      });
      const res = createMockResponse();

      const mockUpdated = createMockSavingBook({ bookid: 1, status: "Close" });

      mockSavingBookService.updateSavingBook.mockResolvedValue(mockUpdated);

      await updateSavingBook(req, res);

      expect(mockSavingBookService.updateSavingBook).toHaveBeenCalledWith(
        "1",
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 when saving book not found", async () => {
      const req = createMockRequest({
        params: { id: "999" },
        body: { status: "Close" },
      });
      const res = createMockResponse();

      mockSavingBookService.updateSavingBook.mockResolvedValue(null);

      await updateSavingBook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("closeSavingBook()", () => {
    it("should close saving book successfully", async () => {
      const req = createMockRequest({
        params: { id: "1" },
        body: {
          employeeID: "EMP001",
        },
      });
      const res = createMockResponse();

      const mockResult = {
        bookId: 1,
        status: "Close",
        finalAmount: 1000000,
      };

      mockSavingBookService.closeSavingBook.mockResolvedValue(mockResult);

      await closeSavingBook(req, res);

      expect(mockSavingBookService.closeSavingBook).toHaveBeenCalledWith(
        "1",
        "EMP001"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Saving book closed successfully",
        success: true,
        data: mockResult,
      });
    });

    it("should return 404 when saving book not found or already closed", async () => {
      const req = createMockRequest({
        params: { id: "999" },
        body: {
          employeeID: "EMP001",
        },
      });
      const res = createMockResponse();

      mockSavingBookService.closeSavingBook.mockResolvedValue(null);

      await closeSavingBook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Saving book not found or already closed",
        success: false,
      });
    });
  });

  describe("deleteSavingBook()", () => {
    it("should delete saving book successfully", async () => {
      const req = createMockRequest({
        params: { id: "1" },
      });
      const res = createMockResponse();

      mockSavingBookService.deleteSavingBook.mockResolvedValue({
        message: "Deleted successfully",
      });

      await deleteSavingBook(req, res);

      expect(mockSavingBookService.deleteSavingBook).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 when saving book not found", async () => {
      const req = createMockRequest({
        params: { id: "999" },
      });
      const res = createMockResponse();

      mockSavingBookService.deleteSavingBook.mockResolvedValue(null);

      await deleteSavingBook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});

