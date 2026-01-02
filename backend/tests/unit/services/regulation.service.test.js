import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock repository
const mockTypeSavingRepository = {
  findAll: jest.fn(),
  update: jest.fn(),
};

jest.unstable_mockModule("@src/repositories/TypeSaving/TypeSavingRepository.js", () => ({
  typeSavingRepository: mockTypeSavingRepository,
}));

const { regulationService } = await import(
  "@src/services/Regulation/regulation.service.js"
);

describe("RegulationService - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllRegulations()", () => {
    it("should return regulations from No term type", async () => {
      const mockTypeSavings = [
        {
          typeid: 1,
          typename: "No term",
          minimumbalance: 100000,
          minimumterm: 15,
        },
        {
          typeid: 2,
          typename: "3 months",
          minimumbalance: 100000,
          minimumterm: 15,
        },
      ];

      mockTypeSavingRepository.findAll.mockResolvedValue(mockTypeSavings);

      const result = await regulationService.getAllRegulations();

      expect(result.minimumBalance).toBe(100000);
      expect(result.minimumTermDays).toBe(15);
    });
  });

  describe("updateRegulations()", () => {
    it("should update regulations for No term type", async () => {
      const minimumBalance = 200000;
      const minimumTermDays = 30;

      const mockTypeSavings = [
        {
          typeid: 1,
          typename: "No term",
          minimumbalance: 100000,
          minimumterm: 15,
        },
      ];

      mockTypeSavingRepository.findAll.mockResolvedValue(mockTypeSavings);
      mockTypeSavingRepository.update.mockResolvedValue({});

      const result = await regulationService.updateRegulations(
        minimumBalance,
        minimumTermDays
      );

      expect(mockTypeSavingRepository.update).toHaveBeenCalledWith(1, {
        minimumbalance: 200000,
        minimumterm: 30,
      });
      expect(result.minimumBalance).toBe(200000);
      expect(result.minimumTermDays).toBe(30);
    });
  });

  describe("getRegulationRates()", () => {
    it("should return all type saving rates", async () => {
      const mockTypeSavings = [
        {
          typeid: 1,
          typename: "No term",
          interest: 0.15,
          minimumbalance: 100000,
          termperiod: 0,
        },
        {
          typeid: 2,
          typename: "3 months",
          interest: 0.5,
          minimumbalance: 100000,
          termperiod: 3,
        },
      ];

      mockTypeSavingRepository.findAll.mockResolvedValue(mockTypeSavings);

      const result = await regulationService.getRegulationRates();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        typeSavingId: 1,
        typeName: "No term",
        rate: 0.15,
        minimumBalance: 100000,
        term: 0,
        editable: true,
      });
    });
  });

  describe("updateRegulation()", () => {
    it("TC_UC11_08 - Áp dụng lãi suất mới không ảnh hưởng lịch sử", async () => {
      const updates = [
        {
          typeSavingId: 2,
          typeName: "6 months",
          rate: 0.65,
          term: 6,
        },
      ];

      mockTypeSavingRepository.update.mockResolvedValue({});

      const result = await regulationService.updateRegulation(updates);

      expect(mockTypeSavingRepository.update).toHaveBeenCalledWith(2, {
        typename: "6 months",
        interest: 0.65,
        termperiod: 6,
      });
      expect(result.message).toBe("Regulations updated successfully.");
    });

    it("should throw error when no updates provided", async () => {
      await expect(regulationService.updateRegulation(null)).rejects.toThrow(
        "No updates provided"
      );
    });

    it("should handle multiple updates", async () => {
      const updates = [
        {
          typeSavingId: 1,
          typeName: "No term",
          rate: 0.2,
          term: 0,
        },
        {
          typeSavingId: 2,
          typeName: "3 months",
          rate: 0.55,
          term: 3,
        },
      ];

      mockTypeSavingRepository.update.mockResolvedValue({});

      const result = await regulationService.updateRegulation(updates);

      expect(mockTypeSavingRepository.update).toHaveBeenCalledTimes(2);
      expect(result.message).toBe("Regulations updated successfully.");
    });
  });
});

