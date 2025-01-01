import { isEmptyObject } from "./isEmptyObject";

test("It should return true for an empty object string", () => {
  const input = "{}";
  const result = isEmptyObject(input);
  expect(result).toBe(true);
});

test("It should return true for an empty object string with spaces", () => {
  const input = "{   }";
  const result = isEmptyObject(input);
  expect(result).toBe(true);
});

test("It should return false for a non-empty object string", () => {
  const input = "{ key: 'value' }";
  const result = isEmptyObject(input);
  expect(result).toBe(false);
});

test("It should return false for a malformed object string", () => {
  const input = "{ key: 'value'";
  const result = isEmptyObject(input);
  expect(result).toBe(false);
});

test("It should return false for a string that is not an object", () => {
  const input = "notAnObject";
  const result = isEmptyObject(input);
  expect(result).toBe(false);
});

test("It should return false for an empty string", () => {
  const input = "";
  const result = isEmptyObject(input);
  expect(result).toBe(false);
});
