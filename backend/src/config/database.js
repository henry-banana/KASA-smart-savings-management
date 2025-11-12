// backend/src/config/database.js
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

// resolve __dirname cho ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load .env
config({ path: path.resolve(__dirname, '../../.env') });

// lấy biến môi trường
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("❌ Thiếu SUPABASE_URL hoặc SUPABASE_KEY trong file .env");
}

// tạo client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Hàm test kết nối + in dữ liệu
export async function connectDatabase() {
  try {
    // lấy 10 bản ghi đầu
    const { data, error } = await supabase.from('user_account').select('*').limit(10);

    if (error) throw error;

    console.log('✅ Kết nối Supabase thành công!');
    console.log('Dữ liệu bảng user_account:', data);

  } catch (err) {
    console.error('❌ Lỗi kết nối Supabase:', err.message || err);
  }
}
