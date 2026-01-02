import { TypeSaving } from "../../models/TypeSaving.js";

export class TypeSavingRepository {
  // Lấy tất cả loại sổ tiết kiệm
  async findAll() {
    return await TypeSaving.getAll();
  }

  // Lấy loại sổ tiết kiệm theo ID
  async findById(typeSavingId) {
    return await TypeSaving.getById(typeSavingId);
  }

  // Tạo loại sổ tiết kiệm mới
  async create(typeSavingData) {
    return await TypeSaving.create(typeSavingData);
  }

  // Cập nhật loại sổ tiết kiệm theo ID
  async update(typeSavingId, typeSavingData) {
    return await TypeSaving.update(typeSavingId, typeSavingData);
  }

  // Xóa loại sổ tiết kiệm theo ID
  async delete(typeSavingId) {
    return await TypeSaving.delete(typeSavingId);
  }

}

// Export instance sẵn
export const typeSavingRepository = new TypeSavingRepository();
