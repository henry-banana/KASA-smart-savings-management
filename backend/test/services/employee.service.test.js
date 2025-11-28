const {
  mockEmployeeRepository,
  mockUserAccountRepository,
  mockHashPassword,
  resetAllMocks
} = require("./__mocks__/serviceDependencies.js");

jest.mock("../../src/repositories/Employee/EmployeeRepository.js", () => ({
  employeeRepository: mockEmployeeRepository
}));
jest.mock("../../src/repositories/UserAccount/UserAccountRepository.js", () => ({
  userAccountRepository: mockUserAccountRepository
}));
jest.mock("../../src/middleware/hashing.middleware.js", () => ({
  hashPassword: mockHashPassword
}));

const { employeeService } = require("../../src/services/Employee/employee.service.js");

describe("EmployeeService", () => {
  const payload = {
    fullName: "John Doe",
    roleID: 2,
    branchID: 5,
    email: "john@example.com",
    password: "secret"
  };

  beforeEach(() => {
    resetAllMocks();
  });

  it("adds employee with hashed password", async () => {
    mockHashPassword.mockResolvedValue("hashed");
    mockEmployeeRepository.create.mockResolvedValue({ employeeid: 10 });
    mockUserAccountRepository.update.mockResolvedValue({});

    const result = await employeeService.addEmployee(payload);

    expect(mockHashPassword).toHaveBeenCalledWith("secret");
    expect(mockEmployeeRepository.create).toHaveBeenCalledWith({
      fullname: "John Doe",
      email: "john@example.com",
      roleid: 2,
      branchid: 5
    });
    expect(mockUserAccountRepository.update).toHaveBeenCalledWith(10, { password: "hashed" });
    expect(result.employee.employeeid).toBe(10);
  });

  it("rejects when data missing", async () => {
    await expect(employeeService.addEmployee({})).rejects.toThrow("Missing required information.");
  });

  it("updates employee and password when provided", async () => {
    mockEmployeeRepository.findById.mockResolvedValue({ employeeid: 1 });
    mockEmployeeRepository.update.mockResolvedValue({ employeeid: 1, fullname: "Jane" });
    mockHashPassword.mockResolvedValue("hashed-new");

    const updates = {
      fullName: "Jane",
      email: "jane@example.com",
      roleID: 3,
      branchID: 9,
      password: "new"
    };

    const response = await employeeService.updateEmployee(1, updates);

    expect(mockEmployeeRepository.update).toHaveBeenCalledWith(1, {
      fullname: "Jane",
      email: "jane@example.com",
      roleid: 3,
      branchid: 9
    });
    expect(mockHashPassword).toHaveBeenCalledWith("new");
    expect(mockUserAccountRepository.update).toHaveBeenCalledWith(1, { password: "hashed-new" });
    expect(response.employee.fullname).toBe("Jane");
  });

  it("updates employee without password change", async () => {
    mockEmployeeRepository.findById.mockResolvedValue({ employeeid: 2 });
    mockEmployeeRepository.update.mockResolvedValue({ employeeid: 2, fullname: "Ann" });

    await employeeService.updateEmployee(2, {
      fullName: "Ann",
      email: "ann@example.com",
      roleID: 4,
      branchID: 6
    });

    expect(mockHashPassword).not.toHaveBeenCalled();
    expect(mockUserAccountRepository.update).not.toHaveBeenCalledWith(2, expect.anything());
  });

  it("throws when employee not found on update", async () => {
    mockEmployeeRepository.findById.mockResolvedValue(null);
    await expect(employeeService.updateEmployee(1, {})).rejects.toThrow("Employee not found");
  });

  it("gets employees and individual employee", async () => {
    mockEmployeeRepository.findAll.mockResolvedValue([{ id: 1 }]);
    mockEmployeeRepository.findById.mockResolvedValue({ id: 2 });

    const all = await employeeService.getAllEmployees();
    const single = await employeeService.getEmployeeById(2);

    expect(all).toHaveLength(1);
    expect(single.id).toBe(2);
  });

  it("deletes employee and account", async () => {
    mockEmployeeRepository.findById.mockResolvedValue({ employeeid: 1 });
    await employeeService.deleteEmployee(1);
    expect(mockEmployeeRepository.delete).toHaveBeenCalledWith(1);
    expect(mockUserAccountRepository.delete).toHaveBeenCalledWith(1);
  });

  it("throws when deleting missing employee", async () => {
    mockEmployeeRepository.findById.mockResolvedValue(null);
    await expect(employeeService.deleteEmployee(2)).rejects.toThrow("Employee not found");
  });

  it("throws when employee id not found on fetch", async () => {
    mockEmployeeRepository.findById.mockResolvedValue(null);
    await expect(employeeService.getEmployeeById(10)).rejects.toThrow("Employee not found");
  });
});

