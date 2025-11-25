import { findSavingBookById, updateSavingBookBalance } from '../data/savingBooks.js';
import { findCustomerById } from '../data/customers.js';
import { findTypeSavingById } from '../data/typeSavings.js';
import { addTransaction, generateTransactionId } from '../data/transactions.js';
import { randomDelay } from '../utils';
import { logger } from '@/utils/logger';

export const mockTransactionAdapter = {
  async getAccountInfo(accountCode) {
    await randomDelay();
    logger.info('🎭 Mock Get Account Info', { accountCode });
    
    const savingBook = findSavingBookById(accountCode);
    if (!savingBook) {
      throw new Error('Không tìm thấy tài khoản');
    }
    
    const customer = findCustomerById(savingBook.customerid);
    const typeSaving = findTypeSavingById(savingBook.typeid);
    
    return { 
      success: true, 
      data: {
        id: savingBook.bookid,
        customerName: customer?.fullname,
        type: typeSaving?.typename,
        balance: savingBook.currentbalance,
        openDate: savingBook.registertime,
        interestRate: savingBook.interestrate
      }
    };
  },

  async depositMoney(accountCode, amount) {
    await randomDelay();
    logger.info('🎭 Mock Deposit', { accountCode, amount });
    
    const savingBook = findSavingBookById(accountCode);
    if (!savingBook) {
      throw new Error('Không tìm thấy tài khoản');
    }

    const typeSaving = findTypeSavingById(savingBook.typeid);
    if (typeSaving && typeSaving.typename !== 'no-term') {
      throw new Error('Chỉ cho phép gửi tiền vào sổ không kỳ hạn');
    }

    const result = updateSavingBookBalance(accountCode, amount);
    if (!result) {
      throw new Error('Không thể cập nhật số dư');
    }

    // Create transaction record
    const transaction = {
      transactionid: generateTransactionId(),
      bookid: accountCode,
      transactiontype: 'deposit',
      amount,
      transactiondate: new Date().toISOString(),
      balancebefore: result.balanceBefore,
      balanceafter: result.balanceAfter,
      employeeid: 'EMP001',
      note: 'Gửi tiền'
    };
    addTransaction(transaction);
    
    return {
      success: true,
      message: 'Gửi tiền thành công',
      data: {
        transactionId: transaction.transactionid,
        accountCode,
        type: 'deposit',
        amount,
        balanceAfter: result.balanceAfter,
        balanceBefore: result.balanceBefore,
        transactionDate: transaction.transactiondate
      }
    };
  },

  async withdrawMoney(accountCode, amount) {
    await randomDelay();
    logger.info('🎭 Mock Withdraw', { accountCode, amount });
    
    const savingBook = findSavingBookById(accountCode);
    if (!savingBook) {
      throw new Error('Không tìm thấy tài khoản');
    }

    if (amount > savingBook.currentbalance) {
      throw new Error('Số dư không đủ');
    }

    // Check fixed-term withdrawal rules
    const typeSaving = findTypeSavingById(savingBook.typeid);
    if (typeSaving && typeSaving.typename !== 'no-term' && savingBook.maturitydate) {
      const today = new Date();
      const maturityDate = new Date(savingBook.maturitydate);
      
      if (today < maturityDate) {
        throw new Error('Sổ có kỳ hạn chỉ được rút khi đến hạn');
      }

      if (amount !== savingBook.currentbalance) {
        throw new Error('Sổ có kỳ hạn phải rút toàn bộ số dư khi đến hạn');
      }
    }

    const result = updateSavingBookBalance(accountCode, -amount);
    if (!result) {
      throw new Error('Không thể cập nhật số dư');
    }

    // Create transaction record
    const transaction = {
      transactionid: generateTransactionId(),
      bookid: accountCode,
      transactiontype: 'withdraw',
      amount,
      transactiondate: new Date().toISOString(),
      balancebefore: result.balanceBefore,
      balanceafter: result.balanceAfter,
      employeeid: 'EMP001',
      note: 'Rút tiền'
    };
    addTransaction(transaction);
    
    return {
      success: true,
      message: 'Rút tiền thành công',
      data: {
        transactionId: transaction.transactionid,
        accountCode,
        type: 'withdraw',
        amount,
        balanceAfter: result.balanceAfter,
        balanceBefore: result.balanceBefore,
        transactionDate: transaction.transactiondate
      }
    };
  }
};
