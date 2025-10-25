import { GetJsonInputResponse } from "@src/entities/responses";

import { inputApi } from "@src/api/input";

export const getJsonInput = async (
  idInputJson: string
): Promise<GetJsonInputResponse> => {
  try {
    const response = await inputApi.get(`/${idInputJson}`);

    const data: GetJsonInputResponse = await response.data;

    return data;
  } catch (e) {
    console.log("Error get json input: ", e);
    throw Error(`Error get json input: ${e}`);
  }
};
