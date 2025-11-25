import { 
  mockUserAccounts, 
  findUserByUsername,
  addUserAccount,
  updateUserAccount,
  deleteUserAccount
} from '../data/users';
import { randomDelay, generateId } from '../utils';
import { logger } from '@/utils/logger';

export const mockUserAdapter = {
  /**
   * Get all users
   */
  async getAllUsers() {
    await randomDelay();
    logger.info('🎭 Mock Get All Users');
    
    // Transform to match frontend format
    return mockUserAccounts.map(user => ({
      id: user.employeeid,
      username: user.userid,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      createdDate: user.createdDate
    }));
  },

  /**
   * Get user by ID
   */
  async getUserById(id) {
    await randomDelay();
    logger.info('🎭 Mock Get User By ID', { id });
    
    const user = mockUserAccounts.find(u => u.employeeid === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      id: user.employeeid,
      username: user.userid,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      createdDate: user.createdDate
    };
  },

  /**
   * Create new user
   */
  async createUser(userData) {
    await randomDelay();
    logger.info('🎭 Mock Create User', { username: userData.username });
    
    // Check if username exists
    if (findUserByUsername(userData.username)) {
      throw new Error('Username already exists');
    }
    
    // Generate employee ID
    const employeeId = generateId('EMP');
    
    const newUser = {
      userid: userData.username,
      password: userData.password, // In real app, this would be hashed
      employeeid: employeeId,
      role: userData.role,
      fullName: userData.fullName,
      email: userData.email,
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      lastlogin: null
    };
    
    addUserAccount(newUser);
    
    // Return in frontend format
    return {
      id: newUser.employeeid,
      username: newUser.userid,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      createdDate: newUser.createdDate
    };
  },

  /**
   * Update user by ID
   */
  async updateUser(id, updates) {
    await randomDelay();
    logger.info('🎭 Mock Update User', { id, updates });
    
    const user = mockUserAccounts.find(u => u.employeeid === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user data
    const updatedUser = updateUserAccount(user.userid, {
      userid: updates.username || user.userid,
      fullName: updates.fullName || user.fullName,
      email: updates.email || user.email,
      role: updates.roleName || updates.role || user.role
    });
    
    // Return in frontend format
    return {
      id: updatedUser.employeeid,
      username: updatedUser.userid,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      roleName: updatedUser.role,
      status: updatedUser.status,
      createdAt: updatedUser.createdDate
    };
  },

  /**
   * Update user status by ID
   */
  async updateUserStatus(id, status) {
    await randomDelay();
    logger.info('🎭 Mock Update User Status', { id, status });
    
    const user = mockUserAccounts.find(u => u.employeeid === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = updateUserAccount(user.userid, { status });
    
    return {
      id: updatedUser.employeeid,
      username: updatedUser.userid,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      roleName: updatedUser.role,
      status: updatedUser.status,
      createdAt: updatedUser.createdDate
    };
  },

  /**
   * Delete user by ID
   */
  async deleteUser(id) {
    await randomDelay();
    logger.info('🎭 Mock Delete User', { id });
    
    const user = mockUserAccounts.find(u => u.employeeid === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    const deleted = deleteUserAccount(user.userid);
    if (!deleted) {
      throw new Error('Failed to delete user');
    }
    
    return {
      success: true,
      message: 'User deleted successfully'
    };
  }
};
