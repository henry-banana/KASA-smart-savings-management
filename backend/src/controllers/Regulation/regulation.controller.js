import { regulationService } from "../../services/Regulation/regulation.service.js";

// Lấy tất cả quy định
export async function getAllRegulations(req, res) {
  try {
    const result = await regulationService.getAllRegulations();

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

// Lấy 1 quy định theo ID
export async function getRegulationById(req, res) {
  try {
    const { id } = req.params;
    const result = await regulationService.getRegulationById(id);

    if (!result) {
      return res.status(404).json({
        message: "Regulation not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Regulation retrieved successfully",
      success: true,
      total: 1,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error getting regulation:", error);

    return res.status(500).json({
      message: "Failed to retrieve regulation",
      success: false,
    });
  }
}

// Thêm quy định mới
export async function createRegulation(req, res) {
  try {
    const result = await regulationService.createRegulation(req.body);

    return res.status(201).json({
      message: "Regulation created successfully",
      success: true,
      total: 1,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error creating regulation:", error);

    return res.status(500).json({
      message: "Failed to create regulation",
      success: false,
    });
  }
}

// Cập nhật quy định
export async function updateRegulation(req, res) {
  try {
    const { id } = req.params;
    const result = await regulationService.updateRegulation(id, req.body);

    if (!result) {
      return res.status(404).json({
        message: "Regulation not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Regulation updated successfully",
      success: true,
      total: 1,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error updating regulation:", error);

    return res.status(500).json({
      message: "Failed to update regulation",
      success: false,
    });
  }
}

// Xóa quy định
export async function deleteRegulation(req, res) {
  try {
    const { id } = req.params;
    const result = await regulationService.deleteRegulation(id);

    if (!result) {
      return res.status(404).json({
        message: "Regulation not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Regulation deleted successfully",
      success: true,
      total: 1,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error deleting regulation:", error);

    return res.status(500).json({
      message: "Failed to delete regulation",
      success: false,
    });
  }
}
