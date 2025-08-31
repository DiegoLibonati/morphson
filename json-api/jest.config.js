module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  globalSetup: "<rootDir>/tests/jest.globalSetup.ts",
  globalTeardown: "<rootDir>/tests/jest.globalTeardown.ts",
  moduleNameMapper: {
    "^@/src/(.*)$": "<rootDir>/src/$1",
  },
};
