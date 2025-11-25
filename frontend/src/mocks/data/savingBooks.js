/**
 * Mock data for SavingBooks (Sổ tiết kiệm)
 * Based on database schema: savingbook table
 * Updated to match Backend DB schema exactly
 */

export const mockSavingBooks = [
  {
    bookid: "SB00123",
    customerid: "CUST001",
    typeid: "TS002",
    registertime: "2025-08-20",
    maturitydate: "2025-11-20",
    initialdeposit: 5000000,
    currentbalance: 6000000,
    interestrate: 0.045,
    status: "active"
  },
  {
    bookid: "SB00124",
    customerid: "CUST002",
    typeid: "TS003",
    registertime: "2025-05-15",
    maturitydate: "2025-11-15",
    initialdeposit: 10000000,
    currentbalance: 10000000,
    interestrate: 0.055,
    status: "active"
  },
  {
    bookid: "SB00125",
    customerid: "CUST003",
    typeid: "TS001",
    registertime: "2025-03-10",
    maturitydate: null,
    initialdeposit: 7500000,
    currentbalance: 8000000,
    interestrate: 0.02,
    status: "active"
  },
  {
    bookid: "SB00126",
    customerid: "CUST004",
    typeid: "TS003",
    registertime: "2025-03-20",
    maturitydate: "2025-09-20",
    initialdeposit: 15000000,
    currentbalance: 15000000,
    interestrate: 0.055,
    status: "active"
  },
  {
    bookid: "SB00127",
    customerid: "CUST005",
    typeid: "TS001",
    registertime: "2025-02-10",
    maturitydate: null,
    initialdeposit: 3500000,
    currentbalance: 3800000,
    interestrate: 0.02,
    status: "active"
  },
  {
    bookid: "SB00128",
    customerid: "CUST006",
    typeid: "TS002",
    registertime: "2024-09-01",
    maturitydate: "2024-12-01",
    initialdeposit: 7500000,
    currentbalance: 0,
    interestrate: 0.045,
    status: "closed"
  },
  {
    bookid: "SB00129",
    customerid: "CUST007",
    typeid: "TS004",
    registertime: "2024-11-15",
    maturitydate: "2025-11-15",
    initialdeposit: 20000000,
    currentbalance: 20000000,
    interestrate: 0.065,
    status: "active"
  },
  {
    bookid: "SB00130",
    customerid: "CUST008",
    typeid: "TS001",
    registertime: "2025-03-20",
    maturitydate: null,
    initialdeposit: 4200000,
    currentbalance: 4500000,
    interestrate: 0.02,
    status: "active"
  },
  // Additional accounts for better distribution
  {
    bookid: "SB00131",
    customerid: "CUST009",
    typeid: "TS002",
    registertime: "2025-04-15",
    maturitydate: "2025-07-15",
    initialdeposit: 8000000,
    currentbalance: 8500000,
    interestrate: 0.045,
    status: "active"
  },
  {
    bookid: "SB00132",
    customerid: "CUST010",
    typeid: "TS002",
    registertime: "2025-05-20",
    maturitydate: "2025-08-20",
    initialdeposit: 12000000,
    currentbalance: 12800000,
    interestrate: 0.045,
    status: "active"
  },
  {
    bookid: "SB00133",
    customerid: "CUST011",
    typeid: "TS003",
    registertime: "2025-06-10",
    maturitydate: "2025-12-10",
    initialdeposit: 25000000,
    currentbalance: 26500000,
    interestrate: 0.055,
    status: "active"
  },
  {
    bookid: "SB00134",
    customerid: "CUST012",
    typeid: "TS001",
    registertime: "2025-07-01",
    maturitydate: null,
    initialdeposit: 5000000,
    currentbalance: 5200000,
    interestrate: 0.02,
    status: "active"
  },
  {
    bookid: "SB00135",
    customerid: "CUST013",
    typeid: "TS001",
    registertime: "2025-08-05",
    maturitydate: null,
    initialdeposit: 6500000,
    currentbalance: 6800000,
    interestrate: 0.02,
    status: "active"
  },
  {
    bookid: "SB00136",
    customerid: "CUST014",
    typeid: "TS003",
    registertime: "2025-09-12",
    maturitydate: "2026-03-12",
    initialdeposit: 18000000,
    currentbalance: 19000000,
    interestrate: 0.055,
    status: "active"
  },
  {
    bookid: "SB00137",
    customerid: "CUST015",
    typeid: "TS002",
    registertime: "2025-10-08",
    maturitydate: "2026-01-08",
    initialdeposit: 9500000,
    currentbalance: 9800000,
    interestrate: 0.045,
    status: "active"
  },
  {
    bookid: "SB00138",
    customerid: "CUST016",
    typeid: "TS001",
    registertime: "2025-11-01",
    maturitydate: null,
    initialdeposit: 3000000,
    currentbalance: 3100000,
    interestrate: 0.02,
    status: "active"
  },
  {
    bookid: "SB00139",
    customerid: "CUST017",
    typeid: "TS003",
    registertime: "2025-11-15",
    maturitydate: "2026-05-15",
    initialdeposit: 22000000,
    currentbalance: 22500000,
    interestrate: 0.055,
    status: "active"
  },
  {
    bookid: "SB00140",
    customerid: "CUST018",
    typeid: "TS002",
    registertime: "2025-11-20",
    maturitydate: "2026-02-20",
    initialdeposit: 11000000,
    currentbalance: 11200000,
    interestrate: 0.045,
    status: "active"
  },
  {
    bookid: "SB00141",
    customerid: "CUST019",
    typeid: "TS001",
    registertime: "2025-10-25",
    maturitydate: null,
    initialdeposit: 7200000,
    currentbalance: 7500000,
    interestrate: 0.02,
    status: "active"
  },
  {
    bookid: "SB00142",
    customerid: "CUST020",
    typeid: "TS002",
    registertime: "2025-09-18",
    maturitydate: "2025-12-18",
    initialdeposit: 13500000,
    currentbalance: 14000000,
    interestrate: 0.045,
    status: "active"
  },
  // Some closed accounts for realism
  {
    bookid: "SB00143",
    customerid: "CUST021",
    typeid: "TS003",
    registertime: "2024-08-10",
    maturitydate: "2025-02-10",
    initialdeposit: 16000000,
    currentbalance: 0,
    interestrate: 0.055,
    status: "closed"
  },
  {
    bookid: "SB00144",
    customerid: "CUST022",
    typeid: "TS001",
    registertime: "2024-06-15",
    maturitydate: null,
    initialdeposit: 4500000,
    currentbalance: 0,
    interestrate: 0.02,
    status: "closed"
  }
];

