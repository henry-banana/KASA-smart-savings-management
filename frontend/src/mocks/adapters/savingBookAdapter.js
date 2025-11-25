import { 
  mockSavingBooks,
  findSavingBookById,
  findSavingBooksByCustomer
} from '../data/savingBooks';
import { 
  findCustomerById 
} from '../data/customers';
import { 
  findTypeSavingById 
} from '../data/typeSavings';
import { randomDelay, generateId } from '../utils';
import { logger } from '@/utils/logger';

export const mockSavingBookAdapter = {
  async searchSavingBooks(keyword = '', typeFilter = 'all', statusFilter = 'all') {
    await randomDelay();
    logger.info('🎭 Mock Search', { keyword, typeFilter, statusFilter });
    
    // Map savingBooks to old account format for backward compatibility
    let results = mockSavingBooks.map(sb => {
      const customer = findCustomerById(sb.customerid);
      const type = findTypeSavingById(sb.typeid);
      
      return {
        id: sb.bookid,
        customer: customer?.fullname || 'Unknown',
        type: type?.typename || 'Unknown',
        status: sb.status,
        balance: sb.currentbalance,
        openDate: sb.registertime,
        interestRate: type?.interestrate || 0,
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
    
    const customer = findCustomerById(savingBook.customerid);
    const type = findTypeSavingById(savingBook.typeid);
    
    // Map to old format
    const account = {
      id: savingBook.bookid,
      customer: customer?.fullname || 'Unknown',
      type: type?.typename || 'Unknown',
      status: savingBook.status,
      balance: savingBook.currentbalance,
      openDate: savingBook.registertime,
      interestRate: type?.interestrate || 0,
      term: type?.term || 0
    };
    
    return { success: true, data: account };
  }
};
