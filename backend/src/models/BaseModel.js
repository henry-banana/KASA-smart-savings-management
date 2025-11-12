// models/BaseModel.js
import { supabase } from "../config/database.js";

/**
 * BaseModel - lớp cơ sở cho tất cả các model thao tác với Supabase
 * --------------------------------------------------------------
 * - Hỗ trợ CRUD cơ bản (create, getById, update, delete)
 * - Cho phép khai báo bảng và khóa chính linh hoạt
 * - Có thể kế thừa và mở rộng trong các model con
 */

export class BaseModel {
  /**
   * @param {string} tableName - tên bảng trong Supabase
   * @param {string} primaryKey - tên cột khóa chính (mặc định: "id")
   */
  constructor(tableName, primaryKey = "id") {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  /**
   * Tạo bản ghi mới
   * @param {object} data - dữ liệu cần thêm
   * @returns {object} - bản ghi vừa thêm
   */
  async create(data) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert([data])
      .select();

    if (error) throw new Error(`Create failed in ${this.tableName}: ${error.message}`);
    return result?.[0] || null;
  }

  /**
   * Lấy bản ghi theo ID
   * @param {any} idValue - giá trị của khóa chính
   * @returns {object|null} - bản ghi nếu tồn tại
   */
  async getById(idValue) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq(this.primaryKey, idValue)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(`Get failed: ${error.message}`);
    return data || null;
  }

  /**
   * Cập nhật bản ghi
   * @param {any} idValue - giá trị của khóa chính
   * @param {object} updates - dữ liệu cần cập nhật
   * @returns {object|null} - bản ghi sau khi cập nhật
   */
  async update(idValue, updates) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq(this.primaryKey, idValue)
      .select();

    if (error) throw new Error(`Update failed in ${this.tableName}: ${error.message}`);
    return data?.[0] || null;
  }

  /**
   * Xóa bản ghi
   * @param {any} idValue - giá trị của khóa chính
   * @returns {object|null} - bản ghi đã xóa (nếu có)
   */
  async delete(idValue) {
    const { data, error } = await supabase
      .from(this.tableName)
      .delete()
      .eq(this.primaryKey, idValue)
      .select();

    if (error) throw new Error(`Delete failed in ${this.tableName}: ${error.message}`);
    return data?.[0] || null;
  }

  /**
   * Lấy toàn bộ bản ghi (tùy chọn điều kiện)
   * @param {object} [filters={}] - điều kiện lọc (ví dụ { roleid: 2 })
   * @returns {Array} - danh sách bản ghi
   */
  async getAll(filters = {}) {
    let query = supabase.from(this.tableName).select("*");

    // Thêm điều kiện nếu có
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const { data, error } = await query;
    if (error) throw new Error(`GetAll failed in ${this.tableName}: ${error.message}`);
    return data || [];
  }
}
