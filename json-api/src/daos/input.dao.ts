import prisma from "@src/config/prisma.config";

import { InputJsonFlat } from "@src/entities/app";

export const InputDAO = {
  findMany: async () => await prisma.inputJson.findMany(),
  findById: async (id: string) =>
    await prisma.inputJson.findUnique({
      where: {
        id: Number(id),
      },
    }),
  findByName: async (name: string) =>
    await prisma.inputJson.findUnique({
      where: {
        name: name,
      },
    }),
  create: async (data: InputJsonFlat) =>
    await prisma.inputJson.create({ data: data }),
  deleteByName: async (name: string) =>
    await prisma.inputJson.delete({
      where: {
        name: name,
      },
    }),
};
