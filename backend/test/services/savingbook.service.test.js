const {
  mockCustomerRepository,
  mockSavingBookRepository,
  mockTypeSavingRepository,
  mockTransactionRepository,
  resetAllMocks
} = require("./__mocks__/serviceDependencies.js");

jest.mock("../../src/repositories/Customer/CustomerRepository.js", () => ({
  customerRepository: mockCustomerRepository
}));
jest.mock("../../src/repositories/SavingBook/SavingBookRepository.js", () => ({
  savingBookRepository: mockSavingBookRepository
}));
jest.mock("../../src/repositories/TypeSaving/TypeSavingRepository.js", () => ({
  typeSavingRepository: mockTypeSavingRepository
}));
jest.mock("../../src/repositories/Transaction/TransactionRepository.js", () => ({
  transactionRepository: mockTransactionRepository
}));

const { savingBookService } = require("../../src/services/SavingBook/savingbook.service.js");

describe("SavingBookService", () => {
  const baseCustomer = { customerid: 7, name: "Jane" };
  const baseType = { typename: "6M", term: 6, termperiod: 6, interest: 5, minimumdeposit: 1000 };

  beforeEach(() => {
    resetAllMocks();
  });

  it("adds saving book", async () => {
    mockCustomerRepository.findByCitizenID.mockResolvedValue(baseCustomer);
    mockTypeSavingRepository.getTypeSavingById.mockResolvedValue(baseType);
    mockSavingBookRepository.create.mockResolvedValue({
      bookid: 11,
      opendate: "2025-01-01",
      maturitydate: "2025-07-01",
      status: "Open"
    });

    const payload = {
      typeSavingID: 1,
      initialDeposit: 5000,
      employeeID: 3,
      citizenID: "0123456789"
    };

    const result = await savingBookService.addSavingBook(payload);

    expect(mockSavingBookRepository.create).toHaveBeenCalledWith({
      typeid: 1,
      customerid: 7,
      currentbalance: 5000
    });
    expect(result.bookid).toBe(11);
  });

  it("validates required fields", async () => {
    await expect(savingBookService.addSavingBook({})).rejects.toThrow("Missing required information.");
  });

  it("updates saving book", async () => {
    mockSavingBookRepository.findById.mockResolvedValue({ bookid: 5 });
    mockSavingBookRepository.update.mockResolvedValue({ bookid: 5, status: "Close" });

    const res = await savingBookService.updateSavingBook(5, {
      status: "Close",
      closeTime: "now",
      currentBalance: 0
    });

    expect(mockSavingBookRepository.update).toHaveBeenCalledWith(5, {
      status: "Close",
      closetime: "now",
      currentbalance: 0
    });
    expect(res.savingBook.status).toBe("Close");
  });

  it("throws when updating missing saving book", async () => {
    mockSavingBookRepository.findById.mockResolvedValue(null);
    await expect(
      savingBookService.updateSavingBook(10, { status: "Close", closeTime: "now", currentBalance: 0 })
    ).rejects.toThrow("Saving book not found");
  });

  it("searches saving books and validates keywords", async () => {
    await expect(savingBookService.searchSavingBook("abc123")).rejects.toThrow(
      "Keyword is only contain number or letter"
    );

    mockSavingBookRepository.findByBookID.mockResolvedValue([{ id: 1 }]);
    const byBookId = await savingBookService.searchSavingBook("123");
    expect(byBookId).toEqual([{ id: 1 }]);

    mockSavingBookRepository.findByCustomerCitizenID.mockResolvedValue([{ id: 2 }]);
    const byCitizen = await savingBookService.searchSavingBook("0123");
    expect(byCitizen).toEqual([{ id: 2 }]);
  });

  it("closes saving book and returns settlement info", async () => {
    const now = new Date();
    const opened = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

    mockSavingBookRepository.findById
      .mockResolvedValueOnce({
        bookid: 5,
        status: "Open",
        registertime: opened.toISOString(),
        currentbalance: 1000,
        typeid: 2,
        customerid: 9
      });
    mockTypeSavingRepository.findById.mockResolvedValue({
      typeid: 2,
      interest: 6
    });
    mockCustomerRepository.findById.mockResolvedValue({ citizenid: "0123", fullname: "Jane" });
    mockSavingBookRepository.update.mockResolvedValue({});
    mockTransactionRepository.create.mockResolvedValue({});

    const result = await savingBookService.closeSavingBook(5, 1);

    expect(mockTransactionRepository.create).toHaveBeenCalled();
    expect(result.status).toBe("closed");
  });

  it("throws when type saving missing", async () => {
    mockCustomerRepository.findByCitizenID.mockResolvedValue(baseCustomer);
    mockTypeSavingRepository.getTypeSavingById.mockResolvedValue(null);
    await expect(
      savingBookService.addSavingBook({
        typeSavingID: 1,
        initialDeposit: 100,
        employeeID: 2,
        citizenID: "1"
      })
    ).rejects.toThrow("TypeSaving not found: 1");
  });

  it("gets saving book by id with related entities", async () => {
    mockSavingBookRepository.findById.mockResolvedValue({
      bookid: 99,
      customerid: 7,
      typeid: 4,
      registertime: "2025-01-01",
      maturitydate: "2025-02-01",
      currentbalance: 500,
      status: "Open"
    });
    mockCustomerRepository.findById.mockResolvedValue({ citizenid: "0123", fullname: "Jane" });
    mockTypeSavingRepository.findById.mockResolvedValue({
      typeid: 4,
      typename: "Flex",
      termperiod: 3,
      interest: 5,
      minimumdeposit: 100
    });
    mockTransactionRepository.findById.mockResolvedValue(null);

    const data = await savingBookService.getSavingBookById(99);

    expect(data.transactions).toEqual([]);
    expect(data.typesaving.typename).toBe("Flex");
  });

  it("throws when saving book or relations missing", async () => {
    mockSavingBookRepository.findById.mockResolvedValue(null);
    await expect(savingBookService.getSavingBookById(1)).rejects.toThrow("Saving book not found");

    mockSavingBookRepository.findById.mockResolvedValue({ customerid: 1, typeid: 2 });
    mockCustomerRepository.findById.mockResolvedValue(null);
    await expect(savingBookService.getSavingBookById(1)).rejects.toThrow("Customer not found");

    mockCustomerRepository.findById.mockResolvedValue({ citizenid: "1" });
    mockTypeSavingRepository.findById.mockResolvedValue(null);
    await expect(savingBookService.getSavingBookById(1)).rejects.toThrow("TypeSaving not found");
  });

  it("deletes saving book and handles missing case", async () => {
    mockSavingBookRepository.findById.mockResolvedValue({ bookid: 1 });
    await savingBookService.deleteSavingBook(1);
    expect(mockSavingBookRepository.delete).toHaveBeenCalledWith(1);

    mockSavingBookRepository.findById.mockResolvedValue(null);
    await expect(savingBookService.deleteSavingBook(2)).rejects.toThrow("Saving book not found");
  });

  it("returns [] when keyword empty or repository returns null", async () => {
    await expect(savingBookService.searchSavingBook("   ")).resolves.toEqual([]);

    mockSavingBookRepository.findByCustomerName.mockResolvedValue(null);
    const results = await savingBookService.searchSavingBook("Alice");
    expect(results).toEqual([]);
  });

  it("closeSavingBook handles already closed book", async () => {
    mockSavingBookRepository.findById.mockResolvedValue({ status: "Close" });
    const result = await savingBookService.closeSavingBook(1, 1);
    expect(result).toBeNull();
  });

  it("closeSavingBook throws when type or customer missing", async () => {
    mockSavingBookRepository.findById.mockResolvedValue({
      bookid: 1,
      status: "Open",
      typeid: 9,
      customerid: 8,
      registertime: new Date().toISOString(),
      currentbalance: 100
    });
    mockTypeSavingRepository.findById.mockResolvedValue(null);
    await expect(savingBookService.closeSavingBook(1, 1)).rejects.toThrow(
      "TypeSaving not found for this book"
    );

    mockTypeSavingRepository.findById.mockResolvedValue({ interest: 5 });
    mockCustomerRepository.findById.mockResolvedValue(null);
    await expect(savingBookService.closeSavingBook(1, 1)).rejects.toThrow(
      "Customer not found for this book"
    );
  });
});

