export default {
  testEnvironment: "node",
  transform: {},
  testMatch: [
    "**/tests/unit/**/*.test.js",
  ],
  collectCoverageFrom: [
    "src/services/**/*.js",
    "src/models/**/*.js",
    "src/middleware/**/*.js",
    "src/controllers/**/*.js",
    "!src/config/**",
    "!src/index.js",
    "!**/node_modules/**",
    // Exclude non-critical files from coverage
    "!src/middleware/logger.middleware.js",
    "!src/services/UserAccount/email.service.js",
    "!src/services/Dashboard/dashboard.service.js",
    "!src/controllers/Dashboard/dashboard.controller.js",
    "!src/controllers/UserAccount/changePassword.controller.js",
  ],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: [
    '<rootDir>/tests/helpers/setup.js',
    '<rootDir>/tests/helpers/teardown.js'
  ],
  testTimeout: 10000,
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/integration/',
    '/tests/e2e/'
  ],
  moduleFileExtensions: ['js', 'mjs'],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
  },
};