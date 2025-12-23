import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock repository
const mockTypeSavingRepository = {
  findAll: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
};

jest.unstable_mockModule("@src/repositories/TypeSaving/TypeSavingRepository.js", () => ({
  typeSavingRepository: mockTypeSavingRepository,
}));

const { regulationService } = await import(
  "@src/services/Regulation/regulation.service.js"
);

describe("RegulationService - Additional Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("TC_UC11_09 - Rollback khi lưu thất bại", () => {
    it("should throw error when update fails for No term regulation", async () => {
      const minimumBalance = 100000;
      const minimumTermDays = 15;

      // Mock findAll to return type savings
      mockTypeSavingRepository.findAll.mockResolvedValue([
        {
          typeid: 1,
          typename: "No term",
          minimumbalance: 50000,
          minimumterm: 0,
        },
      ]);

      // Simulate update fails
      mockTypeSavingRepository.update.mockRejectedValue(
        new Error("Database connection failed")
      );

      // Should throw error
      await expect(
        regulationService.updateRegulations(minimumBalance, minimumTermDays)
      ).rejects.toThrow("Database connection failed");

      // Verify update was attempted
      expect(mockTypeSavingRepository.update).toHaveBeenCalledWith(1, {
        minimumbalance: 100000,
        minimumterm: 15,
      });
    });

    it("should handle complete transaction failure", async () => {
      const minimumBalance = 100000;
      const minimumTermDays = 15;

      // Mock findAll fails (connection error)
      mockTypeSavingRepository.findAll.mockRejectedValue(
        new Error("Connection timeout")
      );

      await expect(
        regulationService.updateRegulations(minimumBalance, minimumTermDays)
      ).rejects.toThrow("Connection timeout");

      expect(mockTypeSavingRepository.findAll).toHaveBeenCalled();
      expect(mockTypeSavingRepository.update).not.toHaveBeenCalled();
    });

    it("should skip non-No term types", async () => {
      const minimumBalance = 100000;
      const minimumTermDays = 15;

      mockTypeSavingRepository.findAll.mockResolvedValue([
        { typeid: 2, typename: "3 months" },
        { typeid: 3, typename: "6 months" },
      ]);

      // Should complete without updating anything
      const result = await regulationService.updateRegulations(
        minimumBalance,
        minimumTermDays
      );

      expect(result).toEqual({ minimumBalance, minimumTermDays });
      expect(mockTypeSavingRepository.update).not.toHaveBeenCalled();
    });

    it("should handle empty result from findAll", async () => {
      const minimumBalance = 100000;
      const minimumTermDays = 15;

      // No type savings exist
      mockTypeSavingRepository.findAll.mockResolvedValue([]);

      // Should complete without error (nothing to update)
      const result = await regulationService.updateRegulations(
        minimumBalance,
        minimumTermDays
      );

      expect(result).toEqual({ minimumBalance, minimumTermDays });
      expect(mockTypeSavingRepository.findAll).toHaveBeenCalled();
      expect(mockTypeSavingRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("TC_UC11_04 - Lỗi bỏ trống thông tin", () => {
    it("should reject when minimumBalance is missing", async () => {
      const minimumBalance = undefined;
      const minimumTermDays = 15;

      await expect(
        regulationService.updateRegulations(minimumBalance, minimumTermDays)
      ).rejects.toThrow();
    });

    it("should reject when minimumTermDays is missing", async () => {
      const minimumBalance = 100000;
      const minimumTermDays = undefined;

      await expect(
        regulationService.updateRegulations(minimumBalance, minimumTermDays)
      ).rejects.toThrow();
    });

    it("should reject when both parameters are missing", async () => {
      await expect(
        regulationService.updateRegulations(undefined, undefined)
      ).rejects.toThrow();
    });

    it("should reject when minimumBalance is zero", async () => {
      const minimumBalance = 0;
      const minimumTermDays = 15;

      await expect(
        regulationService.updateRegulations(minimumBalance, minimumTermDays)
      ).rejects.toThrow();
    });

    it("should reject when minimumBalance is negative", async () => {
      const minimumBalance = -100000;
      const minimumTermDays = 15;

      await expect(
        regulationService.updateRegulations(minimumBalance, minimumTermDays)
      ).rejects.toThrow();
    });

    it("should reject when minimumTermDays is negative", async () => {
      const minimumBalance = 100000;
      const minimumTermDays = -15;

      await expect(
        regulationService.updateRegulations(minimumBalance, minimumTermDays)
      ).rejects.toThrow();
    });

    it("should accept zero for minimumTermDays (no term saving)", async () => {
      const minimumBalance = 100000;
      const minimumTermDays = 0;

      mockTypeSavingRepository.findAll.mockResolvedValue([
        {
          typeid: 1,
          typename: "No term",
        },
      ]);

      mockTypeSavingRepository.update.mockResolvedValue({ typeid: 1 });

      const result = await regulationService.updateRegulations(
        minimumBalance,
        minimumTermDays
      );

      expect(result).toEqual({ minimumBalance, minimumTermDays });
    });
  });

  describe("TC_UC11_08 - Áp dụng lãi suất mới không ảnh hưởng lịch sử", () => {
    it("should only update No term type with new regulations", async () => {
      const minimumBalance = 200000; // New minimum
      const minimumTermDays = 30; // New term days

      mockTypeSavingRepository.findAll.mockResolvedValue([
        {
          typeid: 1,
          typename: "No term",
          minimumbalance: 100000, // Old: 100k
          minimumterm: 0,
        },
        {
          typeid: 2,
          typename: "3 months",
          minimumbalance: 100000, // This won't be updated
          minimumterm: 15,
        },
      ]);

      mockTypeSavingRepository.update.mockResolvedValue({ success: true });

      const result = await regulationService.updateRegulations(
        minimumBalance,
        minimumTermDays
      );

      // Only No term should be updated
      expect(mockTypeSavingRepository.update).toHaveBeenCalledTimes(1);
      expect(mockTypeSavingRepository.update).toHaveBeenCalledWith(1, {
        minimumbalance: 200000,
        minimumterm: 30,
      });

      expect(result).toEqual({ minimumBalance, minimumTermDays });
    });

    it("should use correct field name minimumterm instead of minimumtermdays", async () => {
      const minimumBalance = 150000;
      const minimumTermDays = 20;

      mockTypeSavingRepository.findAll.mockResolvedValue([
        {
          typeid: 1,
          typename: "No term",
        },
      ]);

      mockTypeSavingRepository.update.mockResolvedValue({ typeid: 1 });

      await regulationService.updateRegulations(minimumBalance, minimumTermDays);

      // Verify correct field name is used
      expect(mockTypeSavingRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          minimumbalance: 150000,
          minimumterm: 20, // Not minimumtermdays
        })
      );
    });

    it("should not update term types (3 months, 6 months, etc.)", async () => {
      const minimumBalance = 150000;
      const minimumTermDays = 20;

      mockTypeSavingRepository.findAll.mockResolvedValue([
        {
          typeid: 2,
          typename: "3 months",
        },
        {
          typeid: 3,
          typename: "6 months",
        },
      ]);

      mockTypeSavingRepository.update.mockResolvedValue({ success: true });

      await regulationService.updateRegulations(minimumBalance, minimumTermDays);

      // Term types should NOT be updated (only "No term" is updated)
      expect(mockTypeSavingRepository.update).not.toHaveBeenCalled();
    });

    it("should break after finding and updating No term type", async () => {
      const minimumBalance = 150000;
      const minimumTermDays = 20;

      mockTypeSavingRepository.findAll.mockResolvedValue([
        {
          typeid: 1,
          typename: "No term",
        },
        {
          typeid: 2,
          typename: "3 months",
        },
      ]);

      mockTypeSavingRepository.update.mockResolvedValue({ typeid: 1 });

      await regulationService.updateRegulations(minimumBalance, minimumTermDays);

      // Should only update once (breaks after No term)
      expect(mockTypeSavingRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle null response from findAll", async () => {
      mockTypeSavingRepository.findAll.mockResolvedValue(null);

      await expect(
        regulationService.updateRegulations(100000, 15)
      ).rejects.toThrow();
    });

    it("should handle very large minimumBalance", async () => {
      const minimumBalance = 999999999999; // Very large number
      const minimumTermDays = 15;

      mockTypeSavingRepository.findAll.mockResolvedValue([
        { typeid: 1, typename: "No term" },
      ]);

      mockTypeSavingRepository.update.mockResolvedValue({ typeid: 1 });

      const result = await regulationService.updateRegulations(
        minimumBalance,
        minimumTermDays
      );

      expect(result).toEqual({ minimumBalance, minimumTermDays });
    });

    it("should handle concurrent update attempts", async () => {
      mockTypeSavingRepository.findAll.mockResolvedValue([
        { typeid: 1, typename: "No term" },
      ]);

      mockTypeSavingRepository.update.mockRejectedValue(
        new Error("Concurrent modification detected")
      );

      await expect(
        regulationService.updateRegulations(100000, 15)
      ).rejects.toThrow("Concurrent modification detected");
    });

    it("should handle case-sensitive typename comparison", async () => {
      mockTypeSavingRepository.findAll.mockResolvedValue([
        {
          typeid: 1,
          typename: "no term", // lowercase
        },
      ]);

      mockTypeSavingRepository.update.mockResolvedValue({ typeid: 1 });

      await regulationService.updateRegulations(100000, 15);

      // Should not match due to case sensitivity
      expect(mockTypeSavingRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("Integration with getAllRegulations", () => {
    it("should get regulations from No term type", async () => {
      mockTypeSavingRepository.findAll.mockResolvedValue([
        {
          typeid: 1,
          typename: "No term",
          minimumbalance: 100000,
          minimumterm: 15,
        },
      ]);

      const result = await regulationService.getAllRegulations();

      expect(result).toEqual({
        minimumBalance: 100000,
        minimumTermDays: 15,
      });
    });

    it("should return default values when No term not found", async () => {
      mockTypeSavingRepository.findAll.mockResolvedValue([
        {
          typeid: 2,
          typename: "3 months",
        },
      ]);

      const result = await regulationService.getAllRegulations();

      // Returns default values when No term not found
      expect(result).toEqual({
        minimumBalance: 100000,
        minimumTermDays: 15,
      });
    });
  });
});
