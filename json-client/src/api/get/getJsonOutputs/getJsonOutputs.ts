import { GetJsonOutputsResponse } from "@src/entities/responses";

import { outputApi } from "@src/api/output";

export const getJsonOutputs = async (): Promise<GetJsonOutputsResponse> => {
  try {
    const response = await outputApi.get("/");

    const data: GetJsonOutputsResponse = await response.data;

    return data;
  } catch (e) {
    console.log("Error get json outputs: ", e);
    throw Error(`Error get json outputs: ${e}`);
  }
};
