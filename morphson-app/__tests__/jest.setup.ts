import "@testing-library/jest-dom";

import { mockMswServer } from "@tests/__mocks__/mswServer.mock";

const originalConsoleError = console.error.bind(console);

console.error = (...args: unknown[]): void => {
  const first = String(args[0]);
  if (first.includes("Not implemented: HTMLFormElement.prototype.requestSubmit")) return;
  if (first.includes("Not implemented: navigation (except hash changes)")) return;
  originalConsoleError(...args);
};

beforeAll((): void => {
  mockMswServer.listen({ onUnhandledRequest: "error" });
});

afterEach((): void => {
  mockMswServer.resetHandlers();
});

afterAll((): void => {
  mockMswServer.close();
});
