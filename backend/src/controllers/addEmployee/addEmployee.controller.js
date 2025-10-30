import { supabase } from "../../config/database.js";
import { hashPassword } from "../../middleware/hashing.middleware.js";

export async function addEmployee(req, res) {
  try {
    const { fullName, roleID, branchID, email, password } = req.body;

    // 1️⃣ Validate dữ liệu cơ bản
    if (!fullName || !email || !roleID || !branchID || !password) {
      return res.status(400).json({ message: "Missing required information." });
    }

    // 2️⃣ Hash mật khẩu (sử dụng middleware chung)
    const hashedPassword = await hashPassword(password);

    // 3️⃣ Thêm vào bảng employee
    const { data: empData, error: empErr } = await supabase
      .from("employee")
      .insert([
        {
          fullname: fullName,
          email,
          roleid: roleID,
          branchid: branchID, 
        },
      ])
      .select();

    if (empErr) throw empErr;
    const newEmployee = empData[0];

    // Cập nhật password cho useraccount đã có
    const { error: userErr } = await supabase
      .from("useraccount")
      .update({ password: hashedPassword }) // giá trị mới
      .eq("userid", newEmployee.employeeid); // điều kiện: dòng tương ứng với employee

    if (userErr) throw userErr;

    // 5️⃣ Trả về kết quả
    return res.status(201).json({
      message: "Employee added and account created successfully.",
      employee: newEmployee,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

export default addEmployee;