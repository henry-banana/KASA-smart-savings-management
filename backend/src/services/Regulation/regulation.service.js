import { typeSavingRepository } from "../../repositories/TypeSaving/TypeSavingRepository.js";

class RegulationService {
  // Lấy toàn bộ quy định
  async getAllRegulations() {
    const allTypeSaving = await typeSavingRepository.findAll();
    const result = {
      minimumDeposit: 1e9,
      minimumTermDay: 1e9,
    };

    for (const typeSaving of allTypeSaving) {
      if (
        typeSaving.minimumdeposit !== null &&
        typeSaving.minimumdeposit < result.minimumDeposit
      ) {
        result.minimumDeposit = typeSaving.minimumdeposit;
      }

      if (
        typeSaving.minimumdepositterm !== null &&
        typeSaving.minimumdepositterm < result.minimumTermDay &&
        typeSaving.typename == "No term"
      ) {
        result.minimumTermDay = typeSaving.minimumdepositterm;
      }
    }

    return result;
  }

  // Cập nhật quy định
  async updateRegulations(minimumDepositAmount, minimumTermDays) {
    const allTypeSaving = await typeSavingRepository.findAll();
    for (const typeSaving of allTypeSaving) {
      if (typeSaving.typename == "No term") {
        await typeSavingRepository.update(typeSaving.typeid, {
          minimumdeposit: minimumDepositAmount,
          minimumdepositterm: minimumTermDays,
        });
      }
    }

    return { minimumDepositAmount, minimumTermDays };
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
