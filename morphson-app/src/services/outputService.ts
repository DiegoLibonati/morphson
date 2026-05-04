import axios from "axios";

import type { ResponseWithData } from "@/types/responses";
import type { OutputJson } from "@/types/app";

import { apiOutput } from "@/services/axios";

const outputService = {
  getAll: async (): Promise<ResponseWithData<OutputJson[]>> => {
    try {
      const response = await apiOutput.get<ResponseWithData<OutputJson[]>>("/");

      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        throw new Error(`HTTP error! status: ${e.response?.status} - ${e.message}`);
      }
      throw e;
    }
  },

  getById: async (
    id: string
  ): Promise<
    ResponseWithData<{
      outputJson: OutputJson;
    }>
  > => {
    try {
      const response = await apiOutput.get<
        ResponseWithData<{
          outputJson: OutputJson;
        }>
      >(`/${id}`);

      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        throw new Error(`HTTP error! status: ${e.response?.status} - ${e.message}`);
      }
      throw e;
    }
  },
};

export default outputService;
