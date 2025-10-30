// src/middleware/comparePass.middleware.js

import bcrypt from 'bcrypt'; //thư viện cần cho hash mật khẩu

/**
 * So sánh mật khẩu dạng văn bản (plaintext) với chuỗi băm bcrypt.
 * @param {string} plainPassword - Mật khẩu gốc cần kiểm tra.
 * @param {string} passwordHash - Chuỗi băm bcrypt (lấy từ cơ sở dữ liệu) để so sánh.
 * @returns {Promise<boolean>} Trả về true nếu mật khẩu trùng khớp, ngược lại trả về false.
 * @throws {TypeError} Nếu đầu vào không phải là chuỗi (lỗi có thể phát sinh từ thư viện bcrypt).
 *
 * Ví dụ cách dùng:
 *   const ok = await comparePassword('secret', user.passwordHash);
 * 
 * Lưu ý: Tham số đầu vào bao gồm một mật khẩu gốc và một chuỗi băm.
 */
export async function comparePassword(plainPassword, passwordHash) {
    if (
        typeof plainPassword !== 'string' 
        || typeof passwordHash !== 'string'
    ) {
        throw new TypeError('Both Password and PasswordHash must be strings');
    }
  return await bcrypt.compare(plainPassword, passwordHash); // trả về boolean
}
