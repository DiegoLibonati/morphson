export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/tests/jest.setup.ts"],
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/src/tests/mocks/files/styleMock.js",
    "^@/src/(.*)$": "<rootDir>/src/$1",
    "^monaco-editor$": "<rootDir>/node_modules/@monaco-editor/react",
  },
  transformIgnorePatterns: ["/node_modules/(?!(monaco-editor)).+\\.js$"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
