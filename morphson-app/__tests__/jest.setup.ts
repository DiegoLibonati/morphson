import "@testing-library/jest-dom";

import { TextDecoder, TextEncoder } from "util";

const originalConsoleError = console.error.bind(console);

Object.assign(global, { TextDecoder, TextEncoder });

console.error = (...args: unknown[]): void => {
  if (String(args[0]).includes("Not implemented: HTMLFormElement.prototype.requestSubmit")) return;
  originalConsoleError(...args);
};
