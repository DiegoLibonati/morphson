import type { Prisma } from "@prisma/client";

export interface InputJsonCreatePayload {
  name: string;
  content: Prisma.InputJsonValue;
  keys: string[];
  keysAndValues: Prisma.InputJsonValue;
}

export interface OutputJsonCreatePayload {
  name: string;
  transformationModel: Prisma.InputJsonValue;
}
