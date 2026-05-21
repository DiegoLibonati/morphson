import type { OutputJson } from "@prisma/client";
import type { OutputJsonCreatePayload } from "@/types/zod";

import { OutputDAO } from "@/daos/output.dao";

export const OutputService = {
  getAllOutputs: async (): Promise<OutputJson[]> => {
    return await OutputDAO.findMany();
  },
  getOutputById: async (id: string): Promise<OutputJson | null> => {
    return await OutputDAO.findById(id);
  },
  getOutputByName: async (name: string): Promise<OutputJson | null> => {
    return await OutputDAO.findByName(name);
  },
  createOutput: async (data: OutputJsonCreatePayload): Promise<OutputJson> => {
    return await OutputDAO.create(data);
  },
  deleteOutput: async (name: string): Promise<OutputJson> => {
    return await OutputDAO.deleteByName(name);
  },
};
