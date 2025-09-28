import { OutputJsonFlat } from "@src/entities/app";

import { OutputDAO } from "@src/daos/output.dao";

export const OutputService = {
  getAllOutputs: async () => {
    return await OutputDAO.findMany();
  },
  getOutputById: async (id: string) => {
    return await OutputDAO.findById(id);
  },
  getOutputByName: async (name: string) => {
    return await OutputDAO.findByName(name);
  },
  createOutput: async (data: OutputJsonFlat) => {
    return await OutputDAO.create(data);
  },
  deleteOutput: async (name: string) => {
    return await OutputDAO.deleteByName(name);
  },
};
