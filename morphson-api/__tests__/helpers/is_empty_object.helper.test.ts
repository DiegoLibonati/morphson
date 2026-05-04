import { isEmptyObject } from "@/helpers/is_empty_object.helper";

describe("is_empty_object.helper", () => {
  it.each<[string, boolean]>([
    ["{}", true],
    ["{ }", true],
    ["{  }", true],
    ['{"key":"value"}', false],
    ["", false],
    ["[]", false],
    ["null", false],
    ["{ key: 1 }", false],
  ])("isEmptyObject('%s') should return %s", (input: string, expected: boolean) => {
    expect(isEmptyObject(input)).toBe(expected);
  });
});
