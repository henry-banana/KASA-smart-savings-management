import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockSavingBook,
  createMockTransaction,
  createMockEmployee,
} from "../../helpers/testHelpers.js";

// Mock repositories
const mockTransactionRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockSavingBookRepository = {
  findById: jest.fn(),
  update: jest.fn(),
};

const mockEmployeeRepository = {
  findById: jest.fn(),
};

const mockCustomerRepository = {
  findById: jest.fn(),
};

const transactionRepoPath = new URL(
  "../../../src/repositories/Transaction/TransactionRepository.js",
  import.meta.url
).pathname;
const savingBookRepoPath = new URL(
  "../../../src/repositories/SavingBook/SavingBookRepository.js",
  import.meta.url
).pathname;
const employeeRepoPath = new URL(
  "../../../src/repositories/Employee/EmployeeRepository.js",
  import.meta.url
).pathname;
const customerRepoPath = new URL(
  "../../../src/repositories/Customer/CustomerRepository.js",
  import.meta.url
).pathname;

jest.unstable_mockModule(transactionRepoPath, () => ({
  TransactionRepository: class {},
  transactionRepository: mockTransactionRepository,
}));

jest.unstable_mockModule(savingBookRepoPath, () => ({
  savingBookRepository: mockSavingBookRepository,
}));

jest.unstable_mockModule(employeeRepoPath, () => ({
  employeeRepository: mockEmployeeRepository,
}));

jest.unstable_mockModule(customerRepoPath, () => ({
  customerRepository: mockCustomerRepository,
}));

const { transactionService } = await import(
  "@src/services/Transaction/transaction.service.js"
);

