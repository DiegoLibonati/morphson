import axios from "axios";

import type { ResponseWithData } from "@/types/responses";

import { apiFile } from "@/services/axios";

const fileService = {
  getContent: async (formData: FormData): Promise<ResponseWithData<string>> => {
    try {
      const response = await apiFile.post<ResponseWithData<string>>("/content", formData);

      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        throw new Error(`HTTP error! status: ${e.response?.status} - ${e.message}`);
      }
      throw e;
    }
  },
};

export default fileService;
