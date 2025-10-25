import { PostTransformJsonResponse } from "@src/entities/responses";

import { transformApi } from "@src/api/transform";

type Body = {
  idInputJson: string;
  saveOutputJson: boolean;
  outputJsonNameToSave: string;
  contentJsonToTransform: string;
};

export const postTransformJson = async (
  body: Body
): Promise<PostTransformJsonResponse> => {
  try {
    const response = await transformApi.post("/", body, {
      responseType: "blob",
    });

    const data: PostTransformJsonResponse = await response.data;

    return data;
  } catch (e) {
    console.log("Error post transform json: ", e);
    throw Error(`Error post transform json: ${e}`);
  }
};
