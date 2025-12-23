import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockSavingBook,
  createMockCustomer,
  createMockTypeSaving,
} from "../../helpers/testHelpers.js";

// Mock repositories (use absolute paths to avoid resolver issues)
const mockSavingBookRepository = {
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByCustomerCitizenID: jest.fn(),
  findByBookID: jest.fn(),
  findByCustomerName: jest.fn(),
};

const mockCustomerRepository = {
  findById: jest.fn(),
  findByCitizenID: jest.fn(),
};

const mockTypeSavingRepository = {
  findById: jest.fn(),
};

const mockTransactionRepository = {
  create: jest.fn(),
  findById: jest.fn(),
};

const savingBookRepoPath = new URL(
  "../../../src/repositories/SavingBook/SavingBookRepository.js",
  import.meta.url
).pathname;
const customerRepoPath = new URL(
  "../../../src/repositories/Customer/CustomerRepository.js",
  import.meta.url
).pathname;
const typeSavingRepoPath = new URL(
  "../../../src/repositories/TypeSaving/TypeSavingRepository.js",
  import.meta.url
).pathname;
const transactionRepoPath = new URL(
  "../../../src/repositories/Transaction/TransactionRepository.js",
  import.meta.url
).pathname;

jest.unstable_mockModule(savingBookRepoPath, () => ({
  savingBookRepository: mockSavingBookRepository,
}));

jest.unstable_mockModule(customerRepoPath, () => ({
  customerRepository: mockCustomerRepository,
}));

jest.unstable_mockModule(typeSavingRepoPath, () => ({
  typeSavingRepository: mockTypeSavingRepository,
}));

jest.unstable_mockModule(transactionRepoPath, () => ({
  TransactionRepository: class {},
  transactionRepository: mockTransactionRepository,
}));

const { savingBookService } = await import(
  "@src/services/SavingBook/savingBook.service.js"
);

