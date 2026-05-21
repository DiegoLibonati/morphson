import { z } from "zod";

export const outputIdParamsSchema = z.object({
  idOutputJson: z.string().regex(/^[1-9]\d*$/),
});
