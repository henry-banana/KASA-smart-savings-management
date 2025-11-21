/**
 * Mock data for SavingBooks (Sổ tiết kiệm)
 * Based on database schema: savingbook table
 */

export const mockSavingBooks = [
  {
    bookid: "SB00123",
    customerid: "CUST001",
    typesavingid: "TS002",
    opendate: "2025-08-20",
    maturitydate: "2025-11-20",
    initialdeposit: 5000000,
    balance: 6000000,
    interestrate: 0.045,
    status: "active"
  },
  {
    bookid: "SB00124",
    customerid: "CUST002",
    typesavingid: "TS003",
    opendate: "2025-05-15",
    maturitydate: "2025-11-15",
    initialdeposit: 10000000,
    balance: 10000000,
    interestrate: 0.055,
    status: "active"
  },
  {
    bookid: "SB00125",
    customerid: "CUST003",
    typesavingid: "TS001",
    opendate: "2025-03-10",
    maturitydate: null,
    initialdeposit: 7500000,
    balance: 8000000,
    interestrate: 0.02,
    status: "active"
  },
  {
    bookid: "SB00126",
    customerid: "CUST004",
    typesavingid: "TS003",
    opendate: "2025-03-20",
    maturitydate: "2025-09-20",
    initialdeposit: 15000000,
    balance: 15000000,
    interestrate: 0.055,
    status: "active"
  },
  {
    bookid: "SB00127",
    customerid: "CUST005",
    typesavingid: "TS001",
    opendate: "2025-02-10",
    maturitydate: null,
    initialdeposit: 3500000,
    balance: 3800000,
    interestrate: 0.02,
    status: "active"
  },
  {
    bookid: "SB00128",
    customerid: "CUST006",
    typesavingid: "TS002",
    opendate: "2024-09-01",
    maturitydate: "2024-12-01",
    initialdeposit: 7500000,
    balance: 0,
    interestrate: 0.045,
    status: "closed"
  },
  {
    bookid: "SB00129",
    customerid: "CUST007",
    typesavingid: "TS004",
    opendate: "2024-11-15",
    maturitydate: "2025-11-15",
    initialdeposit: 20000000,
    balance: 20000000,
    interestrate: 0.065,
    status: "active"
  },
  {
    bookid: "SB00130",
    customerid: "CUST008",
    typesavingid: "TS001",
    opendate: "2025-03-20",
    maturitydate: null,
    initialdeposit: 4200000,
    balance: 4500000,
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

export const findSavingBooksByType = (typesavingid) => {
  return mockSavingBooks.filter(sb => sb.typesavingid === typesavingid);
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
    const oldBalance = savingBook.balance;
    savingBook.balance += amount;
    return {
      savingBook,
      balanceBefore: oldBalance,
      balanceAfter: savingBook.balance
    };
  }
  return null;
};

export const closeSavingBook = (bookid) => {
  const savingBook = findSavingBookById(bookid);
  if (savingBook) {
    savingBook.status = "closed";
    const finalBalance = savingBook.balance;
    savingBook.balance = 0;
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
