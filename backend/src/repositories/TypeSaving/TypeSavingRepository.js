import { TypeSaving } from "../../models/TypeSaving.js";

export class TypeSavingRepository {
  // Lấy toàn bộ loại sổ tiết kiệm
  async getAllTypeSavings() {
    return await TypeSaving.getAll();
  }

  // Lấy thông tin loại sổ tiết kiệm theo ID
  async getTypeSavingById(typeSavingId) {
    return await TypeSaving.getById(typeSavingId);
  }

  // Thêm loại sổ tiết kiệm mới
  async createTypeSaving(typeSavingData) {
    return await TypeSaving.create(typeSavingData);
  }

  // Cập nhật loại sổ tiết kiệm theo ID
  async updateTypeSaving(typeSavingId, typeSavingData) {
    return await TypeSaving.update(typeSavingId, typeSavingData);
  }

  // Xóa loại sổ tiết kiệm theo ID
  async deleteTypeSaving(typeSavingId) {
    return await TypeSaving.delete(typeSavingId);
  }
}

export const typeSavingRepository = new TypeSavingRepository();
