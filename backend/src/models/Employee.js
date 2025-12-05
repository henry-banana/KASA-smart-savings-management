import { BaseModel } from "./BaseModel.js";
import { supabase } from "../config/database.js";

class EmployeeModel extends BaseModel {
  constructor() {
    super("employee", "employeeid");
  }

  async getAll() {
    const { data, error } = await supabase
      .from("employee")
      .select(`
        employeeid,
        fullname,
        email,
        role:roleid (
          rolename
        ),
        useraccount:useraccount!userid (
          userid,
          accountstatus
        ),
        branch:branchid (
          branchname
        )
      `);

    if (error) throw error;

    // Map về đúng format bạn muốn
    return data.map(emp => ({
      id: emp.employeeid,
      username: emp.employeeid,
      fullName: emp.fullname,
      email: emp.email,
      roleName: emp.role?.rolename ?? null,
      status: emp.useraccount?.accountstatus ?? "inactive",
      branchName: emp.branch?.branchname ?? null
    }));
  }
}

export const Employee = new EmployeeModel();
