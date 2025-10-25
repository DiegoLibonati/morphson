import { GetJsonOutputResponse } from "@src/entities/responses";

import { outputApi } from "@src/api/output";

export const getJsonOutput = async (
  idOutputJson: string
): Promise<GetJsonOutputResponse> => {
  try {
    const response = await outputApi.get(`/${idOutputJson}`);

    const data: GetJsonOutputResponse = await response.data;

    return data;
  } catch (e) {
    console.log("Error get json output: ", e);
    throw Error(`Error get json output: ${e}`);
  }
};
