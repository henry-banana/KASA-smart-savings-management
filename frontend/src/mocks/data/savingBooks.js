/**
 * Mock data for SavingBooks (Sổ tiết kiệm)
 * Structure matches API contract: bookId, accountCode, citizenId, customerName, accountTypeName, openDate, status, balance
 * Storage: includes typeSavingId and maturityDate for internal use only (not returned by search API)
 */

export const mockSavingBooks = [
  {
    bookId: "SB00123",
    citizenId: "079012345678",
    customerName: "Nguyễn Văn A",
    typeSavingId: "TS02",
    openDate: "2025-08-20",
    maturityDate: "2025-11-20",
    balance: 6000000,
    status: "open",
  },
  {
    bookId: "SB00124",
    citizenId: "079087654321",
    customerName: "Trần Thị B",
    typeSavingId: "TS03",
    openDate: "2025-05-15",
    maturityDate: "2025-11-15",
    balance: 10000000,
    status: "open",
  },
  {
    bookId: "SB00125",
    citizenId: "079011111111",
    customerName: "Lê Văn C",
    typeSavingId: "TS01",
    openDate: "2025-03-10",
    maturityDate: null,
    balance: 8000000,
    status: "open",
  },
  {
    bookId: "SB00126",
    citizenId: "079022222222",
    customerName: "Phạm Thị D",
    typeSavingId: "TS03",
    openDate: "2025-03-20",
    maturityDate: "2025-09-20",
    balance: 15000000,
    status: "open",
  },
  {
    bookId: "SB00127",
    citizenId: "079033333333",
    customerName: "Hoàng Văn E",
    typeSavingId: "TS01",
    openDate: "2025-02-10",
    maturityDate: null,
    balance: 3800000,
    status: "open",
  },
  {
    bookId: "SB00128",
    citizenId: "079044444444",
    customerName: "Nguyễn Thị F",
    typeSavingId: "TS02",
    openDate: "2024-09-01",
    maturityDate: "2024-12-01",
    balance: 0,
    status: "close",
  },
  {
    bookId: "SB00129",
    citizenId: "079055555555",
    customerName: "Vũ Văn G",
    typeSavingId: "TS04",
    openDate: "2024-11-15",
    maturityDate: "2025-11-15",
    balance: 20000000,
    status: "open",
  },
  {
    bookId: "SB00130",
    citizenId: "079066666666",
    customerName: "Đỗ Thị H",
    typeSavingId: "TS01",
    openDate: "2025-03-20",
    maturityDate: null,
    balance: 4500000,
    status: "open",
  },
  {
    bookId: "SB00131",
    citizenId: "079077777777",
    customerName: "Nguyễn Thị I",
    typeSavingId: "TS02",
    openDate: "2025-04-15",
    maturityDate: "2025-07-15",
    balance: 8500000,
    status: "open",
  },
  {
    bookId: "SB00132",
    citizenId: "079088888888",
    customerName: "Lê Văn J",
    typeSavingId: "TS02",
    openDate: "2025-05-20",
    maturityDate: "2025-08-20",
    balance: 12800000,
    status: "open",
  },
  {
    bookId: "SB00133",
    citizenId: "079099999999",
    customerName: "Phạm Văn K",
    typeSavingId: "TS03",
    openDate: "2025-06-10",
    maturityDate: "2025-12-10",
    balance: 26500000,
    status: "open",
  },
  {
    bookId: "SB00134",
    citizenId: "079010101010",
    customerName: "Trần Thị L",
    typeSavingId: "TS01",
    openDate: "2025-07-01",
    maturityDate: null,
    balance: 5200000,
    status: "open",
  },
  {
    bookId: "SB00135",
    citizenId: "079020202020",
    customerName: "Hoàng Văn M",
    typeSavingId: "TS01",
    openDate: "2025-08-05",
    maturityDate: null,
    balance: 6800000,
    status: "open",
  },
  {
    bookId: "SB00136",
    citizenId: "079030303030",
    customerName: "Vũ Thị N",
    typeSavingId: "TS03",
    openDate: "2025-09-12",
    maturityDate: "2026-03-12",
    balance: 19000000,
    status: "open",
  },
  {
    bookId: "SB00137",
    citizenId: "079040404040",
    customerName: "Đỗ Văn O",
    typeSavingId: "TS02",
    openDate: "2025-10-08",
    maturityDate: "2026-01-08",
    balance: 9800000,
    status: "open",
  },
  {
    bookId: "SB00138",
    citizenId: "079050505050",
    customerName: "Nguyễn Văn P",
    typeSavingId: "TS01",
    openDate: "2025-11-01",
    maturityDate: null,
    balance: 3100000,
    status: "open",
  },
  {
    bookId: "SB00139",
    citizenId: "079060606060",
    customerName: "Lê Thị Q",
    typeSavingId: "TS03",
    openDate: "2025-11-15",
    maturityDate: "2026-05-15",
    balance: 22500000,
    status: "open",
  },
  {
    bookId: "SB00140",
    citizenId: "079070707070",
    customerName: "Phạm Văn R",
    typeSavingId: "TS02",
    openDate: "2025-11-20",
    maturityDate: "2026-02-20",
    balance: 11200000,
    status: "open",
  },
  {
    bookId: "SB00141",
    citizenId: "079080808080",
    customerName: "Trần Văn S",
    typeSavingId: "TS01",
    openDate: "2025-10-25",
    maturityDate: null,
    balance: 7500000,
    status: "open",
  },
  {
    bookId: "SB00142",
    citizenId: "079090909090",
    customerName: "Hoàng Thị T",
    typeSavingId: "TS02",
    openDate: "2025-09-18",
    maturityDate: "2025-12-18",
    balance: 14000000,
    status: "open",
  },
  {
    bookId: "SB00143",
    citizenId: "079011112222",
    customerName: "Vũ Văn U",
    typeSavingId: "TS03",
    openDate: "2024-08-10",
    maturityDate: "2025-02-10",
    balance: 0,
    status: "close",
  },
  {
    bookId: "SB00144",
    citizenId: "079022223333",
    customerName: "Đỗ Thị V",
    typeSavingId: "TS01",
    openDate: "2024-06-15",
    maturityDate: null,
    balance: 0,
    status: "close",
  },
  {
    bookId: "SB00145",
    citizenId: "079033334444",
    customerName: "Nguyễn Văn W",
    typeSavingId: "TS02",
    openDate: "2025-08-06",
    maturityDate: "2025-11-06",
    balance: 0,
    status: "close",
  },
  {
    bookId: "SB00146",
    citizenId: "079044445555",
    customerName: "Lê Văn X",
    typeSavingId: "TS01",
    openDate: "2025-10-08",
    maturityDate: null,
    balance: 0,
    status: "close",
  },
  {
    bookId: "SB00147",
    citizenId: "079055556666",
    customerName: "Phạm Thị Y",
    typeSavingId: "TS03",
    openDate: "2025-05-17",
    maturityDate: "2025-11-17",
    balance: 0,
    status: "close",
  },
  {
    bookId: "SB00148",
    citizenId: "079066667777",
    customerName: "Trần Văn Z",
    typeSavingId: "TS02",
    openDate: "2025-08-23",
    maturityDate: "2025-11-23",
    balance: 0,
    status: "close",
  },
  {
    bookId: "SB00149",
    citizenId: "079077778888",
    customerName: "Hoàng Văn AA",
    typeSavingId: "TS01",
    openDate: "2025-10-20",
    maturityDate: null,
    balance: 0,
    status: "close",
  },
  {
    bookId: "SB00150",
    citizenId: "079088889999",
    customerName: "Vũ Thị AB",
    typeSavingId: "TS03",
    openDate: "2025-10-25",
    maturityDate: "2026-04-25",
    balance: 15000000,
    status: "open",
  },
  {
    bookId: "SB00151",
    citizenId: "079099990000",
    customerName: "Đỗ Văn AC",
    typeSavingId: "TS01",
    openDate: "2025-10-28",
    maturityDate: null,
    balance: 6200000,
    status: "open",
  },
  {
    bookId: "SB00152",
    citizenId: "079010203040",
    customerName: "Nguyễn Thị AD",
    typeSavingId: "TS02",
    openDate: "2025-11-02",
    maturityDate: "2026-02-02",
    balance: 9000000,
    status: "open",
  },
  {
    bookId: "SB00153",
    citizenId: "079020304050",
    customerName: "Lê Văn AE",
    typeSavingId: "TS01",
    openDate: "2025-11-05",
    maturityDate: null,
    balance: 4600000,
    status: "open",
  },
  {
    bookId: "SB00154",
    citizenId: "079030405060",
    customerName: "Phạm Văn AF",
    typeSavingId: "TS03",
    openDate: "2025-11-08",
    maturityDate: "2026-05-08",
    balance: 14000000,
    status: "open",
  },
  {
    bookId: "SB00155",
    citizenId: "079040506070",
    customerName: "Trần Thị AG",
    typeSavingId: "TS02",
    openDate: "2025-11-10",
    maturityDate: "2026-02-10",
    balance: 11000000,
    status: "open",
  },
  {
    bookId: "SB00156",
    citizenId: "079050607080",
    customerName: "Hoàng Văn AH",
    typeSavingId: "TS01",
    openDate: "2025-11-12",
    maturityDate: null,
    balance: 5700000,
    status: "open",
  },
  {
    bookId: "SB00157",
    citizenId: "079060708090",
    customerName: "Vũ Văn AI",
    typeSavingId: "TS03",
    openDate: "2025-11-15",
    maturityDate: "2026-05-15",
    balance: 18000000,
    status: "open",
  },
  {
    bookId: "SB00158",
    citizenId: "079070809000",
    customerName: "Đỗ Thị AJ",
    typeSavingId: "TS01",
    openDate: "2025-11-02",
    maturityDate: null,
    balance: 5000000,
    status: "open",
  },
  {
    bookId: "SB00159",
    citizenId: "079080900010",
    customerName: "Nguyễn Văn AK",
    typeSavingId: "TS03",
    openDate: "2025-11-05",
    maturityDate: "2026-05-05",
    balance: 15000000,
    status: "open",
  },
  {
    bookId: "SB00160",
    citizenId: "079090001020",
    customerName: "Lê Thị AL",
    typeSavingId: "TS02",
    openDate: "2025-11-08",
    maturityDate: "2026-02-08",
    balance: 8000000,
    status: "open",
  },
  {
    bookId: "SB00161",
    citizenId: "079000102030",
    customerName: "Phạm Văn AM",
    typeSavingId: "TS01",
    openDate: "2025-11-12",
    maturityDate: null,
    balance: 3500000,
    status: "open",
  },
  {
    bookId: "SB00162",
    citizenId: "079001020304",
    customerName: "Trần Văn AN",
    typeSavingId: "TS03",
    openDate: "2025-11-16",
    maturityDate: "2026-05-16",
    balance: 20000000,
    status: "open",
  },
  {
    bookId: "SB00163",
    citizenId: "079002030405",
    customerName: "Hoàng Thị AO",
    typeSavingId: "TS02",
    openDate: "2025-11-19",
    maturityDate: "2026-02-19",
    balance: 12000000,
    status: "open",
  },
  {
    bookId: "SB00164",
    citizenId: "079003040506",
    customerName: "Vũ Văn AP",
    typeSavingId: "TS01",
    openDate: "2025-11-25",
    maturityDate: null,
    balance: 4500000,
    status: "open",
  },
  {
    bookId: "SB00165",
    citizenId: "079004050607",
    customerName: "Đỗ Văn AQ",
    typeSavingId: "TS03",
    openDate: "2025-11-28",
    maturityDate: "2026-05-28",
    balance: 18000000,
    status: "open",
  },
];

