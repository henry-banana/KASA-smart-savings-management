// src/middleware/hashing.middleware.js


import bcrypt from 'bcrypt'; //thư viện cần cho hash mật khẩu

const SALT_ROUNDS = 12; // 10-12 là hợp lý cho hầu hết hệ thống, nếu nhiều hơn thì có thể gây chậm CPU

// Trả về passwordHash từ plainPassword (mật khẩu gốc)
export async function hashPassword(plainPassword) {
  if (typeof plainPassword !== 'string') 
    {
        throw new TypeError('Password must be a string');
    }
  return await bcrypt.hash(plainPassword, SALT_ROUNDS); 
}
