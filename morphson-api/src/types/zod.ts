import type { Prisma } from "@prisma/client";
import type { z } from "zod";

import type { inputCreateBodySchema, inputIdParamsSchema } from "@/schemas/input.schema";
import type { outputIdParamsSchema } from "@/schemas/output.schema";
import type { transformBodySchema } from "@/schemas/transform.schema";

export type InputIdParams = z.infer<typeof inputIdParamsSchema>;
export type InputCreateBody = z.infer<typeof inputCreateBodySchema>;
export type OutputIdParams = z.infer<typeof outputIdParamsSchema>;
export type TransformBody = z.infer<typeof transformBodySchema>;

export type InputJsonCreatePayload = Omit<InputCreateBody, "content"> & {
  content: Prisma.InputJsonValue;
  keys: string[];
  keysAndValues: Prisma.InputJsonValue;
};

export interface OutputJsonCreatePayload {
  name: NonNullable<TransformBody["outputJsonNameToSave"]>;
  transformationModel: Prisma.InputJsonValue;
}
