import { jest } from '@jest/globals';

// Mock the repository first
const mockTypeSavingRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

const repoPath = new URL(
  '../../../src/repositories/TypeSaving/TypeSavingRepository.js',
  import.meta.url
).pathname;

jest.unstable_mockModule(repoPath, () => ({
  typeSavingRepository: mockTypeSavingRepository
}));

const { typeSavingService } = await import('../../../src/services/TypeSaving/typeSaving.service.js');

describe('TypeSaving Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockTypeSavingRepository.findAll.mockReset();
    mockTypeSavingRepository.findById.mockReset();
    mockTypeSavingRepository.create.mockReset();
    mockTypeSavingRepository.update.mockReset();
    mockTypeSavingRepository.delete.mockReset();
  });

  describe('_mapToApiFormat', () => {
    it('should map database record to API format', () => {
      const dbRecord = {
        typeid: 1,
        typename: 'Fixed Term',
        termperiod: 12,
        interest: 6.5
      };

      const result = typeSavingService._mapToApiFormat(dbRecord);

      expect(result).toEqual({
        typeSavingId: 1,
        typeName: 'Fixed Term',
        term: 12,
        interestRate: 6.5
      });
    });

    it('should return null for null input', () => {
      const result = typeSavingService._mapToApiFormat(null);
      expect(result).toBeNull();
    });

    it('should return null for undefined input', () => {
      const result = typeSavingService._mapToApiFormat(undefined);
      expect(result).toBeNull();
    });
  });

  describe('getAllTypeSavings', () => {
    it('should return all type savings in API format', async () => {
      const mockDbRecords = [
        { typeid: 1, typename: 'Type A', termperiod: 6, interest: 5.5 },
        { typeid: 2, typename: 'Type B', termperiod: 12, interest: 6.0 }
      ];

      mockTypeSavingRepository.findAll.mockResolvedValue(mockDbRecords);

      const result = await typeSavingService.getAllTypeSavings();

      expect(mockTypeSavingRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { typeSavingId: 1, typeName: 'Type A', term: 6, interestRate: 5.5 },
        { typeSavingId: 2, typeName: 'Type B', term: 12, interestRate: 6.0 }
      ]);
    });

    it('should return empty array when no type savings exist', async () => {
      mockTypeSavingRepository.findAll.mockResolvedValue([]);

      const result = await typeSavingService.getAllTypeSavings();

      expect(result).toEqual([]);
    });
  });

  describe('getTypeSavingById', () => {
    it('should return type saving by id in API format', async () => {
      const mockDbRecord = { typeid: 1, typename: 'Type A', termperiod: 6, interest: 5.5 };
      mockTypeSavingRepository.findById.mockResolvedValue(mockDbRecord);

      const result = await typeSavingService.getTypeSavingById(1);

      expect(mockTypeSavingRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        typeSavingId: 1,
        typeName: 'Type A',
        term: 6,
        interestRate: 5.5
      });
    });

    it('should return null when type saving not found', async () => {
      mockTypeSavingRepository.findById.mockResolvedValue(null);

      const result = await typeSavingService.getTypeSavingById(999);

      expect(result).toBeNull();
    });

    it('should throw error when id is not provided', async () => {
      await expect(typeSavingService.getTypeSavingById()).rejects.toThrow('ID is required');
    });

    it('should throw error when id is null', async () => {
      await expect(typeSavingService.getTypeSavingById(null)).rejects.toThrow('ID is required');
    });
  });

  describe('createTypeSaving', () => {
    it('should create type saving successfully', async () => {
      const inputData = {
        typename: 'New Type',
        term: 12,
        interestRate: 6.5
      };

      const mockCreated = {
        typeid: 1,
        typename: 'New Type',
        termperiod: 12,
        interest: 6.5
      };

      mockTypeSavingRepository.create.mockResolvedValue(mockCreated);

      const result = await typeSavingService.createTypeSaving(inputData);

      expect(mockTypeSavingRepository.create).toHaveBeenCalledWith({
        typename: 'New Type',
        termperiod: 12,
        interest: 6.5
      });
      expect(result).toEqual({
        typeSavingId: 1,
        typeName: 'New Type',
        term: 12,
        interestRate: 6.5
      });
    });

    it('should trim whitespace from typename', async () => {
      const inputData = {
        typename: '  Trimmed Type  ',
        term: 6,
        interestRate: 5.0
      };

      const mockCreated = {
        typeid: 1,
        typename: 'Trimmed Type',
        termperiod: 6,
        interest: 5.0
      };

      mockTypeSavingRepository.create.mockResolvedValue(mockCreated);

      await typeSavingService.createTypeSaving(inputData);

      expect(mockTypeSavingRepository.create).toHaveBeenCalledWith({
        typename: 'Trimmed Type',
        termperiod: 6,
        interest: 5.0
      });
    });

    it('should throw error when typename is missing', async () => {
      const inputData = {
        term: 12,
        interestRate: 6.5
      };

      await expect(typeSavingService.createTypeSaving(inputData)).rejects.toThrow('Type name is required');
    });

    it('should throw error when typename is empty string', async () => {
      const inputData = {
        typename: '   ',
        term: 12,
        interestRate: 6.5
      };

      await expect(typeSavingService.createTypeSaving(inputData)).rejects.toThrow('Type name is required');
    });

    it('should throw error when term is missing', async () => {
      const inputData = {
        typename: 'Type A',
        interestRate: 6.5
      };

      await expect(typeSavingService.createTypeSaving(inputData)).rejects.toThrow('Term is required');
    });

    it('should throw error when term is null', async () => {
      const inputData = {
        typename: 'Type A',
        term: null,
        interestRate: 6.5
      };

      await expect(typeSavingService.createTypeSaving(inputData)).rejects.toThrow('Term is required');
    });

    it('should throw error when interestRate is missing', async () => {
      const inputData = {
        typename: 'Type A',
        term: 12
      };

      await expect(typeSavingService.createTypeSaving(inputData)).rejects.toThrow('Interest rate must be greater than 0');
    });

    it('should throw error when interestRate is zero', async () => {
      const inputData = {
        typename: 'Type A',
        term: 12,
        interestRate: 0
      };

      await expect(typeSavingService.createTypeSaving(inputData)).rejects.toThrow('Interest rate must be greater than 0');
    });

    it('should throw error when interestRate is negative', async () => {
      const inputData = {
        typename: 'Type A',
        term: 12,
        interestRate: -1
      };

      await expect(typeSavingService.createTypeSaving(inputData)).rejects.toThrow('Interest rate must be greater than 0');
    });
  });

  describe('updateTypeSaving', () => {
    it('should update type saving successfully', async () => {
      const updateData = {
        typename: 'Updated Type',
        term: 12,
        interestRate: 7.0
      };

      const mockUpdated = {
        typeid: 1,
        typename: 'Updated Type',
        termperiod: 12,
        interest: 7.0
      };

      mockTypeSavingRepository.update.mockResolvedValue(mockUpdated);

      const result = await typeSavingService.updateTypeSaving(1, updateData);

      expect(mockTypeSavingRepository.update).toHaveBeenCalledWith(1, {
        typename: 'Updated Type',
        termperiod: 12,
        interest: 7.0
      });
      expect(result).toEqual({
        typeSavingId: 1,
        typeName: 'Updated Type',
        term: 12,
        interestRate: 7.0
      });
    });

    it('should update only typename', async () => {
      const updateData = { typename: 'Only Name' };

      const mockUpdated = {
        typeid: 1,
        typename: 'Only Name',
        termperiod: 6,
        interest: 5.5
      };

      mockTypeSavingRepository.update.mockResolvedValue(mockUpdated);

      await typeSavingService.updateTypeSaving(1, updateData);

      expect(mockTypeSavingRepository.update).toHaveBeenCalledWith(1, {
        typename: 'Only Name'
      });
    });

    it('should update only term', async () => {
      const updateData = { term: 24 };

      const mockUpdated = {
        typeid: 1,
        typename: 'Type A',
        termperiod: 24,
        interest: 5.5
      };

      mockTypeSavingRepository.update.mockResolvedValue(mockUpdated);

      await typeSavingService.updateTypeSaving(1, updateData);

      expect(mockTypeSavingRepository.update).toHaveBeenCalledWith(1, {
        termperiod: 24
      });
    });

    it('should update only interestRate', async () => {
      const updateData = { interestRate: 8.5 };

      const mockUpdated = {
        typeid: 1,
        typename: 'Type A',
        termperiod: 6,
        interest: 8.5
      };

      mockTypeSavingRepository.update.mockResolvedValue(mockUpdated);

      await typeSavingService.updateTypeSaving(1, updateData);

      expect(mockTypeSavingRepository.update).toHaveBeenCalledWith(1, {
        interest: 8.5
      });
    });

    it('should trim whitespace from typename on update', async () => {
      const updateData = { typename: '  Trimmed Update  ' };

      const mockUpdated = {
        typeid: 1,
        typename: 'Trimmed Update',
        termperiod: 6,
        interest: 5.5
      };

      mockTypeSavingRepository.update.mockResolvedValue(mockUpdated);

      await typeSavingService.updateTypeSaving(1, updateData);

      expect(mockTypeSavingRepository.update).toHaveBeenCalledWith(1, {
        typename: 'Trimmed Update'
      });
    });

    it('should throw error when id is not provided', async () => {
      await expect(typeSavingService.updateTypeSaving(null, {})).rejects.toThrow('ID is required');
    });

    it('should throw error when typename is empty string', async () => {
      const updateData = { typename: '   ' };

      await expect(typeSavingService.updateTypeSaving(1, updateData)).rejects.toThrow('Type name cannot be empty');
    });

    it('should throw error when interestRate is zero or negative', async () => {
      const updateData = { interestRate: 0 };

      await expect(typeSavingService.updateTypeSaving(1, updateData)).rejects.toThrow('Interest rate must be greater than 0');
    });
  });

  describe('deleteTypeSaving', () => {
    it('should delete type saving successfully', async () => {
      const mockDeleted = {
        typeid: 1,
        typename: 'Deleted Type',
        termperiod: 6,
        interest: 5.5
      };

      mockTypeSavingRepository.delete.mockResolvedValue(mockDeleted);

      const result = await typeSavingService.deleteTypeSaving(1);

      expect(mockTypeSavingRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        typeSavingId: 1,
        typeName: 'Deleted Type',
        term: 6,
        interestRate: 5.5
      });
    });

    it('should throw error when id is not provided', async () => {
      await expect(typeSavingService.deleteTypeSaving()).rejects.toThrow('ID is required');
    });

    it('should throw error when id is null', async () => {
      await expect(typeSavingService.deleteTypeSaving(null)).rejects.toThrow('ID is required');
    });
  });
});
