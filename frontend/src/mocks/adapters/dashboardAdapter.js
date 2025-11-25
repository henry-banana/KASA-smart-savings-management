/**
 * Mock adapter for Dashboard API
 * Simulates dashboard statistics API endpoints
 */

import { getDashboardData } from '../data/dashboard';
import { mockTypeSavings, updateTypeSaving } from '../data/typeSavings';
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
    // Derive dynamically from current mockTypeSavings
    const data = mockTypeSavings.map(ts => ({
      typeSavingId: ts.typeSavingId,
      typeName: ts.typeName,
      rate: ts.interestRate,
      term: ts.term,
      editable: true
    }));
    return {
      success: true,
      message: 'Interest rates retrieved successfully',
      data
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
    
    // Apply updates to underlying type savings
    rates.forEach(r => {
      const ts = mockTypeSavings.find(t => t.typeSavingId === r.typeSavingId);
      if (!ts) return;
      // Update interest rate if valid
      if (typeof r.rate === 'number' && r.rate > 0) {
        ts.interestRate = r.rate;
      }
      // Update term if provided and valid (allow 0 for no-term)
      if (typeof r.term === 'number' && r.term >= 0) {
        ts.term = r.term;
      }
    });
    const updated = mockTypeSavings.map(ts => ({
      typeSavingId: ts.typeSavingId,
      typeName: ts.typeName,
      rate: ts.interestRate,
      term: ts.term,
      editable: true
    }));
    return {
      success: true,
      message: 'Interest rates updated successfully',
      data: updated
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
  },

  /**
   * Get recent transactions
   * Simulates: GET /api/dashboard/recent-transactions
   */
  async getRecentTransactions() {
    await randomDelay();
    logger.info('🎭 Mock Recent Transactions');
    
    const { getRecentTransactions } = await import('../data/dashboard');
    const transactions = getRecentTransactions();
    
    return {
      success: true,
      message: 'Recent transactions retrieved successfully',
      data: transactions
    };
  }
};
