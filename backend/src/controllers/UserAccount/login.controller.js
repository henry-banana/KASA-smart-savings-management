import { userAccountRepository } from "../../repositories/UserAccount/UserAccountRepository.js";
import { comparePassword } from "../../middleware/comparePass.middleware.js";

/**
 * POST /login
 * Body: { username, password }
 */
export async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" });
    }

    // Truy cập qua repository thay vì model trực tiếp
    const user = await userAccountRepository.findById(username);
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
        success: false,
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user,
    });
  } catch (err) {
    console.error("❌ Exception:", err);
    return res.status(500).json({
      message: "System error (Exception)",
      detail: err.message,
    });
  }
}
