import { jest } from '@jest/globals';

// Mock the service first
const mockTypeSavingService = {
  getAllTypeSavings: jest.fn(),
  getTypeSavingById: jest.fn(),
  createTypeSaving: jest.fn(),
  updateTypeSaving: jest.fn(),
  deleteTypeSaving: jest.fn()
};

const servicePath = new URL(
  '../../../src/services/TypeSaving/typeSaving.service.js',
  import.meta.url
).pathname;

jest.unstable_mockModule(servicePath, () => ({
  typeSavingService: mockTypeSavingService
}));

const {
  getAllTypeSavings,
  getTypeSavingById,
  createTypeSaving,
  updateTypeSaving,
  deleteTypeSaving
} = await import('../../../src/controllers/TypeSaving/typeSaving.controller.js');

describe('TypeSaving Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
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

  describe('getAllTypeSavings', () => {
    it('should return all type savings successfully', async () => {
      const mockTypeSavings = [
        { typeSavingId: 1, typeName: 'Type A', term: 6, interestRate: 5.5 },
        { typeSavingId: 2, typeName: 'Type B', term: 12, interestRate: 6.0 }
      ];

      mockTypeSavingService.getAllTypeSavings.mockResolvedValue(mockTypeSavings);

      await getAllTypeSavings(req, res);

      expect(mockTypeSavingService.getAllTypeSavings).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Get typesaving successfully',
        success: true,
        total: 2,
        data: mockTypeSavings
      });
    });

    it('should return empty array when no type savings exist', async () => {
      mockTypeSavingService.getAllTypeSavings.mockResolvedValue([]);

      await getAllTypeSavings(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Get typesaving successfully',
        success: true,
        total: 0,
        data: []
      });
    });

    it('should handle errors gracefully', async () => {
      mockTypeSavingService.getAllTypeSavings.mockRejectedValue(new Error('Database error'));

      await getAllTypeSavings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve type savings',
        success: false
      });
    });
  });

  describe('getTypeSavingById', () => {
    it('should return type saving by id successfully', async () => {
      const mockTypeSaving = { typeSavingId: 1, typeName: 'Type A', term: 6, interestRate: 5.5 };
      req.params.id = '1';

      mockTypeSavingService.getTypeSavingById.mockResolvedValue(mockTypeSaving);

      await getTypeSavingById(req, res);

      expect(mockTypeSavingService.getTypeSavingById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Get type saving successfully',
        success: true,
        total: 1,
        data: mockTypeSaving
      });
    });

    it('should return 404 when type saving not found', async () => {
      req.params.id = '999';
      mockTypeSavingService.getTypeSavingById.mockResolvedValue(null);

      await getTypeSavingById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'TypeSaving not found',
        success: false
      });
    });

    it('should handle errors when getting type saving', async () => {
      req.params.id = '1';
      mockTypeSavingService.getTypeSavingById.mockRejectedValue(new Error('Database error'));

      await getTypeSavingById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve type saving',
        success: false
      });
    });
  });

  describe('createTypeSaving', () => {
    it('should create type saving successfully', async () => {
      const mockTypeSaving = { typeSavingId: 1, typeName: 'New Type', term: 12, interestRate: 6.5 };
      req.body = { typename: 'New Type', term: 12, interestRate: 6.5 };

      mockTypeSavingService.createTypeSaving.mockResolvedValue(mockTypeSaving);

      await createTypeSaving(req, res);

      expect(mockTypeSavingService.createTypeSaving).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Create typesaving successfully',
        success: true,
        total: 1,
        data: mockTypeSaving
      });
    });

    it('should handle errors when creating type saving', async () => {
      req.body = { typename: 'New Type', term: 12, interestRate: 6.5 };
      mockTypeSavingService.createTypeSaving.mockRejectedValue(new Error('Validation error'));

      await createTypeSaving(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to create type saving',
        success: false
      });
    });
  });

  describe('updateTypeSaving', () => {
    it('should update type saving successfully', async () => {
      const mockUpdatedTypeSaving = { typeSavingId: 1, typeName: 'Updated Type', term: 12, interestRate: 7.0 };
      req.params.id = '1';
      req.body = { typename: 'Updated Type', interestRate: 7.0 };

      mockTypeSavingService.updateTypeSaving.mockResolvedValue(mockUpdatedTypeSaving);

      await updateTypeSaving(req, res);

      expect(mockTypeSavingService.updateTypeSaving).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Updated successfully',
        success: true,
        total: 1,
        data: mockUpdatedTypeSaving
      });
    });

    it('should return 404 when type saving to update not found', async () => {
      req.params.id = '999';
      req.body = { typename: 'Updated Type' };
      mockTypeSavingService.updateTypeSaving.mockResolvedValue(null);

      await updateTypeSaving(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'TypeSaving not found',
        success: false
      });
    });

    it('should handle errors when updating type saving', async () => {
      req.params.id = '1';
      req.body = { typename: 'Updated Type' };
      mockTypeSavingService.updateTypeSaving.mockRejectedValue(new Error('Update error'));

      await updateTypeSaving(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to update type saving',
        success: false
      });
    });
  });

  describe('deleteTypeSaving', () => {
    it('should delete type saving successfully', async () => {
      const mockDeletedTypeSaving = { typeSavingId: 1, typeName: 'Deleted Type', term: 6, interestRate: 5.5 };
      req.params.id = '1';

      mockTypeSavingService.deleteTypeSaving.mockResolvedValue(mockDeletedTypeSaving);

      await deleteTypeSaving(req, res);

      expect(mockTypeSavingService.deleteTypeSaving).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Deleted successfully',
        success: true,
        total: 1,
        data: mockDeletedTypeSaving
      });
    });

    it('should return 404 when type saving to delete not found', async () => {
      req.params.id = '999';
      mockTypeSavingService.deleteTypeSaving.mockResolvedValue(null);

      await deleteTypeSaving(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'TypeSaving not found',
        success: false
      });
    });

    it('should handle errors when deleting type saving', async () => {
      req.params.id = '1';
      mockTypeSavingService.deleteTypeSaving.mockRejectedValue(new Error('Delete error'));

      await deleteTypeSaving(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to delete type saving',
        success: false
      });
    });
  });
});
