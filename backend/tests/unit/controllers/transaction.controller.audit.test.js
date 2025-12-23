import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
  createMockSavingBook,
  createMockEmployee,
  createMockCustomer,
} from "../../helpers/testHelpers.js";

// Mock service
const mockTransactionService = {
  depositTransaction: jest.fn(),
  withdrawTransaction: jest.fn(),
};

jest.unstable_mockModule("@src/services/Transaction/transaction.service.js", () => ({
  transactionService: mockTransactionService,
}));

const { depositTransaction, withdrawTransaction } = await import(
  "../../../src/controllers/Transaction/transaction.controller.js"
);

describe("TransactionController - Audit & Logging Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("TC_UC06_09 - Ghi Audit Log giao dịch gửi", () => {
    it("should log deposit transaction with teller info and timestamp", async () => {
      const req = createMockRequest({
        body: {
          bookId: 1,
          amount: 1000000,
          employeeId: "EMP001",
        },
        user: {
          userId: "EMP001",
          username: "teller01",
          roleid: 2,
        },
      });
      const res = createMockResponse();

      const mockResult = {
        transactionId: 1,
        bookId: 1,
        amount: 1000000,
        type: "deposit",
        transactionDate: new Date().toISOString(),
        employee: {
          employeeId: "EMP001",
          fullName: "Test Teller",
        },
      };

      mockTransactionService.depositTransaction.mockResolvedValue(mockResult);

      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      await depositTransaction(req, res);

      expect(mockTransactionService.depositTransaction).toHaveBeenCalledWith({
        bookId: 1,
        amount: 1000000,
        employeeId: "EMP001",
      });

      // Verify audit information is present in the response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            transactionId: 1,
            employee: expect.objectContaining({
              employeeId: "EMP001",
            }),
            transactionDate: expect.any(String),
          }),
        })
      );

      logSpy.mockRestore();
    });

    it("should include transaction details in audit log", async () => {
      const req = createMockRequest({
        body: {
          bookId: 1,
          amount: 500000,
          employeeId: "EMP002",
        },
        user: {
          userId: "EMP002",
          username: "teller02",
        },
      });
      const res = createMockResponse();

      const mockResult = {
        transactionId: 2,
        bookId: 1,
        amount: 500000,
        type: "deposit",
        transactionDate: new Date().toISOString(),
        savingBook: {
          bookId: 1,
          customer: {
            customerId: 1,
            fullName: "Test Customer",
          },
        },
        employee: {
          employeeId: "EMP002",
          fullName: "Test Teller 2",
        },
      };

      mockTransactionService.depositTransaction.mockResolvedValue(mockResult);

      await depositTransaction(req, res);

      // Audit log should contain:
      // - Transaction ID
      // - Employee who performed the transaction
      // - Customer information
      // - Amount and timestamp
      const responseData = res.json.mock.calls[0][0].data;
      expect(responseData).toHaveProperty("transactionId");
      expect(responseData).toHaveProperty("employee");
      expect(responseData).toHaveProperty("savingBook");
      expect(responseData).toHaveProperty("transactionDate");
    });
  });

  describe("TC_UC07_12 - Ghi Audit Log giao dịch rút", () => {
    it("should log withdrawal transaction with teller info and timestamp", async () => {
      const req = createMockRequest({
        body: {
          bookId: 1,
          amount: 500000,
          employeeId: "EMP001",
        },
        user: {
          userId: "EMP001",
          username: "teller01",
          roleid: 2,
        },
      });
      const res = createMockResponse();

      const mockResult = {
        transactionId: 3,
        bookId: 1,
        amount: 500000,
        type: "withdraw",
        balanceBefore: 2000000,
        balanceAfter: 1425000, // After withdrawal with interest
        transactionDate: new Date().toISOString(),
        employee: {
          employeeId: "EMP001",
          fullName: "Test Teller",
        },
      };

      mockTransactionService.withdrawTransaction.mockResolvedValue(mockResult);

      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      await withdrawTransaction(req, res);

      expect(mockTransactionService.withdrawTransaction).toHaveBeenCalledWith({
        bookId: 1,
        amount: 500000,
        employeeId: "EMP001",
      });

      // Verify audit information is present
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            transactionId: 3,
            employee: expect.objectContaining({
              employeeId: "EMP001",
            }),
            balanceBefore: 2000000,
            balanceAfter: 1425000,
            transactionDate: expect.any(String),
          }),
        })
      );

      logSpy.mockRestore();
    });

    it("should log account closure in audit trail", async () => {
      const req = createMockRequest({
        body: {
          bookId: 1,
          amount: 1000000, // Full withdrawal
          employeeId: "EMP001",
        },
        user: {
          userId: "EMP001",
          username: "teller01",
        },
      });
      const res = createMockResponse();

      const mockResult = {
        transactionId: 4,
        bookId: 1,
        amount: 1000000,
        type: "withdraw",
        balanceBefore: 1150000,
        balanceAfter: 0, // Account closed
        transactionDate: new Date().toISOString(),
        note: "Tất toán sổ. Số dư gốc: 1150000.",
        employee: {
          employeeId: "EMP001",
          fullName: "Test Teller",
        },
      };

      mockTransactionService.withdrawTransaction.mockResolvedValue(mockResult);

      await withdrawTransaction(req, res);

      // Audit log should indicate account closure
      const responseData = res.json.mock.calls[0][0].data;
      expect(responseData.balanceAfter).toBe(0);
      expect(responseData).toHaveProperty("note");
      expect(responseData.note).toMatch(/Tất toán/i);
    });

    it("should log withdrawal with interest calculation details", async () => {
      const req = createMockRequest({
        body: {
          bookId: 1,
          amount: 500000,
          employeeId: "EMP001",
        },
        user: {
          userId: "EMP001",
        },
      });
      const res = createMockResponse();

      const mockResult = {
        transactionId: 5,
        bookId: 1,
        amount: 500000,
        type: "withdraw",
        balanceBefore: 2000000,
        balanceAfter: 1425000, // 2000000 - (500000 * 1.15)
        interestApplied: 75000, // 500000 * 0.15
        transactionDate: new Date().toISOString(),
        employee: {
          employeeId: "EMP001",
          fullName: "Test Teller",
        },
      };

      mockTransactionService.withdrawTransaction.mockResolvedValue(mockResult);

      await withdrawTransaction(req, res);

      // Audit log should show balance changes
      const responseData = res.json.mock.calls[0][0].data;
      expect(responseData).toHaveProperty("balanceBefore");
      expect(responseData).toHaveProperty("balanceAfter");
      expect(responseData.balanceBefore - responseData.balanceAfter).toBe(575000);
    });
  });

  describe("Audit Log Format Validation", () => {
    it("should ensure audit logs contain required fields", async () => {
      const req = createMockRequest({
        body: {
          bookId: 1,
          amount: 1000000,
          employeeId: "EMP001",
        },
        user: {
          userId: "EMP001",
        },
      });
      const res = createMockResponse();

      const mockResult = {
        transactionId: 6,
        bookId: 1,
        amount: 1000000,
        type: "deposit",
        transactionDate: new Date().toISOString(),
        employee: {
          employeeId: "EMP001",
          fullName: "Test Teller",
        },
        savingBook: {
          bookId: 1,
          customer: {
            customerId: 1,
            fullName: "Test Customer",
          },
        },
      };

      mockTransactionService.depositTransaction.mockResolvedValue(mockResult);

      await depositTransaction(req, res);

      const responseData = res.json.mock.calls[0][0].data;

      // Required audit fields
      expect(responseData).toHaveProperty("transactionId");
      expect(responseData).toHaveProperty("bookId");
      expect(responseData).toHaveProperty("amount");
      expect(responseData).toHaveProperty("type");
      expect(responseData).toHaveProperty("transactionDate");
      expect(responseData).toHaveProperty("employee");
      expect(responseData.employee).toHaveProperty("employeeId");
      expect(responseData.employee).toHaveProperty("fullName");
    });
  });
});
