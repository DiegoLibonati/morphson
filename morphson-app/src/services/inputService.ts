import axios from "axios";

import type { ResponseWithData } from "@/types/responses";
import type { InputJson } from "@/types/app";
import type { InputUploadPayload } from "@/types/payloads";

import { apiInput } from "@/services/axios";

const inputService = {
  getAll: async (): Promise<ResponseWithData<InputJson[]>> => {
    try {
      const response = await apiInput.get<ResponseWithData<InputJson[]>>("/");

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
      inputJson: InputJson;
    }>
  > => {
    try {
      const response = await apiInput.get<
        ResponseWithData<{
          inputJson: InputJson;
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

  upload: async (
    payload: InputUploadPayload
  ): Promise<
    ResponseWithData<{
      inputJson: InputJson;
    }>
  > => {
    try {
      const response = await apiInput.post<
        ResponseWithData<{
          inputJson: InputJson;
        }>
      >("/", payload);

      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        throw new Error(`HTTP error! status: ${e.response?.status} - ${e.message}`);
      }
      throw e;
    }
  },
};

export default inputService;
