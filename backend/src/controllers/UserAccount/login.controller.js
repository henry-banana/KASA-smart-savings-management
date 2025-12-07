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
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // const { data: userData, error } = await supabase
    //   .from("useraccount")
    //   .select(`
    //     userid,
    //     password,
    //     employee:employee (
    //       fullname,
    //       role:role (
    //         rolename
    //       )
    //     )
    //   `)
    //   .eq("userid", username)
    //   .single();

    // JOIN 3 bảng để lấy roleName thông qua Employee
    const { data: userData, error } = await supabase
      .from("employee")
      .select(
        `
        employeeid,
        fullname,
        email,
        roleid,
        role:roleid(
          rolename
        ),
        useraccount!inner(
          userid,
          password,
          accountstatus
        )
      `
      )
      .eq("email", username)
      .single();

    console.log("Error:", error);
    console.log("User data:", userData);

    if (error || !userData) {
      return res.status(401).json({
        message: "Invalid username or password",
        success: false,
      });
    }

    // So sánh mật khẩu
    const isMatch = await comparePassword(
      password,
      userData.useraccount.password
    );
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password",
        success: false,
      });
    }

    // Lấy roleName từ join Employee → Role
    const roleName = userData.role?.rolename || "Unknown";

    // Lấy thêm thông tin fullName, status
    const fullName = userData.fullname || "Unknown";
    const status = userData.useraccount?.accountstatus || "active";
    
    // 🔹 Kiểm tra tài khoản bị vô hiệu hóa
    if (status !== "Submitted") {
      return res.status(403).json({
        message: "Account disabled. Contact administrator.",
        success: false,
      });
    }

    // Tạo JWT
    const token = jwt.sign(
      {
        userId: userData.useraccount.userid, // id duy nhất
        username: userData.useraccount.userid, // username
        role: roleName, // role: admin, teller...
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      success: true,
      data: {
        userId: userData.useraccount.userid,
        username: userData.useraccount.userid,
        fullName,
        roleName,
        status,
        token,
      },
    });
  } catch (err) {
    console.error("Exception:", err);
    return res.status(500).json({
      message: "Server error",
      detail: err.message,
    });
  }
}
