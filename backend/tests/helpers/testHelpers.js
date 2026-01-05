import { expect, jest } from "@jest/globals";
import { faker } from '@faker-js/faker';

/**
 * Generate mock customer data
 */
export function createMockCustomer(overrides = {}) {
  return {
    customerid: faker.number.int({ min: 1, max: 1000 }),
    fullname: faker.person.fullName(),
    citizenid: faker.string.numeric(12),
    street: faker.location.streetAddress(),
    district: faker.location.city(),
    province: 'HCM',
    ...overrides
  };
}

/**
 * Generate mock employee data
 */
export function createMockEmployee(overrides = {}) {
  return {
    employeeid: `EMP${faker.string.alphanumeric(6).toUpperCase()}`,
    fullname: faker.person.fullName(),
    email: faker.internet.email(),
    roleid: 2, // Teller
    branchid: 1,
    ...overrides
  };
}

/**
 * Generate mock saving book data
 */
export function createMockSavingBook(overrides = {}) {
  const registerDate = faker.date.past();
  return {
    bookid: faker.number.int({ min: 1, max: 1000 }),
    customerid: 1,
    typeid: 1,
    currentbalance: faker.number.int({ min: 100000, max: 10000000 }),
    status: 'Open',
    registertime: registerDate.toISOString(),
    maturitydate: faker.date.future({ refDate: registerDate }).toISOString(),
    updatetime: registerDate.toISOString(),
    ...overrides
  };
}

/**
 * Generate mock transaction data
 */
export function createMockTransaction(overrides = {}) {
  return {
    transactionid: faker.number.int({ min: 1, max: 1000 }),
    bookid: 1,
    tellerid: 'EMP001',
    transactiontype: faker.helpers.arrayElement(['Deposit', 'WithDraw']),
    amount: faker.number.int({ min: 10000, max: 1000000 }),
    transactiondate: new Date().toISOString(),
    note: '',
    ...overrides
  };
}

/**
 * Generate mock type saving data
 */
export function createMockTypeSaving(overrides = {}) {
  return {
    typeid: faker.number.int({ min: 1, max: 10 }),
    typename: faker.helpers.arrayElement(['No term', '3 months', '6 months', '12 months']),
    interest: faker.number.float({ min: 0.15, max: 0.7, precision: 0.05 }),
    termperiod: faker.helpers.arrayElement([0, 3, 6, 12]),
    minimumbalance: 100000,
    minimumterm: 15,
    ...overrides
  };
}

/**
 * Calculate expected interest
 * Logic: interest = balance * rate * (days / 365)
 */
export function calculateExpectedInterest(balance, rate, days) {
  return balance * (rate / 100) * (days / 365);
}

/**
 * Calculate days between dates
 */
export function calculateDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Calculate expected balance after interest (No term)
 * Công thức: Cộng 0.15% mỗi tháng (30 ngày)
 */
export function calculateNoTermBalance(initialBalance, registerDate, currentDate) {
  const days = calculateDaysBetween(registerDate, currentDate);
  const monthsPassed = Math.floor(days / 30);
  
  let balance = initialBalance;
  for (let i = 0; i < monthsPassed; i++) {
    balance += balance * 0.0015; // 0.15%
  }
  
  return Math.round(balance);
}

/**
 * Calculate withdrawal amount with interest
 * Logic: amount * 1.15 (bao gồm 15% lãi)
 */
export function calculateWithdrawalWithInterest(amount) {
  return amount * 1.15;
}

/**
 * Mock Date.now() for testing time-based logic
 */
export function mockCurrentDate(dateString) {
  const mockDate = new Date(dateString);
  jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  return mockDate;
}

/**
 * Restore Date.now()
 */
export function restoreDate() {
  jest.restoreAllMocks();
}

/**
 * Assert error thrown
 */
export function assertErrorThrown(fn, expectedMessage) {
  expect(fn).rejects.toThrow(expectedMessage);
}

/**
 * Assert object properties
 */
export function assertHasProperties(obj, properties) {
  properties.forEach(prop => {
    expect(obj).toHaveProperty(prop);
  });
}

/**
 * Mock bcrypt hash (for password testing)
 */
export function mockBcryptHash() {
  return jest.fn().mockImplementation(async (password) => {
    return `$2b$12$hashed_${password}`;
  });
}

/**
 * Mock bcrypt compare
 */
export function mockBcryptCompare(shouldMatch = true) {
  return jest.fn().mockResolvedValue(shouldMatch);
}

/**
 * Create mock request object (for middleware testing)
 */
export function createMockRequest(overrides = {}) {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...overrides
  };
}

/**
 * Create mock response object (for middleware testing)
 */
export function createMockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

/**
 * Create mock next function (for middleware testing)
 */
export function createMockNext() {
  return jest.fn();
}

/**
 * Create mock Supabase client with chainable methods
 */
export function createMockSupabaseClient() {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue({ data: null, error: null }),
    ilike: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  };
  return mockSupabase;
}

/**
 * Reset Supabase mock to default state
 */
export function resetSupabaseMock(mockSupabase) {
  mockSupabase.from.mockReturnThis();
  mockSupabase.select.mockReturnThis();
  mockSupabase.eq.mockReturnThis();
  mockSupabase.single.mockResolvedValue({ data: null, error: null });
  mockSupabase.insert.mockReturnThis();
  mockSupabase.update.mockReturnThis();
  mockSupabase.delete.mockReturnThis();
  mockSupabase.order.mockReturnThis();
  mockSupabase.limit.mockResolvedValue({ data: null, error: null });
  mockSupabase.ilike.mockReturnThis();
  mockSupabase.gte.mockReturnThis();
  mockSupabase.lte.mockReturnThis();
  mockSupabase.lt.mockReturnThis();
  mockSupabase.maybeSingle.mockResolvedValue({ data: null, error: null });
}