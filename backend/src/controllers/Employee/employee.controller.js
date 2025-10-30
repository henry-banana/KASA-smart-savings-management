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
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}