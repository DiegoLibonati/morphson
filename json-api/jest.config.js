module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/tests/jest.setup.ts"],
  globalSetup: "<rootDir>/src/tests/jest.globalSetup.ts",
  globalTeardown: "<rootDir>/src/tests/jest.globalTeardown.ts",
  moduleNameMapper: {
    "^@/src/(.*)$": "<rootDir>/src/$1",
  },
};
