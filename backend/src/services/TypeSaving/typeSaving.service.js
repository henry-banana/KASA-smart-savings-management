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
    const { termperiod, interest } = data;

    if (termperiod == null || interest == null)
      throw new Error("Missing required fields");

    return await typeSavingRepository.create({
      termperiod,
      interest,
    });
  }

  // Cập nhật loại sổ tiết kiệm
  async updateTypeSaving(id, data) {
    if (!id) throw new Error("ID is required");
    return await typeSavingRepository.update(id, data);
  }

  // Xóa loại sổ tiết kiệm
  async deleteTypeSaving(id) {
    if (!id) throw new Error("ID is required");
    return await typeSavingRepository.delete(id);
  }
}

export const typeSavingService = new TypeSavingService();
