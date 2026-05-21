import { z } from "zod";

export const inputIdParamsSchema = z.object({
  idInputJson: z.string().regex(/^[1-9]\d*$/),
});

export const inputCreateBodySchema = z.object({
  name: z.string().trim().min(1),
  content: z
    .string()
    .trim()
    .min(1)
    .refine((val) => val !== "{}" && !/^\{\s*\}$/.test(val), {
      message: "Content cannot be an empty object",
    }),
});
