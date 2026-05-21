import { outputIdParamsSchema } from "@/schemas/output.schema";

describe("output.schema", () => {
  describe("outputIdParamsSchema", () => {
    it.each<[string]>([["1"], ["42"], ["999999"]])(
      "should accept '%s' as a valid positive integer string",
      (value: string) => {
        const result = outputIdParamsSchema.safeParse({ idOutputJson: value });

        expect(result.success).toBe(true);
      }
    );

    it.each<[string]>([["0"], ["-1"], ["abc"], [""], ["1.5"]])(
      "should reject '%s' as an invalid id",
      (value: string) => {
        const result = outputIdParamsSchema.safeParse({ idOutputJson: value });

        expect(result.success).toBe(false);
      }
    );

    it("should reject when idOutputJson is missing", () => {
      const result = outputIdParamsSchema.safeParse({});

      expect(result.success).toBe(false);
    });
  });
});