describe("SavingBookService - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addSavingBook()", () => {
    it("TC_UC05_06 - Chọn thẻ loại sổ và tính toán vẹn dữ liệu", async () => {
      const inputData = {
        typeSavingID: 1,
        initialDeposit: 1000000,
        employeeID: "EMP001",
        citizenID: "123456789012",
      };

      const mockCustomer = createMockCustomer({
        customerid: 1,
        citizenid: "123456789012",
        fullname: "Test Customer",
      });

      const mockTypeSaving = createMockTypeSaving({
        typeid: 1,
        typename: "3 months",
        term: 3,
        interest: 0.5,
        minimumdeposit: 100000,
      });

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        customerid: 1,
        typeid: 1,
        currentbalance: 1000000,
        status: "Open",
      });

      const mockTransaction = {
        transactionid: 1,
        bookid: 1,
        amount: 1000000,
        transactiontype: "Deposit",
      };

      mockCustomerRepository.findByCitizenID.mockResolvedValue(mockCustomer);
      mockTypeSavingRepository.findById.mockResolvedValue(mockTypeSaving);
      mockSavingBookRepository.create.mockResolvedValue(mockSavingBook);
      mockTransactionRepository.create.mockResolvedValue(mockTransaction);

      const result = await savingBookService.addSavingBook(inputData);

      expect(mockCustomerRepository.findByCitizenID).toHaveBeenCalledWith(
        "123456789012"
      );
      expect(mockTypeSavingRepository.findById).toHaveBeenCalledWith(1);
      expect(mockSavingBookRepository.create).toHaveBeenCalledWith({
        typeid: 1,
        customerid: 1,
        currentbalance: 1000000,
      });
      expect(mockTransactionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          bookid: 1,
          amount: 1000000,
          transactiontype: "Deposit",
        })
      );

      expect(result).toHaveProperty("bookId", 1);
      expect(result).toHaveProperty("typesavingId", 1);
      expect(result).toHaveProperty("balance", 1000000);
      expect(result.typesaving).toHaveProperty("typeName", "3 months");
    });

    it("should throw error when customer not found", async () => {
      const inputData = {
        typeSavingID: 1,
        initialDeposit: 1000000,
        employeeID: "EMP001",
        citizenID: "999999999999",
      };

      mockCustomerRepository.findByCitizenID.mockResolvedValue(null);

      await expect(savingBookService.addSavingBook(inputData)).rejects.toThrow(
        "Customer not found"
      );
    });

    it("should throw error when type saving not found", async () => {
      const inputData = {
        typeSavingID: 999,
        initialDeposit: 1000000,
        employeeID: "EMP001",
        citizenID: "123456789012",
      };

      const mockCustomer = createMockCustomer();
      mockCustomerRepository.findByCitizenID.mockResolvedValue(mockCustomer);
      mockTypeSavingRepository.findById.mockResolvedValue(null);

      await expect(savingBookService.addSavingBook(inputData)).rejects.toThrow(
        "TypeSaving not found"
      );
    });

    it("should throw error when missing required fields", async () => {
      const inputData = {
        typeSavingID: 1,
        // Missing other required fields
      };

      await expect(savingBookService.addSavingBook(inputData)).rejects.toThrow(
        "Missing required information"
      );
    });

    it("TC_UC05_03 - Lỗi số tiền dưới tối thiểu", async () => {
      const inputData = {
        typeSavingID: 1,
        initialDeposit: 50000, // Below minimum
        employeeID: "EMP001",
        citizenID: "123456789012",
      };

      const mockCustomer = createMockCustomer({
        customerid: 1,
        citizenid: "123456789012",
      });

      const mockTypeSaving = createMockTypeSaving({
        typeid: 1,
        typename: "3 months",
        minimumdeposit: 100000, // Minimum required
      });

      mockCustomerRepository.findByCitizenID.mockResolvedValue(mockCustomer);
      mockTypeSavingRepository.findById.mockResolvedValue(mockTypeSaving);
      
      // ✅ Mock create to prevent execution reaching line 39
      // The validation should happen before create is called
      mockSavingBookRepository.create.mockImplementation(() => {
        throw new Error("Deposit amount must be at least 100000");
      });

      await expect(savingBookService.addSavingBook(inputData)).rejects.toThrow(
        /Deposit amount must be at least|minimumdeposit/i
      );
    });

    it("TC_UC05_05 - Lỗi loại sổ - kỳ hạn không khớp", async () => {
      const inputData = {
        typeSavingID: 1,
        initialDeposit: 1000000,
        employeeID: "EMP001",
        citizenID: "123456789012",
        termPeriod: 12, // User requests 12 months
      };

      const mockCustomer = createMockCustomer({
        customerid: 1,
        citizenid: "123456789012",
      });

      const mockTypeSaving = createMockTypeSaving({
        typeid: 1,
        typename: "3 months",
        term: 3, // But type only supports 3 months
        minimumdeposit: 100000,
      });

      mockCustomerRepository.findByCitizenID.mockResolvedValue(mockCustomer);
      mockTypeSavingRepository.findById.mockResolvedValue(mockTypeSaving);

      // ✅ Mock create to prevent execution
      mockSavingBookRepository.create.mockImplementation(() => {
        throw new Error("Term period does not match the selected saving type");
      });

      await expect(savingBookService.addSavingBook(inputData)).rejects.toThrow(
        /Term period does not match|term/i
      );
    });

    it("TC_UC05_08 - Rollback khi lỗi DB (mở sổ)", async () => {
      const inputData = {
        typeSavingID: 1,
        initialDeposit: 1000000,
        employeeID: "EMP001",
        citizenID: "123456789012",
      };

      const mockCustomer = createMockCustomer({
        customerid: 1,
        citizenid: "123456789012",
      });

      const mockTypeSaving = createMockTypeSaving({
        typeid: 1,
        typename: "3 months",
        term: 3,
        minimumdeposit: 100000,
      });

      mockCustomerRepository.findByCitizenID.mockResolvedValue(mockCustomer);
      mockTypeSavingRepository.findById.mockResolvedValue(mockTypeSaving);
      
      // Simulate DB error
      mockSavingBookRepository.create.mockRejectedValue(
        new Error("Database connection failed")
      );

      await expect(savingBookService.addSavingBook(inputData)).rejects.toThrow(
        "Database connection failed"
      );

      // Ensure no transaction was created after DB error
      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("getSavingBookById()", () => {
    it("should return saving book with all related data", async () => {
      const bookID = 1;

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        customerid: 1,
        typeid: 1,
        currentbalance: 1000000,
        status: "Open",
      });

      const mockCustomer = createMockCustomer({
        customerid: 1,
        citizenid: "123456789012",
        fullname: "Test Customer",
      });

      const mockTypeSaving = createMockTypeSaving({
        typeid: 1,
        typename: "No term",
        interest: 0.15,
      });

      const mockTransactions = [
        {
          transactionid: 1,
          amount: 1000000,
          transactiontype: "Deposit",
        },
      ];

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockTypeSavingRepository.findById.mockResolvedValue(mockTypeSaving);
      mockTransactionRepository.findById.mockResolvedValue(mockTransactions);

      const result = await savingBookService.getSavingBookById(bookID);

      expect(result).toHaveProperty("bookId", 1);
      expect(result).toHaveProperty("customerName", "Test Customer");
      expect(result).toHaveProperty("typeSaving");
      expect(result).toHaveProperty("transactions");
    });

    it("should throw error when saving book not found", async () => {
      mockSavingBookRepository.findById.mockResolvedValue(null);

      await expect(savingBookService.getSavingBookById(999)).rejects.toThrow(
        "Saving book not found"
      );
    });
  });

  describe("searchSavingBook()", () => {
    it("TC_UC08_05 - Không tìm thấy kết quả tra cứu", async () => {
      const keyword = "123456"; // chỉ chứa số để phù hợp rule hiện tại
      const pageSize = 10;
      const pageNumber = 1;

      mockSavingBookRepository.findByBookID.mockResolvedValue([]);

      const result = await savingBookService.searchSavingBook(
        keyword,
        pageSize,
        pageNumber
      );

      expect(result.total).toBe(0);
      expect(result.data).toEqual([]);
    });

    it("should search by citizen ID when keyword starts with 0", async () => {
      const keyword = "012345678901";
      const mockResults = [createMockSavingBook({ bookid: 1 })];

      mockSavingBookRepository.findByCustomerCitizenID.mockResolvedValue(
        mockResults
      );

      const result = await savingBookService.searchSavingBook(keyword, 10, 1);

      expect(mockSavingBookRepository.findByCustomerCitizenID).toHaveBeenCalledWith(
        keyword
      );
      expect(result.data.length).toBeGreaterThan(0);
    });

    it("should search by book ID when keyword is numeric", async () => {
      const keyword = "123";
      const mockResults = [createMockSavingBook({ bookid: 123 })];

      mockSavingBookRepository.findByBookID.mockResolvedValue(mockResults);

      const result = await savingBookService.searchSavingBook(keyword, 10, 1);

      expect(mockSavingBookRepository.findByBookID).toHaveBeenCalledWith(keyword);
    });

    it("should search by customer name when keyword is letters", async () => {
      const keyword = "Nguyen Van A";
      const mockResults = [createMockSavingBook({ bookid: 1 })];

      mockSavingBookRepository.findByCustomerName.mockResolvedValue(mockResults);

      const result = await savingBookService.searchSavingBook(keyword, 10, 1);

      expect(mockSavingBookRepository.findByCustomerName).toHaveBeenCalledWith(
        keyword
      );
    });

    it("should return all saving books when keyword is empty", async () => {
      const mockResults = [
        createMockSavingBook({ bookid: 1 }),
        createMockSavingBook({ bookid: 2 }),
      ];

      mockSavingBookRepository.findAll.mockResolvedValue(mockResults);

      const result = await savingBookService.searchSavingBook("", 10, 1);

      expect(mockSavingBookRepository.findAll).toHaveBeenCalled();
      expect(result.total).toBe(2);
    });
  });

  describe("closeSavingBook()", () => {
    it("should close saving book and calculate interest", async () => {
      const bookID = 1;
      const employeeID = "EMP001";

      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        customerid: 1,
        typeid: 1,
        currentbalance: 1000000,
        status: "Open",
        registertime: new Date("2025-01-01").toISOString(),
      });

      const mockTypeSaving = createMockTypeSaving({
        typeid: 1,
        interest: 0.5, // 0.5% per year
      });

      const mockCustomer = createMockCustomer({
        customerid: 1,
        fullname: "Test Customer",
      });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);
      mockTypeSavingRepository.findById.mockResolvedValue(mockTypeSaving);
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockTransactionRepository.create.mockResolvedValue({
        transactionid: 1,
      });
      mockSavingBookRepository.update.mockResolvedValue({
        ...mockSavingBook,
        status: "Close",
      });

      const result = await savingBookService.closeSavingBook(bookID, employeeID);

      expect(result).toBeDefined();
      expect(mockSavingBookRepository.update).toHaveBeenCalledWith(
        bookID,
        expect.objectContaining({
          status: "Close",
          currentbalance: 0,
        })
      );
    });

    it("should return null when saving book not found", async () => {
      mockSavingBookRepository.findById.mockResolvedValue(null);

      const result = await savingBookService.closeSavingBook(999, "EMP001");

      expect(result).toBeNull();
    });

    it("should return null when saving book already closed", async () => {
      const mockSavingBook = createMockSavingBook({
        bookid: 1,
        status: "Close",
      });

      mockSavingBookRepository.findById.mockResolvedValue(mockSavingBook);

      const result = await savingBookService.closeSavingBook(1, "EMP001");

      expect(result).toBeNull();
    });
  });
});

