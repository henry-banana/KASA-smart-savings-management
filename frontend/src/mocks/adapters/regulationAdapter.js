// TODO: replace with real backend API for QĐ6 – Regulations
import { 
  getRegulations,
  updateRegulations
} from '../data/regulations.js';
import { mockTypeSavings } from '../data/typeSavings.js';
import { 
  buildGetRegulationsResponse,
  buildUpdateRegulationsResponse,
  buildRegulationErrorResponse
} from '../responses/regulation.responses.js';
import { randomDelay } from '../utils.js';
import { logger } from '@/utils/logger';

/**
 * Mock adapter for Regulation endpoints (QĐ6)
 * Intercepts /api/regulations requests
 */
export const mockRegulationAdapter = {
  /**
   * GET /api/regulations - Get current regulations
   */
  async getRegulations() {
    await randomDelay();
    logger.info('🎭 Mock Get Regulations');
    
    const regulations = getRegulations();
    return buildGetRegulationsResponse(regulations);
  },

  /**
   * PUT /api/regulations - Update regulations
   */
  async updateRegulations(payload) {
    await randomDelay();
    logger.info('🎭 Mock Update Regulations', { payload });
    
    // Validation
    if (!payload.minimumDepositAmount || payload.minimumDepositAmount <= 0) {
      logger.error('Invalid minimumDepositAmount');
      return buildRegulationErrorResponse('Minimum deposit amount must be greater than 0');
    }
    
    if (payload.minimumTermDays < 0) {
      logger.error('Invalid minimumTermDays');
      return buildRegulationErrorResponse('Minimum term days must be greater than or equal to 0');
    }
    
    const updatedRegulations = updateRegulations(payload);
    return buildUpdateRegulationsResponse(updatedRegulations);
  },

  /**
   * GET /api/regulations/interest-rates - Get interest rates for all saving types
   */
  async getInterestRates() {
    await randomDelay();
    logger.info('🎭 Mock Get Interest Rates');
    
    // Derive from current mockTypeSavings with canonical field names
    const data = mockTypeSavings.map(ts => ({
      typeSavingId: ts.typeSavingId,
      typeName: ts.typeName,
      interestRate: ts.interestRate, // Canonical field name
      term: ts.term, // Term in months (0 = no term)
      editable: true
    }));
    
    return {
      message: 'Get interest rates successfully',
      success: true,
      data
    };
  },

  /**
   * PUT /api/regulations/interest-rates - Update interest rates
   */
  async updateInterestRates(rates) {
    await randomDelay();
    logger.info('🎭 Mock Update Interest Rates', { rates });
    
    // Validation
    if (!Array.isArray(rates)) {
      return {
        message: 'Invalid rates format',
        success: false
      };
    }
    
    // Apply updates to underlying type savings
    rates.forEach(r => {
      const ts = mockTypeSavings.find(t => t.typeSavingId === r.typeSavingId);
      if (!ts) return;
      
      // Update interest rate if valid (accept both interestRate and rate for backward compatibility)
      const newRate = r.interestRate ?? r.rate;
      if (typeof newRate === 'number' && newRate > 0) {
        ts.interestRate = newRate;
      }
      
      // Update term if provided
      if (typeof r.term === 'number' && r.term >= 0) {
        ts.term = r.term;
      }
    });
    
    // Return updated rates with canonical field names
    const updated = mockTypeSavings.map(ts => ({
      typeSavingId: ts.typeSavingId,
      typeName: ts.typeName,
      interestRate: ts.interestRate, // Canonical field name
      term: ts.term, // Term in months (0 = no term)
      editable: true
    }));
    
    return {
      message: 'Update interest rates successfully',
      success: true,
      data: updated
    };
  },

  /**
   * GET /api/regulations/history - Get regulation change history
   */
  async getChangeHistory() {
    await randomDelay();
    logger.info('🎭 Mock Get Change History');
    
    // Mock history data with contract-compliant field labels
    const history = [
      {
        date: '2025-11-01',
        user: 'admin',
        field: 'Minimum Deposit Amount',
        oldValue: '50,000 VND',
        newValue: '100,000 VND'
      },
      {
        date: '2025-10-15',
        user: 'admin',
        field: 'Minimum Term (Days)', // Contract field label
        oldValue: '10 days',
        newValue: '15 days'
      },
      {
        date: '2025-09-20',
        user: 'admin',
        field: '3-Month Interest Rate',
        oldValue: '4.5%',
        newValue: '5.0%'
      }
    ];
    
    return {
      message: 'Get change history successfully',
      success: true,
      data: history
    };
  }
};
