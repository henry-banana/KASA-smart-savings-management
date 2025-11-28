const createRepoMock = (methodNames = []) =>
  methodNames.reduce((acc, method) => {
    acc[method] = jest.fn();
    return acc;
  }, {});

const mockEmployeeRepository = createRepoMock(["create", "update", "findById", "findAll", "delete"]);
const mockCustomerRepository = createRepoMock([
  "create",
  "update",
  "findById",
  "findByCitizenID",
  "findAll",
  "delete",
  "findByName"
]);
const mockUserAccountRepository = createRepoMock([
  "findAll",
  "findById",
  "findByUsernameOrEmail",
  "create",
  "update",
  "delete",
  "findByEmail"
]);
const mockSavingBookRepository = createRepoMock([
  "create",
  "update",
  "delete",
  "findById",
  "findByCustomerCitizenID",
  "findByBookID",
  "findByCustomerName"
]);
const mockTypeSavingRepository = createRepoMock([
  "getTypeSavingById",
  "findById",
  "findAll",
  "create",
  "update",
  "delete"
]);
const mockTransactionRepository = createRepoMock(["create", "findAll", "findById", "update", "delete"]);
const mockReportRepository = createRepoMock(["getDailyData", "getMonthlyData"]);

const mockHashPassword = jest.fn();
const mockComparePassword = jest.fn();

const resetMockObject = (obj) => {
  Object.values(obj).forEach((fn) => {
    if (fn?.mockReset) fn.mockReset();
  });
};

const resetAllMocks = () => {
  [
    mockEmployeeRepository,
    mockCustomerRepository,
    mockUserAccountRepository,
    mockSavingBookRepository,
    mockTypeSavingRepository,
    mockTransactionRepository,
    mockReportRepository
  ].forEach(resetMockObject);

  if (mockHashPassword.mockReset) mockHashPassword.mockReset();
  if (mockComparePassword.mockReset) mockComparePassword.mockReset();

  jest.clearAllMocks();
};

module.exports = {
  mockEmployeeRepository,
  mockCustomerRepository,
  mockUserAccountRepository,
  mockSavingBookRepository,
  mockTypeSavingRepository,
  mockTransactionRepository,
  mockReportRepository,
  mockHashPassword,
  mockComparePassword,
  resetAllMocks
};

