import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
} from "../../helpers/testHelpers.js";

// Mock service
const mockRegulationService = {
  getAllRegulations: jest.fn(),
  updateRegulations: jest.fn(),
  getRegulationRates: jest.fn(),
  updateRegulation: jest.fn(),
  getHistoryRegulations: jest.fn(),
};

const regulationServicePath = new URL(
  "../../../src/services/Regulation/regulation.service.js",
  import.meta.url
).pathname;

jest.unstable_mockModule(regulationServicePath, () => ({
  regulationService: mockRegulationService,
}));

const {
  getAllRegulations,
  updateRegulations,
  getRegulationRates,
  updateSomeRegulation,
  getHistoryRegulations,
} = await import("../../../src/controllers/Regulation/regulation.controller.js");

describe("RegulationController - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllRegulations()", () => {
    it("should return all regulations", async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      const mockRegulations = {
        minimumBalance: 100000,
        minimumTermDays: 15,
      };

      mockRegulationService.getAllRegulations.mockResolvedValue(
        mockRegulations
      );

      await getAllRegulations(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Regulations retrieved successfully",
        success: true,
        total: undefined,
        data: {
          minimumBalance: 100000,
          minimumTermDays: 15,
        },
      });
    });

    it("should return 500 on server error", async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      mockRegulationService.getAllRegulations.mockRejectedValue(
        new Error("Database error")
      );
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await getAllRegulations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to retrieve regulations",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("updateRegulations()", () => {
    it("should update regulations successfully", async () => {
      const req = createMockRequest({
        body: {
          minimumBalance: 200000,
          minimumTermDays: 30,
        },
      });
      const res = createMockResponse();

      mockRegulationService.updateRegulations.mockResolvedValue({
        minimumBalance: 200000,
        minimumTermDays: 30,
      });

      await updateRegulations(req, res);

      expect(mockRegulationService.updateRegulations).toHaveBeenCalledWith(
        200000,
        30
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Regulation updated successfully",
        success: true,
        data: {
          minimumBalance: 200000,
          minimumTermDays: 30,
        },
      });
    });

    it("should return 500 on server error", async () => {
      const req = createMockRequest({
        body: {
          minimumBalance: 200000,
          minimumTermDays: 30,
        },
      });
      const res = createMockResponse();

      mockRegulationService.updateRegulations.mockRejectedValue(
        new Error("Database error")
      );
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await updateRegulations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to update regulation",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getRegulationRates()", () => {
    it("should return regulation rates", async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      const mockRates = [
        {
          typeSavingId: 1,
          typeName: "No term",
          rate: 0.15,
          minimumBalance: 100000,
          term: 0,
          editable: true,
        },
        {
          typeSavingId: 2,
          typeName: "3 months",
          rate: 0.5,
          minimumBalance: 100000,
          term: 3,
          editable: true,
        },
      ];

      mockRegulationService.getRegulationRates.mockResolvedValue(mockRates);

      await getRegulationRates(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Regulation rates retrieved successfully",
        success: true,
        total: 2,
        data: mockRates,
      });
    });
  });

  describe("updateSomeRegulation()", () => {
    it("TC_UC11_08 - Áp dụng lãi suất mới không ảnh hưởng lịch sử", async () => {
      const req = createMockRequest({
        body: [
          {
            typeSavingId: 2,
            typeName: "6 months",
            rate: 0.65,
            term: 6,
          },
        ],
      });
      const res = createMockResponse();

      mockRegulationService.updateRegulation.mockResolvedValue({
        message: "Regulations updated successfully.",
      });

      await updateSomeRegulation(req, res);

      expect(mockRegulationService.updateRegulation).toHaveBeenCalledWith(
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Regulation updated successfully",
        success: true,
        data: {},
      });
    });

    it("should handle typo in minimumBalance (minimunBalance)", async () => {
      const req = createMockRequest({
        body: {
          minimunBalance: 200000, // Typo
          minimumTermDays: 30,
        },
      });
      const res = createMockResponse();

      mockRegulationService.updateRegulation.mockResolvedValue({
        message: "Regulations updated successfully.",
      });

      await updateSomeRegulation(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on server error", async () => {
      const req = createMockRequest({
        body: [
          {
            typeSavingId: 2,
            typeName: "6 months",
            rate: 0.65,
            term: 6,
          },
        ],
      });
      const res = createMockResponse();

      mockRegulationService.updateRegulation.mockRejectedValue(
        new Error("Database error")
      );
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await updateSomeRegulation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to update regulation",
        success: false,
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getHistoryRegulations()", () => {
    it("should return regulation history", async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      const mockHistory = [
        {
          id: 1,
          date: "2025-01-01",
          minimumBalance: 100000,
          minimumTermDays: 15,
        },
      ];

      mockRegulationService.getHistoryRegulations.mockResolvedValue(mockHistory);

      await getHistoryRegulations(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Regulation history retrieved successfully",
        success: true,
        total: 1,
        data: mockHistory,
      });
    });
  });
});

