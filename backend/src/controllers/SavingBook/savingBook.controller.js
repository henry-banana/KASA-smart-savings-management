import { savingBookService } from "../../services/SavingBook/savingBook.service.js";

// Thêm sổ tiết kiệm mới
export async function addSavingBook(req, res) {
  try {
    const result = await savingBookService.addSavingBook(req.body);
    

    return res.status(201).json({
      message: "Saving book added successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error adding saving book:", err);

    return res.status(err.status || 500).json({
      message: "Failed to add saving book",
      success: false,
    });
  }
}

// Cập nhật sổ tiết kiệm
export async function updateSavingBook(req, res) {
  try {
    const { id } = req.params;
    const result = await savingBookService.updateSavingBook(id, req.body);

    if (!result) {
      return res.status(404).json({
        message: "Saving book not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Saving book updated successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error updating saving book:", err);

    return res.status(err.status || 500).json({
      message: "Failed to update saving book",
      success: false,
    });
  }
}

// Xóa sổ tiết kiệm
export async function deleteSavingBook(req, res) {
  try {
    const { id } = req.params;
    const result = await savingBookService.deleteSavingBook(id);

    if (!result) {
      return res.status(404).json({
        message: "Saving book not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Saving book deleted successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error deleting saving book:", err);

    return res.status(err.status || 500).json({
      message: "Failed to delete saving book",
      success: false,
    });
  }
}

// Lấy thông tin sổ tiết kiệm theo ID
export async function getSavingBookById(req, res) {
  try {
    const { id } = req.params;
    const result = await savingBookService.getSavingBookById(id);

    if (!result) {
      return res.status(404).json({
        message: "Saving book not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Get saving book successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error getting saving book:", err);

    return res.status(err.status || 500).json({
      message: "Failed to retrieve saving book",
      success: false,
    });
  }
}
