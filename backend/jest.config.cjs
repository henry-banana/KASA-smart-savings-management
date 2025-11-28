module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  moduleFileExtensions: ["js", "json"],
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/middleware/**/*.js",
    "src/services/**/*.js"
  ],
  coverageDirectory: "coverage",
  clearMocks: true
};

