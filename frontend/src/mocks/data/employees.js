/**
 * Mock data for Employees
 * Based on database schema: employee table
 */

export const mockEmployees = [
  {
    employeeid: "EMP001",
    fullname: "Trần Văn Teller",
    roleid: "ROLE001",
    phone: "0912345678",
    email: "teller1@bank.com",
    dateofbirth: "1995-03-15",
    hiredate: "2023-01-10"
  },
  {
    employeeid: "EMP002",
    fullname: "Nguyễn Thị Teller",
    roleid: "ROLE001",
    phone: "0923456789",
    email: "teller2@bank.com",
    dateofbirth: "1996-07-20",
    hiredate: "2023-03-15"
  },
  {
    employeeid: "EMP003",
    fullname: "Lê Văn Kế Toán",
    roleid: "ROLE002",
    phone: "0934567890",
    email: "auditor1@bank.com",
    dateofbirth: "1990-11-05",
    hiredate: "2022-06-01"
  },
  {
    employeeid: "EMP004",
    fullname: "Phạm Thị Admin",
    roleid: "ROLE003",
    phone: "0945678901",
    email: "admin@bank.com",
    dateofbirth: "1988-02-28",
    hiredate: "2021-01-05"
  }
];

/**
 * Mock data for Roles
 * Based on database schema: role table
 */
export const mockRoles = [
  {
    roleid: "ROLE001",
    rolename: "Teller",
    description: "Nhân viên giao dịch - Xử lý giao dịch gửi/rút tiền"
  },
  {
    roleid: "ROLE002",
    rolename: "Auditor",
    description: "Kế toán - Xem báo cáo và kiểm tra sổ sách"
  },
  {
    roleid: "ROLE003",
    rolename: "Administrator",
    description: "Quản trị viên - Quản lý hệ thống và cấu hình"
  }
];

/**
 * Helper functions for employee data
 */
export const findEmployeeById = (employeeid) => {
  return mockEmployees.find(e => e.employeeid === employeeid);
};

export const findEmployeesByRole = (roleid) => {
  return mockEmployees.filter(e => e.roleid === roleid);
};

export const addEmployee = (employee) => {
  mockEmployees.push(employee);
  return employee;
};

export const updateEmployee = (employeeid, updates) => {
  const index = mockEmployees.findIndex(e => e.employeeid === employeeid);
  if (index !== -1) {
    mockEmployees[index] = { ...mockEmployees[index], ...updates };
    return mockEmployees[index];
  }
  return null;
};

export const deleteEmployee = (employeeid) => {
  const index = mockEmployees.findIndex(e => e.employeeid === employeeid);
  if (index !== -1) {
    const deleted = mockEmployees.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

/**
 * Helper functions for role data
 */
export const findRoleById = (roleid) => {
  return mockRoles.find(r => r.roleid === roleid);
};

export const findRoleByName = (rolename) => {
  return mockRoles.find(r => r.rolename === rolename);
};

export { mockEmployees, mockRoles };
export default mockEmployees;
