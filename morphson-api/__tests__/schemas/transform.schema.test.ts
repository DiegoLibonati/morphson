import { transformBodySchema } from "@/schemas/transform.schema";

describe("transform.schema", () => {
  describe("transformBodySchema", () => {
    it("should accept a valid body with saveOutputJson false and no name", () => {
      const result = transformBodySchema.safeParse({
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: '{"a":1}',
      });

      expect(result.success).toBe(true);
    });

    it("should accept a valid body with saveOutputJson true and a non-empty name", () => {
      const result = transformBodySchema.safeParse({
        idInputJson: "1",
        saveOutputJson: true,
        outputJsonNameToSave: "saved",
        contentJsonToTransform: '{"a":1}',
      });

      expect(result.success).toBe(true);
    });

    it("should reject when idInputJson is not a positive integer string", () => {
      const result = transformBodySchema.safeParse({
        idInputJson: "abc",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: '{"a":1}',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("idInputJson");
      }
    });

    it("should reject when idInputJson is '0'", () => {
      const result = transformBodySchema.safeParse({
        idInputJson: "0",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: '{"a":1}',
      });

      expect(result.success).toBe(false);
    });

    it("should reject when contentJsonToTransform is empty after trim", () => {
      const result = transformBodySchema.safeParse({
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: "   ",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("contentJsonToTransform");
      }
    });

    it("should reject when contentJsonToTransform is '{}'", () => {
      const result = transformBodySchema.safeParse({
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: "{}",
      });

      expect(result.success).toBe(false);
    });

    it("should reject when contentJsonToTransform is '{ }'", () => {
      const result = transformBodySchema.safeParse({
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: "{   }",
      });

      expect(result.success).toBe(false);
    });

    it("should reject when saveOutputJson is true but outputJsonNameToSave is missing", () => {
      const result = transformBodySchema.safeParse({
        idInputJson: "1",
        saveOutputJson: true,
        contentJsonToTransform: '{"a":1}',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("outputJsonNameToSave");
      }
    });

    it("should reject when saveOutputJson is true but outputJsonNameToSave is an empty string after trim", () => {
      const result = transformBodySchema.safeParse({
        idInputJson: "1",
        saveOutputJson: true,
        outputJsonNameToSave: "   ",
        contentJsonToTransform: '{"a":1}',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("outputJsonNameToSave");
      }
    });

    it("should reject when saveOutputJson is not a boolean", () => {
      const result = transformBodySchema.safeParse({
        idInputJson: "1",
        saveOutputJson: "yes",
        outputJsonNameToSave: "",
        contentJsonToTransform: '{"a":1}',
      });

      expect(result.success).toBe(false);
    });

    it("should accept saveOutputJson false even when outputJsonNameToSave is undefined", () => {
      const result = transformBodySchema.safeParse({
        idInputJson: "1",
        saveOutputJson: false,
        contentJsonToTransform: '{"a":1}',
      });

      expect(result.success).toBe(true);
    });
  });
});
