import { Prisma } from "@prisma/client";

export type InputJson = {
  id: number;
  name: string;
  content: Prisma.InputJsonValue;
  keys: string[];
  keysAndValues: Prisma.InputJsonValue;
  createdAt: Date;
  updatedAt: Date;
};

export type InputJsonFlat = Omit<InputJson, "id" | "createdAt" | "updatedAt">;

export type OutputJson = {
  id: number;
  name: string;
  transformationModel: Prisma.InputJsonValue;
  createdAt: Date;
  updatedAt: Date;
};

export type OutputJsonFlat = Omit<OutputJson, "id" | "createdAt" | "updatedAt">;
