// models/Employee.js

// 1. Import lớp BaseModel
import { BaseModel } from "./BaseModel.js";

// 2. Tạo lớp Employee KẾ THỪA từ BaseModel
class EmployeeModel extends BaseModel {
  constructor() {
    
    super('employee', 'employeeid');
  }

 
}

export const Employee = new EmployeeModel();