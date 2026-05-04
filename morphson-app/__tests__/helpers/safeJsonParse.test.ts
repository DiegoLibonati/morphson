import { safeJsonParse } from "@/helpers/safeJsonParse";

describe("safeJsonParse", () => {
  describe("valid JSON", () => {
    it("should parse a simple object", () => {
      const result = safeJsonParse('{"key": "value"}');
      expect(result).toEqual({ key: "value" });
    });

    it("should parse a nested object", () => {
      const result = safeJsonParse('{"a": {"b": 1}}');
      expect(result).toEqual({ a: { b: 1 } });
    });

    it("should parse an empty object", () => {
      const result = safeJsonParse("{}");
      expect(result).toEqual({});
    });
  });

  describe("invalid JSON", () => {
    it("should return null for invalid json string", () => {
      const result = safeJsonParse("not valid json");
      expect(result).toBeNull();
    });

    it("should return null for an empty string", () => {
      const result = safeJsonParse("");
      expect(result).toBeNull();
    });

    it("should return null for malformed JSON", () => {
      const result = safeJsonParse("{key: value}");
      expect(result).toBeNull();
    });
  });
});
