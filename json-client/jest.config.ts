import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/tests_mocks/styleMock.ts",
    "^monaco-editor$": "<rootDir>/node_modules/@monaco-editor/react",
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
  },
  transformIgnorePatterns: ["/node_modules/(?!(monaco-editor)).+\\.js$"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
};

export default config;
