// DEPRECATED: This adapter is no longer used. Use savingBookAdapter/transactionAdapter instead.
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
    
    // Return with standard envelope and canonical field names
    return {
      message: 'Get account successfully',
      success: true,
      data: {
        bookId: savingBook.bookId,
        citizenId: customer?.citizenId || savingBook.citizenId,
        customerName: customer?.fullName || savingBook.customerName,
        address: customer?.address,
        typeSavingId: savingBook.typeSavingId,
        accountTypeName: typeSaving?.typeName,
        balance: savingBook.balance,
        openDate: savingBook.openDate,
        maturityDate: savingBook.maturityDate,
        status: savingBook.status
      }
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
    // Support passing either typeSavingId or typeName in savings_type
    const typeSaving = mockTypeSavings.find(ts => 
      ts.typeSavingId === accountData.savings_type || ts.typeName === accountData.savings_type
    );
    
    const bookId = generateId('SB');
    const newSavingBook = {
      bookId: bookId, // camelCase to match mockSavingBooks format
      citizenId: customer.citizenid,
      customerName: customer.fullname,
      typeSavingId: typeSaving?.typeSavingId || 'TS01',
      openDate: accountData.open_date,
      maturityDate: null,
      balance: parseFloat(accountData.initial_deposit),
      status: 'active'
    };
    
    addSavingBook(newSavingBook);
    
    // Return with standard envelope and canonical field names
    return {
      message: 'Create account successfully',
      success: true,
      data: {
        bookId: bookId,
        accountCode: bookId, // alias for UI
        citizenId: customer.citizenid,
        customerName: customer.fullname,
        address: customer.address,
        typeSavingId: typeSaving?.typeSavingId || 'TS01',
        accountTypeName: typeSaving?.typeName,
        balance: newSavingBook.balance,
        openDate: newSavingBook.openDate,
        maturityDate: newSavingBook.maturityDate,
        status: 'active'
      }
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
      message: 'Deposit successfully',
      success: true,
      data: {
        savingBook: result.savingBook,
        transaction: {
          transactionId: generateId('TXN'),
          bookId: accountId,
          type: 'deposit',
          amount,
          balanceBefore: result.balanceBefore,
          balanceAfter: result.balanceAfter,
          transactionDate: new Date().toISOString()
        }
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
      message: 'Withdraw successfully',
      success: true,
      data: {
        savingBook: result.savingBook,
        transaction: {
          transactionId: generateId('TXN'),
          bookId: accountId,
          type: 'withdraw',
          amount,
          balanceBefore: result.balanceBefore,
          balanceAfter: result.balanceAfter,
          transactionDate: new Date().toISOString()
        }
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
    
    return { 
      message: 'Search accounts successfully',
      success: true,
      data: results, 
      total: results.length 
    };
  }
};
