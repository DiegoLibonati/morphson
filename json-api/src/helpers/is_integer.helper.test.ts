import { isInteger } from "@src/helpers/is_integer.helper";

describe("isInteger.ts", () => {
  test("It should return true for a valid integer string", () => {
    const input = "12345";
    const result = isInteger(input);
    expect(result).toBe(true);
  });

  test("It should return false for a string with non-numeric characters", () => {
    const input = "123a45";
    const result = isInteger(input);
    expect(result).toBe(false);
  });

  test("It should return false for a string with spaces", () => {
    const input = "123 45";
    const result = isInteger(input);
    expect(result).toBe(false);
  });

  test("It should return false for an empty string", () => {
    const input = "";
    const result = isInteger(input);
    expect(result).toBe(false);
  });

  test("It should return true for a string with leading zeros", () => {
    const input = "00123";
    const result = isInteger(input);
    expect(result).toBe(true);
  });

  test("It should return false for a string representing a decimal number", () => {
    const input = "123.45";
    const result = isInteger(input);
    expect(result).toBe(false);
  });

  test("It should return false for a negative integer string", () => {
    const input = "-123";
    const result = isInteger(input);
    expect(result).toBe(false);
  });
});
