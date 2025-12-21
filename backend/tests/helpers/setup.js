import { jest } from '@jest/globals';

/**
 * Global setup cho unit tests
 * Chạy 1 lần trước tất cả test suites
 */
beforeAll(() => {
  console.log("🧪 Starting Unit Tests...");
  console.log("");
});

/**
 * Cleanup sau mỗi test
 * Đảm bảo mocks được reset
 */
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

export default {};
