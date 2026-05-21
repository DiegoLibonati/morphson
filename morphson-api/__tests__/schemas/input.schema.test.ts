import { inputCreateBodySchema, inputIdParamsSchema } from "@/schemas/input.schema";

describe("input.schema", () => {
  describe("inputIdParamsSchema", () => {
    it.each<[string]>([["1"], ["10"], ["999999"]])(
      "should accept '%s' as a valid positive integer string",
      (value: string) => {
        const result = inputIdParamsSchema.safeParse({ idInputJson: value });

        expect(result.success).toBe(true);
      }
    );

    it.each<[string]>([["0"], ["-1"], ["abc"], [""], ["1.5"], ["01"]])(
      "should reject '%s' as an invalid id",
      (value: string) => {
        const result = inputIdParamsSchema.safeParse({ idInputJson: value });

        expect(result.success).toBe(false);
      }
    );

    it("should reject when idInputJson is missing", () => {
      const result = inputIdParamsSchema.safeParse({});

      expect(result.success).toBe(false);
    });
  });

  describe("inputCreateBodySchema", () => {
    it("should accept a valid name and content", () => {
      const result = inputCreateBodySchema.safeParse({
        name: "template",
        content: '{"key":"value"}',
      });

      expect(result.success).toBe(true);
    });

    it("should trim name and content", () => {
      const result = inputCreateBodySchema.safeParse({
        name: "  template  ",
        content: '   {"a":1}  ',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("template");
        expect(result.data.content).toBe('{"a":1}');
      }
    });

    it("should reject when name is empty after trim", () => {
      const result = inputCreateBodySchema.safeParse({
        name: "   ",
        content: '{"a":1}',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("name");
      }
    });

    it("should reject when content is an empty string", () => {
      const result = inputCreateBodySchema.safeParse({
        name: "x",
        content: "   ",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("content");
      }
    });

    it("should reject when content is '{}'", () => {
      const result = inputCreateBodySchema.safeParse({
        name: "x",
        content: "{}",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("content");
      }
    });

    it("should reject when content is '{  }'", () => {
      const result = inputCreateBodySchema.safeParse({
        name: "x",
        content: "{   }",
      });

      expect(result.success).toBe(false);
    });

    it("should reject when name is missing", () => {
      const result = inputCreateBodySchema.safeParse({ content: '{"a":1}' });

      expect(result.success).toBe(false);
    });

    it("should reject when content is missing", () => {
      const result = inputCreateBodySchema.safeParse({ name: "x" });

      expect(result.success).toBe(false);
    });
  });
});
