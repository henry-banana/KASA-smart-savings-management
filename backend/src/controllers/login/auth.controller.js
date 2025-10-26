import { supabase } from "../../config/database.js";

export async function login(req, res) {
  try {
    const { username, password } = req.body || {};

    // 1. Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      return res.status(400).json({
        message: "Thiếu username hoặc password",
      });
    }

    // 2. Thực hiện truy vấn Supabase để kiểm tra tài khoản
    const { data, error } = await supabase
      .from("user_account")
      .select("*")
      .eq("user_id", username)
      .eq("password", password)
      .single(); // Lấy 1 dòng duy nhất (nếu có)

    // 3. Xử lý lỗi từ Supabase
    if (error && error.code !== "PGRST116") { 
      // PGRST116 = không tìm thấy bản ghi (không phải lỗi nghiêm trọng)
      console.error("Supabase query error:", error);
      return res.status(400).json({
        message: "Lỗi truy vấn dữ liệu",
        detail: error.message,
      });
    }

    // 4. Kiểm tra tài khoản có tồn tại hay không
    if (!data) {
      return res.status(401).json({
        message: "Sai tên đăng nhập hoặc mật khẩu",
        success: false,
      });
    }

    // 5. Nếu có dữ liệu -> đăng nhập thành công
    return res.status(200).json({
      message: "Đăng nhập thành công",
      success: true,
      user: data,
    });

  } catch (err) {
    console.error("❌ Exception:", err);
    return res.status(500).json({
      message: "Lỗi hệ thống (Exception)",
      detail: err.message,
    });
  }
}

export default login;
