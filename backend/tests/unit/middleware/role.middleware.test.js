import { jest } from '@jest/globals';
import checkRole from '../../../src/middleware/role.middleware.js';

describe('Role Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkRole - Access Control', () => {
    it('should allow access when user has required role', () => {
      req.user = { roleName: 'Admin' };
      const middleware = checkRole(['admin', 'accountant']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow access with case-insensitive role matching', () => {
      req.user = { roleName: 'ACCOUNTANT' };
      const middleware = checkRole(['admin', 'accountant']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access when user role not in allowed roles', () => {
      req.user = { roleName: 'Teller' };
      const middleware = checkRole(['admin', 'accountant']);

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden: Insufficient permissions. Required roles: admin, accountant',
        success: false
      });
    });

    it('should deny access when user has no role', () => {
      req.user = {};
      const middleware = checkRole(['admin']);

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden: No role assigned',
        success: false
      });
    });

    it('should deny access when req.user is missing', () => {
      req.user = null;
      const middleware = checkRole(['admin']);

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden: No role assigned',
        success: false
      });
    });

    it('should handle errors gracefully', () => {
      req.user = { roleName: 'Admin' };
      const middleware = checkRole(['admin']);
      
      // Suppress console.error for this test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Force an error by making includes throw
      jest.spyOn(Array.prototype, 'includes').mockImplementation(() => {
        throw new Error('Test error');
      });

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal server error',
        success: false
      });

      consoleErrorSpy.mockRestore();
      Array.prototype.includes.mockRestore();
    });

    it('should work with single allowed role', () => {
      req.user = { roleName: 'Admin' };
      const middleware = checkRole(['admin']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should work with multiple allowed roles', () => {
      req.user = { roleName: 'Accountant' };
      const middleware = checkRole(['admin', 'accountant', 'teller']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
