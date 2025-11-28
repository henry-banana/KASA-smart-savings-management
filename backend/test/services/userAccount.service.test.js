const {
  mockUserAccountRepository,
  mockHashPassword,
  mockComparePassword,
  resetAllMocks
} = require("./__mocks__/serviceDependencies.js");

jest.mock("../../src/repositories/UserAccount/UserAccountRepository.js", () => ({
  userAccountRepository: mockUserAccountRepository
}));
jest.mock("../../src/middleware/hashing.middleware.js", () => ({
  hashPassword: mockHashPassword
}));
jest.mock("../../src/middleware/comparePass.middleware.js", () => ({
  comparePassword: mockComparePassword
}));

const { userAccountService } = require("../../src/services/UserAccount/userAccount.service.js");

describe("UserAccountService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it("creates account after hashing password", async () => {
    mockUserAccountRepository.findByUsernameOrEmail.mockResolvedValue(null);
    mockHashPassword.mockResolvedValue("hashed");
    mockUserAccountRepository.create.mockResolvedValue({ userid: 1 });

    const payload = {
      username: "user",
      email: "user@example.com",
      password: "secret",
      roleID: 2
    };

    const result = await userAccountService.createUserAccount(payload);

    expect(mockHashPassword).toHaveBeenCalledWith("secret");
    expect(mockUserAccountRepository.create).toHaveBeenCalled();
    expect(result.account.userid).toBe(1);
  });

  it("rejects duplicate username/email", async () => {
    mockUserAccountRepository.findByUsernameOrEmail.mockResolvedValue({ userid: 1 });
    await expect(
      userAccountService.createUserAccount({
        username: "user",
        email: "user@example.com",
        password: "secret",
        roleID: 2
      })
    ).rejects.toThrow("Username or email already exists.");
  });

  it("validates required fields on create", async () => {
    await expect(userAccountService.createUserAccount({ username: "u" })).rejects.toThrow(
      "Missing required information."
    );
  });

  it("logs in user via comparePassword", async () => {
    mockUserAccountRepository.findByEmail.mockResolvedValue({
      userid: 1,
      username: "user",
      email: "user@example.com",
      password: "hashed",
      roleid: 2
    });
    mockComparePassword.mockResolvedValue(true);

    const result = await userAccountService.login({
      email: "user@example.com",
      password: "secret"
    });

    expect(mockComparePassword).toHaveBeenCalledWith("secret", "hashed");
    expect(result.user.id).toBe(1);

    mockComparePassword.mockResolvedValue(false);
    await expect(
      userAccountService.login({ email: "user@example.com", password: "secret" })
    ).rejects.toThrow("Invalid email or password.");
  });

  it("returns all accounts and fetches by id", async () => {
    mockUserAccountRepository.findAll.mockResolvedValue([{ userid: 1 }]);
    expect(await userAccountService.getAllUserAccounts()).toEqual([{ userid: 1 }]);

    mockUserAccountRepository.findById.mockResolvedValue({ userid: 2 });
    expect(await userAccountService.getUserAccountById(2)).toEqual({ userid: 2 });

    mockUserAccountRepository.findById.mockResolvedValue(null);
    await expect(userAccountService.getUserAccountById(3)).rejects.toThrow("User account not found.");
  });

  it("updates account with and without password", async () => {
    mockUserAccountRepository.findById.mockResolvedValue({ userid: 4 });
    mockUserAccountRepository.update.mockResolvedValue({ userid: 4, username: "new" });

    await userAccountService.updateUserAccount(4, {
      username: "new",
      email: "new@example.com",
      roleID: 1
    });
    expect(mockHashPassword).not.toHaveBeenCalled();

    mockHashPassword.mockResolvedValue("hashed-new");
    await userAccountService.updateUserAccount(4, {
      username: "newer",
      email: "newer@example.com",
      roleID: 1,
      password: "secret"
    });
    expect(mockHashPassword).toHaveBeenCalledWith("secret");

    mockUserAccountRepository.findById.mockResolvedValue(null);
    await expect(
      userAccountService.updateUserAccount(5, { username: "x" })
    ).rejects.toThrow("User account not found.");
  });

  it("deletes account and handles missing", async () => {
    mockUserAccountRepository.findById.mockResolvedValue({ userid: 6 });
    await userAccountService.deleteUserAccount(6);
    expect(mockUserAccountRepository.delete).toHaveBeenCalledWith(6);

    mockUserAccountRepository.findById.mockResolvedValue(null);
    await expect(userAccountService.deleteUserAccount(7)).rejects.toThrow("User account not found.");
  });

  it("validates login inputs and missing user", async () => {
    await expect(userAccountService.login({ email: "", password: "" })).rejects.toThrow(
      "Email and password are required."
    );

    mockUserAccountRepository.findByEmail.mockResolvedValue(null);
    await expect(
      userAccountService.login({ email: "missing@example.com", password: "secret" })
    ).rejects.toThrow("Invalid email or password.");
  });
});

