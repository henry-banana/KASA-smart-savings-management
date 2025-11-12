import { transactionService } from "../../services/Transaction/transaction.service.js";

//Thêm giao dịch mới
export async function addTransaction(req, res) {
  try {
    const result = await transactionService.addTransaction(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error adding transaction:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

//Lấy danh sách tất cả giao dịch
export async function getAllTransactions(req, res) {
  try {
    const result = await transactionService.getAllTransactions();
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error getting transactions:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

//Lấy giao dịch theo ID
export async function getTransactionById(req, res) {
  try {
    const { id } = req.params;
    const result = await transactionService.getTransactionById(id);
    if (!result) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error getting transaction by ID:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

//Cập nhật giao dịch
export async function updateTransaction(req, res) {
  try {
    const { id } = req.params; 
    const result = await transactionService.updateTransaction(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating transaction:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

//Xóa giao dịch
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    const result = await transactionService.deleteTransaction(id);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error deleting transaction:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}
