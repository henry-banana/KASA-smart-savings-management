import { typeSavingRepository } from "../../repositories/TypeSaving/TypeSavingRepository.js";

class TypeSavingService {
  // Map database fields to OPENAPI camelCase format
  _mapToApiFormat(dbRecord) {
    if (!dbRecord) return null;
    return {
      typeSavingId: dbRecord.typeid,
      typeName: dbRecord.typename,
      term: dbRecord.termperiod,
      interestRate: dbRecord.interest,
      isACtive: dbRecord.isactive,
    };
  }

  // Lấy tất cả loại sổ tiết kiệm
  async getAllTypeSavings() {
    const results = await typeSavingRepository.findAll();
    return results.map(record => this._mapToApiFormat(record));
  }

  // Lấy 1 loại sổ tiết kiệm theo ID
  async getTypeSavingById(id) {
    if (!id) throw new Error("ID is required");
    const result = await typeSavingRepository.findById(id);
    return this._mapToApiFormat(result);
  }

  // Thêm loại sổ tiết kiệm mới
  async createTypeSaving(data) {
    // Accept OPENAPI field names: typename, term, interestRate
    const { typename, term, interestRate } = data;

    if (!typename || typename.trim() === "")
      throw new Error("Type name is required");
    if (term === null || term === undefined)
      throw new Error("Term is required");
    if (
      interestRate === null ||
      interestRate === undefined ||
      interestRate <= 0
    )
      throw new Error("Interest rate must be greater than 0");

    const created = await typeSavingRepository.create({
      typename: typename.trim(),
      termperiod: Number(term),
      interest: Number(interestRate),
    });
    return this._mapToApiFormat(created);
  }

  // Cập nhật loại sổ tiết kiệm
  async updateTypeSaving(id, data) {
    if (!id) throw new Error("ID is required");

    // Accept OPENAPI field names: typename, term, interestRate
    const updates = {};
    if (data.typename !== undefined) {
      if (!data.typename.trim()) throw new Error("Type name cannot be empty");
      updates.typename = data.typename.trim();
    }
    if (data.term !== undefined) {
      updates.termperiod = Number(data.term);
    }
    if (data.interestRate !== undefined) {
      if (data.interestRate <= 0)
        throw new Error("Interest rate must be greater than 0");
      updates.interest = Number(data.interestRate);
    }

    const updated = await typeSavingRepository.update(id, updates);
    return this._mapToApiFormat(updated);
  }

  // Xóa loại sổ tiết kiệm
  async deleteTypeSaving(id) {
    if (!id) throw new Error("ID is required");
    const deleted = await typeSavingRepository.delete(id);
    return this._mapToApiFormat(deleted);
  }
}

export const typeSavingService = new TypeSavingService();
