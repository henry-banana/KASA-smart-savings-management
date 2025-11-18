import { 
  mockAccounts, 
  findAccountById 
} from '../data/accounts';
import { searchMockData } from '../searchMockData';
import { randomDelay, generateId } from '../utils';
import { logger } from '@/utils/logger';

export const mockSavingBookAdapter = {
  async searchSavingBooks(keyword = '', typeFilter = 'all', statusFilter = 'all') {
    await randomDelay();
    logger.info('🎭 Mock Search', { keyword, typeFilter, statusFilter });
    
    let results = searchMockData.accounts.filter(account => {
      const matchesSearch = !keyword || 
        account.id.toLowerCase().includes(keyword.toLowerCase()) ||
        account.customer.toLowerCase().includes(keyword.toLowerCase());
      
      const matchesType = typeFilter === 'all' || account.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || account.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
    
    return { 
      success: true, 
      data: results,
      total: results.length 
    };
  },

  async getSavingBookById(id) {
    await randomDelay();
    logger.info('🎭 Mock Get Saving Book', { id });
    
    const account = searchMockData.accounts.find(acc => acc.id === id);
    if (!account) {
      throw new Error('Không tìm thấy sổ tiết kiệm');
    }
    
    return { success: true, data: account };
  }
};
