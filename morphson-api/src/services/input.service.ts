import type { InputJson } from "@prisma/client";
import type { InputJsonCreatePayload } from "@/types/payloads";

import { InputDAO } from "@/daos/input.dao";

export const InputService = {
  getAllInputs: async (): Promise<InputJson[]> => {
    return await InputDAO.findMany();
  },
  getInputById: async (id: string): Promise<InputJson | null> => {
    return await InputDAO.findById(id);
  },
  getInputByName: async (name: string): Promise<InputJson | null> => {
    return await InputDAO.findByName(name);
  },
  createInput: async (data: InputJsonCreatePayload): Promise<InputJson> => {
    return await InputDAO.create(data);
  },
  deleteInput: async (name: string): Promise<InputJson> => {
    return await InputDAO.deleteByName(name);
  },
};
