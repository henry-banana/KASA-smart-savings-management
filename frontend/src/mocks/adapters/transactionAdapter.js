import { findSavingBookById, updateSavingBookBalance } from '../data/savingBooks.js';
import { findTypeSavingById } from '../data/typeSavings.js';
import { addTransaction } from '../data/transactions.js';
import { randomDelay, generateId } from '../utils';
import { findEmployeeById, findRoleById } from '../data/employees.js';
import { BUSINESS_RULES, TRANSACTION_TYPES } from '@/constants/business.js';
import { logger } from '@/utils/logger';

// Helper: build contract savingBook object
const buildSavingBookPayload = (sb, type) => ({
  bookId: sb.bookId,
  citizenId: sb.citizenId,
  customerName: sb.customerName,
  typeSavingId: sb.typeSavingId,
  openDate: sb.openDate,
  maturityDate: sb.maturityDate, // may be null (no term)
  balance: sb.balance,
  status: sb.status,
  typeSaving: type ? {
    typeSavingId: type.typeSavingId,
    typeName: type.typeName,
    term: type.term,
    interestRate: type.interestRate
  } : {},
  transactions: [] // mock-extension: omitted actual transaction list for brevity
});

// Helper: build employee payload (minimal contract shape)
const buildEmployeePayload = (employee) => {
  if (!employee) return {};
  const role = findRoleById(employee.roleid);
  return {
    employeeId: employee.employeeid,
    fullName: employee.fullname,
    roleName: role?.rolename || 'Unknown'
  };
};

export const mockTransactionAdapter = {
  /**
   * Get account info (contract fields only)
   */
  async getAccountInfo(bookId) {
    await randomDelay();
    logger.info('🎭 Mock Get Account Info', { bookId });

    const savingBook = findSavingBookById(bookId);
    if (!savingBook) {
      throw new Error('Account not found');
    }

    const typeSaving = findTypeSavingById(savingBook.typeSavingId);

    return {
      message: 'Get account info successfully',
      success: true,
      data: {
        bookId: savingBook.bookId,
        customerName: savingBook.customerName,
        accountTypeName: typeSaving?.typeName || 'Unknown',
        balance: savingBook.balance,
        openDate: savingBook.openDate,
        interestRate: typeSaving?.interestRate || 0,
        // mock-extension: needed by withdraw page for maturity check
        maturityDate: savingBook.maturityDate
      }
    };
  },

  /**
   * Deposit money (non-term only, min amount rule)
   */
  async depositMoney({ bookId, amount, employeeId }) {
    await randomDelay();
    logger.info('🎭 Mock Deposit', { bookId, amount, employeeId });

    if (!bookId) throw new Error('Book ID is required');
    if (typeof amount !== 'number' || isNaN(amount)) throw new Error('Amount must be a number');
    if (amount < BUSINESS_RULES.MIN_DEPOSIT) throw new Error(`Minimum deposit is ${BUSINESS_RULES.MIN_DEPOSIT}`);

    const savingBook = findSavingBookById(bookId);
    if (!savingBook) throw new Error('Account not found');
    if (savingBook.status !== 'active') throw new Error('Cannot deposit to a closed account');

    const typeSaving = findTypeSavingById(savingBook.typeSavingId);
    if (typeSaving && typeSaving.term > 0) {
      throw new Error('Cannot deposit into fixed-term account');
    }

    const result = updateSavingBookBalance(bookId, amount);
    if (!result) throw new Error('Failed to update balance');

    // Build transaction record (contract-like fields)
    const transactionId = generateId('TXN');
    const transactionDate = new Date().toISOString();
    const employee = buildEmployeePayload(findEmployeeById(employeeId) || findEmployeeById('EMP001'));

    const type = TRANSACTION_TYPES.DEPOSIT;
    addTransaction({
      transactionId,
      bookId,
      type,
      amount,
      transactionDate,
      balanceBefore: result.balanceBefore,
      balanceAfter: result.balanceAfter,
      employeeId: employee.employeeId
    });

    // Update savingBook object with new balance
    const updatedSavingBook = { ...savingBook, balance: result.balanceAfter };
    const savingBookPayload = buildSavingBookPayload(updatedSavingBook, typeSaving);

    return {
      message: 'Deposit successfully',
      success: true,
      data: {
        transactionId,
        bookId,
        type: 'Deposit',
        amount,
        balanceBefore: result.balanceBefore,
        balanceAfter: result.balanceAfter,
        transactionDate,
        savingBook: savingBookPayload,
        employee
      }
    };
  },

  /**
   * Withdraw money with early withdrawal rules
   */
  async withdrawMoney({ bookId, amount, shouldCloseAccount = false, employeeId }) {
    await randomDelay();
    logger.info('🎭 Mock Withdraw', { bookId, amount, shouldCloseAccount, employeeId });

    if (!bookId) throw new Error('Book ID is required');
    if (typeof amount !== 'number' || isNaN(amount)) throw new Error('Amount must be a number');
    if (amount <= 0) throw new Error('Amount must be greater than 0');

    const savingBook = findSavingBookById(bookId);
    if (!savingBook) throw new Error('Account not found');
    if (savingBook.status !== 'active') throw new Error('Cannot withdraw from a closed account');
    if (amount > savingBook.balance) throw new Error('Insufficient balance');

    const typeSaving = findTypeSavingById(savingBook.typeSavingId);
    const isFixedTerm = typeSaving && typeSaving.term > 0 && savingBook.maturityDate;
    const today = new Date();
    const maturityDate = savingBook.maturityDate ? new Date(savingBook.maturityDate) : null;

    if (isFixedTerm && maturityDate && today < maturityDate) {
      // Early withdrawal before maturity requires closing the account & full balance
      if (!shouldCloseAccount) {
        throw new Error('Early withdrawal requires shouldCloseAccount=true');
      }
      if (amount !== savingBook.balance) {
        throw new Error('Must withdraw full balance to close before maturity');
      }
    }

    // Perform balance update
    const result = updateSavingBookBalance(bookId, -amount);
    if (!result) throw new Error('Failed to update balance');

    // Close account if early withdrawal closing or balance reaches zero
    if ((isFixedTerm && today < maturityDate && shouldCloseAccount) || result.balanceAfter === 0) {
      const sb = findSavingBookById(bookId);
      if (sb) sb.status = 'closed';
    }

    const transactionId = generateId('TXN');
    const transactionDate = new Date().toISOString();
    const employee = buildEmployeePayload(findEmployeeById(employeeId) || findEmployeeById('EMP001'));

    const type = TRANSACTION_TYPES.WITHDRAW;
    addTransaction({
      transactionId,
      bookId,
      type,
      amount,
      transactionDate,
      balanceBefore: result.balanceBefore,
      balanceAfter: result.balanceAfter,
      employeeId: employee.employeeId
    });

    const updatedSavingBook = { ...savingBook, balance: result.balanceAfter };
    const savingBookPayload = buildSavingBookPayload(updatedSavingBook, typeSaving);

    return {
      message: 'Withdraw successfully',
      success: true,
      data: {
        transactionId,
        bookId,
        type: 'Withdraw',
        amount,
        balanceBefore: result.balanceBefore,
        balanceAfter: result.balanceAfter,
        transactionDate,
        savingBook: savingBookPayload,
        employee
      }
    };
  }
};
