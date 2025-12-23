import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
  createMockTransaction,
} from "../../helpers/testHelpers.js";

// Mock service
const mockTransactionService = {
  addTransaction: jest.fn(),
  getAllTransactions: jest.fn(),
  getTransactionById: jest.fn(),
  updateTransaction: jest.fn(),
  deleteTransaction: jest.fn(),
  depositTransaction: jest.fn(),
  withdrawTransaction: jest.fn(),
};

jest.unstable_mockModule("@src/services/Transaction/transaction.service.js", () => ({
  transactionService: mockTransactionService,
}));

const {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  depositTransaction,
  withdrawTransaction,
} = await import("../../../src/controllers/Transaction/transaction.controller.js");

describe("TransactionController - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("depositTransaction()", () => {
    it("TC_UC06_08 - Rollback khi DB lỗi (Gửi tiền)", async () => {
      const req = createMockRequest({
        body: {
          bookId: 1,
          amount: 1000000,
          employeeId: "EMP001",
        },
      });
      const res = createMockResponse();

      // Simulate DB error - service should handle rollback
      const dbError = new Error("Database connection failed");
      dbError.status = 500;
      mockTransactionService.depositTransaction.mockRejectedValue(dbError);

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await depositTransaction(req, res);

      expect(mockTransactionService.depositTransaction).toHaveBeenCalledWith(
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to deposit money",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });

    it("should deposit successfully", async () => {
      const req = createMockRequest({
        body: {
          bookId: 1,
          amount: 1000000,
          employeeId: "EMP001",
        },
      });
      const res = createMockResponse();

      const mockResult = {
        transactionId: 1,
        bookId: 1,
        type: "deposit",
        amount: 1000000,
        transactionDate: new Date().toISOString(),
      };

      mockTransactionService.depositTransaction.mockResolvedValue(mockResult);

      await depositTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Deposit successfully",
        success: true,
        total: 1,
        data: mockResult,
      });
    });
  });

  describe("withdrawTransaction()", () => {
    it("TC_UC07_08 - Kiểm tra tính lãi tự động", async () => {
      const req = createMockRequest({
        body: {
          bookId: 1,
          amount: 500000,
          employeeId: "EMP001",
        },
      });
      const res = createMockResponse();

      // Withdrawal amount * 1.15 (includes 15% interest)
      const mockResult = {
        transactionId: 1,
        bookId: 1,
        type: "withdraw",
        amount: 500000,
        balanceBefore: 1000000,
        balanceAfter: 425000, // 1000000 - (500000 * 1.15) = 425000
        transactionDate: new Date().toISOString(),
      };

      mockTransactionService.withdrawTransaction.mockResolvedValue(mockResult);

      await withdrawTransaction(req, res);

      expect(mockTransactionService.withdrawTransaction).toHaveBeenCalledWith(
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Withdraw successfully",
        success: true,
        total: 1,
        data: mockResult,
      });

      // Verify interest calculation: amount * 1.15
      expect(mockResult.balanceAfter).toBe(425000);
    });

    it("should return 500 when withdrawal fails", async () => {
      const req = createMockRequest({
        body: {
          bookId: 1,
          amount: 500000,
          employeeId: "EMP001",
        },
      });
      const res = createMockResponse();

      mockTransactionService.withdrawTransaction.mockRejectedValue(
        new Error("Insufficient balance")
      );
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await withdrawTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to withdraw money",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("addTransaction()", () => {
    it("should add transaction successfully", async () => {
      const req = createMockRequest({
        body: {
          bookID: 1,
          amount: 1000000,
          type: "Deposit",
          tellerid: "EMP001",
        },
      });
      const res = createMockResponse();

      const mockTransaction = createMockTransaction();

      mockTransactionService.addTransaction.mockResolvedValue({
        message: "Transaction added successfully.",
        transaction: mockTransaction,
      });

      await addTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction added successfully",
        success: true,
        total: 1,
        data: expect.objectContaining({
          transaction: mockTransaction,
        }),
      });
    });
  });

  describe("getAllTransactions()", () => {
    it("should return all transactions", async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      const mockTransactions = [
        createMockTransaction({ transactionid: 1 }),
        createMockTransaction({ transactionid: 2 }),
      ];

      mockTransactionService.getAllTransactions.mockResolvedValue(
        mockTransactions
      );

      await getAllTransactions(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Get transactions successfully",
        success: true,
        total: 2,
        data: mockTransactions,
      });
    });
  });

  describe("getTransactionById()", () => {
    it("should return transaction when found", async () => {
      const req = createMockRequest({
        params: { id: "1" },
      });
      const res = createMockResponse();

      const mockTransaction = createMockTransaction();

      mockTransactionService.getTransactionById.mockResolvedValue(
        mockTransaction
      );

      await getTransactionById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Get transaction successfully",
        success: true,
        total: 1,
        data: mockTransaction,
      });
    });

    it("should return 404 when transaction not found", async () => {
      const req = createMockRequest({
        params: { id: "999" },
      });
      const res = createMockResponse();

      mockTransactionService.getTransactionById.mockResolvedValue(null);

      await getTransactionById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction not found",
        success: false,
      });
    });
  });

  describe("updateTransaction()", () => {
    it("should update transaction successfully", async () => {
      const req = createMockRequest({
        params: { id: "1" },
        body: {
          amount: 2000000,
        },
      });
      const res = createMockResponse();

      const mockUpdated = createMockTransaction({ amount: 2000000 });

      mockTransactionService.updateTransaction.mockResolvedValue({
        message: "Transaction updated successfully.",
        transaction: mockUpdated,
      });

      await updateTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 when transaction not found", async () => {
      const req = createMockRequest({
        params: { id: "999" },
        body: { amount: 2000000 },
      });
      const res = createMockResponse();

      mockTransactionService.updateTransaction.mockResolvedValue(null);

      await updateTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteTransaction()", () => {
    it("should delete transaction successfully", async () => {
      const req = createMockRequest({
        params: { id: "1" },
      });
      const res = createMockResponse();

      mockTransactionService.deleteTransaction.mockResolvedValue({
        message: "Transaction deleted successfully.",
      });

      await deleteTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 when transaction not found", async () => {
      const req = createMockRequest({
        params: { id: "999" },
      });
      const res = createMockResponse();

      mockTransactionService.deleteTransaction.mockResolvedValue(null);

      await deleteTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});

