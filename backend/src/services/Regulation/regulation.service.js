import { typeSavingRepository } from "../../repositories/TypeSaving/TypeSavingRepository.js";

class RegulationService {
  // Lấy toàn bộ quy định
  async getAllRegulations() {
    const allTypeSaving = await typeSavingRepository.findAll();
    const result = {
      minimumBalance: 1e9,
      minimumTermDays: 1e9,
    };

    for (const typeSaving of allTypeSaving) {
      if (
        typeSaving.minimumbalance !== null &&
        typeSaving.minimumbalance < result.minimumBalance
      ) {
        result.minimumBalance = typeSaving.minimumbalance;
      }

      if (
        typeSaving.minimumdepositterm !== null &&
        typeSaving.minimumdepositterm < result.minimumTermDays &&
        typeSaving.typename == "No term"
      ) {
        result.minimumTermDays = typeSaving.minimumdepositterm;
      }
    }

    return result;
  }

  // Cập nhật quy định
  async updateRegulations(minimumBalance, minimumTermDays) {
    const allTypeSaving = await typeSavingRepository.findAll();
    for (const typeSaving of allTypeSaving) {
      if (typeSaving.typename == "No term") {
        await typeSavingRepository.update(typeSaving.typeid, {
          minimumbalance: minimumBalance,
          minimumterm: minimumTermDays,
        });
      }
    }

    return { minimumBalance, minimumTermDays };
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
    if (updates) {
      for (const update of updates) {
        typeSavingRepository.update(update.typeSavingId, {
          typename: update.typeName,
          interest: update.rate,
          termperiod: update.term,
        });
      }

      return { message: "Regulations updated successfully." };
    } else {
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

  async getHistoryRegulations() {
    const history = await regulationRepository.getHistoryRegulations();
    return history;
  }
}

export const regulationService = new RegulationService();
