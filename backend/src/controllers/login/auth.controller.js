import { supabase } from "../../config/database.js";
import { comparePassword } from "../../middleware/comparePass.middleware.js";

export async function login(req, res) {
  try {
    // 1. Kiểm tra dữ liệu đầu vào
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Missing username or password",
      });
    }

    // 2. Truy vấn Supabase để lấy thông tin user
    const { data, error } = await supabase
      .from("useraccount")
      .select("*")
      .eq("userid", username)
      .single(); // Lấy 1 dòng duy nhất (nếu có)

    // 3. Xử lý lỗi từ Supabase
    if (error && error.code !== "PGRST116") {
      // PGRST116 = không tìm thấy bản ghi (không phải lỗi nghiêm trọng)
      console.error("Supabase query error:", error);
      return res.status(400).json({
        message: "Database query error",
        detail: error.message,
      });
    }

    // 4. Kiểm tra tài khoản có tồn tại và so sánh mật khẩu
    if (!data) {
      return res.status(401).json({
        message: "Invalid username or password",
        success: false,
      });
    }

    // So sánh mật khẩu đã hash
    const isMatch = await comparePassword(password, data.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
        success: false,
      });
    }

    // 5. Nếu đúng mật khẩu -> đăng nhập thành công
    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: data,
    });
  } catch (err) {
    console.error("❌ Exception:", err);
    return res.status(500).json({
      message: "System error (Exception)",
      detail: err.message,
    });
  }
}

export default login;
