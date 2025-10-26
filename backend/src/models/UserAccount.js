import { supabase } from '../config/database.js';

/**
 * Model UserAccount
 * Liên kết với bảng 'user_account' trong Supabase
 */
export const UserAccount = {
  tableName: 'user_account',

  // Các trường trong bảng user_account
  fields: {
    user_id: 'int',          // định danh người dùng
    role_id: 'int',          // vai trò (VD: admin, user,...)
    password: 'string',         // mật khẩu (nên được mã hóa khi lưu)
    register_status: 'string', // trạng thái đăng ký (true/false)
  },

  // Liên kết client Supabase (để service/repo có thể truy cập)
  client: supabase,
};
