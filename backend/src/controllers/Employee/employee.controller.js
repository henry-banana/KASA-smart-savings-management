import { Employee } from "../../models/Employee.js";
import { UserAccount } from "../../models/UserAccount.js";
import { hashPassword } from "../../middleware/hashing.middleware.js";

export async function addEmployee(req, res) {
  try {
    const { fullName, roleID, branchID, email, password } = req.body;
    if (!fullName || !email || !roleID || !branchID || !password) {
      return res.status(400).json({ message: "Missing required information." });
    }

    const hashedPassword = await hashPassword(password);

    const newEmployee = await Employee.create({
      fullname: fullName,
      email,
      roleid: roleID,
      branchid: branchID,
    });

    await UserAccount.update(newEmployee.employeeid, { password: hashedPassword });

    return res.status(201).json({
      message: "Employee added and account created successfully.",
      employee: newEmployee,
    });
  } catch (err) {
    console.error("❌ Error adding employee:", err);
    return res.status(500).json({ 
      message: "Server error while adding employee", 
      error: err.message 
    });
  }
}

export async function updateEmployee(req, res) {
  try {
    const { id } = req.params; // Lấy employee ID từ URL params
    const { fullName, email, roleID, branchID, password } = req.body;

    // Kiểm tra employee tồn tại
    const existingEmployee = await Employee.getById(id);
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Chuẩn bị dữ liệu cập nhật cho employee
    const updates = {};
    if (fullName) updates.fullname = fullName;
    if (email) updates.email = email;
    if (roleID) updates.roleid = roleID;
    if (branchID) updates.branchid = branchID;

    // Cập nhật thông tin employee
    const updatedEmployee = await Employee.update(id, updates);

    // Nếu có password mới, hash và cập nhật
    if (password) {
      const hashedPassword = await hashPassword(password);
      await UserAccount.update(id, { password: hashedPassword });
    }

    return res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });

  } catch (err) {
    console.error("❌ Error updating employee:", err);
    return res.status(500).json({
      message: "Server error while updating employee",
      error: err.message,
    });
  }
}
