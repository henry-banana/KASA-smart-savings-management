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

  // Lấy danh sách lãi suất các loại tiết kiệm
  async getRegulationRates() {
    const allTypeSaving = await typeSavingRepository.findAll();
    const result = allTypeSaving.map((typeSaving) => ({
      typeSavingId: typeSaving.typeid,
      typeName: typeSaving.typename,
      rate: typeSaving.interest,
      minimumBalance: typeSaving.minimumbalance,
      term: typeSaving.termperiod,
      editable: true,
    }));

    return result;
  }

  // Cập nhật lãi suất cho một loại tiết kiệm
  async updateRegulation(updates) {
    if (updates){
        for (const update of updates) {
            typeSavingRepository.update(update.typeSavingId, {
              typename: update.typeName,  
              interest: update.rate,
              termperiod: update.term,
            });
        }

        return { message: "Regulations updated successfully." };
    }else{
        throw new Error("No updates provided.");
    }
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
