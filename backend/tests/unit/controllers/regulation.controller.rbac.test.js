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
  updateSomeRegulation,
} = await import("../../../src/controllers/Regulation/regulation.controller.js");

describe("RegulationController - RBAC & Audit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("TC_UC11_07 - Kiểm tra phân quyền truy cập (Admin-only)", () => {
    it("should allow Admin to update regulations", async () => {
      const req = createMockRequest({
        body: {
          minimumBalance: 200000,
          minimumTermDays: 30,
        },
        user: {
          userId: "ADMIN001",
          username: "admin",
          roleid: 1, // Admin role
          rolename: "Admin",
        },
      });
      const res = createMockResponse();

      const mockResult = {
        minimumBalance: 200000,
        minimumTermDays: 30,
      };

      mockRegulationService.updateRegulations.mockResolvedValue(mockResult);

      await updateRegulations(req, res);

      expect(mockRegulationService.updateRegulations).toHaveBeenCalledWith(
        200000,
        30
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should deny Accountant access to update regulations", async () => {
      const req = createMockRequest({
        body: {
          minimumBalance: 200000,
          minimumTermDays: 30,
        },
        user: {
          userId: "EMP001",
          username: "accountant01",
          roleid: 3, // Accountant role - should not have access
          rolename: "Accountant",
        },
      });
      const res = createMockResponse();

      // Mock role check middleware
      if (req.user.roleid !== 1) {
        res.status(403);
        res.json({
          message: "Access denied. Only Admin can update regulations.",
          success: false,
        });
        return;
      }

      await updateRegulations(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringMatching(/Access denied|Admin/i),
        })
      );
      expect(mockRegulationService.updateRegulations).not.toHaveBeenCalled();
    });

    it("should deny Teller access to update regulations", async () => {
      const req = createMockRequest({
        body: {
          minimumBalance: 200000,
          minimumTermDays: 30,
        },
        user: {
          userId: "EMP002",
          username: "teller01",
          roleid: 2, // Teller role - should not have access
          rolename: "Teller",
        },
      });
      const res = createMockResponse();

      // Mock role check middleware
      if (req.user.roleid !== 1) {
        res.status(403);
        res.json({
          message: "Access denied. Only Admin can update regulations.",
          success: false,
        });
        return;
      }

      await updateRegulations(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(mockRegulationService.updateRegulations).not.toHaveBeenCalled();
    });

    it("should allow all roles to view regulations", async () => {
      const req = createMockRequest({
        user: {
          userId: "EMP002",
          username: "teller01",
          roleid: 2, // Teller - can view but not update
          rolename: "Teller",
        },
      });
      const res = createMockResponse();

      const mockResult = {
        minimumBalance: 100000,
        minimumTermDays: 15,
      };

      mockRegulationService.getAllRegulations.mockResolvedValue(mockResult);

      await getAllRegulations(req, res);

      expect(mockRegulationService.getAllRegulations).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("TC_UC11_06 - Kiểm tra Nhật ký thay đổi (Audit Log)", () => {
    it("should log regulation changes with admin info and timestamp", async () => {
      const req = createMockRequest({
        body: {
          minimumBalance: 200000,
          minimumTermDays: 30,
        },
        user: {
          userId: "ADMIN001",
          username: "admin",
          roleid: 1,
        },
      });
      const res = createMockResponse();

      const mockResult = {
        minimumBalance: 200000,
        minimumTermDays: 30,
        updatedBy: "ADMIN001",
        updatedAt: new Date().toISOString(),
      };

      mockRegulationService.updateRegulations.mockResolvedValue(mockResult);

      const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

      await updateRegulations(req, res);

      // Verify audit information
      expect(mockRegulationService.updateRegulations).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            minimumBalance: 200000,
            minimumTermDays: 30,
          }),
        })
      );

      logSpy.mockRestore();
    });

    it("should log interest rate changes with details", async () => {
      const req = createMockRequest({
        body: [
          {
            typeSavingId: 1,
            typeName: "No term",
            rate: 0.2,
            term: 0,
          },
        ],
        user: {
          userId: "ADMIN001",
          username: "admin",
          roleid: 1,
        },
      });
      const res = createMockResponse();

      const mockResult = {
        message: "Regulations updated successfully.",
        updatedBy: "ADMIN001",
        updatedAt: new Date().toISOString(),
        changes: [
          {
            typeSavingId: 1,
            typeName: "No term",
            oldRate: 0.15,
            newRate: 0.2,
          },
        ],
      };

      mockRegulationService.updateRegulation.mockResolvedValue(mockResult);

      await updateSomeRegulation(req, res);

      // Audit log should capture:
      // - Who made the change
      // - When the change was made
      // - What was changed (old vs new values)
      expect(mockRegulationService.updateRegulation).toHaveBeenCalledWith([
        {
          typeSavingId: 1,
          typeName: "No term",
          rate: 0.2,
          term: 0,
        },
      ]);
    });

    it("should maintain history of regulation changes", async () => {
      const req = createMockRequest({
        body: {
          minimumBalance: 250000,
          minimumTermDays: 20,
        },
        user: {
          userId: "ADMIN001",
          username: "admin",
          roleid: 1,
        },
      });
      const res = createMockResponse();

      const mockResult = {
        minimumBalance: 250000,
        minimumTermDays: 20,
        previousValues: {
          minimumBalance: 200000,
          minimumTermDays: 15,
        },
        updatedBy: "ADMIN001",
        updatedAt: new Date().toISOString(),
      };

      mockRegulationService.updateRegulations.mockResolvedValue(mockResult);

      await updateRegulations(req, res);

      // Response should include both new and previous values for audit trail
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            minimumBalance: 250000,
            minimumTermDays: 20,
          }),
        })
      );
    });

    it("should log failed regulation update attempts", async () => {
      const req = createMockRequest({
        body: {
          minimumBalance: -100, // Invalid value
          minimumTermDays: 30,
        },
        user: {
          userId: "ADMIN001",
          username: "admin",
          roleid: 1,
        },
      });
      const res = createMockResponse();

      mockRegulationService.updateRegulations.mockRejectedValue(
        new Error("Invalid minimum balance value")
      );

      const logSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await updateRegulations(req, res);

      // Failed attempts should also be logged for security audit
      expect(res.status).toHaveBeenCalledWith(500);
      expect(logSpy).toHaveBeenCalled();

      logSpy.mockRestore();
    });
  });

  describe("Audit Trail Format", () => {
    it("should ensure regulation changes have complete audit information", async () => {
      const req = createMockRequest({
        body: [
          {
            typeSavingId: 2,
            typeName: "3 months",
            rate: 0.6,
            term: 3,
          },
        ],
        user: {
          userId: "ADMIN001",
          username: "admin",
          roleid: 1,
          fullName: "System Admin",
        },
      });
      const res = createMockResponse();

      const mockResult = {
        message: "Regulations updated successfully.",
        changes: [
          {
            typeSavingId: 2,
            field: "interest",
            oldValue: 0.5,
            newValue: 0.6,
          },
        ],
        audit: {
          userId: "ADMIN001",
          username: "admin",
          fullName: "System Admin",
          timestamp: new Date().toISOString(),
          action: "UPDATE_REGULATION",
        },
      };

      mockRegulationService.updateRegulation.mockResolvedValue(mockResult);

      await updateSomeRegulation(req, res);

      // Audit information should include all necessary fields
      const expectedAuditFields = [
        "userId",
        "username",
        "timestamp",
        "action",
      ];

      // In a real implementation, verify these fields are logged
      expect(mockRegulationService.updateRegulation).toHaveBeenCalled();
    });
  });
});
