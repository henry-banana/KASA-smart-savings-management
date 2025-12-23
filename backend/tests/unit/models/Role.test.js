import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Cấu hình env giả
process.env.SUPABASE_URL = "http://localhost:8000";
process.env.SUPABASE_KEY = "test-key";

// ✅ Mock Supabase client
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue({ data: null, error: null }),
};

// ✅ Mock @config/database.js thay vì @supabase/supabase-js
jest.unstable_mockModule("@config/database.js", () => ({
  supabase: mockSupabase,
}));

// Import Role AFTER mocking
const { Role } = await import("@src/models/Role.js");

describe("Role Model - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // ✅ Reset mock chain
    mockSupabase.from.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
    mockSupabase.limit.mockResolvedValue({ data: null, error: null });
  });

  describe("getByName()", () => {
    it("should return role when found", async () => {
      const roleName = "Teller";
      const mockRole = {
        roleid: 2,
        rolename: "Teller",
      };

      // ✅ Mock limit() để trả về data
      mockSupabase.limit.mockResolvedValueOnce({
        data: [mockRole],
        error: null,
      });

      const result = await Role.getByName(roleName);

      expect(mockSupabase.from).toHaveBeenCalledWith("role");
      expect(mockSupabase.select).toHaveBeenCalledWith("roleid, rolename");
      expect(mockSupabase.eq).toHaveBeenCalledWith("rolename", roleName);
      expect(mockSupabase.limit).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockRole);
    });

    it("should return null when role not found", async () => {
      const roleName = "NonExistent Role";

      // ✅ Mock limit() trả về empty array
      mockSupabase.limit.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      const result = await Role.getByName(roleName);

      expect(mockSupabase.from).toHaveBeenCalledWith("role");
      expect(mockSupabase.eq).toHaveBeenCalledWith("rolename", roleName);
      expect(result).toBeNull();
    });

    it("should throw error on database error", async () => {
      const roleName = "Teller";

      // ✅ Mock limit() trả về error
      mockSupabase.limit.mockResolvedValueOnce({
        data: null,
        error: { message: "Database error" },
      });

      await expect(Role.getByName(roleName)).rejects.toThrow(
        "Get failed: Database error"
      );

      expect(mockSupabase.from).toHaveBeenCalledWith("role");
      expect(mockSupabase.eq).toHaveBeenCalledWith("rolename", roleName);
    });
  });
});

