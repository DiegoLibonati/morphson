import { GetJsonInputsResponse } from "@src/entities/responses";

import { inputApi } from "@src/api/input";

export const getJsonInputs = async (): Promise<GetJsonInputsResponse> => {
  try {
    const response = await inputApi.get("/");

    const data: GetJsonInputsResponse = await response.data;

    return data;
  } catch (e) {
    console.log("Error get json inputs: ", e);
    throw Error(`Error get json inputs: ${e}`);
  }
};
