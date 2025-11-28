const { mockTypeSavingRepository, resetAllMocks } = require("./__mocks__/serviceDependencies.js");

jest.mock("../../src/repositories/TypeSaving/TypeSavingRepository.js", () => ({
  typeSavingRepository: mockTypeSavingRepository
}));

const { typeSavingService } = require("../../src/services/TypeSaving/typeSaving.service.js");

describe("TypeSavingService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it("gets all type savings", async () => {
    mockTypeSavingRepository.findAll.mockResolvedValue([{ id: 1 }]);
    const all = await typeSavingService.getAllTypeSavings();
    expect(all).toHaveLength(1);
  });

  it("gets a type saving by id", async () => {
    mockTypeSavingRepository.findById.mockResolvedValue({ id: 2 });
    expect(await typeSavingService.getTypeSavingById(2)).toEqual({ id: 2 });
  });

  it("creates, updates and deletes type saving", async () => {
    mockTypeSavingRepository.create.mockResolvedValue({ id: 3 });
    await typeSavingService.createTypeSaving({ termperiod: 6, interest: 5 });
    expect(mockTypeSavingRepository.create).toHaveBeenCalled();

    mockTypeSavingRepository.update.mockResolvedValue({ id: 2 });
    await typeSavingService.updateTypeSaving(2, { interest: 6 });
    expect(mockTypeSavingRepository.update).toHaveBeenCalledWith(2, { interest: 6 });

    await typeSavingService.deleteTypeSaving(2);
    expect(mockTypeSavingRepository.delete).toHaveBeenCalledWith(2);
  });

  it("validates required fields", async () => {
    await expect(typeSavingService.getTypeSavingById()).rejects.toThrow("ID is required");
    await expect(typeSavingService.updateTypeSaving()).rejects.toThrow("ID is required");
    await expect(typeSavingService.deleteTypeSaving()).rejects.toThrow("ID is required");
    await expect(typeSavingService.createTypeSaving({ termperiod: null })).rejects.toThrow(
      "Missing required fields"
    );
  });
});

