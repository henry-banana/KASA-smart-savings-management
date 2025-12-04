import { regulationService } from "../../services/Regulation/regulation.service.js";

// Lấy tất cả quy định
export async function getAllRegulations(req, res) {
  try {
    const data = await regulationService.getAllRegulations();

    const result = {
      minimumDepositAmount: data.minimumDeposit,
      minimumTermDays: data.minimumTermDay,
    };

    return res.status(200).json({
      message: "Regulations retrieved successfully",
      success: true,
      total: result.length,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error getting regulations:", error);

    return res.status(500).json({
      message: "Failed to retrieve regulations",
      success: false,
    });
  }
}

// Cập nhật quy định
export async function updateRegulations(req, res) {
  try {
    const { minimumDepositAmount, minimumTermDays } = req.body;
    const updates = await regulationService.updateRegulations(
      minimumDepositAmount,
      minimumTermDays
    );

    return res.status(200).json({
      message: "Regulation updated successfully",
      success: true,
      data: {
        minimumDepositAmount: minimumDepositAmount,
        minimumTermDays: minimumTermDays,
      },
    });
  } catch (error) {
    console.error("❌ Error updating regulation:", error);

    return res.status(500).json({
      message: "Failed to update regulation",
      success: false,
    });
  }
}

export async function getRegulationRates(req, res) {
  try {
    const rates = await regulationService.getRegulationRates();

    return res.status(200).json({
      message: "Regulation rates retrieved successfully",
      success: true,
      total: rates.length,
      data: rates,
    });
  } catch (error) {
    console.error("❌ Error getting regulation rates:", error);

    return res.status(500).json({
      message: "Failed to retrieve regulation rates",
      success: false,
    });
  }
}

export async function updateSomeRegulation(req, res) {
  try {
    const updates = req.body;

    const result = await regulationService.updateRegulation(
      updates
    );

    return res.status(200).json({
      message: "Regulation updated successfully",
      success: true,
      data: updates,
    });
  } catch (error) {
    console.error("❌ Error updating regulation:", error);

    return res.status(500).json({
      message: "Failed to update regulation",
      success: false,
    });
  }
}
