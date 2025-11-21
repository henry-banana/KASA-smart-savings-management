import { apiClient } from './apiClient';
import { mockUserAdapter } from '@/mocks/adapters/userAdapter';
import { USE_MOCK } from '@/config/app.config';
import { logger } from '@/utils/logger';

/**
 * User API
 * Auto switches between mock and real API based on config
 */
export const userApi = {
  /**
   * Get all users
   */
  async getAllUsers() {
    if (USE_MOCK) {
      logger.info('📝 Using MOCK for getAllUsers');
      return mockUserAdapter.getAllUsers();
    }
    
    logger.info('🌐 Using REAL API for getAllUsers');
    const response = await apiClient.get('/api/users');
    return response.data;
  },

  /**
   * Get user by ID
   */
  async getUserById(id) {
    if (USE_MOCK) {
      logger.info('📝 Using MOCK for getUserById');
      return mockUserAdapter.getUserById(id);
    }
    
    logger.info('🌐 Using REAL API for getUserById');
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },

  /**
   * Create new user
   */
  async createUser(userData) {
    if (USE_MOCK) {
      logger.info('📝 Using MOCK for createUser');
      return mockUserAdapter.createUser(userData);
    }
    
    logger.info('🌐 Using REAL API for createUser');
    const response = await apiClient.post('/api/users', userData);
    return response.data;
  },

  /**
   * Update user
   */
  async updateUser(username, updates) {
    if (USE_MOCK) {
      logger.info('📝 Using MOCK for updateUser');
      return mockUserAdapter.updateUser(username, updates);
    }
    
    logger.info('🌐 Using REAL API for updateUser');
    const response = await apiClient.put(`/api/users/${username}`, updates);
    return response.data;
  },

  /**
   * Toggle user status (enable/disable)
   */
  async toggleUserStatus(username) {
    if (USE_MOCK) {
      logger.info('📝 Using MOCK for toggleUserStatus');
      return mockUserAdapter.toggleUserStatus(username);
    }
    
    logger.info('🌐 Using REAL API for toggleUserStatus');
    const response = await apiClient.patch(`/api/users/${username}/toggle-status`);
    return response.data;
  },

  /**
   * Delete user
   */
  async deleteUser(username) {
    if (USE_MOCK) {
      logger.info('📝 Using MOCK for deleteUser');
      return mockUserAdapter.deleteUser(username);
    }
    
    logger.info('🌐 Using REAL API for deleteUser');
    const response = await apiClient.delete(`/api/users/${username}`);
    return response.data;
  }
};