/**
 * Helper functions for savingbook data
 */
export const findSavingBookById = (bookId) => {
  return mockSavingBooks.find((sb) => sb.bookId === bookId);
};

export const findSavingBooksByCitizenId = (citizenId) => {
  return mockSavingBooks.filter((sb) => sb.citizenId === citizenId);
};

export const findSavingBooksByType = (typeSavingId) => {
  return mockSavingBooks.filter((sb) => sb.typeSavingId === typeSavingId);
};

export const findActiveSavingBooks = () => {
  return mockSavingBooks.filter((sb) => sb.status === "open");
};

export const addSavingBook = (savingBook) => {
  mockSavingBooks.push(savingBook);
  return savingBook;
};

export const updateSavingBook = (bookId, updates) => {
  const index = mockSavingBooks.findIndex((sb) => sb.bookId === bookId);
  if (index !== -1) {
    mockSavingBooks[index] = { ...mockSavingBooks[index], ...updates };
    return mockSavingBooks[index];
  }
  return null;
};

export const updateSavingBookBalance = (bookId, amount) => {
  const savingBook = findSavingBookById(bookId);
  if (savingBook) {
    const oldBalance = savingBook.balance;
    savingBook.balance += amount;
    return {
      savingBook,
      balanceBefore: oldBalance,
      balanceAfter: savingBook.balance,
    };
  }
  return null;
};

export const closeSavingBook = (bookId) => {
  const savingBook = findSavingBookById(bookId);
  if (savingBook) {
    savingBook.status = "close";
    const finalBalance = savingBook.balance;
    savingBook.balance = 0;
    return {
      ...savingBook,
      finalBalance,
    };
  }
  return null;
};

export const deleteSavingBook = (bookId) => {
  const index = mockSavingBooks.findIndex((sb) => sb.bookId === bookId);
  if (index !== -1) {
    const deleted = mockSavingBooks.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

export default mockSavingBooks;
