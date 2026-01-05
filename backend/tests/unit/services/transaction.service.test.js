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
      ).rejects.toThrow(
        /Cannot deposit to term savings book|Failed to deposit money/i
      );
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
      ).rejects.toThrow(
        /Deposit amount must be at least|Failed to deposit money/i
      );
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
      expect(result.balanceAfter).toBe(500000);
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

      // 1. should throw error when insufficient balance
      await expect(
        transactionService.withdrawTransaction({
          bookId: 1,
          amount: 500000,
          employeeId: "EMP001",
        })
      ).rejects.toThrow("Failed to withdraw money.");
    });

    it("should close account when balance becomes 0", async () => {
      const registerDate = new Date();
      registerDate.setDate(registerDate.getDate() - 45);

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        customerid: 1,
        typeid: 1, // No term
        currentbalance: 1000000,
        registertime: registerDate.toISOString(),
      });

      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });
      const mockCustomer = { customerid: 1, fullname: "Test Customer" };

      // Rút đúng bằng số dư
      const updatedBook = {
        ...mockSavingBook,
        currentbalance: 0,
        status: "Close",
      };
      mockSavingBookRepository.update.mockResolvedValue(updatedBook);

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
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
      expect(result.balanceBefore).toBe(1000000);
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

      // Rút toàn bộ số dư
      const withdrawAmount = 5000000;

      let updateCallArgs;
      mockSavingBookRepository.update.mockImplementation(
        (_bookId, updateData) => {
          updateCallArgs = updateData;
          return Promise.resolve({
            ...mockSavingBook,
            ...updateData,
          });
        }
      );

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

      expect(result.balanceAfter).toBe(0);

      expect(mockSavingBookRepository.update).toHaveBeenCalledWith(
        1,
        expect.any(Object)
      );

      expect(updateCallArgs).toHaveProperty("status", "Close");
      expect(updateCallArgs).toHaveProperty("currentbalance", 0);

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
      ).rejects.toThrow(
        /Term savings must be fully withdrawn|Failed to withdraw money/i
      );
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
      expect(result).toHaveProperty(
        "message",
        "Transaction added successfully."
      );
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

    it("should throw error when teller not found", async () => {
      const mockSavingBook = createMockSavingBook({ bookid: 1 });
      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(null);

      await expect(
        transactionService.addTransaction({
          bookID: 1,
          amount: 1000000,
          type: "Deposit",
          tellerid: "EMP999",
        })
      ).rejects.toThrow("Teller ID is not exists");
    });

    it("should create transaction with transactionDate when provided", async () => {
      const inputData = {
        bookID: 1,
        amount: 1000000,
        type: "Deposit",
        tellerid: "EMP001",
        transactionDate: "2024-01-01",
      };

      const mockSavingBook = createMockSavingBook({ bookid: 1 });
      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });
      const mockTransaction = createMockTransaction();

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
      mockTransactionRepository.create.mockResolvedValue(mockTransaction);

      await transactionService.addTransaction(inputData);

      expect(mockTransactionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          transactiondate: "2024-01-01",
        })
      );
    });

    it("should create transaction without transactionDate when not provided", async () => {
      const inputData = {
        bookID: 1,
        amount: 1000000,
        type: "WithDraw",
        tellerid: "EMP001",
      };

      const mockSavingBook = createMockSavingBook({ bookid: 1 });
      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });
      const mockTransaction = createMockTransaction();

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
      mockTransactionRepository.create.mockResolvedValue(mockTransaction);

      await transactionService.addTransaction(inputData);

      expect(mockTransactionRepository.create).toHaveBeenCalledWith(
        expect.not.objectContaining({
          transactiondate: expect.anything(),
        })
      );
    });
  });

  describe("getAllTransactions()", () => {
    it("should return all transactions with nested data", async () => {
      const mockTransactions = [
        {
          transactionid: 1,
          bookid: 1,
          transactiontype: "Deposit",
          amount: 1000000,
          transactiondate: "2024-01-01",
          savingbook: {
            bookid: 1,
            customer: {
              customerid: "CUST001",
              fullname: "John Doe",
              citizenid: "123456789",
            },
            typesaving: {
              typename: "Term 6 months",
              interest: 5.5,
            },
          },
          employee: {
            employeeid: "EMP001",
            fullname: "Jane Smith",
          },
        },
      ];

      mockTransactionRepository.findAll.mockResolvedValue(mockTransactions);

      const result = await transactionService.getAllTransactions();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("transactionId", 1);
      expect(result[0].savingBook.customer).toHaveProperty(
        "fullName",
        "John Doe"
      );
      expect(result[0].employee).toHaveProperty("role", "teller");
    });

    it("should handle transactions without nested data", async () => {
      const mockTransactions = [
        {
          transactionid: 1,
          bookid: 1,
          transactiontype: "Deposit",
          amount: 1000000,
          transactiondate: "2024-01-01",
          savingbook: null,
          employee: null,
        },
      ];

      mockTransactionRepository.findAll.mockResolvedValue(mockTransactions);

      const result = await transactionService.getAllTransactions();

      expect(result[0].savingBook).toBeNull();
      expect(result[0].employee).toBeNull();
    });

    it("should handle null data from repository", async () => {
      mockTransactionRepository.findAll.mockResolvedValue(null);

      const result = await transactionService.getAllTransactions();

      expect(result).toEqual([]);
    });
  });

  describe("getTransactionById()", () => {
    it("should return transaction by id", async () => {
      const mockTransaction = createMockTransaction({ transactionid: 1 });
      mockTransactionRepository.findById.mockResolvedValue(mockTransaction);

      const result = await transactionService.getTransactionById(1);

      expect(mockTransactionRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTransaction);
    });

    it("should throw error when transaction not found", async () => {
      mockTransactionRepository.findById.mockResolvedValue(null);

      await expect(transactionService.getTransactionById(999)).rejects.toThrow(
        "Transaction not found"
      );
    });
  });

  describe("updateTransaction()", () => {
    it("should update transaction successfully", async () => {
      const mockTransaction = createMockTransaction({ transactionid: 1 });
      const mockUpdated = createMockTransaction({
        transactionid: 1,
        amount: 2000000,
      });

      mockTransactionRepository.findById.mockResolvedValue(mockTransaction);
      mockTransactionRepository.update.mockResolvedValue(mockUpdated);

      const result = await transactionService.updateTransaction(1, {
        amount: 2000000,
      });

      expect(result).toHaveProperty(
        "message",
        "Transaction updated successfully."
      );
      expect(result.transaction).toEqual(mockUpdated);
    });

    it("should throw error when transaction to update not found", async () => {
      mockTransactionRepository.findById.mockResolvedValue(null);

      await expect(
        transactionService.updateTransaction(999, { amount: 2000000 })
      ).rejects.toThrow("Transaction not found");
    });
  });

  describe("deleteTransaction()", () => {
    it("should delete transaction successfully", async () => {
      const mockTransaction = createMockTransaction({ transactionid: 1 });
      mockTransactionRepository.findById.mockResolvedValue(mockTransaction);
      mockTransactionRepository.delete.mockResolvedValue(true);

      const result = await transactionService.deleteTransaction(1);

      expect(mockTransactionRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toHaveProperty(
        "message",
        "Transaction deleted successfully."
      );
    });

    it("should throw error when transaction to delete not found", async () => {
      mockTransactionRepository.findById.mockResolvedValue(null);

      await expect(transactionService.deleteTransaction(999)).rejects.toThrow(
        "Transaction not found"
      );
    });
  });

  describe("depositTransaction() - Additional Coverage", () => {
    it("should throw error when deposit fails to update book", async () => {
      const inputData = {
        bookId: 1,
        amount: 1000000,
        employeeId: "EMP001",
      };

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        status: "Active",
        currentbalance: 0,
      });
      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
      mockSavingBookRepository.update.mockResolvedValue(null);

      await expect(
        transactionService.depositTransaction(inputData)
      ).rejects.toThrow("Failed to deposit money");
    });

    it("should throw error when transaction creation fails after deposit", async () => {
      const inputData = {
        bookId: 1,
        amount: 1000000,
        employeeId: "EMP001",
      };

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        status: "Active",
        currentbalance: 0,
        customerid: "CUST001",
      });
      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });
      const mockUpdatedBook = createMockSavingBook({
        bookid: 1,
        currentbalance: 1000000,
      });
      const mockCustomer = {
        customerid: "CUST001",
        fullname: "John Doe",
      };

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
      mockSavingBookRepository.update.mockResolvedValue(mockUpdatedBook);
      mockTransactionRepository.create.mockResolvedValue(null);
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);

      await expect(
        transactionService.depositTransaction(inputData)
      ).rejects.toThrow("Failed to make transaction but deposit successfully");
    });
  });

  describe("withdrawTransaction() - Additional Coverage", () => {
    it("should throw error when withdraw before 1 month", async () => {
      const inputData = {
        bookId: 1,
        amount: 100000,
        employeeId: "EMP001",
      };

      const registerDate = new Date();
      registerDate.setDate(registerDate.getDate() - 20); // 20 days ago

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        registertime: registerDate.toISOString(),
        currentbalance: 1000000,
      });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);

      await expect(
        transactionService.withdrawTransaction(inputData)
      ).rejects.toThrow("Cannot withdraw before 1 month to earn interest");
    });

    it("should throw error when withdraw fails to update book", async () => {
      const inputData = {
        bookId: 1,
        amount: 100000,
        employeeId: "EMP001",
      };

      const registerDate = new Date();
      registerDate.setDate(registerDate.getDate() - 60); // 60 days ago

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        registertime: registerDate.toISOString(),
        currentbalance: 1000000,
      });
      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
      mockSavingBookRepository.update.mockResolvedValue(null);

      await expect(
        transactionService.withdrawTransaction(inputData)
      ).rejects.toThrow("Failed to withdraw money.");
    });

    it("should throw error when transaction creation fails after withdrawal", async () => {
      const inputData = {
        bookId: 1,
        amount: 100000,
        employeeId: "EMP001",
      };

      const registerDate = new Date();
      registerDate.setDate(registerDate.getDate() - 60);

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        registertime: registerDate.toISOString(),
        currentbalance: 1000000,
        customerid: "CUST001",
      });
      const mockEmployee = createMockEmployee({ employeeid: "EMP001" });
      const mockUpdatedBook = createMockSavingBook({ bookid: 1 });
      const mockCustomer = {
        customerid: "CUST001",
        fullname: "John Doe",
      };

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
      mockSavingBookRepository.update.mockResolvedValue(mockUpdatedBook);
      mockTransactionRepository.create.mockResolvedValue(null);
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);

      await expect(
        transactionService.withdrawTransaction(inputData)
      ).rejects.toThrow("Failed to make transaction but withdrawal succeeded");
    });
  });
});
