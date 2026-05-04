import { isInteger } from "@/helpers/is_integer.helper";

describe("is_integer.helper", () => {
  it.each<[string, boolean]>([
    ["1", true],
    ["100", true],
    ["999999", true],
    ["0", false],
    ["-1", false],
    ["1.5", false],
    ["abc", false],
    ["", false],
    ["   ", false],
  ])("isInteger('%s') should return %s", (input: string, expected: boolean) => {
    expect(isInteger(input)).toBe(expected);
  });
});
