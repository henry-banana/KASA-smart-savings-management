/**
 * Mock adapter for Dashboard API
 * Simulates dashboard statistics API endpoints
 */

import { getDashboardData } from '../data/dashboard';
import { randomDelay } from '../utils';
import { logger } from '@/utils/logger';

export const mockDashboardAdapter = {
  /**
   * Get dashboard statistics
   * Simulates: GET /api/dashboard/stats
   */
  async getDashboardStats() {
    await randomDelay();
    logger.info('🎭 Mock Dashboard Stats');
    
    const data = getDashboardData();
    
    return {
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data
    };
  },

  /**
   * Get interest rates for all saving types
   * Simulates: GET /api/regulations/interest-rates
   */
  async getInterestRates() {
    await randomDelay();
    logger.info('🎭 Mock Interest Rates');
    
    return {
      success: true,
      message: 'Interest rates retrieved successfully',
      data: [
        { 
          typeSavingId: 'TS01',
          typeName: 'No Term', 
          rate: 0.2,
          editable: true 
        },
        { 
          typeSavingId: 'TS02',
          typeName: '3 Months', 
          rate: 0.5,
          editable: true 
        },
        { 
          typeSavingId: 'TS03',
          typeName: '6 Months', 
          rate: 0.55,
          editable: true 
        }
      ]
    };
  },

  /**
   * Update interest rates
   * Simulates: PUT /api/regulations/interest-rates
   */
  async updateInterestRates(rates) {
    await randomDelay();
    logger.info('🎭 Mock Update Interest Rates', { rates });
    
    // Validate rates
    if (!Array.isArray(rates)) {
      return {
        success: false,
        message: 'Invalid rates format'
      };
    }
    
    // Simulate successful update
    return {
      success: true,
      message: 'Interest rates updated successfully',
      data: rates
    };
  },

  /**
   * Get regulation change history
   * Simulates: GET /api/regulations/history
   */
  async getChangeHistory() {
    await randomDelay();
    logger.info('🎭 Mock Change History');
    
    // Mock history data
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
        field: 'Minimum Withdrawal Days',
        oldValue: '10 days',
        newValue: '15 days'
      },
      {
        date: '2025-09-20',
        user: 'admin',
        field: '3-Month Interest Rate',
        oldValue: '4.0%',
        newValue: '4.5%'
      },
      {
        date: '2025-08-10',
        user: 'admin',
        field: '6-Month Interest Rate',
        oldValue: '5.0%',
        newValue: '5.5%'
      }
    ];
    
    return {
      success: true,
      message: 'Change history retrieved successfully',
      data: history
    };
  }
};
