import { typeSavingRepository } from "../../repositories/TypeSaving/TypeSavingRepository.js";

class TypeSavingService {
  // Lấy tất cả loại sổ tiết kiệm
  async getAllTypeSavings() {
    return await typeSavingRepository.findAll();
  }

  // Lấy 1 loại sổ tiết kiệm theo ID
  async getTypeSavingById(id) {
    if (!id) throw new Error("ID is required");
    return await typeSavingRepository.findById(id);
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

    return await typeSavingRepository.create({
      typename: typename.trim(),
      termperiod: Number(term),
      interest: Number(interestRate),
    });
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

    return await typeSavingRepository.update(id, updates);
  }

  // Xóa loại sổ tiết kiệm
  async deleteTypeSaving(id) {
    if (!id) throw new Error("ID is required");
    return await typeSavingRepository.delete(id);
  }
}

export const typeSavingService = new TypeSavingService();
