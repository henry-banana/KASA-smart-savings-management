import { 
  mockSavingBooks,
  findSavingBookById, 
  addSavingBook, 
  updateSavingBookBalance 
} from '../data/savingBooks.js';
import { mockCustomers, findCustomerById } from '../data/customers.js';
import { mockTypeSavings, findTypeSavingById } from '../data/typeSavings.js';
import { randomDelay, generateId } from '../utils';
import { logger } from '@/utils/logger';

export const mockAccountAdapter = {
  async getAccount(id) {
    await randomDelay();
    logger.info('🎭 Mock Get Account', { id });
    
    const savingBook = findSavingBookById(id);
    if (!savingBook) {
      throw new Error('Không tìm thấy sổ tiết kiệm');
    }
    
    const customer = findCustomerById(savingBook.customerid);
    const typeSaving = findTypeSavingById(savingBook.typesavingid);
    
    // Map to old format for compatibility
    return {
      id: savingBook.bookid,
      customerId: savingBook.customerid,
      customerName: customer?.fullname,
      idCard: customer?.idcard,
      address: customer?.address,
      type: typeSaving?.typename,
      balance: savingBook.balance,
      openDate: savingBook.opendate,
      status: savingBook.status
    };
  },

  async createAccount(accountData) {
    await randomDelay();
    logger.info('🎭 Mock Create Account', { customerName: accountData.customer_name });
    
    // Find or create customer
    let customer = mockCustomers.find(c => c.idcard === accountData.id_card);
    if (!customer) {
      customer = {
        customerid: generateId('CUST'),
        fullname: accountData.customer_name,
        idcard: accountData.id_card,
        address: accountData.address,
        phone: '',
        email: '',
        dateofbirth: ''
      };
      mockCustomers.push(customer);
    }
    
    // Find typesaving
    const typeSaving = mockTypeSavings.find(ts => ts.typename === accountData.savings_type);
    
    const newSavingBook = {
      bookid: generateId('SB'),
      customerid: customer.customerid,
      typesavingid: typeSaving?.typesavingid || 'TS001',
      opendate: accountData.open_date,
      maturitydate: null,
      initialdeposit: parseFloat(accountData.initial_deposit),
      balance: parseFloat(accountData.initial_deposit),
      interestrate: typeSaving?.interestrate || 0.02,
      status: 'active'
    };
    
    addSavingBook(newSavingBook);
    
    // Return in old format
    return {
      id: newSavingBook.bookid,
      customerId: customer.customerid,
      customer_name: customer.fullname,
      customerName: customer.fullname,
      id_card: customer.idcard,
      idCard: customer.idcard,
      address: customer.address,
      savings_type: typeSaving?.typename,
      type: typeSaving?.typename,
      balance: newSavingBook.balance,
      open_date: newSavingBook.opendate,
      openDate: newSavingBook.opendate,
      status: 'active'
    };
  },

  async deposit(accountId, amount) {
    await randomDelay();
    logger.info('🎭 Mock Deposit', { accountId, amount });
    
    const result = updateSavingBookBalance(accountId, amount);
    if (!result) {
      throw new Error('Không tìm thấy sổ tiết kiệm');
    }
    
    const account = findAccountById(accountId);
    if (!account) {
      throw new Error('Không tìm thấy sổ tiết kiệm');
    }
    
    if (account.type !== 'no-term') {
      throw new Error('Chỉ cho phép gửi tiền vào sổ không kỳ hạn');
    }
    
    const balanceBefore = account.balance;
    const updatedAccount = updateAccountBalance(accountId, amount);
    
    return {
      account: updatedAccount,
      transaction: {
        id: generateId('TXN'),
        accountId,
        type: 'deposit',
        amount,
        balanceBefore,
        balanceAfter: updatedAccount.balance,
        timestamp: new Date().toISOString()
      }
    };
  },

  async withdraw(accountId, amount) {
    await randomDelay();
    logger.info('🎭 Mock Withdraw', { accountId, amount });
    
    const account = findAccountById(accountId);
    if (!account) {
      throw new Error('Không tìm thấy sổ tiết kiệm');
    }
    
    if (account.balance < amount) {
      throw new Error('Số dư không đủ');
    }
    
    const balanceBefore = account.balance;
    const updatedAccount = updateAccountBalance(accountId, -amount);
    
    return {
      account: updatedAccount,
      transaction: {
        id: generateId('TXN'),
        accountId,
        type: 'withdraw',
        amount,
        balanceBefore,
        balanceAfter: updatedAccount.balance,
        timestamp: new Date().toISOString()
      }
    };
  },

  async searchAccounts(params = {}) {
    await randomDelay();
    logger.info('🎭 Mock Search', { query: params.query, type: params.type });
    
    let results = [...mockAccounts];
    
    // Simple filter by search term
    if (params.query) {
      const term = params.query.toLowerCase();
      results = results.filter(acc => 
        acc.id.toLowerCase().includes(term) ||
        acc.customerName.toLowerCase().includes(term) ||
        acc.idCard.includes(term)
      );
    }
    
    // Filter by type
    if (params.type && params.type !== 'all') {
      results = results.filter(acc => acc.type === params.type);
    }
    
    return { data: results, total: results.length };
  }
};
