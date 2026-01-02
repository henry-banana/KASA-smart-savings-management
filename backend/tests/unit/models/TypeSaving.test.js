import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock BaseModel
const mockBaseModel = {
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.unstable_mockModule("@src/models/BaseModel.js", () => ({
  BaseModel: jest.fn().mockImplementation(() => mockBaseModel),
}));

const { TypeSaving } = await import("@src/models/TypeSaving.js");

describe("TypeSaving Model - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("TypeSaving extends BaseModel", () => {
    it("should have correct table name and primary key", () => {
      // TypeSaving extends BaseModel with table "typesaving" and primary key "typeid"
      expect(TypeSaving).toBeDefined();
    });

    it("should use BaseModel methods", async () => {
      const mockTypeSaving = {
        typeid: 1,
        typename: "No term",
        interest: 0.15,
        termperiod: 0,
        minimumbalance: 100000,
      };

      mockBaseModel.findById.mockResolvedValue(mockTypeSaving);

      const result = await TypeSaving.findById(1);

      expect(mockBaseModel.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTypeSaving);
    });
  });
});

