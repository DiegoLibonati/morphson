import { safeJsonParse } from "@src/helpers/safeJsonParse";

describe("safeJsonParse.ts", () => {
  describe("General Tests.", () => {
    test("it should parse a valid JSON string into an object", () => {
      const json = '{"key":"value"}';
      const result = safeJsonParse(json);
      expect(result).toEqual({ key: "value" });
    });

    test("it should parse a valid JSON string into an array", () => {
      const json = "[1, 2, 3]";
      const result = safeJsonParse(json);
      expect(result).toEqual([1, 2, 3]);
    });

    test("it should return null for an invalid JSON string", () => {
      const invalidJson = "{key:value}";
      const result = safeJsonParse(invalidJson);
      expect(result).toBeNull();
    });

    test("it should return null for an empty string", () => {
      const result = safeJsonParse("");
      expect(result).toBeNull();
    });

    test("it should parse a JSON string with nested objects", () => {
      const json = '{"outer":{"inner":123}}';
      const result = safeJsonParse(json);
      expect(result).toEqual({ outer: { inner: 123 } });
    });
  });
});
