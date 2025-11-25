import { 
  mockSavingBooks,
  findSavingBookById,
  findSavingBooksByCitizenId
} from '../data/savingBooks';
import { 
  findTypeSavingById 
} from '../data/typeSavings';
import { randomDelay, generateId } from '../utils';
import { logger } from '@/utils/logger';

export const mockSavingBookAdapter = {
  async searchSavingBooks(keyword = '', typeFilter = 'all', statusFilter = 'all') {
    await randomDelay();
    logger.info('🎭 Mock Search', { keyword, typeFilter, statusFilter });
    
    // Map savingBooks to account format with embedded customer data
    let results = mockSavingBooks.map(sb => {
      const type = findTypeSavingById(sb.typeSavingId);
      
      return {
        id: sb.bookId,
        customer: sb.customerName,
        type: type?.typeName || 'Unknown',
        status: sb.status,
        balance: sb.balance,
        openDate: sb.openDate,
        interestRate: type?.interestRate || 0,
        term: type?.term || 0
      };
    });
    
    // Apply filters
    results = results.filter(account => {
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
    
    const savingBook = findSavingBookById(id);
    if (!savingBook) {
      throw new Error('Không tìm thấy sổ tiết kiệm');
    }
    
    const type = findTypeSavingById(savingBook.typeSavingId);
    
    // Map to account format
    const account = {
      id: savingBook.bookId,
      customer: savingBook.customerName,
      type: type?.typeName || 'Unknown',
      status: savingBook.status,
      balance: savingBook.balance,
      openDate: savingBook.openDate,
      interestRate: type?.interestRate || 0,
      term: type?.term || 0
    };
    
    return { success: true, data: account };
  },

  async createSavingBook(formData) {
    await randomDelay();
    logger.info('🎭 Mock Create Saving Book', formData);
    // Tạo mã sổ tiết kiệm giả lập
    const now = new Date();
    const code = `SBK${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${Math.floor(1000 + Math.random() * 9000)}`;
    // Có thể push vào mockSavingBooks nếu muốn lưu lại
    return {
      success: true,
      data: {
        accountCode: code
      }
    };
  }
};
