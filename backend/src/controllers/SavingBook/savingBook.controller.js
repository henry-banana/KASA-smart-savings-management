import { savingBookService } from "../../services/SavingBook/savingBook.service.js";

// Thêm sổ tiết kiệm mới
export async function addSavingBook(req, res) {
  try {
    const result = await savingBookService.addSavingBook(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error adding saving book:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

// Cập nhật sổ tiết kiệm
export async function updateSavingBook(req, res) {
  try {
    const { id } = req.params;
    const result = await savingBookService.updateSavingBook(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating saving book:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

// Xóa sổ tiết kiệm
export async function deleteSavingBook(req, res) {
  try {
    const { id } = req.params;
    const result = await savingBookService.deleteSavingBook(id);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error deleting saving book:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

// Lấy thông tin sổ tiết kiệm theo ID
export async function getSavingBookById(req, res) {
  try {
    const { id } = req.params;
    const result = await savingBookService.getSavingBookById(id);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error getting saving book:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}
