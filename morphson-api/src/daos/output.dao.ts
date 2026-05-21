import type { OutputJson } from "@prisma/client";
import type { OutputJsonCreatePayload } from "@/types/zod";

import { prisma } from "@/configs/prisma.config";

export const OutputDAO = {
  findMany: async (): Promise<OutputJson[]> => await prisma.outputJson.findMany(),
  findById: async (id: string): Promise<OutputJson | null> =>
    await prisma.outputJson.findUnique({
      where: {
        id: Number(id),
      },
    }),
  findByName: async (name: string): Promise<OutputJson | null> =>
    await prisma.outputJson.findUnique({
      where: {
        name: name,
      },
    }),
  create: async (data: OutputJsonCreatePayload): Promise<OutputJson> =>
    await prisma.outputJson.create({ data: data }),
  deleteByName: async (name: string): Promise<OutputJson> =>
    await prisma.outputJson.delete({
      where: {
        name: name,
      },
    }),
};
