// Thay đổi duy nhất ở dòng này
import { UserAccount } from "../../models/UserAccount.js"; 
import { comparePassword } from "../../middleware/comparePass.middleware.js";

/**
 * POST /login
 * Body: { username, password }
 */
export async function login(req, res) {
  try {
    // 1. Kiểm tra dữ liệu đầu vào
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Missing username or password",
      });
    }


    const user = await UserAccount.getById(username);

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
        success: false,
      });
    }

    // 3. So sánh mật khẩu đã hash
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
        success: false,
      });
    }

    // 4. Đăng nhập thành công
    return res.status(200).json({
      message: "Login successful",
      success: true,
      user, // Bạn có thể cân nhắc bỏ 'user.password' trước khi trả về
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