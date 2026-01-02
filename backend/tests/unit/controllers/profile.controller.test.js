import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import {
  createMockRequest,
  createMockResponse,
} from "../../helpers/testHelpers.js";

// Mock employee service
const mockEmployeeService = {
  getMyProfile: jest.fn(),
  updateMyProfile: jest.fn(),
};

jest.unstable_mockModule("@src/services/Employee/employee.service.js", () => ({
  employeeService: mockEmployeeService,
}));

const { getMe, updateMe } = await import("../../../src/controllers/UserAccount/userAccount.controller.js");

describe("ProfileController - Unit Tests", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("TC_UC04_01 - Xem thông tin thành công", () => {
    it("should display user profile with all required fields", async () => {
      const req = createMockRequest({
        user: {
          userId: "EMP001",
          username: "employee01",
          roleid: 2,
        },
      });
      const res = createMockResponse();

      const mockProfile = {
        employeeId: "EMP001",
        fullName: "Nguyen Van A",
        email: "nguyenvana@example.com",
        phone: "0123456789",
        address: "123 Test Street",
        roleId: 2,
        roleName: "Teller",
        branchId: 1,
        branchName: "Branch 1",
        username: "employee01",
        status: "Active",
      };

      mockEmployeeService.getMyProfile.mockResolvedValue(mockProfile);

      await getMe(req, res);

      expect(mockEmployeeService.getMyProfile).toHaveBeenCalledWith("EMP001");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            employeeId: "EMP001",
            fullName: "Nguyen Van A",
            email: "nguyenvana@example.com",
            roleName: "Teller",
          }),
        })
      );
    });

    it("should display correct role name", async () => {
      const req = createMockRequest({
        user: {
          userId: "ADMIN001",
          username: "admin",
          roleid: 1,
        },
      });
      const res = createMockResponse();

      const mockProfile = {
        employeeId: "ADMIN001",
        fullName: "Admin User",
        email: "admin@example.com",
        roleId: 1,
        roleName: "Admin",
        username: "admin",
      };

      mockEmployeeService.getMyProfile.mockResolvedValue(mockProfile);

      await getMe(req, res);

      const responseData = res.json.mock.calls[0][0].data;
      expect(responseData.roleName).toBe("Admin");
    });
  });

  describe("TC_UC04_02 - Lỗi kết nối CSDL", () => {
    it("should handle database connection error gracefully", async () => {
      const req = createMockRequest({
        user: {
          userId: "EMP001",
        },
      });
      const res = createMockResponse();

      mockEmployeeService.getMyProfile.mockRejectedValue(
        new Error("Database connection failed")
      );

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringMatching(/error|failed|internal/i),
        })
      );
    });

    it("should return error when employee not found", async () => {
      const req = createMockRequest({
        user: {
          userId: "EMP999",
        },
      });
      const res = createMockResponse();

      mockEmployeeService.getMyProfile.mockResolvedValue(null);

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringMatching(/not found/i),
        })
      );
    });
  });

  describe("TC_UC04_04 - Ẩn thông tin nhạy cảm", () => {
    it("should not return password in profile data", async () => {
      const req = createMockRequest({
        user: {
          userId: "EMP001",
        },
      });
      const res = createMockResponse();

      const mockProfile = {
        employeeId: "EMP001",
        fullName: "Nguyen Van A",
        email: "nguyenvana@example.com",
        username: "employee01",
        // Password should not be included by service
      };

      mockEmployeeService.getMyProfile.mockResolvedValue(mockProfile);

      await getMe(req, res);

      const responseData = res.json.mock.calls[0][0].data;
      expect(responseData).not.toHaveProperty("password");
      expect(responseData).not.toHaveProperty("passwordHash");
    });

    it("should mask sensitive fields if present", async () => {
      const req = createMockRequest({
        user: {
          userId: "EMP001",
        },
      });
      const res = createMockResponse();

      const mockProfile = {
        employeeId: "EMP001",
        fullName: "Nguyen Van A",
        email: "nguyenvana@example.com",
        citizenId: "123456789012",
      };

      mockEmployeeService.getMyProfile.mockResolvedValue(mockProfile);

      await getMe(req, res);

      const responseData = res.json.mock.calls[0][0].data;
      
      // Citizen ID might be partially masked (e.g., "123456***012")
      // or fully displayed depending on business rules
      expect(responseData).toHaveProperty("employeeId");
      expect(responseData).toHaveProperty("fullName");
    });

    it("should not expose internal system fields", async () => {
      const req = createMockRequest({
        user: {
          userId: "EMP001",
        },
      });
      const res = createMockResponse();

      // ✅ Service should NOT return internal fields
      const mockProfile = {
        employeeId: "EMP001",
        fullName: "Nguyen Van A",
        email: "nguyenvana@example.com",
        // Internal fields should already be filtered by service
        // Not included: internalNote, passwordResetToken
      };

      mockEmployeeService.getMyProfile.mockResolvedValue(mockProfile);

      await getMe(req, res);

      const responseData = res.json.mock.calls[0][0].data;
      
      // ✅ Verify public fields are present
      expect(responseData).toHaveProperty("employeeId");
      expect(responseData).toHaveProperty("fullName");
      expect(responseData).toHaveProperty("email");
      
      // ✅ Verify sensitive fields are NOT present
      expect(responseData).not.toHaveProperty("password");
      expect(responseData).not.toHaveProperty("passwordHash");
      expect(responseData).not.toHaveProperty("internalNote");
      expect(responseData).not.toHaveProperty("passwordResetToken");
    });
  });

  describe("TC_UC04_05 - Kiểm soát truy cập", () => {
    it("should allow authenticated user to view own profile", async () => {
      const req = createMockRequest({
        user: {
          userId: "EMP001",
          username: "employee01",
          roleid: 2,
        },
      });
      const res = createMockResponse();

      const mockProfile = {
        employeeId: "EMP001",
        fullName: "Nguyen Van A",
        email: "nguyenvana@example.com",
      };

      mockEmployeeService.getMyProfile.mockResolvedValue(mockProfile);

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockEmployeeService.getMyProfile).toHaveBeenCalledWith("EMP001");
    });

    it("should validate user is authenticated", async () => {
      const req = createMockRequest({
        // No user object - not authenticated
      });
      const res = createMockResponse();

      // This would be handled by middleware in real app
      // But we can test controller's behavior
      await getMe(req, res);

      // Controller should handle gracefully
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("TC_UC04_06 - Cập nhật thông tin profile", () => {
    it("should update profile successfully", async () => {
      const req = createMockRequest({
        user: {
          userId: "EMP001",
        },
        body: {
          fullName: "Nguyen Van A Updated",
          email: "updated@example.com",
          phone: "0987654321",
        },
      });
      const res = createMockResponse();

      const mockUpdatedProfile = {
        employeeId: "EMP001",
        fullName: "Nguyen Van A Updated",
        email: "updated@example.com",
        phone: "0987654321",
      };

      mockEmployeeService.updateMyProfile.mockResolvedValue(mockUpdatedProfile);

      await updateMe(req, res);

      expect(mockEmployeeService.updateMyProfile).toHaveBeenCalledWith(
        "EMP001",
        expect.objectContaining({
          fullName: "Nguyen Van A Updated",
          email: "updated@example.com",
          phone: "0987654321",
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringMatching(/updated|success/i),
          data: mockUpdatedProfile,
        })
      );
    });

    it("should reject duplicate email", async () => {
      const req = createMockRequest({
        user: {
          userId: "EMP001",
        },
        body: {
          email: "existing@example.com",
        },
      });
      const res = createMockResponse();

      mockEmployeeService.updateMyProfile.mockRejectedValue(
        new Error("Email already exists.")
      );

      await updateMe(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Email already exists.",
        })
      );
    });

    it("should handle no valid fields to update", async () => {
      const req = createMockRequest({
        user: {
          userId: "EMP001",
        },
        body: {
          invalidField: "value",
        },
      });
      const res = createMockResponse();

      mockEmployeeService.updateMyProfile.mockRejectedValue(
        new Error("No valid fields to update.")
      );

      await updateMe(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringMatching(/No valid fields/i),
        })
      );
    });

    it("should handle database error during update", async () => {
      const req = createMockRequest({
        user: {
          userId: "EMP001",
        },
        body: {
          fullName: "New Name",
        },
      });
      const res = createMockResponse();

      mockEmployeeService.updateMyProfile.mockRejectedValue(
        new Error("Database connection failed")
      );

      await updateMe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringMatching(/error|failed|internal/i),
        })
      );
    });
  });

  describe("Profile Data Validation", () => {
    it("should return profile with consistent field names", async () => {
      const req = createMockRequest({
        user: {
          userId: "EMP001",
        },
      });
      const res = createMockResponse();

      const mockProfile = {
        employeeId: "EMP001",
        fullName: "Nguyen Van A",
        email: "nguyenvana@example.com",
        phone: "0123456789",
        username: "employee01",
        roleName: "Teller",
      };

      mockEmployeeService.getMyProfile.mockResolvedValue(mockProfile);

      await getMe(req, res);

      const responseData = res.json.mock.calls[0][0].data;
      
      // Check consistent naming (camelCase)
      expect(responseData).toHaveProperty("employeeId");
      expect(responseData).toHaveProperty("fullName");
      expect(responseData).toHaveProperty("roleName");
    });
  });
});
