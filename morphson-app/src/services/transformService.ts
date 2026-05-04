import axios from "axios";

import type { ResponseDirect } from "@/types/responses";
import type { JsonTransformPayload } from "@/types/payloads";

import { apiTransform } from "@/services/axios";

const transformService = {
  transform: async (payload: JsonTransformPayload): Promise<ResponseDirect<Blob>> => {
    try {
      const response = await apiTransform.post<ResponseDirect<Blob>>("/", payload, {
        responseType: "blob",
      });

      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        throw new Error(`HTTP error! status: ${e.response?.status} - ${e.message}`);
      }
      throw e;
    }
  },
};

export default transformService;
