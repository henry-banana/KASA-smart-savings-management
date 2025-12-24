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
    switch (err.message) {
      case "Saving book not found":
        return res.status(404).json({
          message: err.message,
          success: false,
        });    
      
      case "Customer not found":
        return res.status(404).json({
          message: err.message,
          success: false,
        });

      case "TypeSaving not found":
        return res.status(404).json({
          message: err.message,
          success: false,
        });

      default:
        return res.status(err.status || 500).json({
          message: "Failed to retrieve saving book",
          success: false,
        });
    }
  }
}

// Tìm kiếm sổ tiết kiệm theo keyword
export async function searchSavingBook(req, res) {
  try {
    const { keyword, pageSize, pageNumber, typeId, status } = req.query;

    // Parse pageSize và pageNumber, set giá trị mặc định
    const parsedPageSize = parseInt(pageSize) || 10;
    const parsedPageNumber = parseInt(pageNumber) || 1;

    // Gọi service - nếu không có keyword thì lấy tất cả
    const result = await savingBookService.searchSavingBook(
      keyword,
      typeId,
      status,
      parsedPageSize,
      parsedPageNumber
    );

    return res.status(200).json({
      message: keyword
        ? "Search saving books successfully"
        : "Get all saving books successfully",
      success: true,
      total: result.total,
      pageSize: parsedPageSize,
      pageNumber: parsedPageNumber,
      totalPages: Math.ceil(result.total / parsedPageSize),
      data: result.data,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Failed to search saving books",
      success: false,
    });
  }
}

// Tất toán sổ tiết kiệm
export async function closeSavingBook(req, res) {
  try {
    const { id } = req.params;
    const { employeeID } = req.body;
    const result = await savingBookService.closeSavingBook(id, employeeID);

    if (!result) {
      return res.status(404).json({
        message: "Saving book not found or already closed",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Saving book closed successfully",
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("❌ Error closing saving book:", err);
    return res.status(err.status || 500).json({
      message: "Failed to close saving book",
      success: false,
    });
  }
}
