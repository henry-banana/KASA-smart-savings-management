import { transactionService } from "../../services/Transaction/transaction.service.js";

// Thêm giao dịch mới
export async function addTransaction(req, res) {
  try {
    const result = await transactionService.addTransaction(req.body);

    return res.status(201).json({
      message: "Transaction added successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error adding transaction:", err);

    return res.status(err.status || 500).json({
      message: "Failed to add transaction",
      success: false,
    });
  }
}

// Lấy danh sách tất cả giao dịch
export async function getAllTransactions(req, res) {
  try {
    const result = await transactionService.getAllTransactions();

    return res.status(200).json({
      message: "Get transactions successfully",
      success: true,
      total: result.length,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error getting transactions:", err);

    return res.status(err.status || 500).json({
      message: "Failed to retrieve transactions",
      success: false,
    });
  }
}

// Lấy giao dịch theo ID
export async function getTransactionById(req, res) {
  try {
    const { id } = req.params;
    const result = await transactionService.getTransactionById(id);

    if (!result) {
      return res.status(404).json({
        message: "Transaction not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Get transaction successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error getting transaction by ID:", err);

    return res.status(err.status || 500).json({
      message: "Failed to retrieve transaction",
      success: false,
    });
  }
}

// Cập nhật giao dịch
export async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    const result = await transactionService.updateTransaction(id, req.body);

    if (!result) {
      return res.status(404).json({
        message: "Transaction not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Transaction updated successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error updating transaction:", err);

    return res.status(err.status || 500).json({
      message: "Failed to update transaction",
      success: false,
    });
  }
}

// Xóa giao dịch
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    const result = await transactionService.deleteTransaction(id);

    if (!result) {
      return res.status(404).json({
        message: "Transaction not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Transaction deleted successfully",
      success: true,
      total: 1,
      data: result,
    });

  } catch (err) {
    console.error("❌ Error deleting transaction:", err);

    return res.status(err.status || 500).json({
      message: "Failed to delete transaction",
      success: false,
    });
  }
}
