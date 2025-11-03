import { employeeService } from "../../services/Employee/employee.service.js";

export async function addEmployee(req, res) {
  try {
    const result = await employeeService.addEmployee(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error adding employee:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}

export async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const result = await employeeService.updateEmployee(id, req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error updating employee:", err);
    res.status(err.status || 500).json({ message: err.message });
  }
}
