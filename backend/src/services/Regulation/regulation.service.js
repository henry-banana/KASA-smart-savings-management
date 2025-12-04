
import { typeSavingRepository } from "../../repositories/TypeSaving/TypeSavingRepository.js";

class RegulationService {
  // Lấy toàn bộ quy định
  async getAllRegulations() {
    const allTypeSaving = await typeSavingRepository.findAll();
    const result = {
        minimumDeposit: 1e9,
        minimumTermDay: 1e9
    };

    for (const typeSaving of allTypeSaving) {
      if (typeSaving.minimumdeposit !== null && typeSaving.minimumdeposit < result.minimumDeposit) {
        result.minimumDeposit = typeSaving.minimumdeposit;
      }

      if (typeSaving.minimumdepositterm !== null && typeSaving.minimumdepositterm < result.minimumTermDay && typeSaving.typeid == 1) {
        result.minimumTermDay = typeSaving.minimumdepositterm;
      }
    }

    return result;
  }

  // Lấy quy định theo ID
  async getRegulationById(id) {
    const regulation = await regulationRepository.findById(id);
    if (!regulation) throw new Error("Regulation not found.");
    return regulation;
  }

  // Tạo quy định mới
  async createRegulation(regulationData) {
    const newRegulation = await regulationRepository.create(regulationData);
    return newRegulation;
  }

  // Cập nhật quy định
  async updateRegulation(id, updates) {
    const existingRegulation = await regulationRepository.findById(id);
    if (!existingRegulation) throw new Error("Regulation not found.");

    const updatedRegulation = await regulationRepository.update(id, updates);
    return updatedRegulation;
  }

  // Xóa quy định
  async deleteRegulation(id) {
    const existingRegulation = await regulationRepository.findById(id);
    if (!existingRegulation) throw new Error("Regulation not found.");

    await regulationRepository.delete(id);
    return { message: "Regulation deleted successfully." };
  }
}

export const regulationService = new RegulationService();
