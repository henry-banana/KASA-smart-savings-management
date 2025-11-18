import { 
  mockAccounts, 
  findAccountById, 
  addAccount, 
  updateAccountBalance 
} from '../data/accounts';
import { randomDelay, generateId } from '../utils';
import { logger } from '@/utils/logger';

export const mockAccountAdapter = {
  async getAccount(id) {
    await randomDelay();
    logger.info('🎭 Mock Get Account', { id });
    
    const account = findAccountById(id);
    if (!account) {
      throw new Error('Không tìm thấy sổ tiết kiệm');
    }
    
    return account;
  },

  async createAccount(accountData) {
    await randomDelay();
    logger.info('🎭 Mock Create Account', { customerName: accountData.customer_name });
    
    const newAccount = {
      id: generateId('SA'),
      customerId: generateId('CUST'),
      customer_name: accountData.customer_name,
      customerName: accountData.customer_name,
      id_card: accountData.id_card,
      idCard: accountData.id_card,
      address: accountData.address,
      savings_type: accountData.savings_type,
      type: accountData.savings_type,
      balance: parseFloat(accountData.initial_deposit),
      open_date: accountData.open_date,
      openDate: accountData.open_date,
      status: 'active'
    };
    
    addAccount(newAccount);
    return newAccount;
  },

  async deposit(accountId, amount) {
    await randomDelay();
    logger.info('🎭 Mock Deposit', { accountId, amount });
    
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
