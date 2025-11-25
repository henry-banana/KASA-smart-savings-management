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
    const typeSaving = findTypeSavingById(savingBook.typeid);
    
    // Map to old format for compatibility
    return {
      id: savingBook.bookid,
      customerId: savingBook.customerid,
      customerName: customer?.fullname,
      idCard: customer?.citizenid,
      address: customer?.address,
      type: typeSaving?.typename,
      balance: savingBook.currentbalance,
      openDate: savingBook.registertime,
      status: savingBook.status
    };
  },

  async createAccount(accountData) {
    await randomDelay();
    logger.info('🎭 Mock Create Account', { customerName: accountData.customer_name });
    
    // Find or create customer
    let customer = mockCustomers.find(c => c.citizenid === accountData.id_card);
    if (!customer) {
      customer = {
        customerid: generateId('CUST'),
        fullname: accountData.customer_name,
        citizenid: accountData.id_card,
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
      typeid: typeSaving?.typesavingid || 'TS01',
      registertime: accountData.open_date,
      maturitydate: null,
      initialdeposit: parseFloat(accountData.initial_deposit),
      currentbalance: parseFloat(accountData.initial_deposit),
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
      id_card: customer.citizenid,
      idCard: customer.citizenid,
      address: customer.address,
      savings_type: typeSaving?.typename,
      type: typeSaving?.typename,
      balance: newSavingBook.currentbalance,
      open_date: newSavingBook.registertime,
      openDate: newSavingBook.registertime,
      status: 'active'
    };
  },

  // Note: deposit/withdraw are handled by transactionAdapter
  // These methods are kept for backward compatibility but should not be used
  async deposit(accountId, amount) {
    await randomDelay();
    logger.info('🎭 Mock Deposit', { accountId, amount });
    
    const result = updateSavingBookBalance(accountId, amount);
    if (!result) {
      throw new Error('Không tìm thấy sổ tiết kiệm');
    }
    
    return {
      account: result.savingBook,
      transaction: {
        id: generateId('TXN'),
        accountId,
        type: 'deposit',
        amount,
        balanceBefore: result.balanceBefore,
        balanceAfter: result.balanceAfter,
        timestamp: new Date().toISOString()
      }
    };
  },

  async withdraw(accountId, amount) {
    await randomDelay();
    logger.info('🎭 Mock Withdraw', { accountId, amount });
    
    const savingBook = findSavingBookById(accountId);
    if (!savingBook) {
      throw new Error('Không tìm thấy sổ tiết kiệm');
    }
    
    if (savingBook.currentbalance < amount) {
      throw new Error('Số dư không đủ');
    }
    
    const result = updateSavingBookBalance(accountId, -amount);
    
    return {
      account: result.savingBook,
      transaction: {
        id: generateId('TXN'),
        accountId,
        type: 'withdraw',
        amount,
        balanceBefore: result.balanceBefore,
        balanceAfter: result.balanceAfter,
        timestamp: new Date().toISOString()
      }
    };
  },

  async searchAccounts(params = {}) {
    await randomDelay();
    logger.info('🎭 Mock Search', { query: params.query, type: params.type });
    
    // Map savingBooks to account format
    let results = mockSavingBooks.map(sb => {
      const customer = findCustomerById(sb.customerid);
      const type = findTypeSavingById(sb.typeid);
      
      return {
        id: sb.bookid,
        customerName: customer?.fullname || 'Unknown',
        idCard: customer?.citizenid || '',
        type: type?.typename || 'Unknown',
        balance: sb.currentbalance,
        openDate: sb.registertime,
        status: sb.status
      };
    });
    
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
