import { typeSavingService } from "../../services/TypeSaving/typeSaving.service.js";

// Lấy tất cả loại sổ tiết kiệm
export async function getAllTypeSavings(req, res) {
  try {
    const result = await typeSavingService.getAllTypeSavings();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Lấy 1 loại sổ tiết kiệm theo ID
export async function getTypeSavingById(req, res) {
  try {
    const { id } = req.params;
    const result = await typeSavingService.getTypeSavingById(id);
    if (!result) return res.status(404).json({ message: "TypeSaving not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Thêm loại sổ tiết kiệm mới
export async function createTypeSaving(req, res) {
  try {
    const data = req.body;
    const result = await typeSavingService.createTypeSaving(data);
    res.status(201).json({ message: "Created successfully", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Cập nhật loại sổ tiết kiệm
export async function updateTypeSaving(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await typeSavingService.updateTypeSaving(id, data);
    if (!result) return res.status(404).json({ message: "TypeSaving not found" });
    res.status(200).json({ message: "Updated successfully", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Xóa loại sổ tiết kiệm
export async function deleteTypeSaving(req, res) {
  try {
    const { id } = req.params;
    const result = await typeSavingService.deleteTypeSaving(id);
    if (!result) return res.status(404).json({ message: "TypeSaving not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
