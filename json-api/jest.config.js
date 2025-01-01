module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "<rootDir>/src/tests/jest.setup.ts",
  globalTeardown: "<rootDir>/src/tests/jest.teardown.ts",
  moduleNameMapper: {
    "^@/src/(.*)$": "<rootDir>/src/$1",
  },
};
