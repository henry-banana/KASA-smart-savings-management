// Stateful mock data (có thể thay đổi khi deposit/withdraw)
export let mockAccounts = [
  {
    id: 'SA12345',
    customerId: 'CUST001',
    customerName: 'Nguyễn Văn A',
    idCard: '079012345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    type: 'no-term',
    balance: 5000000,
    openDate: '2025-01-15',
    status: 'active'
  },
  {
    id: 'SA12346',
    customerId: 'CUST002',
    customerName: 'Trần Thị B',
    idCard: '079087654321',
    address: '456 Lê Lợi, Q1, TP.HCM',
    type: '3-months',
    balance: 10000000,
    openDate: '2024-11-15',
    status: 'active'
  },
  {
    id: 'SA12347',
    customerId: 'CUST003',
    customerName: 'Lê Văn C',
    idCard: '079011111111',
    address: '789 Điện Biên Phủ, Q3, TP.HCM',
    type: 'no-term',
    balance: 7500000,
    openDate: '2025-03-10',
    status: 'active'
  }
];

export const findAccountById = (id) => {
  return mockAccounts.find(acc => acc.id === id);
};

export const addAccount = (account) => {
  mockAccounts.push(account);
  return account;
};

export const updateAccountBalance = (id, amount) => {
  const account = findAccountById(id);
  if (account) {
    account.balance += amount;
  }
  return account;
};
