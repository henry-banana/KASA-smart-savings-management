export const reportMockData = {
  daily: {
    success: true,
    data: {
      date: new Date().toISOString().split('T')[0],
      totalDeposits: 50000000,
      totalWithdrawals: 30000000,
      newAccounts: 5,
      closedAccounts: 2,
      transactions: [
        { id: 'TXN001', type: 'deposit', accountCode: 'SA12345', amount: 5000000, time: '09:30' },
        { id: 'TXN002', type: 'withdraw', accountCode: 'SA12346', amount: 3000000, time: '10:15' },
        { id: 'TXN003', type: 'deposit', accountCode: 'SA12347', amount: 10000000, time: '11:00' },
      ]
    }
  },
  
  monthly: {
    success: true,
    data: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      totalDeposits: 500000000,
      totalWithdrawals: 300000000,
      newAccounts: 45,
      closedAccounts: 10,
      accountsByType: {
        'no-term': 25,
        '3-months': 12,
        '6-months': 8
      }
    }
  }
};

export default reportMockData;
