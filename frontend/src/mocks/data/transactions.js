/**
 * Mock data for Transactions (Giao dịch)
 * Based on database schema: transaction table
 */

export const mockTransactions = [
  {
    transactionid: "TXN001",
    bookid: "SB00123",
    transactiontype: "deposit",
    amount: 5000000,
    transactiondate: "2025-08-20T09:00:00.000Z",
    balancebefore: 0,
    balanceafter: 5000000,
    employeeid: "EMP001",
    note: "Mở sổ tiết kiệm",
    penalty: null
  },
  {
    transactionid: "TXN002",
    bookid: "SB00123",
    transactiontype: "deposit",
    amount: 1000000,
    transactiondate: "2025-09-15T10:30:00.000Z",
    balancebefore: 5000000,
    balanceafter: 6000000,
    employeeid: "EMP001",
    note: "Gửi tiền định kỳ",
    penalty: null
  },
  {
    transactionid: "TXN003",
    bookid: "SB00124",
    transactiontype: "deposit",
    amount: 10000000,
    transactiondate: "2025-05-15T14:00:00.000Z",
    balancebefore: 0,
    balanceafter: 10000000,
    employeeid: "EMP002",
    note: "Mở sổ tiết kiệm",
    penalty: null
  },
  {
    transactionid: "TXN004",
    bookid: "SB00125",
    transactiontype: "deposit",
    amount: 7500000,
    transactiondate: "2025-03-10T11:15:00.000Z",
    balancebefore: 0,
    balanceafter: 7500000,
    employeeid: "EMP001",
    note: "Mở sổ tiết kiệm",
    penalty: null
  },
  {
    transactionid: "TXN005",
    bookid: "SB00125",
    transactiontype: "deposit",
    amount: 500000,
    transactiondate: "2025-04-20T09:30:00.000Z",
    balancebefore: 7500000,
    balanceafter: 8000000,
    employeeid: "EMP001",
    note: "Gửi thêm tiền",
    penalty: null
  },
  {
    transactionid: "TXN006",
    bookid: "SB00126",
    transactiontype: "deposit",
    amount: 15000000,
    transactiondate: "2025-03-20T10:00:00.000Z",
    balancebefore: 0,
    balanceafter: 15000000,
    employeeid: "EMP002",
    note: "Mở sổ tiết kiệm",
    penalty: null
  },
  {
    transactionid: "TXN007",
    bookid: "SB00127",
    transactiontype: "deposit",
    amount: 3500000,
    transactiondate: "2025-02-10T15:45:00.000Z",
    balancebefore: 0,
    balanceafter: 3500000,
    employeeid: "EMP001",
    note: "Mở sổ tiết kiệm",
    penalty: null
  },
  {
    transactionid: "TXN008",
    bookid: "SB00127",
    transactiontype: "deposit",
    amount: 300000,
    transactiondate: "2025-05-15T11:20:00.000Z",
    balancebefore: 3500000,
    balanceafter: 3800000,
    employeeid: "EMP001",
    note: "Gửi thêm tiền",
    penalty: null
  },
  {
    transactionid: "TXN009",
    bookid: "SB00128",
    transactiontype: "deposit",
    amount: 7500000,
    transactiondate: "2024-09-01T09:00:00.000Z",
    balancebefore: 0,
    balanceafter: 7500000,
    employeeid: "EMP002",
    note: "Mở sổ tiết kiệm",
    penalty: null
  },
  {
    transactionid: "TXN010",
    bookid: "SB00128",
    transactiontype: "withdraw",
    amount: 7500000,
    transactiondate: "2024-12-01T14:30:00.000Z",
    balancebefore: 7500000,
    balanceafter: 0,
    employeeid: "EMP002",
    note: "Đóng sổ đến hạn",
    penalty: null
  },
  {
    transactionid: "TXN011",
    bookid: "SB00129",
    transactiontype: "deposit",
    amount: 20000000,
    transactiondate: "2024-11-15T10:00:00.000Z",
    balancebefore: 0,
    balanceafter: 20000000,
    employeeid: "EMP001",
    note: "Mở sổ tiết kiệm",
    penalty: null
  },
  {
    transactionid: "TXN012",
    bookid: "SB00130",
    transactiontype: "deposit",
    amount: 4200000,
    transactiondate: "2025-03-20T13:15:00.000Z",
    balancebefore: 0,
    balanceafter: 4200000,
    employeeid: "EMP002",
    note: "Mở sổ tiết kiệm",
    penalty: null
  },
  {
    transactionid: "TXN013",
    bookid: "SB00130",
    transactiontype: "deposit",
    amount: 300000,
    transactiondate: "2025-06-10T10:45:00.000Z",
    balancebefore: 4200000,
    balanceafter: 4500000,
    employeeid: "EMP001",
    note: "Gửi thêm tiền",
    penalty: null
  },
  // Transactions for today (2025-11-25)
  {
    transactionid: "TXN014",
    bookid: "SB00123",
    transactiontype: "deposit",
    amount: 5000000,
    transactiondate: "2025-11-25T08:30:00.000Z",
    balancebefore: 6000000,
    balanceafter: 11000000,
    employeeid: "EMP001",
    note: "Gửi thêm tiền",
    penalty: null
  },
  {
    transactionid: "TXN015",
    bookid: "SB00124",
    transactiontype: "withdraw",
    amount: 3000000,
    transactiondate: "2025-11-25T09:15:00.000Z",
    balancebefore: 10000000,
    balanceafter: 7000000,
    employeeid: "EMP002",
    note: "Rút tiền định kỳ",
    penalty: null
  },
  {
    transactionid: "TXN016",
    bookid: "SB00125",
    transactiontype: "deposit",
    amount: 8000000,
    transactiondate: "2025-11-25T10:00:00.000Z",
    balancebefore: 8000000,
    balanceafter: 16000000,
    employeeid: "EMP001",
    note: "Gửi thêm tiền lớn",
    penalty: null
  },
  {
    transactionid: "TXN017",
    bookid: "SB00126",
    transactiontype: "withdraw",
    amount: 5000000,
    transactiondate: "2025-11-25T10:45:00.000Z",
    balancebefore: 15000000,
    balanceafter: 10000000,
    employeeid: "EMP002",
    note: "Rút tiền",
    penalty: null
  },
  {
    transactionid: "TXN018",
    bookid: "SB00127",
    transactiontype: "deposit",
    amount: 12000000,
    transactiondate: "2025-11-25T11:30:00.000Z",
    balancebefore: 3800000,
    balanceafter: 15800000,
    employeeid: "EMP001",
    note: "Gửi thêm lớn",
    penalty: null
  },
  {
    transactionid: "TXN019",
    bookid: "SB00129",
    transactiontype: "deposit",
    amount: 15000000,
    transactiondate: "2025-11-25T13:00:00.000Z",
    balancebefore: 20000000,
    balanceafter: 35000000,
    employeeid: "EMP001",
    note: "Gửi tiền VIP",
    penalty: null
  },
  {
    transactionid: "TXN020",
    bookid: "SB00130",
    transactiontype: "withdraw",
    amount: 2000000,
    transactiondate: "2025-11-25T14:20:00.000Z",
    balancebefore: 4500000,
    balanceafter: 2500000,
    employeeid: "EMP002",
    note: "Rút tiền",
    penalty: null
  },
  // This week transactions
  {
    transactionid: "TXN021",
    bookid: "SB00123",
    transactiontype: "deposit",
    amount: 6000000,
    transactiondate: "2025-11-24T09:00:00.000Z",
    balancebefore: 5000000,
    balanceafter: 11000000,
    employeeid: "EMP001",
    note: "Gửi tiền",
    penalty: null
  },
  {
    transactionid: "TXN022",
    bookid: "SB00124",
    transactiontype: "withdraw",
    amount: 4000000,
    transactiondate: "2025-11-24T10:30:00.000Z",
    balancebefore: 11000000,
    balanceafter: 7000000,
    employeeid: "EMP002",
    note: "Rút tiền",
    penalty: null
  },
  {
    transactionid: "TXN023",
    bookid: "SB00125",
    transactiontype: "deposit",
    amount: 7000000,
    transactiondate: "2025-11-23T11:00:00.000Z",
    balancebefore: 9000000,
    balanceafter: 16000000,
    employeeid: "EMP001",
    note: "Gửi thêm",
    penalty: null
  },
  {
    transactionid: "TXN024",
    bookid: "SB00126",
    transactiontype: "deposit",
    amount: 10000000,
    transactiondate: "2025-11-22T08:30:00.000Z",
    balancebefore: 5000000,
    balanceafter: 15000000,
    employeeid: "EMP001",
    note: "Gửi tiền",
    penalty: null
  },
  {
    transactionid: "TXN025",
    bookid: "SB00127",
    transactiontype: "withdraw",
    amount: 3500000,
    transactiondate: "2025-11-22T14:00:00.000Z",
    balancebefore: 7300000,
    balanceafter: 3800000,
    employeeid: "EMP002",
    note: "Rút tiền",
    penalty: null
  },
  {
    transactionid: "TXN026",
    bookid: "SB00129",
    transactiontype: "deposit",
    amount: 18000000,
    transactiondate: "2025-11-21T09:30:00.000Z",
    balancebefore: 2000000,
    balanceafter: 20000000,
    employeeid: "EMP001",
    note: "Gửi lớn",
    penalty: null
  },
  {
    transactionid: "TXN027",
    bookid: "SB00130",
    transactiontype: "deposit",
    amount: 5000000,
    transactiondate: "2025-11-21T11:00:00.000Z",
    balancebefore: -500000,
    balanceafter: 4500000,
    employeeid: "EMP001",
    note: "Gửi tiền",
    penalty: null
  },
  {
    transactionid: "TXN028",
    bookid: "SB00123",
    transactiontype: "withdraw",
    amount: 2000000,
    transactiondate: "2025-11-20T10:00:00.000Z",
    balancebefore: 7000000,
    balanceafter: 5000000,
    employeeid: "EMP002",
    note: "Rút tiền",
    penalty: null
  },
  {
    transactionid: "TXN029",
    bookid: "SB00124",
    transactiontype: "deposit",
    amount: 8000000,
    transactiondate: "2025-11-20T13:30:00.000Z",
    balancebefore: 3000000,
    balanceafter: 11000000,
    employeeid: "EMP001",
    note: "Gửi tiền",
    penalty: null
  },
  {
    transactionid: "TXN030",
    bookid: "SB00125",
    transactiontype: "deposit",
    amount: 4000000,
    transactiondate: "2025-11-19T09:00:00.000Z",
    balancebefore: 5000000,
    balanceafter: 9000000,
    employeeid: "EMP001",
    note: "Gửi tiền",
    penalty: null
  },
  {
    transactionid: "TXN031",
    bookid: "SB00126",
    transactiontype: "withdraw",
    amount: 6000000,
    transactiondate: "2025-11-19T11:30:00.000Z",
    balancebefore: 11000000,
    balanceafter: 5000000,
    employeeid: "EMP002",
    note: "Rút tiền",
    penalty: null
  }
];

