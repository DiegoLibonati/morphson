import type { InputJson } from "@prisma/client";
import type { InputJsonCreatePayload } from "@/types/payloads";

import { prisma } from "@/configs/prisma.config";

export const InputDAO = {
  findMany: async (): Promise<InputJson[]> => await prisma.inputJson.findMany(),
  findById: async (id: string): Promise<InputJson | null> =>
    await prisma.inputJson.findUnique({
      where: {
        id: Number(id),
      },
    }),
  findByName: async (name: string): Promise<InputJson | null> =>
    await prisma.inputJson.findUnique({
      where: {
        name: name,
      },
    }),
  create: async (data: InputJsonCreatePayload): Promise<InputJson> =>
    await prisma.inputJson.create({ data: data }),
  deleteByName: async (name: string): Promise<InputJson> =>
    await prisma.inputJson.delete({
      where: {
        name: name,
      },
    }),
};
