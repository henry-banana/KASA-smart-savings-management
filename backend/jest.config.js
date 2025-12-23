export default {
  testEnvironment: "node",
  transform: {},
  testMatch: [
    // "**/tests/unit/**/*.test.js",
    "**/tests/unit/**/customer.controller.test.js"
  ],
  collectCoverageFrom: [
    "src/services/**/*.js",
    "src/repositories/**/*.js",
    "src/models/**/*.js",
    "src/middleware/**/*.js",
    "src/utils/**/*.js",
    "!src/config/**",
    "!src/index.js",
    "!**/node_modules/**",
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