/**
 * Helper functions for transaction data
 */
export const findTransactionById = (transactionid) => {
  return mockTransactions.find(t => t.transactionid === transactionid);
};

export const findTransactionsByBookId = (bookid) => {
  return mockTransactions.filter(t => t.bookid === bookid);
};

export const findTransactionsByType = (transactiontype) => {
  return mockTransactions.filter(t => t.transactiontype === transactiontype);
};

export const findTransactionsByDateRange = (startDate, endDate) => {
  return mockTransactions.filter(t => {
    const transDate = new Date(t.transactiondate);
    return transDate >= new Date(startDate) && transDate <= new Date(endDate);
  });
};

export const addTransaction = (transaction) => {
  mockTransactions.push(transaction);
  return transaction;
};

export const updateTransaction = (transactionid, updates) => {
  const index = mockTransactions.findIndex(t => t.transactionid === transactionid);
  if (index !== -1) {
    mockTransactions[index] = { ...mockTransactions[index], ...updates };
    return mockTransactions[index];
  }
  return null;
};

export const deleteTransaction = (transactionid) => {
  const index = mockTransactions.findIndex(t => t.transactionid === transactionid);
  if (index !== -1) {
    const deleted = mockTransactions.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

/**
 * Generate next transaction ID
 */
export const generateTransactionId = () => {
  const lastId = mockTransactions[mockTransactions.length - 1]?.transactionid || "TXN000";
  const num = parseInt(lastId.substring(3)) + 1;
  return `TXN${String(num).padStart(3, '0')}`;
};

export default mockTransactions;
