import { z } from "zod";

export const transformBodySchema = z
  .object({
    idInputJson: z.string().regex(/^[1-9]\d*$/),
    saveOutputJson: z.boolean(),
    outputJsonNameToSave: z.string().trim().optional(),
    contentJsonToTransform: z
      .string()
      .trim()
      .min(1)
      .refine((val) => val !== "{}" && !/^\{\s*\}$/.test(val), {
        message: "Content cannot be an empty object",
      }),
  })
  .refine(
    (data) =>
      !data.saveOutputJson ||
      (data.outputJsonNameToSave !== undefined && data.outputJsonNameToSave.length > 0),
    {
      message: "outputJsonNameToSave is required when saveOutputJson is true",
      path: ["outputJsonNameToSave"],
    }
  );
