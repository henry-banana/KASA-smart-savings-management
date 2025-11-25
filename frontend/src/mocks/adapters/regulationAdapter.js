// TODO: replace with real backend API for QĐ6 – Regulations
import { 
  getRegulations,
  updateRegulations
} from '../data/regulations.js';
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
  }
};
