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
      message: 'Get dashboard statistics successfully',
      success: true,
      data
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
      message: 'Get recent transactions successfully',
      success: true,
      data: transactions,
      total: transactions.length
    };
  }
};
