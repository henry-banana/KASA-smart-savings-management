import { jest } from '@jest/globals';

// Mock the Branch model first
const mockBranch = {
  getAll: jest.fn()
};

const branchModelPath = new URL(
  '../../../src/models/Branch.js',
  import.meta.url
).pathname;

jest.unstable_mockModule(branchModelPath, () => ({
  Branch: mockBranch
}));

const { getAllBranchName } = await import('../../../src/controllers/Branch/branch.controller.js');

describe('Branch Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
    // Suppress console.error for cleaner test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('getAllBranchName', () => {
    it('should return all branch names successfully', async () => {
      const mockBranches = [
        { branchid: 1, branchname: 'Branch A', address: '123 Street' },
        { branchid: 2, branchname: 'Branch B', address: '456 Avenue' },
        { branchid: 3, branchname: 'Branch C', address: '789 Road' }
      ];

      mockBranch.getAll.mockResolvedValue(mockBranches);

      await getAllBranchName(req, res);

      expect(mockBranch.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Branches retrieved successfully',
        success: true,
        total: 3,
        data: ['Branch A', 'Branch B', 'Branch C']
      });
    });

    it('should return empty array when no branches exist', async () => {
      mockBranch.getAll.mockResolvedValue([]);

      await getAllBranchName(req, res);

      expect(mockBranch.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Branches retrieved successfully',
        success: true,
        total: 0,
        data: []
      });
    });

    it('should handle errors with custom status code', async () => {
      const error = new Error('Database connection failed');
      error.status = 503;
      mockBranch.getAll.mockRejectedValue(error);

      await getAllBranchName(req, res);

      expect(mockBranch.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve branch name',
        success: false
      });
    });

    it('should handle errors with default 500 status code', async () => {
      const error = new Error('Unexpected error');
      mockBranch.getAll.mockRejectedValue(error);

      await getAllBranchName(req, res);

      expect(mockBranch.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve branch name',
        success: false
      });
    });

    it('should extract only branch names from full branch objects', async () => {
      const mockBranches = [
        { branchid: 1, branchname: 'Main Branch', address: 'Downtown', phone: '123456' },
        { branchid: 2, branchname: 'North Branch', address: 'Uptown', phone: '789012' }
      ];

      mockBranch.getAll.mockResolvedValue(mockBranches);

      await getAllBranchName(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Branches retrieved successfully',
        success: true,
        total: 2,
        data: ['Main Branch', 'North Branch']
      });
    });
  });
});
