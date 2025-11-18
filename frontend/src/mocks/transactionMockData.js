export const transactionMockData = {
  accounts: {
    'SA12345': {
      id: 'SA12345',
      customerName: 'Nguyen Van A',
      type: 'no-term',
      balance: 5000000,
      openDate: '2025-01-15',
      interestRate: 0.02
    },
    'SA12346': {
      id: 'SA12346',
      customerName: 'Tran Thi B',
      type: 'fixed-3m',
      balance: 10000000,
      openDate: '2024-11-01',
      maturityDate: '2025-02-01',
      interestRate: 0.045
    },
    'SA12347': {
      id: 'SA12347',
      customerName: 'Le Van C',
      type: 'no-term',
      balance: 7500000,
      openDate: '2025-03-10',
      interestRate: 0.02
    },
    'SA12348': {
      id: 'SA12348',
      customerName: 'Pham Thi D',
      type: 'fixed-6m',
      balance: 15000000,
      openDate: '2024-09-01',
      maturityDate: '2025-03-01',
      interestRate: 0.055
    }
  },

  depositSuccess: {
    success: true,
    message: 'Gửi tiền thành công',
    data: {
      transactionId: 'TXN001',
      accountCode: 'SA12345',
      type: 'deposit',
      amount: 1000000,
      balanceAfter: 6000000,
      transactionDate: new Date().toISOString()
    }
  },

  withdrawSuccess: {
    success: true,
    message: 'Rút tiền thành công',
    data: {
      transactionId: 'TXN002',
      accountCode: 'SA12345',
      type: 'withdraw',
      amount: 500000,
      balanceAfter: 5500000,
      transactionDate: new Date().toISOString()
    }
  }
};

export default transactionMockData;
