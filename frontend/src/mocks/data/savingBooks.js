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
