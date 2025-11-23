import { typeSavingService } from "../../services/TypeSaving/typeSaving.service.js";

// Lấy tất cả loại sổ tiết kiệm
export async function getAllTypeSavings(req, res) {
  try {
    const result = await typeSavingService.getAllTypeSavings();

    return res.status(200).json({
      message: "Get typesaving successfully",
      success: true,
      total: result.length,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error getting type savings:", error);

    return res.status(500).json({
      message: "Failed to retrieve type savings",
      success: false,
    });
  }
}

// Lấy 1 loại sổ tiết kiệm theo ID
export async function getTypeSavingById(req, res) {
  try {
    const { id } = req.params;
    const result = await typeSavingService.getTypeSavingById(id);

    if (!result) {
      return res.status(404).json({
        message: "TypeSaving not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Get type saving successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error getting type saving:", error);

    return res.status(500).json({
      message: "Failed to retrieve type saving",
      success: false,
    });
  }
}

// Thêm loại sổ tiết kiệm mới
export async function createTypeSaving(req, res) {
  try {
    const result = await typeSavingService.createTypeSaving(req.body);

    return res.status(201).json({
      message: "Created successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error creating type saving:", error);

    return res.status(500).json({
      message: "Failed to create type saving",
      success: false,
    });
  }
}

// Cập nhật loại sổ tiết kiệm
export async function updateTypeSaving(req, res) {
  try {
    const { id } = req.params;
    const result = await typeSavingService.updateTypeSaving(id, req.body);

    if (!result) {
      return res.status(404).json({
        message: "TypeSaving not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Updated successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error updating type saving:", error);

    return res.status(500).json({
      message: "Failed to update type saving",
      success: false,
    });
  }
}

// Xóa loại sổ tiết kiệm
export async function deleteTypeSaving(req, res) {
  try {
    const { id } = req.params;
    const result = await typeSavingService.deleteTypeSaving(id);

    if (!result) {
      return res.status(404).json({
        message: "TypeSaving not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Deleted successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error deleting type saving:", error);

    return res.status(500).json({
      message: "Failed to delete type saving",
      success: false,
    });
  }
}
