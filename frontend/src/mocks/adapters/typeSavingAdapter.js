import { 
  mockTypeSavings,
  findTypeSavingById,
  findTypeSavingByName,
  addTypeSaving,
  updateTypeSaving as updateTypeSavingData,
  deleteTypeSaving as deleteTypeSavingData
} from '../data/typeSavings';
import { randomDelay, generateId } from '../utils';
import { logger } from '@/utils/logger';

export const mockTypeSavingAdapter = {
  /**
   * Get all type savings
   */
  async getAllTypeSavings() {
    await randomDelay();
    logger.info('🎭 Mock Get All Type Savings');
    
    return {
      message: 'Get typesaving successfully',
      success: true,
      data: mockTypeSavings,
      total: mockTypeSavings.length
    };
  },

  /**
   * Get type saving by ID
   */
  async getTypeSavingById(typeSavingId) {
    await randomDelay();
    logger.info('🎭 Mock Get Type Saving By ID', { typeSavingId });
    
    const typeSaving = findTypeSavingById(typeSavingId);
    if (!typeSaving) {
      throw new Error('Type saving not found');
    }
    
    // TODO: Add statistics (totalActiveSavingBooks, totalDeposits)
    return {
      message: 'Get typesaving successfully',
      success: true,
      data: {
        ...typeSaving,
        totalActiveSavingBooks: 0,
        totalDeposits: 0
      }
    };
  },

  /**
   * Create new type saving
   */
  async createTypeSaving(data) {
    await randomDelay();
    logger.info('🎭 Mock Create Type Saving', { data });
    
    // Validation
    if (!data.typename?.trim()) {
      throw new Error('Type name is required');
    }
    if (data.term === undefined || data.term === null) {
      throw new Error('Term is required');
    }
    if (!data.interestRate || data.interestRate <= 0) {
      throw new Error('Interest rate must be greater than 0');
    }
    if (!data.minimumDeposit || data.minimumDeposit <= 0) {
      throw new Error('Minimum deposit must be greater than 0');
    }

    // Check if type name already exists
    if (findTypeSavingByName(data.typename)) {
      throw new Error('Type saving with this name already exists');
    }

    // Generate new ID
    const newId = generateId('TS');
    
    const newTypeSaving = {
      typeSavingId: newId,
      typeName: data.typename,
      term: Number(data.term),
      interestRate: Number(data.interestRate),
      minimumDeposit: Number(data.minimumDeposit)
    };
    
    addTypeSaving(newTypeSaving);
    
    return {
      message: 'Create typesaving successfully',
      success: true,
      data: newTypeSaving
    };
  },

  /**
   * Update type saving
   */
  async updateTypeSaving(typeSavingId, data) {
    await randomDelay();
    logger.info('🎭 Mock Update Type Saving', { typeSavingId, data });
    
    const typeSaving = findTypeSavingById(typeSavingId);
    if (!typeSaving) {
      throw new Error('Type saving not found');
    }

    // Validation
    if (data.typename && !data.typename.trim()) {
      throw new Error('Type name cannot be empty');
    }
    if (data.interestRate !== undefined && data.interestRate <= 0) {
      throw new Error('Interest rate must be greater than 0');
    }
    if (data.minimumDeposit !== undefined && data.minimumDeposit <= 0) {
      throw new Error('Minimum deposit must be greater than 0');
    }

    const updates = {};
    if (data.typename) updates.typeName = data.typename;
    if (data.term !== undefined) updates.term = Number(data.term);
    if (data.interestRate !== undefined) updates.interestRate = Number(data.interestRate);
    if (data.minimumDeposit !== undefined) updates.minimumDeposit = Number(data.minimumDeposit);

    const updatedTypeSaving = updateTypeSavingData(typeSavingId, updates);
    
    return {
      message: 'Update typesaving successfully',
      success: true,
      data: updatedTypeSaving
    };
  },

  /**
   * Delete type saving
   */
  async deleteTypeSaving(typeSavingId) {
    await randomDelay();
    logger.info('🎭 Mock Delete Type Saving', { typeSavingId });
    
    const typeSaving = findTypeSavingById(typeSavingId);
    if (!typeSaving) {
      throw new Error('Type saving not found');
    }

    // TODO: Check if there are active saving books using this type
    // For now, just delete
    const deleted = deleteTypeSavingData(typeSavingId);
    
    if (!deleted) {
      throw new Error('Failed to delete type saving');
    }
    
    return {
      message: 'Delete typesaving successfully',
      success: true
    };
  }
};
