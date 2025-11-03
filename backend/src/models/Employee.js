import { BaseModel } from "./BaseModel.js";

class EmployeeModel extends BaseModel {
  constructor() {
    super("employee", "employeeid");
  }
}

export const Employee = new EmployeeModel();
