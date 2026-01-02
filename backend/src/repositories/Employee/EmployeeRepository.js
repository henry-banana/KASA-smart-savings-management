import { Employee } from "../../models/Employee.js";

export class EmployeeRepository {
  async findById(employeeId) {
    return await Employee.getById(employeeId);
  }

  async findAll() {
    return await Employee.getAll();
  }

  async create(employeeData) {
    return await Employee.create(employeeData); 
  }

  async update(employeeId, employeeData) {
    return await Employee.update(employeeId, employeeData);
  }

  async delete(employeeId) {
    return await Employee.delete(employeeId);
  }
  // --- Hàm nghiệp vụ riêng cho Profile ---
  async findProfileById(id) {
    return await Employee.getProfileById(id);
  }
}

export const employeeRepository = new EmployeeRepository();
