import prisma from "@src/configs/prisma.config";

import { OutputJsonFlat } from "@src/entities/app";

export const OutputDAO = {
  findMany: async () => await prisma.outputJson.findMany(),
  findById: async (id: string) =>
    await prisma.outputJson.findUnique({
      where: {
        id: Number(id),
      },
    }),
  findByName: async (name: string) =>
    await prisma.outputJson.findUnique({
      where: {
        name: name,
      },
    }),
  create: async (data: OutputJsonFlat) =>
    await prisma.outputJson.create({ data: data }),
  deleteByName: async (name: string) =>
    await prisma.outputJson.delete({
      where: {
        name: name,
      },
    }),
};
