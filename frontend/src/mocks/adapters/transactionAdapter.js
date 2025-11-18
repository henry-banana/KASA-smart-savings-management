import { transactionMockData } from '../transactionMockData';
import { randomDelay, generateId } from '../utils';
import { logger } from '@/utils/logger';

export const mockTransactionAdapter = {
  async getAccountInfo(accountCode) {
    await randomDelay();
    logger.info('🎭 Mock Get Account Info', { accountCode });
    
    const account = transactionMockData.accounts[accountCode];
    if (!account) {
      throw new Error('Không tìm thấy tài khoản');
    }
    
    return { success: true, data: account };
  },

  async depositMoney(accountCode, amount) {
    await randomDelay();
    logger.info('🎭 Mock Deposit', { accountCode, amount });
    
    const account = transactionMockData.accounts[accountCode];
    if (!account) {
      throw new Error('Không tìm thấy tài khoản');
    }

    if (account.type !== 'no-term') {
      throw new Error('Chỉ cho phép gửi tiền vào sổ không kỳ hạn');
    }

    const previousBalance = account.balance;
    account.balance += amount;
    
    return {
      success: true,
      message: 'Gửi tiền thành công',
      data: {
        transactionId: generateId('TXN'),
        accountCode,
        type: 'deposit',
        amount,
        balanceAfter: account.balance,
        balanceBefore: previousBalance,
        transactionDate: new Date().toISOString()
      }
    };
  },

  async withdrawMoney(accountCode, amount) {
    await randomDelay();
    logger.info('🎭 Mock Withdraw', { accountCode, amount });
    
    const account = transactionMockData.accounts[accountCode];
    if (!account) {
      throw new Error('Không tìm thấy tài khoản');
    }

    if (amount > account.balance) {
      throw new Error('Số dư không đủ');
    }

    // Check fixed-term withdrawal rules
    if (account.type !== 'no-term' && account.maturityDate) {
      const today = new Date();
      const maturityDate = new Date(account.maturityDate);
      
      if (today < maturityDate) {
        throw new Error('Sổ có kỳ hạn chỉ được rút khi đến hạn');
      }

      if (amount !== account.balance) {
        throw new Error('Sổ có kỳ hạn phải rút toàn bộ số dư khi đến hạn');
      }
    }

    const previousBalance = account.balance;
    account.balance -= amount;
    
    return {
      success: true,
      message: 'Rút tiền thành công',
      data: {
        transactionId: generateId('TXN'),
        accountCode,
        type: 'withdraw',
        amount,
        balanceAfter: account.balance,
        balanceBefore: previousBalance,
        transactionDate: new Date().toISOString()
      }
    };
  }
};