/**
 * Helper functions for savingbook data
 */
export const findSavingBookById = (bookid) => {
  return mockSavingBooks.find(sb => sb.bookid === bookid);
};

export const findSavingBooksByCustomer = (customerid) => {
  return mockSavingBooks.filter(sb => sb.customerid === customerid);
};

export const findSavingBooksByType = (typeid) => {
  return mockSavingBooks.filter(sb => sb.typeid === typeid);
};

export const findActiveSavingBooks = () => {
  return mockSavingBooks.filter(sb => sb.status === "active");
};

export const addSavingBook = (savingBook) => {
  mockSavingBooks.push(savingBook);
  return savingBook;
};

export const updateSavingBook = (bookid, updates) => {
  const index = mockSavingBooks.findIndex(sb => sb.bookid === bookid);
  if (index !== -1) {
    mockSavingBooks[index] = { ...mockSavingBooks[index], ...updates };
    return mockSavingBooks[index];
  }
  return null;
};

export const updateSavingBookBalance = (bookid, amount) => {
  const savingBook = findSavingBookById(bookid);
  if (savingBook) {
    const oldBalance = savingBook.currentbalance;
    savingBook.currentbalance += amount;
    return {
      savingBook,
      balanceBefore: oldBalance,
      balanceAfter: savingBook.currentbalance
    };
  }
  return null;
};

export const closeSavingBook = (bookid) => {
  const savingBook = findSavingBookById(bookid);
  if (savingBook) {
    savingBook.status = "closed";
    const finalBalance = savingBook.currentbalance;
    savingBook.currentbalance = 0;
    return {
      ...savingBook,
      finalBalance
    };
  }
  return null;
};

export const deleteSavingBook = (bookid) => {
  const index = mockSavingBooks.findIndex(sb => sb.bookid === bookid);
  if (index !== -1) {
    const deleted = mockSavingBooks.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

export default mockSavingBooks;
