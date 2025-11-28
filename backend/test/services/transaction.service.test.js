const {
  mockSavingBookRepository,
  mockTransactionRepository,
  mockEmployeeRepository,
  resetAllMocks
} = require("./__mocks__/serviceDependencies.js");

jest.mock("../../src/repositories/SavingBook/SavingBookRepository.js", () => ({
  savingBookRepository: mockSavingBookRepository
}));
jest.mock("../../src/repositories/Transaction/TransactionRepository.js", () => ({
  transactionRepository: mockTransactionRepository
}));
jest.mock("../../src/repositories/Employee/EmployeeRepository.js", () => ({
  employeeRepository: mockEmployeeRepository
}));

const { transactionService } = require("../../src/services/Transaction/transaction.service.js");

describe("TransactionService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it("adds transaction when account and teller exist", async () => {
    mockSavingBookRepository.findById.mockResolvedValue({ bookid: 1 });
    mockTransactionRepository.create.mockResolvedValue({ transactionid: 99 });
    mockEmployeeRepository.findById.mockResolvedValue({ employeeid: 7 });

    const payload = {
      bookID: 1,
      amount: 500,
      type: "Deposit",
      tellerid: 7,
      note: "test"
    };

    const result = await transactionService.addTransaction(payload);

    expect(mockTransactionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ bookid: 1, amount: 500, transactiontype: "Deposit" })
    );
    expect(result.transaction.transactionid).toBe(99);
  });

  it("throws when account missing or teller invalid", async () => {
    mockSavingBookRepository.findById.mockResolvedValue(null);
    await expect(
      transactionService.addTransaction({ bookID: 1, amount: 1, type: "Deposit", tellerid: 2 })
    ).rejects.toThrow("Account not found.");

    mockSavingBookRepository.findById.mockResolvedValue({ bookid: 1 });
    mockTransactionRepository.create.mockResolvedValue({});
    mockEmployeeRepository.findById.mockResolvedValue(null);

    await expect(
      transactionService.addTransaction({ bookID: 1, amount: 1, type: "Deposit", tellerid: 2 })
    ).rejects.toThrow("Teller ID is not exists.");
  });

  it("maps getAllTransactions output", async () => {
    mockTransactionRepository.findAll.mockResolvedValue([
      {
        transactionid: 1,
        bookid: 2,
        transactiontype: "Deposit",
        amount: 100,
        transactiondate: "2025-01-01",
        savingbook: {
          bookid: 2,
          customer: { customerid: 3, fullname: "Jane", citizenid: "0123" },
          typesaving: { typename: "Flex", interest: 5 }
        },
        employee: { employeeid: 4, fullname: "Teller" }
      }
    ]);

    const result = await transactionService.getAllTransactions();

    expect(result[0]).toMatchObject({
      transactionId: 1,
      savingBook: {
        customer: {
          fullName: "Jane"
        }
      }
    });
  });

  it("handles deposit and withdraw flows", async () => {
    mockSavingBookRepository.findById.mockResolvedValue({ bookid: 1, currentbalance: 1000 });
    mockEmployeeRepository.findById.mockResolvedValue({ employeeid: 2 });
    mockSavingBookRepository.update.mockResolvedValue({ currentbalance: 1500 });
    mockTransactionRepository.create.mockResolvedValue({ transactionid: 1 });

    const depositResult = await transactionService.depositTransaction({
      bookID: 1,
      amount: 500,
      employeeID: 2
    });

    expect(depositResult.currentbalance).toBe(1500);

    mockSavingBookRepository.findById.mockResolvedValue({ bookid: 1, currentbalance: 200 });
    await expect(
      transactionService.withdrawTransaction({ bookID: 1, amount: 500, employeeID: 2 })
    ).rejects.toThrow("Insufficient balance.");
  });

  it("validates addTransaction params and teller existence", async () => {
    await expect(
      transactionService.addTransaction({ amount: 1, type: "Deposit", tellerid: 1 })
    ).rejects.toThrow("Missing required information.");

    mockSavingBookRepository.findById.mockResolvedValue({ bookid: 1 });
    mockTransactionRepository.create.mockResolvedValue({});
    mockEmployeeRepository.findById.mockResolvedValue(null);

    await expect(
      transactionService.addTransaction({
        bookID: 1,
        amount: 1,
        type: "Deposit",
        tellerid: 2,
        transactionDate: "2025-01-01"
      })
    ).rejects.toThrow("Teller ID is not exists.");

    mockEmployeeRepository.findById.mockResolvedValue({ employeeid: 2 });
    await transactionService.addTransaction({
      bookID: 1,
      amount: 1,
      type: "Deposit",
      tellerid: 2,
      transactionDate: "2025-01-01",
      note: "backdated"
    });
    expect(mockTransactionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ transactiondate: "2025-01-01" })
    );
  });

  it("returns empty array when no transactions", async () => {
    mockTransactionRepository.findAll.mockResolvedValue(null);
    const list = await transactionService.getAllTransactions();
    expect(list).toEqual([]);
  });

  it("maps transactions when nested data missing", async () => {
    mockTransactionRepository.findAll.mockResolvedValue([
      { transactionid: 2, bookid: 3, transactiontype: "WithDraw", amount: 10, transactiondate: "2025-01-02" }
    ]);

    const result = await transactionService.getAllTransactions();
    expect(result[0]).toMatchObject({
      savingBook: null,
      employee: null
    });
  });

  it("handles missing nested customer/typeSaving while saving book exists", async () => {
    mockTransactionRepository.findAll.mockResolvedValue([
      {
        transactionid: 5,
        bookid: 6,
        transactiontype: "Deposit",
        amount: 70,
        transactiondate: "2025-01-03",
        savingbook: { bookid: 6, customer: null, typesaving: null },
        employee: { employeeid: 2, fullname: "Teller" }
      }
    ]);

    const result = await transactionService.getAllTransactions();
    expect(result[0].savingBook.customer).toBeNull();
    expect(result[0].savingBook.typeSaving).toBeNull();
  });

  it("gets transaction by id and handles missing", async () => {
    mockTransactionRepository.findById.mockResolvedValue({ id: 1 });
    expect(await transactionService.getTransactionById(1)).toEqual({ id: 1 });
    mockTransactionRepository.findById.mockResolvedValue(null);
    await expect(transactionService.getTransactionById(2)).rejects.toThrow("Transaction not found.");
  });

  it("updates and deletes transaction with validations", async () => {
    mockTransactionRepository.findById.mockResolvedValue({ id: 1 });
    mockTransactionRepository.update.mockResolvedValue({ id: 1, amount: 50 });
    await transactionService.updateTransaction(1, { amount: 50 });
    expect(mockTransactionRepository.update).toHaveBeenCalled();

    mockTransactionRepository.findById.mockResolvedValue(null);
    await expect(transactionService.updateTransaction(2, { amount: 10 })).rejects.toThrow(
      "Transaction not found."
    );

    mockTransactionRepository.findById.mockResolvedValue({ id: 3 });
    await transactionService.deleteTransaction(3);
    expect(mockTransactionRepository.delete).toHaveBeenCalledWith(3);

    mockTransactionRepository.findById.mockResolvedValue(null);
    await expect(transactionService.deleteTransaction(4)).rejects.toThrow("Transaction not found.");
  });

  it("validates depositTransaction failure scenarios", async () => {
    mockSavingBookRepository.findById.mockResolvedValue(null);
    await expect(
      transactionService.depositTransaction({ bookID: 1, amount: 10, employeeID: 1 })
    ).rejects.toThrow("Account not found.");

    mockSavingBookRepository.findById.mockResolvedValue({ currentbalance: 100 });
    await expect(
      transactionService.depositTransaction({ bookID: 1, amount: 0, employeeID: 1 })
    ).rejects.toThrow("Invalid amount.");

    mockEmployeeRepository.findById.mockResolvedValue(null);
    await expect(
      transactionService.depositTransaction({ bookID: 1, amount: 10, employeeID: 1 })
    ).rejects.toThrow("Teller ID is not exists.");

    mockEmployeeRepository.findById.mockResolvedValue({ employeeid: 1 });
    mockSavingBookRepository.update.mockResolvedValue(null);
    await expect(
      transactionService.depositTransaction({ bookID: 1, amount: 10, employeeID: 1 })
    ).rejects.toThrow("Failed to deposit money.");

    mockSavingBookRepository.update.mockResolvedValue({ currentbalance: 110 });
    mockTransactionRepository.create.mockResolvedValue(null);
    await expect(
      transactionService.depositTransaction({ bookID: 1, amount: 10, employeeID: 1 })
    ).rejects.toThrow("Failed to make transaction but deposit successfully.");
  });

  it("validates withdrawTransaction failure scenarios", async () => {
    mockSavingBookRepository.findById.mockResolvedValue(null);
    await expect(
      transactionService.withdrawTransaction({ bookID: 1, amount: 10, employeeID: 1 })
    ).rejects.toThrow("Account not found.");

    mockSavingBookRepository.findById.mockResolvedValue({ currentbalance: 100 });
    await expect(
      transactionService.withdrawTransaction({ bookID: 1, amount: 0, employeeID: 1 })
    ).rejects.toThrow("Invalid amount.");

    mockEmployeeRepository.findById.mockResolvedValue(null);
    await expect(
      transactionService.withdrawTransaction({ bookID: 1, amount: 10, employeeID: 1 })
    ).rejects.toThrow("Teller ID is not exists.");

    mockEmployeeRepository.findById.mockResolvedValue({ employeeid: 1 });
    mockSavingBookRepository.findById.mockResolvedValue({ currentbalance: 50 });
    await expect(
      transactionService.withdrawTransaction({ bookID: 1, amount: 100, employeeID: 1 })
    ).rejects.toThrow("Insufficient balance.");

    mockSavingBookRepository.findById.mockResolvedValue({ currentbalance: 100 });
    mockSavingBookRepository.update.mockResolvedValue(null);
    mockTransactionRepository.create.mockResolvedValue({});
    await expect(
      transactionService.withdrawTransaction({ bookID: 1, amount: 10, employeeID: 1 })
    ).rejects.toThrow("Failed to withdraw money.");

    mockSavingBookRepository.update.mockResolvedValue({});
    mockTransactionRepository.create.mockResolvedValue(null);
    await expect(
      transactionService.withdrawTransaction({ bookID: 1, amount: 10, employeeID: 1 })
    ).rejects.toThrow("Failed to make transaction but withdrawal succeeded.");
  });

  it("completes withdrawTransaction successfully", async () => {
    mockSavingBookRepository.findById.mockResolvedValue({ currentbalance: 200 });
    mockEmployeeRepository.findById.mockResolvedValue({ employeeid: 1 });
    mockSavingBookRepository.update.mockResolvedValue({ currentbalance: 150 });
    mockTransactionRepository.create.mockResolvedValue({ transactionid: 1 });

    const result = await transactionService.withdrawTransaction({
      bookID: 1,
      amount: 50,
      employeeID: 1
    });

    expect(result.currentbalance).toBe(150);
  });
});

