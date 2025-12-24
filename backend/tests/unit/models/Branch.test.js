import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Cấu hình env giả
process.env.SUPABASE_URL = "http://localhost:8000";
process.env.SUPABASE_KEY = "test-key";

// ✅ Mock Supabase client
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
};

// ✅ Mock database.js thay vì @supabase/supabase-js
jest.unstable_mockModule("@config/database.js", () => ({
  supabase: mockSupabase,
}));

// Import Branch AFTER mocking
const { Branch } = await import("@src/models/Branch.js");

describe("Branch Model - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // ✅ Reset mock chain
    mockSupabase.from.mockReturnThis();
    mockSupabase.select.mockReturnThis();
    mockSupabase.eq.mockReturnThis();
    mockSupabase.single.mockResolvedValue({ data: null, error: null });
  });

  describe("getByName()", () => {
    it("should return branch when found", async () => {
      const branchName = "Branch 1";
      const mockBranch = {
        branchid: 1,
        branchname: "Branch 1",
      };

      // ✅ Mock single() để trả về data
      mockSupabase.single.mockResolvedValueOnce({
        data: mockBranch,
        error: null,
      });

      const result = await Branch.getByName(branchName);

      expect(mockSupabase.from).toHaveBeenCalledWith("branch");
      expect(mockSupabase.select).toHaveBeenCalledWith("branchid, branchname");
      expect(mockSupabase.eq).toHaveBeenCalledWith("branchname", branchName);
      expect(mockSupabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockBranch);
    });

    it("should return null when branch not found", async () => {
      const branchName = "NonExistent Branch";

      // ✅ Mock single() trả về null với code PGRST116
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116" }, // No rows found
      });

      const result = await Branch.getByName(branchName);

      expect(mockSupabase.from).toHaveBeenCalledWith("branch");
      expect(mockSupabase.eq).toHaveBeenCalledWith("branchname", branchName);
      expect(result).toBeNull();
    });

    it("should throw error on database error", async () => {
      const branchName = "Branch 1";

      // ✅ Mock single() trả về error khác PGRST116
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: "OTHER_ERROR", message: "Database error" },
      });

      await expect(Branch.getByName(branchName)).rejects.toThrow(
        "Get failed: Database error"
      );

      expect(mockSupabase.from).toHaveBeenCalledWith("branch");
      expect(mockSupabase.eq).toHaveBeenCalledWith("branchname", branchName);
    });
  });
});

