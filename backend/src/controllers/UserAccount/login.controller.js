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

    //JOIN 3 bảng để lấy roleName thông qua Employee
    const { data: userData, error } = await supabase
      .from("useraccount")
      .select(`
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

    // Lấy roleName (qua Employee → Role)
    const roleName = userData.employee?.role?.rolename || "Unknown";

    return res.status(200).json({
      message: "Login successful",
      success: true,
      roleName,
    });

  } catch (err) {
    console.error("Exception:", err);
    return res.status(500).json({
      message: "Employee not found",
      detail: err.message,
    });
  }
}
