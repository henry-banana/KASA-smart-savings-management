import jwt from "jsonwebtoken";
import { comparePassword } from "../../middleware/comparePass.middleware.js";
import { supabase } from "../../config/database.js";

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

    // JOIN 3 bảng để lấy roleName thông qua Employee
    const { data: userData, error } = await supabase
      .from("useraccount")
      .select(`
        userid,
        password,
        employee:employee (
          role:role (
            rolename
          )
        )
      `)
      .eq("userid", username)
      .single();

    if (error || !userData) {
      return res.status(401).json({
        message: "Invalid username or password",
        success: false,
      });
    }

    // So sánh mật khẩu
    const isMatch = await comparePassword(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password",
        success: false,
      });
    }

    // Lấy roleName từ join Employee → Role
    const roleName = userData.employee?.role?.rolename || "Unknown";

    // Tạo JWT
    const token = jwt.sign(
      {
        userId: userData.userid,
        role: roleName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      success: true,
      roleName,
      token,   
    });

  } catch (err) {
    console.error("Exception:", err);
    return res.status(500).json({
      message: "Server error",
      detail: err.message,
    });
  }
}
