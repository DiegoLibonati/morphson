import { PostGetFileContentResponse } from "@src/entities/responses";

import { fileApi } from "@src/api/file";

export const postGetFileContent = async (
  formData: FormData
): Promise<PostGetFileContentResponse> => {
  try {
    const response = await fileApi.post("/content", formData);

    const data: PostGetFileContentResponse = await response.data;

    return data;
  } catch (e) {
    console.log("Error post get file content: ", e);
    throw Error(`Error post get file content: ${e}`);
  }
};