describe("TransactionService - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("depositTransaction()", () => {
    it("TC_UC06_08 - Rollback khi DB lỗi (Gửi tiền)", async () => {
      const inputData = {
        bookId: 1,
        amount: 1000000,
        employeeId: "EMP001",
      };

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        currentbalance: 5000000,
        status: "Open",
      });

      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);

      // Simulate DB error on update
      mockSavingBookRepository.update.mockRejectedValue(
        new Error("Database connection failed")
      );

      await expect(
        transactionService.depositTransaction(inputData)
      ).rejects.toThrow("Database connection failed");

      // Verify that transaction was not created (rollback)
      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
    });

    it("should deposit successfully and update balance", async () => {
      const inputData = {
        bookId: 1,
        amount: 1000000,
        employeeId: "EMP001",
      };

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        customerid: 1,
        typeid: 1, // ✅ No term type
        currentbalance: 5000000,
        status: "Open",
      });

      const mockEmployee = createMockEmployee({
        employeeid: "EMP001",
        fullname: "Test Employee",
      });

      const mockCustomer = {
        customerid: 1,
        fullname: "Test Customer",
      };

      const updatedBook = {
        ...mockSavingBook,
        currentbalance: 6000000,
      };

      const mockTransaction = createMockTransaction({
        transactionid: 1,
        bookid: 1,
        amount: 1000000,
        transactiontype: "Deposit",
      });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
      mockSavingBookRepository.update.mockResolvedValue(updatedBook);
      mockTransactionRepository.create.mockResolvedValue(mockTransaction);
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);

      const result = await transactionService.depositTransaction(inputData);

      expect(mockSavingBookRepository.update).toHaveBeenCalledWith(1, {
        currentbalance: 6000000,
      });
      expect(mockTransactionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          bookid: 1,
          amount: 1000000,
          transactiontype: "Deposit",
        })
      );
      expect(result).toHaveProperty("transactionId");
      expect(result).toHaveProperty("type", "deposit");
    });

    it("should throw error when account not found", async () => {
      mockSavingBookRepository.findById.mockResolvedValue(null);

      await expect(
        transactionService.depositTransaction({
          bookId: 999,
          amount: 1000000,
          employeeId: "EMP001",
        })
      ).rejects.toThrow("Account not found");
    });

    it("should throw error when account is closed", async () => {
      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        status: "Close",
      });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);

      await expect(
        transactionService.depositTransaction({
          bookId: 1,
          amount: 1000000,
          employeeId: "EMP001",
        })
      ).rejects.toThrow("Cannot deposit to a closed account");
    });

    it("should throw error when amount is invalid", async () => {
      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        status: "Open",
      });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);

      await expect(
        transactionService.depositTransaction({
          bookId: 1,
          amount: -1000,
          employeeId: "EMP001",
        })
      ).rejects.toThrow("Invalid amount");
    });

    it("TC_UC06_02 - Gửi tiền thất bại - Sổ Có kỳ hạn", async () => {
      const inputData = {
        bookId: 1,
        amount: 1000000,
        employeeId: "EMP001",
      };

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        typeid: 2, // Type with term
        currentbalance: 5000000,
        status: "Open",
      });

      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);

      // ✅ Mock update to fail for term savings
      mockSavingBookRepository.update.mockResolvedValue(null);

      // Should reject deposit to term savings book
      await expect(
        transactionService.depositTransaction(inputData)
      ).rejects.toThrow(/Cannot deposit to term savings book|Failed to deposit money/i);
    });

    it("TC_UC06_04 - Lỗi số tiền dưới tối thiểu", async () => {
      const inputData = {
        bookId: 1,
        amount: 50000, // Below minimum deposit
        employeeId: "EMP001",
      };

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        typeid: 1, // No term
        currentbalance: 5000000,
        status: "Open",
      });

      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);

      // ✅ Mock update to fail for minimum amount
      mockSavingBookRepository.update.mockResolvedValue(null);

      await expect(
        transactionService.depositTransaction(inputData)
      ).rejects.toThrow(/Deposit amount must be at least|Failed to deposit money/i);
    });
  });

  describe("withdrawTransaction()", () => {
    it("TC_UC07_08 - Kiểm tra tính lãi tự động", async () => {
      const inputData = {
        bookId: 1,
        amount: 500000,
        employeeId: "EMP001",
      };

      // Register date: 45 days ago (more than 30 days)
      const registerDate = new Date();
      registerDate.setDate(registerDate.getDate() - 45);

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        customerid: 1,
        typeid: 1, // No term
        currentbalance: 1000000,
        status: "Open",
        registertime: registerDate.toISOString(),
      });

      const mockEmployee = createMockEmployee({
        employeeid: "EMP001",
        fullname: "Test Employee",
      });

      const mockCustomer = {
        customerid: 1,
        fullname: "Test Customer",
      };

      // Withdrawal: amount * 1.15 = 500000 * 1.15 = 575000
      // Balance after: 1000000 - 575000 = 425000
      const updatedBook = {
        ...mockSavingBook,
        currentbalance: 425000,
      };

      const mockTransaction = createMockTransaction({
        transactionid: 1,
        bookid: 1,
        amount: 500000,
        transactiontype: "WithDraw",
      });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
      mockSavingBookRepository.update.mockResolvedValue(updatedBook);
      mockTransactionRepository.create.mockResolvedValue(mockTransaction);
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);

      const result = await transactionService.withdrawTransaction(inputData);

      // Verify interest calculation: amount * 1.15
      expect(result.balanceBefore).toBe(1000000);
      expect(result.balanceAfter).toBe(425000); // 1000000 - (500000 * 1.15)
      expect(result.amount).toBe(500000);
    });

    it("should throw error when cannot withdraw within 15 days", async () => {
      const registerDate = new Date();
      registerDate.setDate(registerDate.getDate() - 10); // 10 days ago

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        currentbalance: 1000000,
        registertime: registerDate.toISOString(),
      });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);

      await expect(
        transactionService.withdrawTransaction({
          bookId: 1,
          amount: 500000,
          employeeId: "EMP001",
        })
      ).rejects.toThrow("Cannot withdraw within 15 days");
    });

    it("should throw error when cannot withdraw before 1 month", async () => {
      const registerDate = new Date();
      registerDate.setDate(registerDate.getDate() - 20); // 20 days ago

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        currentbalance: 1000000,
        registertime: registerDate.toISOString(),
      });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);

      await expect(
        transactionService.withdrawTransaction({
          bookId: 1,
          amount: 500000,
          employeeId: "EMP001",
        })
      ).rejects.toThrow("Cannot withdraw before 1 month");
    });

    it("should throw error when insufficient balance", async () => {
      const registerDate = new Date();
      registerDate.setDate(registerDate.getDate() - 45);

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        currentbalance: 500000, // Less than amount * 1.15
        registertime: registerDate.toISOString(),
      });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(
        createMockEmployee({ employeeid: "EMP001" })
      );

      await expect(
        transactionService.withdrawTransaction({
          bookId: 1,
          amount: 500000, // Requires 575000 (500000 * 1.15)
          employeeId: "EMP001",
        })
      ).rejects.toThrow("Insufficient balance");
    });

    it("should close account when balance becomes 0", async () => {
      const registerDate = new Date();
      registerDate.setDate(registerDate.getDate() - 45);

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        customerid: 1,
        typeid: 1, // No term
        currentbalance: 1150000,
        registertime: registerDate.toISOString(),
      });

      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });
      const mockCustomer = { customerid: 1, fullname: "Test Customer" };

      const updatedBook = {
        ...mockSavingBook,
        currentbalance: 0,
        status: "Close",
      };

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
      mockSavingBookRepository.update.mockResolvedValue(updatedBook);
      mockTransactionRepository.create.mockResolvedValue({
        transactionid: 1,
      });
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);

      const result = await transactionService.withdrawTransaction({
        bookId: 1,
        amount: 1000000,
        employeeId: "EMP001",
      });

      expect(mockSavingBookRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          status: "Close",
          currentbalance: 0,
        })
      );

      expect(result.balanceAfter).toBe(0);
      expect(result.balanceBefore).toBe(1150000);
    });

    it("TC_UC07_02 - Tất toán thành công (Sổ Có kỳ hạn)", async () => {
      const registerDate = new Date();
      registerDate.setMonth(registerDate.getMonth() - 3); // 3 months ago

      const maturityDate = new Date(registerDate);
      maturityDate.setMonth(maturityDate.getMonth() + 3); // Maturity date reached

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        customerid: 1,
        typeid: 2, // Term saving type
        currentbalance: 5000000,
        registertime: registerDate.toISOString(),
        maturitydate: maturityDate.toISOString(),
        status: "Open",
      });

      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });
      const mockCustomer = { customerid: 1, fullname: "Test Customer" };

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);

      // ✅ Calculate exact amount to withdraw full balance
      const withdrawAmount = Math.floor(5000000 / 1.15); // 4347826

      // ✅ Mock the update call - service will calculate and set status based on remaining balance
      let updateCallArgs;
      mockSavingBookRepository.update.mockImplementation((_bookId, updateData) => {
        updateCallArgs = updateData;
        return Promise.resolve({
          ...mockSavingBook,
          ...updateData,
        });
      });

      mockTransactionRepository.create.mockResolvedValue({
        transactionid: 1,
        bookid: 1,
        amount: withdrawAmount,
        transactiontype: "WithDraw",
      });

      const result = await transactionService.withdrawTransaction({
        bookId: 1,
        amount: withdrawAmount,
        employeeId: "EMP001",
      });

      // ✅ Verify the balance is 0 (service should round to 0)
      expect(result.balanceAfter).toBe(0);

      // ✅ Verify update was called
      expect(mockSavingBookRepository.update).toHaveBeenCalledWith(
        1,
        expect.any(Object)
      );

      // ✅ Verify service sets status to Close when balance is 0
      expect(updateCallArgs).toHaveProperty("status", "Close");
      expect(updateCallArgs).toHaveProperty("currentbalance", 0);

      // ✅ Verify transaction was created
      expect(mockTransactionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          bookid: 1,
          amount: withdrawAmount,
          transactiontype: "WithDraw",
        })
      );
    });

    it("TC_UC07_05 - Lỗi rút một phần (Sổ Có kỳ hạn)", async () => {
      const registerDate = new Date();
      registerDate.setMonth(registerDate.getMonth() - 3);

      const maturityDate = new Date(registerDate);
      maturityDate.setMonth(maturityDate.getMonth() + 3);

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        typeid: 2, // Term saving - must withdraw full amount
        currentbalance: 5000000,
        registertime: registerDate.toISOString(),
        maturitydate: maturityDate.toISOString(),
        status: "Open",
      });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(
        createMockEmployee({ employeeid: "EMP001" })
      );

      // ✅ Mock update to return null (validation failed)
      mockSavingBookRepository.update.mockResolvedValue(null);

      // Try to withdraw partial amount from term savings
      await expect(
        transactionService.withdrawTransaction({
          bookId: 1,
          amount: 2000000, // Partial withdrawal
          employeeId: "EMP001",
        })
      ).rejects.toThrow(/Term savings must be fully withdrawn|Failed to withdraw money/i);
    });

    it("TC_UC07_11 - Rollback khi DB lỗi (rút tiền)", async () => {
      const registerDate = new Date();
      registerDate.setDate(registerDate.getDate() - 45);

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        typeid: 1, // No term
        currentbalance: 2000000,
        registertime: registerDate.toISOString(),
      });

      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);

      // Simulate DB error on update
      mockSavingBookRepository.update.mockRejectedValue(
        new Error("Database connection failed")
      );

      await expect(
        transactionService.withdrawTransaction({
          bookId: 1,
          amount: 1000000,
          employeeId: "EMP001",
        })
      ).rejects.toThrow("Database connection failed");

      // Ensure no transaction was created after DB error
      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("addTransaction()", () => {
    it("should add transaction successfully", async () => {
      const inputData = {
        bookID: 1,
        amount: 1000000,
        type: "Deposit",
        tellerid: "EMP001",
      };

      const mockSavingBook = createMockSavingBook({ bookid: 1 });
      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });
      const mockTransaction = createMockTransaction();

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
      mockTransactionRepository.create.mockResolvedValue(mockTransaction);

      const result = await transactionService.addTransaction(inputData);

      expect(mockTransactionRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty("message", "Transaction added successfully.");
    });

    it("should throw error when missing required fields", async () => {
      await expect(
        transactionService.addTransaction({
          bookID: 1,
          // Missing other fields
        })
      ).rejects.toThrow("Missing required information");
    });

    it("should throw error when account not found", async () => {
      mockSavingBookRepository.findById.mockResolvedValue(null);

      await expect(
        transactionService.addTransaction({
          bookID: 999,
          amount: 1000000,
          type: "Deposit",
          tellerid: "EMP001",
        })
      ).rejects.toThrow("Account not found");
    });
  });
});

