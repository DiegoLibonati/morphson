import { PostUploadJsonResponse } from "@src/entities/responses";

import { inputApi } from "@src/api/input";

export const postUploadJson = async (formData: {
  name: string;
  content: string;
}): Promise<PostUploadJsonResponse> => {
  try {
    const response = await inputApi.post("/", formData);

    const data: PostUploadJsonResponse = await response.data;

    return data;
  } catch (e) {
    console.log("Error post upload json: ", e);
    throw Error(`Error post upload json: ${e}`);
  }
};
