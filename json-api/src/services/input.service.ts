import { InputJsonFlat } from "@src/entities/app";

import { InputDAO } from "@src/daos/input.dao";

export const InputService = {
  getAllInputs: async () => {
    return await InputDAO.findMany();
  },
  getInputById: async (id: string) => {
    return await InputDAO.findById(id);
  },
  getInputByName: async (name: string) => {
    return await InputDAO.findByName(name);
  },
  createInput: async (data: InputJsonFlat) => {
    return await InputDAO.create(data);
  },
  deleteInput: async (name: string) => {
    return await InputDAO.deleteByName(name);
  },
};
