import { regulationService } from "../../services/Regulation/regulation.service.js";

// Lấy tất cả quy định
export async function getAllRegulations(req, res) {
  try {
    const data = await regulationService.getAllRegulations();

    const result = {
      minimumBalance: data.minimumBalance,
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
    const { minimumBalance, minimumTermDays } = req.body;
    await regulationService.updateRegulations(minimumBalance, minimumTermDays);

    return res.status(200).json({
      message: "Regulation updated successfully",
      success: true,
      data: {
        minimumBalance: minimumBalance,
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

    // Xử lý trường hợp viết sai chính tả minimunBalance -> minimumBalance
    if (updates.minimunBalance !== undefined && updates.minimumBalance === undefined) {
      updates.minimumBalance = updates.minimunBalance;
    }

    const result = await regulationService.updateRegulation(updates);

    // Đảm bảo trả về đầy đủ các trường đã cập nhật
    const responseData = {};
    if (updates.minimumBalance !== undefined) {
      responseData.minimumBalance = updates.minimumBalance;
    }
    if (updates.minimumTermDays !== undefined) {
      responseData.minimumTermDays = updates.minimumTermDays;
    }

    return res.status(200).json({
      message: "Regulation updated successfully",
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("❌ Error updating regulation:", error);

    return res.status(500).json({
      message: "Failed to update regulation",
      success: false,
    });
  }
}

export async function getHistoryRegulations(req, res) {
  try {
    const history = await regulationService.getHistoryRegulations();
    return res.status(200).json({
      message: "Regulation history retrieved successfully",
      success: true,
      total: history.length,
      data: history,
    });
  } catch (error) {
    console.error("❌ Error getting regulation history:", error);

    return res.status(500).json({
      message: "Failed to get regulation history",
      success: false,
    });
  }
}
